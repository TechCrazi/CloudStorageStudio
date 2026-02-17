const vsaxThrottle = {
  maxConcurrent: Number.parseInt(process.env.VSAX_API_MAX_CONCURRENCY || '2', 10),
  minIntervalMs: Number.parseInt(process.env.VSAX_API_MIN_INTERVAL_MS || '150', 10),
  maxRetries: Number.parseInt(process.env.VSAX_API_MAX_RETRIES || '4', 10)
};

const DEFAULT_BASE_URL = '';
const DEFAULT_INCLUDE = 'Disks';
const DEFAULT_GROUPS = [];
const DEFAULT_PAGE_SIZE = 100;
const DEFAULT_MAX_PAGES = 500;
const DEFAULT_DISK_VALUE_UNIT = 'kb';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toFiniteNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeString(value) {
  return String(value || '').trim();
}

function normalizeUrl(value, fallback = DEFAULT_BASE_URL) {
  const raw = normalizeString(value) || fallback;
  if (!raw) {
    return '';
  }
  const parsed = new URL(raw);
  return parsed.toString().replace(/\/$/, '');
}

function normalizeGroupName(value) {
  return normalizeString(value);
}

function splitGroupTokens(value) {
  const text = normalizeGroupName(value);
  if (!text) {
    return [];
  }
  const tokens = new Set([text]);
  const segments = text
    .split(/[>\/|\\]/)
    .map((part) => normalizeGroupName(part))
    .filter(Boolean);
  for (const segment of segments) {
    tokens.add(segment);
  }
  return Array.from(tokens);
}

function normalizeGroupNames(raw) {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    const names = raw.map((value) => normalizeGroupName(value)).filter(Boolean);
    return names.length ? Array.from(new Set(names)) : [];
  }

  const text = normalizeString(raw);
  if (!text) {
    return [...DEFAULT_GROUPS];
  }

  if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        const names = parsed.map((value) => normalizeGroupName(value)).filter(Boolean);
        return names.length ? Array.from(new Set(names)) : [];
      }
    } catch (_error) {
      // Fall through to CSV parsing.
    }
  }

  const names = text
    .split(',')
    .map((value) => normalizeGroupName(value))
    .filter(Boolean);
  return names.length ? Array.from(new Set(names)) : [];
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

function shouldRetryStatus(statusCode) {
  return statusCode === 429 || statusCode === 500 || statusCode === 502 || statusCode === 503 || statusCode === 504;
}

function calculateBackoffMs(attemptIndex, retryAfterMs) {
  if (retryAfterMs > 0) {
    return clamp(retryAfterMs, 120, 20000);
  }

  const base = 300 * 2 ** attemptIndex;
  const jitter = Math.floor(Math.random() * 240);
  return clamp(base + jitter, 120, 20000);
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
      const waitMs = this.lastDispatchAtMs + this.minIntervalMs - now;
      if (waitMs > 0) {
        this.timer = setTimeout(() => this.drain(), waitMs);
        return;
      }

      const next = this.queue.shift();
      if (!next) {
        return;
      }

      this.inFlight += 1;
      this.lastDispatchAtMs = Date.now();

      Promise.resolve()
        .then(() => next.task())
        .then((value) => next.resolve(value))
        .catch((error) => next.reject(error))
        .finally(() => {
          this.inFlight -= 1;
          this.drain();
        });
    }
  }
}

const scheduler = new RequestScheduler({
  maxConcurrent: vsaxThrottle.maxConcurrent,
  minIntervalMs: vsaxThrottle.minIntervalMs
});

async function scheduledVsaxFetch(url, options) {
  return scheduler.schedule(async () => {
    let attempt = 0;

    while (true) {
      const response = await fetch(url, options);
      if (!shouldRetryStatus(response.status) || attempt >= vsaxThrottle.maxRetries) {
        return response;
      }

      const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
      const backoffMs = calculateBackoffMs(attempt, retryAfterMs);
      await response.text().catch(() => null);
      await sleep(backoffMs);
      attempt += 1;
    }
  });
}

function parseVsaxConfigFromEnv() {
  const rawGroups = process.env.VSAX_GROUPS ?? process.env.VSAX_GROUP_FILTERS ?? '';
  const rawGroupsText = normalizeString(rawGroups);
  const baseUrl = normalizeUrl(process.env.VSAX_BASE_URL || process.env.VSAX_SERVER_URL || DEFAULT_BASE_URL, '');
  const tokenId = normalizeString(process.env.VSAX_API_TOKEN_ID || process.env.VSAX_TOKEN_ID || '');
  const tokenSecret = normalizeString(process.env.VSAX_API_TOKEN_SECRET || process.env.VSAX_TOKEN_SECRET || '');
  const include = normalizeString(process.env.VSAX_INCLUDE || DEFAULT_INCLUDE) || DEFAULT_INCLUDE;
  const groups = normalizeGroupNames(rawGroups);
  const groupFilterDefined = rawGroupsText.length > 0 && groups.length > 0;
  const pageSize = Math.max(1, Math.round(toFiniteNumber(process.env.VSAX_PAGE_SIZE, DEFAULT_PAGE_SIZE)));
  const maxPages = Math.max(1, Math.round(toFiniteNumber(process.env.VSAX_MAX_PAGES, DEFAULT_MAX_PAGES)));
  const assetFilter = normalizeString(process.env.VSAX_ASSET_FILTER || '');

  const missing = [];
  if (!baseUrl) {
    missing.push('VSAX_BASE_URL');
  }
  if (!tokenId) {
    missing.push('VSAX_API_TOKEN_ID');
  }
  if (!tokenSecret) {
    missing.push('VSAX_API_TOKEN_SECRET');
  }

  return {
    configured: missing.length === 0,
    missing,
    baseUrl,
    tokenId,
    tokenSecret,
    include,
    groups,
    groupFilterDefined,
    pageSize,
    maxPages,
    assetFilter
  };
}

function toPublicVsaxConfig(config) {
  return {
    configured: Boolean(config?.configured),
    missing: Array.isArray(config?.missing) ? config.missing : [],
    baseUrl: config?.baseUrl || '',
    include: config?.include || DEFAULT_INCLUDE,
    groups: Array.isArray(config?.groups) ? config.groups : [],
    groupFilterDefined: Boolean(config?.groupFilterDefined),
    pageSize: config?.pageSize || DEFAULT_PAGE_SIZE,
    maxPages: config?.maxPages || DEFAULT_MAX_PAGES,
    assetFilter: config?.assetFilter || ''
  };
}

function parseApiErrorMessage(rawText, statusCode) {
  if (!rawText) {
    return `VSAx API request failed with status ${statusCode}`;
  }

  try {
    const parsed = JSON.parse(rawText);
    if (parsed?.message) {
      return `VSAx API ${statusCode}: ${parsed.message}`;
    }
    if (parsed?.error?.message) {
      return `VSAx API ${statusCode}: ${parsed.error.message}`;
    }
  } catch (_error) {
    // fall through
  }

  return `VSAx API ${statusCode}: ${String(rawText).slice(0, 320)}`;
}

async function fetchVsaxAssetsPage({ baseUrl, tokenId, tokenSecret, include, pageSize, skip, assetFilter }) {
  const url = new URL('/api/v3/assets', baseUrl);
  if (include) {
    url.searchParams.set('include', include);
  }
  if (pageSize > 0) {
    url.searchParams.set('$top', String(pageSize));
  }
  if (skip > 0) {
    url.searchParams.set('$skip', String(skip));
  }
  if (assetFilter) {
    url.searchParams.set('$filter', assetFilter);
  }

  const authHeader = Buffer.from(`${tokenId}:${tokenSecret}`, 'utf8').toString('base64');
  const response = await scheduledVsaxFetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${authHeader}`
    }
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(parseApiErrorMessage(rawText, response.status));
  }

  try {
    return rawText ? JSON.parse(rawText) : {};
  } catch (error) {
    throw new Error(`VSAx API returned invalid JSON: ${error.message || String(error)}`);
  }
}

function parseAssetList(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  if (Array.isArray(response.Items)) {
    return response.Items;
  }
  if (Array.isArray(response.items)) {
    return response.items;
  }
  if (Array.isArray(response.Data)) {
    return response.Data;
  }

  return Object.keys(response).length ? [response] : [];
}

function getFirstString(valueCandidates = []) {
  for (const value of valueCandidates) {
    const text = normalizeString(value);
    if (text) {
      return text;
    }
  }
  return '';
}

function extractGroupNamesFromAsset(asset) {
  const groups = new Set();

  const directCandidates = [
    asset?.GroupName,
    asset?.groupName,
    asset?.Group,
    asset?.group,
    asset?.AgentGroup,
    asset?.AgentGroupName,
    asset?.OrganizationGroup,
    asset?.OrganizationGroupName,
    asset?.OrganizationName,
    asset?.OrgName,
    asset?.SiteName,
    asset?.Site
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === 'string') {
      for (const token of splitGroupTokens(candidate)) {
        groups.add(token);
      }
      continue;
    }

    if (candidate && typeof candidate === 'object') {
      const nestedName = getFirstString([candidate.Name, candidate.name, candidate.GroupName, candidate.groupName]);
      for (const token of splitGroupTokens(nestedName)) {
        groups.add(token);
      }
    }
  }

  const multiCandidates = [asset?.Groups, asset?.groups, asset?.GroupPaths, asset?.groupPaths, asset?.Folders, asset?.folders];
  for (const candidate of multiCandidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    for (const entry of candidate) {
      if (typeof entry === 'string') {
        for (const token of splitGroupTokens(entry)) {
          groups.add(token);
        }
        continue;
      }

      if (entry && typeof entry === 'object') {
        const nestedName = getFirstString([
          entry.Name,
          entry.name,
          entry.GroupName,
          entry.groupName,
          entry.Path,
          entry.path,
          entry.DisplayName,
          entry.displayName
        ]);
        for (const token of splitGroupTokens(nestedName)) {
          groups.add(token);
        }
      }
    }
  }

  return Array.from(groups);
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseDiskValueUnit(raw) {
  const normalized = String(raw || '')
    .trim()
    .toLowerCase();
  if (!normalized) {
    return DEFAULT_DISK_VALUE_UNIT;
  }
  if (['b', 'byte', 'bytes'].includes(normalized)) {
    return 'bytes';
  }
  if (['kb', 'k', 'kilobyte', 'kilobytes'].includes(normalized)) {
    return 'kb';
  }
  if (['mb', 'm', 'megabyte', 'megabytes'].includes(normalized)) {
    return 'mb';
  }
  if (['gb', 'g', 'gigabyte', 'gigabytes'].includes(normalized)) {
    return 'gb';
  }
  if (['tb', 't', 'terabyte', 'terabytes'].includes(normalized)) {
    return 'tb';
  }
  return DEFAULT_DISK_VALUE_UNIT;
}

function getDiskValueUnitMultiplier() {
  const unit = parseDiskValueUnit(process.env.VSAX_DISK_VALUE_UNIT || DEFAULT_DISK_VALUE_UNIT);
  if (unit === 'bytes') {
    return 1;
  }
  if (unit === 'mb') {
    return 1024 ** 2;
  }
  if (unit === 'gb') {
    return 1024 ** 3;
  }
  if (unit === 'tb') {
    return 1024 ** 4;
  }
  return 1024;
}

function convertDiskValueToBytes(value) {
  const numeric = toNullableNumber(value);
  if (numeric === null) {
    return null;
  }
  const multiplier = getDiskValueUnitMultiplier();
  return Math.round(numeric * multiplier);
}

function toNullableBool(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'n'].includes(normalized)) {
    return false;
  }
  return null;
}

function normalizeDiskEntry(rawDisk) {
  if (!rawDisk || typeof rawDisk !== 'object') {
    return null;
  }

  const diskName = getFirstString([rawDisk.Name, rawDisk.name, rawDisk.Drive, rawDisk.drive, rawDisk.Device, rawDisk.device]);
  if (!diskName) {
    return null;
  }

  const totalBytes = convertDiskValueToBytes(rawDisk.TotalValue ?? rawDisk.totalValue ?? rawDisk.Total ?? rawDisk.total ?? null);
  const freeBytesDirect = convertDiskValueToBytes(rawDisk.FreeValue ?? rawDisk.freeValue ?? rawDisk.Free ?? rawDisk.free ?? null);
  const usedBytesDirect = convertDiskValueToBytes(rawDisk.UsedValue ?? rawDisk.usedValue ?? rawDisk.Used ?? rawDisk.used ?? null);
  const freePercentage = toNullableNumber(rawDisk.FreePercentage ?? rawDisk.freePercentage ?? null);

  let usedBytes = usedBytesDirect;
  let freeBytes = freeBytesDirect;

  if (usedBytes === null && totalBytes !== null && freeBytes !== null) {
    usedBytes = Math.max(0, totalBytes - freeBytes);
  }
  if (freeBytes === null && totalBytes !== null && usedBytes !== null) {
    freeBytes = Math.max(0, totalBytes - usedBytes);
  }
  if (usedBytes === null && totalBytes !== null && freePercentage !== null) {
    usedBytes = Math.max(0, Math.round(totalBytes * (1 - freePercentage / 100)));
  }
  if (freeBytes === null && totalBytes !== null && freePercentage !== null) {
    freeBytes = Math.max(0, Math.round(totalBytes * (freePercentage / 100)));
  }

  return {
    diskName,
    isSystem: toNullableBool(rawDisk.System ?? rawDisk.system ?? null),
    totalBytes,
    usedBytes,
    freeBytes,
    freePercentage
  };
}

function parseAssetMetrics(asset) {
  const deviceId = getFirstString([asset?.Identifier, asset?.identifier, asset?.Id, asset?.id]);
  const deviceName = getFirstString([asset?.Name, asset?.name, asset?.DeviceName, asset?.deviceName]) || deviceId;
  const cpuUsage = toNullableNumber(asset?.CpuUsage ?? asset?.cpuUsage ?? asset?.cpu_usage ?? null);
  const memoryUsage = toNullableNumber(asset?.MemoryUsage ?? asset?.memoryUsage ?? asset?.memory_usage ?? null);
  const memoryTotal = toNullableNumber(asset?.MemoryTotal ?? asset?.memoryTotal ?? asset?.memory_total ?? null);

  const rawDisks = Array.isArray(asset?.Disks) ? asset.Disks : [];
  const disks = rawDisks.map((disk) => normalizeDiskEntry(disk)).filter(Boolean);

  const diskTotalBytes = disks.reduce((sum, disk) => sum + (disk.totalBytes || 0), 0);
  const diskUsedBytes = disks.reduce((sum, disk) => sum + (disk.usedBytes || 0), 0);
  const diskFreeBytes = disks.reduce((sum, disk) => sum + (disk.freeBytes || 0), 0);

  return {
    deviceId,
    deviceName,
    cpuUsage,
    memoryUsage,
    memoryTotal,
    disks,
    diskTotalBytes,
    diskUsedBytes,
    diskFreeBytes
  };
}

function selectMatchingGroups(assetGroupNames, selectedGroups) {
  const normalizedSelected = Array.isArray(selectedGroups)
    ? selectedGroups.map((name) => normalizeGroupName(name)).filter(Boolean)
    : [];
  if (!normalizedSelected.length) {
    return assetGroupNames.length ? assetGroupNames : ['Unassigned'];
  }

  const selectedSet = new Set(normalizedSelected.map((name) => name.toLowerCase()));
  return assetGroupNames.filter((name) => selectedSet.has(String(name || '').toLowerCase()));
}

async function fetchVsaxInventory({
  baseUrl,
  tokenId,
  tokenSecret,
  include = DEFAULT_INCLUDE,
  pageSize = DEFAULT_PAGE_SIZE,
  maxPages = DEFAULT_MAX_PAGES,
  selectedGroups = [],
  assetFilter = ''
}) {
  const devices = [];
  const disks = [];
  const groupSet = new Set();
  let pageCount = 0;
  let assetCount = 0;

  let skip = 0;
  const safePageSize = Math.max(1, Math.round(toFiniteNumber(pageSize, DEFAULT_PAGE_SIZE)));
  const safeMaxPages = Math.max(1, Math.round(toFiniteNumber(maxPages, DEFAULT_MAX_PAGES)));

  for (let page = 0; page < safeMaxPages; page += 1) {
    const response = await fetchVsaxAssetsPage({
      baseUrl,
      tokenId,
      tokenSecret,
      include,
      pageSize: safePageSize,
      skip,
      assetFilter
    });

    const assets = parseAssetList(response);
    if (!assets.length) {
      break;
    }

    pageCount += 1;
    assetCount += assets.length;

    for (const asset of assets) {
      const parsed = parseAssetMetrics(asset);
      if (!parsed.deviceId) {
        continue;
      }

      const assetGroupNames = extractGroupNamesFromAsset(asset);
      const matchedGroups = selectMatchingGroups(assetGroupNames, selectedGroups);
      if (!matchedGroups.length) {
        continue;
      }

      for (const groupName of matchedGroups) {
        groupSet.add(groupName);

        devices.push({
          groupName,
          deviceId: parsed.deviceId,
          deviceName: parsed.deviceName,
          cpuUsage: parsed.cpuUsage,
          memoryUsage: parsed.memoryUsage,
          memoryTotal: parsed.memoryTotal,
          diskTotalBytes: parsed.diskTotalBytes,
          diskUsedBytes: parsed.diskUsedBytes,
          diskFreeBytes: parsed.diskFreeBytes,
          diskCount: parsed.disks.length,
          lastSyncAt: new Date().toISOString(),
          error: null
        });

        for (const disk of parsed.disks) {
          disks.push({
            groupName,
            deviceId: parsed.deviceId,
            deviceName: parsed.deviceName,
            diskName: disk.diskName,
            isSystem: disk.isSystem,
            totalBytes: disk.totalBytes,
            usedBytes: disk.usedBytes,
            freeBytes: disk.freeBytes,
            freePercentage: disk.freePercentage,
            lastSyncAt: new Date().toISOString(),
            error: null
          });
        }
      }
    }

    if (assets.length < safePageSize) {
      break;
    }

    skip += safePageSize;
  }

  const fallbackGroups = Array.isArray(selectedGroups) ? selectedGroups.map((name) => normalizeGroupName(name)).filter(Boolean) : [];

  return {
    groups: groupSet.size ? Array.from(groupSet) : fallbackGroups,
    devices,
    disks,
    pageCount,
    assetCount,
    matchedDeviceCount: devices.length
  };
}

async function fetchVsaxGroupCatalog({
  baseUrl,
  tokenId,
  tokenSecret,
  pageSize = DEFAULT_PAGE_SIZE,
  maxPages = DEFAULT_MAX_PAGES,
  assetFilter = ''
}) {
  const groupSet = new Set();
  let pageCount = 0;
  let assetCount = 0;
  let skip = 0;

  const safePageSize = Math.max(1, Math.round(toFiniteNumber(pageSize, DEFAULT_PAGE_SIZE)));
  const safeMaxPages = Math.max(1, Math.round(toFiniteNumber(maxPages, DEFAULT_MAX_PAGES)));

  for (let page = 0; page < safeMaxPages; page += 1) {
    const response = await fetchVsaxAssetsPage({
      baseUrl,
      tokenId,
      tokenSecret,
      include: '',
      pageSize: safePageSize,
      skip,
      assetFilter
    });

    const assets = parseAssetList(response);
    if (!assets.length) {
      break;
    }

    pageCount += 1;
    assetCount += assets.length;

    for (const asset of assets) {
      const groupNames = extractGroupNamesFromAsset(asset);
      for (const groupName of groupNames) {
        const normalized = normalizeGroupName(groupName);
        if (normalized) {
          groupSet.add(normalized);
        }
      }
    }

    if (assets.length < safePageSize) {
      break;
    }
    skip += safePageSize;
  }

  return {
    groups: Array.from(groupSet).sort((left, right) =>
      String(left || '').localeCompare(String(right || ''), undefined, {
        sensitivity: 'base',
        numeric: true
      })
    ),
    pageCount,
    assetCount
  };
}

module.exports = {
  vsaxThrottle,
  parseVsaxConfigFromEnv,
  toPublicVsaxConfig,
  fetchVsaxInventory,
  fetchVsaxGroupCatalog
};
