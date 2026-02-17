const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
});

const azureThrottle = {
  maxConcurrent: Number.parseInt(process.env.AZURE_API_MAX_CONCURRENCY || '4', 10),
  minIntervalMs: Number.parseInt(process.env.AZURE_API_MIN_INTERVAL_MS || '75', 10),
  maxRetries: Number.parseInt(process.env.AZURE_API_MAX_RETRIES || '5', 10),
  baseBackoffMs: Number.parseInt(process.env.AZURE_API_BASE_BACKOFF_MS || '500', 10),
  maxBackoffMs: Number.parseInt(process.env.AZURE_API_MAX_BACKOFF_MS || '15000', 10)
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryAfterMs(headerValue) {
  if (!headerValue) {
    return 0;
  }

  const seconds = Number.parseInt(headerValue, 10);
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000);
  }

  const dateMs = new Date(headerValue).getTime();
  if (Number.isFinite(dateMs)) {
    return Math.max(0, dateMs - Date.now());
  }

  return 0;
}

function shouldRetryStatus(code) {
  return code === 429 || code === 500 || code === 502 || code === 503 || code === 504;
}

function calculateBackoffMs(attemptIndex, retryAfterMs) {
  if (retryAfterMs > 0) {
    return clamp(retryAfterMs, 100, azureThrottle.maxBackoffMs);
  }

  const exponential = azureThrottle.baseBackoffMs * 2 ** attemptIndex;
  const jitter = Math.floor(Math.random() * Math.max(50, azureThrottle.baseBackoffMs));
  return clamp(exponential + jitter, 100, azureThrottle.maxBackoffMs);
}

class RequestScheduler {
  constructor({ maxConcurrent, minIntervalMs }) {
    this.maxConcurrent = Math.max(1, maxConcurrent);
    this.minIntervalMs = Math.max(0, minIntervalMs);
    this.queue = [];
    this.inFlight = 0;
    this.lastDispatchAtMs = 0;
    this.timer = null;
  }

  schedule(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.drain();
    });
  }

  drain() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    while (this.inFlight < this.maxConcurrent && this.queue.length > 0) {
      const now = Date.now();
      const wait = this.lastDispatchAtMs + this.minIntervalMs - now;
      if (wait > 0) {
        this.timer = setTimeout(() => this.drain(), wait);
        return;
      }

      const entry = this.queue.shift();
      if (!entry) {
        return;
      }

      this.inFlight += 1;
      this.lastDispatchAtMs = Date.now();

      Promise.resolve()
        .then(() => entry.task())
        .then((value) => entry.resolve(value))
        .catch((error) => entry.reject(error))
        .finally(() => {
          this.inFlight -= 1;
          this.drain();
        });
    }
  }
}

const scheduler = new RequestScheduler({
  maxConcurrent: azureThrottle.maxConcurrent,
  minIntervalMs: azureThrottle.minIntervalMs
});

async function scheduledAzureFetch(url, options) {
  return scheduler.schedule(async () => {
    let attempt = 0;

    while (true) {
      const res = await fetch(url, options);

      if (!shouldRetryStatus(res.status) || attempt >= azureThrottle.maxRetries) {
        return res;
      }

      const retryAfterMs = parseRetryAfterMs(res.headers.get('retry-after'));
      const backoffMs = calculateBackoffMs(attempt, retryAfterMs);

      // Drain response body before retry to avoid keeping sockets busy.
      await res.text().catch(() => null);
      await sleep(backoffMs);

      attempt += 1;
    }
  });
}

async function fetchJson(url, token) {
  const res = await scheduledAzureFetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Azure request failed (${res.status}): ${text.slice(0, 600)}`);
  }

  return res.json();
}

function parseJsonSafe(rawText) {
  try {
    return JSON.parse(rawText);
  } catch (_error) {
    return null;
  }
}

async function fetchJsonWithStatus(url, token, options = {}) {
  const acceptedStatuses = new Set(options.acceptedStatuses || []);
  const res = await scheduledAzureFetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const text = await res.text();
  const json = parseJsonSafe(text);
  if (!res.ok && !acceptedStatuses.has(res.status)) {
    throw new Error(`Azure request failed (${res.status}): ${text.slice(0, 600)}`);
  }

  return {
    status: res.status,
    ok: res.ok,
    json,
    text
  };
}

async function fetchManagementPages(startUrl, token) {
  const values = [];
  let next = startUrl;

  while (next) {
    const payload = await fetchJson(next, token);
    if (Array.isArray(payload.value)) {
      values.push(...payload.value);
    }
    next = payload.nextLink || null;
  }

  return values;
}

async function listSubscriptions(armToken) {
  const url = 'https://management.azure.com/subscriptions?api-version=2022-12-01';
  return fetchManagementPages(url, armToken);
}

async function listStorageAccounts(armToken, subscriptionId) {
  const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2023-05-01`;
  return fetchManagementPages(url, armToken);
}

async function listContainersForAccount(armToken, accountId) {
  const normalizedId = accountId.startsWith('/') ? accountId : `/${accountId}`;
  const url = `https://management.azure.com${normalizedId}/blobServices/default/containers?api-version=2023-05-01`;
  return fetchManagementPages(url, armToken);
}

function asList(node) {
  if (!Array.isArray(node)) {
    return [];
  }
  return node;
}

async function getStorageAccountSecurityProfile(armToken, accountId) {
  const normalizedId = accountId.startsWith('/') ? accountId : `/${accountId}`;
  const base = `https://management.azure.com${normalizedId}`;

  const [account, lifecycle, blobService, diagnostics] = await Promise.all([
    fetchJsonWithStatus(`${base}?api-version=2023-05-01`, armToken),
    fetchJsonWithStatus(`${base}/managementPolicies/default?api-version=2023-05-01`, armToken, {
      acceptedStatuses: [404]
    }),
    fetchJsonWithStatus(`${base}/blobServices/default?api-version=2023-05-01`, armToken, {
      acceptedStatuses: [404]
    }),
    fetchJsonWithStatus(`${base}/providers/microsoft.insights/diagnosticSettings?api-version=2021-05-01-preview`, armToken, {
      acceptedStatuses: [404]
    })
  ]);

  const accountPayload = account.json || {};
  const accountProps = accountPayload.properties || {};
  const networkAcls = accountProps.networkAcls || accountProps.networkRuleSet || {};

  const ipRules = asList(networkAcls.ipRules)
    .map((rule) => ({
      value: rule?.value || '',
      action: rule?.action || ''
    }))
    .filter((rule) => rule.value);

  const virtualNetworkRules = asList(networkAcls.virtualNetworkRules)
    .map((rule) => ({
      id: rule?.virtualNetworkResourceId || '',
      action: rule?.action || '',
      state: rule?.state || ''
    }))
    .filter((rule) => rule.id);

  const privateEndpointConnections = asList(accountProps.privateEndpointConnections).map((connection) => ({
    name: connection?.name || '',
    status: connection?.properties?.privateLinkServiceConnectionState?.status || '',
    description: connection?.properties?.privateLinkServiceConnectionState?.description || ''
  }));

  const lifecycleRules = asList(lifecycle?.json?.properties?.policy?.rules);
  const diagnosticsSettings = asList(diagnostics?.json?.value);
  const enabledLifecycleRules = lifecycleRules.filter((rule) => rule?.enabled !== false).map((rule) => rule?.name || '').filter(Boolean);

  return {
    account: {
      id: accountPayload.id || normalizedId,
      name: accountPayload.name || normalizedId.split('/').pop(),
      location: accountPayload.location || null,
      kind: accountPayload.kind || null,
      sku: accountPayload.sku?.name || null
    },
    security: {
      publicNetworkAccess: accountProps.publicNetworkAccess ?? null,
      allowBlobPublicAccess: accountProps.allowBlobPublicAccess ?? null,
      allowSharedKeyAccess: accountProps.allowSharedKeyAccess ?? null,
      supportsHttpsTrafficOnly: accountProps.supportsHttpsTrafficOnly ?? null,
      minimumTlsVersion: accountProps.minimumTlsVersion ?? null,
      allowCrossTenantReplication: accountProps.allowCrossTenantReplication ?? null,
      encryptionKeySource: accountProps.encryption?.keySource ?? null,
      requireInfrastructureEncryption: accountProps.encryption?.requireInfrastructureEncryption ?? null
    },
    network: {
      defaultAction: networkAcls.defaultAction ?? null,
      bypass: networkAcls.bypass ?? null,
      ipRules,
      virtualNetworkRules,
      privateEndpointConnections
    },
    lifecycleManagement: {
      requestStatus: lifecycle.status,
      enabled: enabledLifecycleRules.length > 0,
      totalRules: lifecycleRules.length,
      enabledRules: enabledLifecycleRules
    },
    blobService: {
      requestStatus: blobService.status,
      deleteRetentionPolicy: blobService?.json?.properties?.deleteRetentionPolicy || null,
      containerDeleteRetentionPolicy: blobService?.json?.properties?.containerDeleteRetentionPolicy || null,
      versioningEnabled: blobService?.json?.properties?.isVersioningEnabled ?? null,
      changeFeedEnabled: blobService?.json?.properties?.changeFeed?.enabled ?? null,
      restorePolicy: blobService?.json?.properties?.restorePolicy || null,
      lastAccessTimeTrackingPolicy: blobService?.json?.properties?.lastAccessTimeTrackingPolicy || null
    },
    diagnostics: {
      requestStatus: diagnostics.status,
      settingCount: diagnosticsSettings.length,
      settings: diagnosticsSettings.map((setting) => ({
        name: setting?.name || '',
        workspaceId: setting?.properties?.workspaceId || null,
        storageAccountId: setting?.properties?.storageAccountId || null,
        eventHubAuthorizationRuleId: setting?.properties?.eventHubAuthorizationRuleId || null,
        enabledLogCategories: asList(setting?.properties?.logs)
          .filter((log) => log?.enabled)
          .map((log) => log?.category || '')
          .filter(Boolean),
        enabledMetricCategories: asList(setting?.properties?.metrics)
          .filter((metric) => metric?.enabled)
          .map((metric) => metric?.category || '')
          .filter(Boolean)
      }))
    }
  };
}

function asArray(node) {
  if (!node) {
    return [];
  }
  return Array.isArray(node) ? node : [node];
}

function toFiniteNumberOrNull(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeMetricName(name) {
  return String(name || '').trim().toLowerCase();
}

function getMetricRecord(metrics, metricName) {
  const target = normalizeMetricName(metricName);
  return asArray(metrics).find((metric) => normalizeMetricName(metric?.name?.value || metric?.name?.localizedValue) === target) || null;
}

function getMetricDataPoints(metricRecord) {
  return asArray(metricRecord?.timeseries).flatMap((series) => asArray(series?.data));
}

function getLatestMetricValue(metricRecord) {
  const points = getMetricDataPoints(metricRecord);
  let latestTimestamp = -Infinity;
  let latestValue = null;

  for (const point of points) {
    const metricValue =
      toFiniteNumberOrNull(point?.average) ??
      toFiniteNumberOrNull(point?.total) ??
      toFiniteNumberOrNull(point?.maximum) ??
      toFiniteNumberOrNull(point?.minimum);
    if (metricValue === null) {
      continue;
    }

    const timestamp = Date.parse(point?.timeStamp || point?.timestamp || '');
    const comparableTimestamp = Number.isFinite(timestamp) ? timestamp : latestTimestamp + 1;
    if (comparableTimestamp >= latestTimestamp) {
      latestTimestamp = comparableTimestamp;
      latestValue = metricValue;
    }
  }

  return latestValue;
}

function getMetricTotal(metricRecord) {
  const points = getMetricDataPoints(metricRecord);
  let total = 0;
  let found = false;

  for (const point of points) {
    const pointValue =
      toFiniteNumberOrNull(point?.total) ??
      toFiniteNumberOrNull(point?.average) ??
      toFiniteNumberOrNull(point?.maximum) ??
      toFiniteNumberOrNull(point?.minimum);
    if (pointValue === null) {
      continue;
    }
    total += pointValue;
    found = true;
  }

  return found ? total : null;
}

async function getStorageAccountMetricsWindow(
  armToken,
  accountId,
  { windowHours, interval, includeUsedCapacity = false }
) {
  const normalizedId = accountId.startsWith('/') ? accountId : `/${accountId}`;
  const endAt = new Date();
  const hours = Math.max(1, Number(windowHours) || 24);
  const startAt = new Date(endAt.getTime() - hours * 60 * 60 * 1000);
  const metricNames = includeUsedCapacity ? 'UsedCapacity,Egress,Ingress,Transactions' : 'Egress,Ingress,Transactions';

  const params = new URLSearchParams({
    'api-version': '2023-10-01',
    timespan: `${startAt.toISOString()}/${endAt.toISOString()}`,
    interval: interval || 'PT1H',
    metricnames: metricNames,
    aggregation: 'Average,Total',
    metricnamespace: 'Microsoft.Storage/storageAccounts',
    AutoAdjustTimegrain: 'true'
  });

  const url = `https://management.azure.com${normalizedId}/providers/microsoft.insights/metrics?${params.toString()}`;
  const response = await fetchJsonWithStatus(url, armToken);
  const metricValues = asList(response?.json?.value);

  return {
    windowStartUtc: startAt.toISOString(),
    windowEndUtc: endAt.toISOString(),
    usedCapacityBytes: includeUsedCapacity ? getLatestMetricValue(getMetricRecord(metricValues, 'UsedCapacity')) : null,
    totalEgressBytes: getMetricTotal(getMetricRecord(metricValues, 'Egress')),
    totalIngressBytes: getMetricTotal(getMetricRecord(metricValues, 'Ingress')),
    totalTransactions: getMetricTotal(getMetricRecord(metricValues, 'Transactions'))
  };
}

async function getStorageAccountMetrics24h(armToken, accountId) {
  const snapshot = await getStorageAccountMetricsWindow(armToken, accountId, {
    windowHours: 24,
    interval: 'PT1H',
    includeUsedCapacity: true
  });

  return {
    windowStartUtc: snapshot.windowStartUtc,
    windowEndUtc: snapshot.windowEndUtc,
    usedCapacityBytes: snapshot.usedCapacityBytes,
    totalEgressBytes24h: snapshot.totalEgressBytes,
    totalIngressBytes24h: snapshot.totalIngressBytes,
    totalTransactions24h: snapshot.totalTransactions
  };
}

async function getStorageAccountMetrics30d(armToken, accountId) {
  const snapshot = await getStorageAccountMetricsWindow(armToken, accountId, {
    windowHours: 30 * 24,
    interval: 'P1D',
    includeUsedCapacity: false
  });

  return {
    windowStartUtc: snapshot.windowStartUtc,
    windowEndUtc: snapshot.windowEndUtc,
    totalEgressBytes30d: snapshot.totalEgressBytes,
    totalIngressBytes30d: snapshot.totalIngressBytes,
    totalTransactions30d: snapshot.totalTransactions
  };
}

function parseBlobServiceError(text) {
  try {
    const parsed = parser.parse(text);
    const error = parsed?.Error || {};
    return {
      code: error.Code || '',
      message: error.Message || ''
    };
  } catch (_error) {
    return { code: '', message: '' };
  }
}

async function listBlobsPage(storageToken, blobEndpoint, containerName, marker) {
  const endpoint = blobEndpoint.replace(/\/$/, '');
  const url = new URL(`${endpoint}/${encodeURIComponent(containerName)}`);
  url.searchParams.set('restype', 'container');
  url.searchParams.set('comp', 'list');
  url.searchParams.set('maxresults', '5000');
  if (marker) {
    url.searchParams.set('marker', marker);
  }

  const res = await scheduledAzureFetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${storageToken}`,
      'x-ms-version': '2023-11-03'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    const parsedError = parseBlobServiceError(text);
    const parts = [`Blob list failed for ${containerName} (${res.status})`];

    if (parsedError.code) {
      parts.push(parsedError.code);
    }

    if (parsedError.message) {
      parts.push(parsedError.message.replace(/\s+/g, ' ').trim().slice(0, 500));
    } else {
      parts.push(text.slice(0, 400));
    }

    if (parsedError.code === 'AuthorizationPermissionMismatch' || parsedError.code === 'AuthorizationFailure') {
      parts.push('Grant Storage Blob Data Reader (or Contributor) to the calling principal at storage account or container scope and verify network rules allow access.');
    }

    throw new Error(parts.join(': '));
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);
  const listResult = parsed.EnumerationResults || {};
  const blobsNode = listResult.Blobs || {};
  const blobItems = asArray(blobsNode.Blob);

  let sizeBytes = 0;
  let blobCount = 0;

  for (const blob of blobItems) {
    const lenRaw = blob?.Properties?.['Content-Length'];
    const length = Number.parseInt(lenRaw, 10);
    sizeBytes += Number.isFinite(length) ? length : 0;
    blobCount += 1;
  }

  return {
    nextMarker: listResult.NextMarker || '',
    sizeBytes,
    blobCount
  };
}

async function calculateContainerSize(storageToken, blobEndpoint, containerName) {
  let marker = '';
  let totalBytes = 0;
  let totalBlobs = 0;

  do {
    const page = await listBlobsPage(storageToken, blobEndpoint, containerName, marker);
    totalBytes += page.sizeBytes;
    totalBlobs += page.blobCount;
    marker = page.nextMarker || '';
  } while (marker);

  return {
    sizeBytes: totalBytes,
    blobCount: totalBlobs
  };
}

module.exports = {
  listSubscriptions,
  listStorageAccounts,
  listContainersForAccount,
  calculateContainerSize,
  getStorageAccountSecurityProfile,
  getStorageAccountMetrics24h,
  getStorageAccountMetrics30d
};
