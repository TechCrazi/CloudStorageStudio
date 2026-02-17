const crypto = require('crypto');
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
});

const wasabiThrottle = {
  maxConcurrent: Number.parseInt(process.env.WASABI_API_MAX_CONCURRENCY || '3', 10),
  minIntervalMs: Number.parseInt(process.env.WASABI_API_MIN_INTERVAL_MS || '120', 10),
  maxRetries: Number.parseInt(process.env.WASABI_API_MAX_RETRIES || '4', 10),
  baseBackoffMs: Number.parseInt(process.env.WASABI_API_BASE_BACKOFF_MS || '400', 10),
  maxBackoffMs: Number.parseInt(process.env.WASABI_API_MAX_BACKOFF_MS || '8000', 10)
};

const DEFAULT_S3_ENDPOINT = 'https://s3.wasabisys.com';
const DEFAULT_STATS_ENDPOINT = 'https://stats.wasabisys.com';
const DEFAULT_REGION = 'us-east-1';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asArray(node) {
  if (!node) {
    return [];
  }
  return Array.isArray(node) ? node : [node];
}

function normalizeAccountId(value, fallback = 'wasabi-default') {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-');
}

function normalizeUrl(value, fallback) {
  const candidate = String(value || '').trim() || fallback;
  const parsed = new URL(candidate);
  return parsed.toString().replace(/\/$/, '');
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
    return clamp(retryAfterMs, 120, wasabiThrottle.maxBackoffMs);
  }

  const exponential = wasabiThrottle.baseBackoffMs * 2 ** attemptIndex;
  const jitter = Math.floor(Math.random() * Math.max(60, wasabiThrottle.baseBackoffMs));
  return clamp(exponential + jitter, 120, wasabiThrottle.maxBackoffMs);
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
  maxConcurrent: wasabiThrottle.maxConcurrent,
  minIntervalMs: wasabiThrottle.minIntervalMs
});

async function scheduledWasabiFetch(url, options) {
  return scheduler.schedule(async () => {
    let attempt = 0;

    while (true) {
      const response = await fetch(url, options);
      if (!shouldRetryStatus(response.status) || attempt >= wasabiThrottle.maxRetries) {
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

function parseWasabiAccountsFromJson(rawJson) {
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`WASABI_ACCOUNTS_JSON is not valid JSON: ${error.message || String(error)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('WASABI_ACCOUNTS_JSON must be a JSON array of account objects.');
  }

  return parsed;
}

function normalizeWasabiAccountConfig(rawAccount, index = 0) {
  if (!rawAccount || typeof rawAccount !== 'object') {
    return null;
  }

  const accessKey = String(rawAccount.accessKey || rawAccount.access_key || '').trim();
  const secretKey = String(rawAccount.secretKey || rawAccount.secret_key || '').trim();
  if (!accessKey || !secretKey) {
    return null;
  }

  const accountId = normalizeAccountId(rawAccount.accountId || rawAccount.id || rawAccount.name, `wasabi-${index + 1}`);
  const displayName = String(rawAccount.displayName || rawAccount.label || rawAccount.name || accountId).trim() || accountId;

  return {
    accountId,
    displayName,
    accessKey,
    secretKey,
    region: String(rawAccount.region || DEFAULT_REGION).trim() || DEFAULT_REGION,
    s3Endpoint: normalizeUrl(rawAccount.s3Endpoint || rawAccount.endpoint || rawAccount.s3_endpoint, DEFAULT_S3_ENDPOINT),
    statsEndpoint: normalizeUrl(rawAccount.statsEndpoint || rawAccount.stats_endpoint, DEFAULT_STATS_ENDPOINT)
  };
}

function getWasabiAccountConfigsFromEnv() {
  const rawJson = String(process.env.WASABI_ACCOUNTS_JSON || '').trim();
  let accounts = [];

  if (rawJson) {
    const parsedAccounts = parseWasabiAccountsFromJson(rawJson);
    accounts = parsedAccounts
      .map((account, index) => normalizeWasabiAccountConfig(account, index))
      .filter(Boolean);
  }

  if (!accounts.length) {
    const fallbackAccessKey = String(process.env.WASABI_ACCESS_KEY || '').trim();
    const fallbackSecretKey = String(process.env.WASABI_SECRET_KEY || '').trim();

    if (fallbackAccessKey && fallbackSecretKey) {
      const fallbackAccount = normalizeWasabiAccountConfig(
        {
          accountId: process.env.WASABI_ACCOUNT_ID || 'wasabi-default',
          displayName: process.env.WASABI_ACCOUNT_LABEL || 'Wasabi',
          accessKey: fallbackAccessKey,
          secretKey: fallbackSecretKey,
          region: process.env.WASABI_REGION || DEFAULT_REGION,
          s3Endpoint: process.env.WASABI_S3_ENDPOINT || DEFAULT_S3_ENDPOINT,
          statsEndpoint: process.env.WASABI_STATS_ENDPOINT || DEFAULT_STATS_ENDPOINT
        },
        0
      );

      if (fallbackAccount) {
        accounts = [fallbackAccount];
      }
    }
  }

  const deduped = new Map();
  for (const account of accounts) {
    if (!deduped.has(account.accountId)) {
      deduped.set(account.accountId, account);
    }
  }

  return Array.from(deduped.values());
}

function toPublicWasabiAccount(account) {
  return {
    accountId: account.accountId,
    displayName: account.displayName,
    region: account.region,
    s3Endpoint: account.s3Endpoint,
    statsEndpoint: account.statsEndpoint
  };
}

function toAmzDate(date) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

function hashSha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function hmacSha256(key, value, encoding) {
  return crypto.createHmac('sha256', key).update(value, 'utf8').digest(encoding);
}

function buildCanonicalQuery(searchParams) {
  const entries = [];
  for (const [key, value] of searchParams.entries()) {
    entries.push([encodeURIComponent(key), encodeURIComponent(value)]);
  }

  entries.sort(([aKey, aValue], [bKey, bValue]) => {
    if (aKey === bKey) {
      return aValue.localeCompare(bValue);
    }
    return aKey.localeCompare(bKey);
  });

  return entries.map(([key, value]) => `${key}=${value}`).join('&');
}

function buildSignedS3Headers({ method, endpointUrl, accessKey, secretKey, region }) {
  const requestDate = new Date();
  const amzDate = toAmzDate(requestDate);
  const dateStamp = amzDate.slice(0, 8);
  const url = new URL(endpointUrl);
  const host = url.host;
  const canonicalUri = url.pathname || '/';
  const canonicalQuery = buildCanonicalQuery(url.searchParams);
  const payloadHash = hashSha256Hex('');

  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [method, canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join('\n');

  const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, hashSha256Hex(canonicalRequest)].join('\n');

  const kDate = hmacSha256(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, region);
  const kService = hmacSha256(kRegion, 's3');
  const kSigning = hmacSha256(kService, 'aws4_request');
  const signature = hmacSha256(kSigning, stringToSign, 'hex');

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    authorization,
    amzDate,
    payloadHash
  };
}

function parseWasabiErrorPayload(rawText) {
  if (!rawText) {
    return '';
  }

  try {
    const parsed = JSON.parse(rawText);
    if (parsed?.message) {
      return String(parsed.message);
    }
    if (parsed?.error) {
      return String(parsed.error);
    }
  } catch (_error) {
    // Ignore parse errors and fall back to plain text.
  }

  return String(rawText).trim();
}

async function listBucketsForAccount(account) {
  const endpointUrl = `${account.s3Endpoint}/`;
  const signedHeaders = buildSignedS3Headers({
    method: 'GET',
    endpointUrl,
    accessKey: account.accessKey,
    secretKey: account.secretKey,
    region: account.region || DEFAULT_REGION
  });

  const response = await scheduledWasabiFetch(endpointUrl, {
    method: 'GET',
    headers: {
      Authorization: signedHeaders.authorization,
      'x-amz-date': signedHeaders.amzDate,
      'x-amz-content-sha256': signedHeaders.payloadHash
    }
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`Wasabi list buckets failed (${response.status}): ${parseWasabiErrorPayload(rawText).slice(0, 500)}`);
  }

  let parsed;
  try {
    parsed = parser.parse(rawText);
  } catch (error) {
    throw new Error(`Wasabi bucket list XML parse failed: ${error.message || String(error)}`);
  }

  const bucketNodes = asArray(parsed?.ListAllMyBucketsResult?.Buckets?.Bucket);
  return bucketNodes
    .map((bucket) => ({
      bucketName: String(bucket?.Name || '').trim(),
      createdAt: bucket?.CreationDate || null
    }))
    .filter((bucket) => bucket.bucketName);
}

function formatUtcDate(date) {
  return date.toISOString().slice(0, 10);
}

function buildWasabiStatsDateRange(now = new Date()) {
  const endDate = new Date(now.getTime());
  const startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return {
    fromDate: formatUtcDate(startDate),
    toDate: formatUtcDate(endDate)
  };
}

function toNumberOrZero(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

async function getBucketLatestUtilization(account, bucketName, dateRange = buildWasabiStatsDateRange()) {
  const endpoint = account.statsEndpoint.replace(/\/$/, '');
  const url = new URL(`${endpoint}/v1/standalone/utilizations/bucket/${encodeURIComponent(bucketName)}`);
  url.searchParams.set('pageNum', '0');
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('latest', 'true');
  url.searchParams.set('from', dateRange.fromDate);
  url.searchParams.set('to', dateRange.toDate);

  const response = await scheduledWasabiFetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `${account.accessKey}:${account.secretKey}`
    }
  });

  const rawText = await response.text();
  if (!response.ok) {
    throw new Error(`Wasabi stats failed for ${bucketName} (${response.status}): ${parseWasabiErrorPayload(rawText).slice(0, 500)}`);
  }

  let payload;
  try {
    payload = JSON.parse(rawText);
  } catch (error) {
    throw new Error(`Wasabi stats JSON parse failed for ${bucketName}: ${error.message || String(error)}`);
  }

  const record = Array.isArray(payload?.Records) ? payload.Records[0] || null : null;

  return {
    usageBytes: toNumberOrZero(record?.PaddedStorageSizeBytes),
    objectCount: toNumberOrZero(record?.NumBillableObjects),
    utilizationRecordedAt: record?.Date || record?.Timestamp || record?.LatestTime || null,
    fromDate: dateRange.fromDate,
    toDate: dateRange.toDate
  };
}

module.exports = {
  getWasabiAccountConfigsFromEnv,
  toPublicWasabiAccount,
  listBucketsForAccount,
  buildWasabiStatsDateRange,
  getBucketLatestUtilization
};
