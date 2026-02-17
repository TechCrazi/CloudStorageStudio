const {
  S3Client,
  ListBucketsCommand,
  ListObjectsV2Command,
  GetBucketLocationCommand,
  GetPublicAccessBlockCommand,
  GetBucketPolicyStatusCommand,
  GetBucketEncryptionCommand,
  GetBucketVersioningCommand,
  GetBucketLifecycleConfigurationCommand,
  GetBucketLoggingCommand,
  GetObjectLockConfigurationCommand,
  GetBucketOwnershipControlsCommand
} = require('@aws-sdk/client-s3');
const { CloudWatchClient, GetMetricStatisticsCommand } = require('@aws-sdk/client-cloudwatch');
const { EFSClient, DescribeFileSystemsCommand } = require('@aws-sdk/client-efs');

const DEFAULT_REGION = 'us-east-1';
const DEFAULT_CLOUDWATCH_REGION = 'us-east-1';
const STORAGE_TYPE_CANDIDATES = ['AllStorageTypes', 'StandardStorage'];

const awsThrottle = {
  maxConcurrent: Number.parseInt(process.env.AWS_API_MAX_CONCURRENCY || '4', 10),
  minIntervalMs: Number.parseInt(process.env.AWS_API_MIN_INTERVAL_MS || '100', 10),
  maxRetries: Number.parseInt(process.env.AWS_API_MAX_RETRIES || '4', 10),
  deepScanMaxPagesPerBucket: Math.max(0, Number.parseInt(process.env.AWS_DEEP_SCAN_MAX_PAGES_PER_BUCKET || '0', 10))
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) {
    return false;
  }
  return fallback;
}

function toFiniteNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function asArray(value) {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function normalizeRegionList(value, fallbackRegion = DEFAULT_REGION) {
  const fallback = normalizeBucketRegion(fallbackRegion, DEFAULT_REGION);

  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => normalizeBucketRegion(item, ''))
      .filter(Boolean);
    return normalized.length ? Array.from(new Set(normalized)) : [fallback];
  }

  if (typeof value === 'string') {
    const normalized = value
      .split(',')
      .map((item) => normalizeBucketRegion(item, ''))
      .filter(Boolean);
    return normalized.length ? Array.from(new Set(normalized)) : [fallback];
  }

  return [fallback];
}

function normalizeAccountId(value, fallback = 'aws-default') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-');
}

function normalizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return null;
  }
  const parsed = new URL(raw);
  return parsed.toString().replace(/\/$/, '');
}

function isAwsManagedS3Endpoint(endpointUrl) {
  const raw = String(endpointUrl || '').trim();
  if (!raw) {
    return false;
  }

  try {
    const host = new URL(raw).hostname.toLowerCase();
    const isAmazonDomain = host.endsWith('.amazonaws.com') || host.endsWith('.amazonaws.com.cn');
    const looksLikeS3Host = host.startsWith('s3.') || host.startsWith('s3-') || host === 's3.amazonaws.com';
    return isAmazonDomain && looksLikeS3Host;
  } catch (_error) {
    return false;
  }
}

function normalizeBucketRegion(regionValue, fallbackRegion = DEFAULT_REGION) {
  const fallback = String(fallbackRegion || DEFAULT_REGION).trim() || DEFAULT_REGION;
  if (regionValue === null || regionValue === undefined || regionValue === '') {
    return fallback;
  }

  const normalized = String(regionValue).trim();
  if (!normalized) {
    return fallback;
  }

  const upper = normalized.toUpperCase();
  if (upper === 'EU') {
    return 'eu-west-1';
  }
  if (upper === 'US') {
    return 'us-east-1';
  }

  return normalized.toLowerCase();
}

function buildS3ClientConfig(account, regionOverride) {
  const region = normalizeBucketRegion(regionOverride || account.region || DEFAULT_REGION, account.region || DEFAULT_REGION);
  const config = {
    region,
    credentials: buildAwsCredentials(account),
    maxAttempts: awsThrottle.maxRetries,
    followRegionRedirects: true
  };

  if (account.s3Endpoint && !isAwsManagedS3Endpoint(account.s3Endpoint)) {
    config.endpoint = account.s3Endpoint;
    config.forcePathStyle = Boolean(account.forcePathStyle);
  }

  return config;
}

function createS3Client(account, regionOverride) {
  return new S3Client(buildS3ClientConfig(account, regionOverride));
}

function createEfsClient(account, regionOverride) {
  const region = normalizeBucketRegion(regionOverride || account.region || DEFAULT_REGION, account.region || DEFAULT_REGION);
  return new EFSClient({
    region,
    credentials: buildAwsCredentials(account),
    maxAttempts: awsThrottle.maxRetries
  });
}

class RequestScheduler {
  constructor({ maxConcurrent, minIntervalMs }) {
    this.maxConcurrent = Math.max(1, maxConcurrent);
    this.minIntervalMs = Math.max(0, minIntervalMs);
    this.queue = [];
    this.inFlight = 0;
    this.lastDispatchAt = 0;
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
      const waitMs = this.lastDispatchAt + this.minIntervalMs - Date.now();
      if (waitMs > 0) {
        this.timer = setTimeout(() => this.drain(), waitMs);
        return;
      }

      const next = this.queue.shift();
      if (!next) {
        return;
      }

      this.inFlight += 1;
      this.lastDispatchAt = Date.now();

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
  maxConcurrent: awsThrottle.maxConcurrent,
  minIntervalMs: awsThrottle.minIntervalMs
});

function parseAwsAccountsFromJson(rawJson) {
  let parsed;
  try {
    parsed = JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`AWS_ACCOUNTS_JSON is not valid JSON: ${error.message || String(error)}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('AWS_ACCOUNTS_JSON must be a JSON array of account objects.');
  }
  return parsed;
}

function normalizeAwsAccountConfig(rawAccount, index = 0) {
  if (!rawAccount || typeof rawAccount !== 'object') {
    return null;
  }

  const accessKeyId = String(rawAccount.accessKeyId || rawAccount.accessKey || rawAccount.access_key || '').trim();
  const secretAccessKey = String(
    rawAccount.secretAccessKey || rawAccount.secretKey || rawAccount.secret_key || ''
  ).trim();
  if (!accessKeyId || !secretAccessKey) {
    return null;
  }

  const accountId = normalizeAccountId(rawAccount.accountId || rawAccount.id || rawAccount.name, `aws-${index + 1}`);
  const displayName = String(rawAccount.displayName || rawAccount.label || rawAccount.name || accountId).trim() || accountId;
  const region = String(rawAccount.region || DEFAULT_REGION).trim() || DEFAULT_REGION;
  const cloudWatchRegion = String(rawAccount.cloudWatchRegion || rawAccount.cloudwatchRegion || DEFAULT_CLOUDWATCH_REGION).trim() || DEFAULT_CLOUDWATCH_REGION;
  const efsRegions = normalizeRegionList(rawAccount.efsRegions || rawAccount.efs_regions, region);

  return {
    accountId,
    displayName,
    accessKeyId,
    secretAccessKey,
    sessionToken: String(rawAccount.sessionToken || rawAccount.session_token || '').trim() || null,
    region,
    cloudWatchRegion,
    efsRegions,
    s3Endpoint: normalizeUrl(rawAccount.s3Endpoint || rawAccount.endpoint || rawAccount.s3_endpoint),
    forcePathStyle: parseBoolean(rawAccount.forcePathStyle ?? rawAccount.s3ForcePathStyle, false),
    requestMetricsEnabledByDefault: parseBoolean(
      rawAccount.requestMetricsEnabledByDefault ?? rawAccount.enableRequestMetrics,
      false
    )
  };
}

function getAwsAccountConfigsFromEnv() {
  const rawJson = String(process.env.AWS_ACCOUNTS_JSON || '').trim();
  let accounts = [];

  if (rawJson) {
    accounts = parseAwsAccountsFromJson(rawJson)
      .map((row, index) => normalizeAwsAccountConfig(row, index))
      .filter(Boolean);
  }

  if (!accounts.length) {
    const fallbackAccessKey = String(process.env.AWS_DEFAULT_ACCESS_KEY_ID || '').trim();
    const fallbackSecretKey = String(process.env.AWS_DEFAULT_SECRET_ACCESS_KEY || '').trim();
    if (fallbackAccessKey && fallbackSecretKey) {
      const fallback = normalizeAwsAccountConfig(
        {
          accountId: process.env.AWS_DEFAULT_ACCOUNT_ID || 'aws-default',
          displayName: process.env.AWS_DEFAULT_ACCOUNT_LABEL || 'AWS',
          accessKeyId: fallbackAccessKey,
          secretAccessKey: fallbackSecretKey,
          sessionToken: process.env.AWS_DEFAULT_SESSION_TOKEN || '',
          region: process.env.AWS_DEFAULT_REGION || DEFAULT_REGION,
          cloudWatchRegion: process.env.AWS_DEFAULT_CLOUDWATCH_REGION || DEFAULT_CLOUDWATCH_REGION,
          efsRegions: process.env.AWS_DEFAULT_EFS_REGIONS || process.env.AWS_DEFAULT_REGION || DEFAULT_REGION,
          s3Endpoint: process.env.AWS_DEFAULT_S3_ENDPOINT || '',
          forcePathStyle: process.env.AWS_DEFAULT_FORCE_PATH_STYLE || false,
          requestMetricsEnabledByDefault: process.env.AWS_DEFAULT_REQUEST_METRICS_ENABLED || false
        },
        0
      );
      if (fallback) {
        accounts = [fallback];
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

function toPublicAwsAccount(account) {
  return {
    accountId: account.accountId,
    displayName: account.displayName,
    region: account.region,
    cloudWatchRegion: account.cloudWatchRegion,
    efsRegions: Array.isArray(account.efsRegions) ? account.efsRegions : [account.region || DEFAULT_REGION],
    s3Endpoint: account.s3Endpoint || null,
    forcePathStyle: Boolean(account.forcePathStyle),
    requestMetricsEnabledByDefault: Boolean(account.requestMetricsEnabledByDefault)
  };
}

function buildAwsCredentials(account) {
  const credentials = {
    accessKeyId: account.accessKeyId,
    secretAccessKey: account.secretAccessKey
  };
  if (account.sessionToken) {
    credentials.sessionToken = account.sessionToken;
  }
  return credentials;
}

function createAwsClients(account) {
  const credentials = buildAwsCredentials(account);
  const s3Client = createS3Client(account);

  const cloudWatchConfig = {
    region: account.cloudWatchRegion || DEFAULT_CLOUDWATCH_REGION,
    credentials,
    maxAttempts: awsThrottle.maxRetries
  };

  return {
    s3Client,
    cloudWatchClient: new CloudWatchClient(cloudWatchConfig)
  };
}

function destroyAwsClients(clients = {}) {
  try {
    clients.s3Client?.destroy?.();
  } catch (_error) {
    // Ignore destroy errors.
  }
  try {
    clients.cloudWatchClient?.destroy?.();
  } catch (_error) {
    // Ignore destroy errors.
  }
}

async function scheduledAwsSend(client, command) {
  return scheduler.schedule(() => client.send(command));
}

async function listBucketsForAccount(account, clients = createAwsClients(account)) {
  const output = await scheduledAwsSend(clients.s3Client, new ListBucketsCommand({}));
  return asArray(output?.Buckets)
    .map((bucket) => ({
      bucketName: String(bucket?.Name || '').trim(),
      createdAt: bucket?.CreationDate ? new Date(bucket.CreationDate).toISOString() : null
    }))
    .filter((bucket) => bucket.bucketName);
}

function getLatestDatapointValue(datapoints, candidateFields = []) {
  const points = asArray(datapoints);
  let latestTimestamp = -Infinity;
  let latestValue = null;

  for (const point of points) {
    const timestamp = Date.parse(point?.Timestamp || point?.timestamp || '');
    const comparableTimestamp = Number.isFinite(timestamp) ? timestamp : latestTimestamp + 1;
    let value = null;
    for (const field of candidateFields) {
      value = toFiniteNumber(point?.[field]);
      if (value !== null) {
        break;
      }
    }

    if (value === null) {
      continue;
    }

    if (comparableTimestamp >= latestTimestamp) {
      latestTimestamp = comparableTimestamp;
      latestValue = value;
    }
  }

  return latestValue;
}

function getTotalDatapointValue(datapoints, candidateFields = []) {
  const points = asArray(datapoints);
  let total = 0;
  let found = false;

  for (const point of points) {
    let value = null;
    for (const field of candidateFields) {
      value = toFiniteNumber(point?.[field]);
      if (value !== null) {
        break;
      }
    }
    if (value === null) {
      continue;
    }
    total += value;
    found = true;
  }

  return found ? total : null;
}

async function getBucketMetricStatistics({
  cloudWatchClient,
  metricName,
  bucketName,
  storageType,
  startTime,
  endTime,
  periodSeconds,
  statistics
}) {
  const dimensions = [{ Name: 'BucketName', Value: bucketName }];
  if (storageType) {
    dimensions.push({ Name: 'StorageType', Value: storageType });
  }

  const output = await scheduledAwsSend(
    cloudWatchClient,
    new GetMetricStatisticsCommand({
      Namespace: 'AWS/S3',
      MetricName: metricName,
      Dimensions: dimensions,
      StartTime: startTime,
      EndTime: endTime,
      Period: Math.max(60, periodSeconds),
      Statistics: statistics
    })
  );

  return asArray(output?.Datapoints);
}

async function getBucketStorageMetrics(account, bucketName, clients = createAwsClients(account)) {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 8 * 24 * 60 * 60 * 1000);

  let usageBytes = null;
  let usageStorageType = null;
  for (const storageType of STORAGE_TYPE_CANDIDATES) {
    const datapoints = await getBucketMetricStatistics({
      cloudWatchClient: clients.cloudWatchClient,
      metricName: 'BucketSizeBytes',
      bucketName,
      storageType,
      startTime,
      endTime,
      periodSeconds: 24 * 60 * 60,
      statistics: ['Average']
    });

    usageBytes = getLatestDatapointValue(datapoints, ['Average']);
    if (usageBytes !== null) {
      usageStorageType = storageType;
      break;
    }
  }

  let objectCount = null;
  let objectStorageType = null;
  for (const storageType of STORAGE_TYPE_CANDIDATES) {
    const datapoints = await getBucketMetricStatistics({
      cloudWatchClient: clients.cloudWatchClient,
      metricName: 'NumberOfObjects',
      bucketName,
      storageType,
      startTime,
      endTime,
      periodSeconds: 24 * 60 * 60,
      statistics: ['Average']
    });

    objectCount = getLatestDatapointValue(datapoints, ['Average']);
    if (objectCount !== null) {
      objectStorageType = storageType;
      break;
    }
  }

  return {
    usageBytes: usageBytes === null ? null : Math.max(0, Math.round(usageBytes)),
    objectCount: objectCount === null ? null : Math.max(0, Math.round(objectCount)),
    usageStorageType,
    objectStorageType,
    sampledAt: new Date().toISOString()
  };
}

async function getBucketRequestMetrics({
  account,
  bucketName,
  windowHours,
  periodSeconds = 3600,
  clients = createAwsClients(account)
}) {
  const endTime = new Date();
  const hours = Math.max(1, Number(windowHours) || 24);
  const startTime = new Date(endTime.getTime() - hours * 60 * 60 * 1000);

  const fetchMetric = async (metricName) => {
    try {
      const datapoints = await scheduledAwsSend(
        clients.cloudWatchClient,
        new GetMetricStatisticsCommand({
          Namespace: 'AWS/S3',
          MetricName: metricName,
          Dimensions: [
            { Name: 'BucketName', Value: bucketName },
            { Name: 'FilterId', Value: 'EntireBucket' }
          ],
          StartTime: startTime,
          EndTime: endTime,
          Period: Math.max(60, periodSeconds),
          Statistics: ['Sum']
        })
      );
      return getTotalDatapointValue(datapoints?.Datapoints, ['Sum']);
    } catch (error) {
      return {
        error: error?.message || String(error)
      };
    }
  };

  const [egressRaw, ingressRaw, txnsRaw] = await Promise.all([
    fetchMetric('BytesDownloaded'),
    fetchMetric('BytesUploaded'),
    fetchMetric('AllRequests')
  ]);

  const failures = [egressRaw, ingressRaw, txnsRaw].filter((value) => value && typeof value === 'object' && value.error);
  const egressBytes = typeof egressRaw === 'number' ? Math.max(0, Math.round(egressRaw)) : null;
  const ingressBytes = typeof ingressRaw === 'number' ? Math.max(0, Math.round(ingressRaw)) : null;
  const transactions = typeof txnsRaw === 'number' ? Math.max(0, Math.round(txnsRaw)) : null;
  const available = egressBytes !== null || ingressBytes !== null || transactions !== null;

  return {
    available,
    egressBytes,
    ingressBytes,
    transactions,
    windowStartUtc: startTime.toISOString(),
    windowEndUtc: endTime.toISOString(),
    error: failures.length ? failures[0].error : null
  };
}

function getAwsErrorCode(error) {
  return (
    String(error?.name || '').trim() ||
    String(error?.Code || '').trim() ||
    String(error?.code || '').trim() ||
    String(error?.__type || '').trim()
  );
}

function isMissingBucketConfigError(error, allowedCodes = []) {
  const code = getAwsErrorCode(error);
  return allowedCodes.includes(code);
}

function boolOrNull(value) {
  if (value === null || value === undefined) {
    return null;
  }
  return Boolean(value);
}

async function getBucketSecurityPosture({ account, bucketName, clients = createAwsClients(account) }) {
  const posture = {
    publicAccessBlockEnabled: null,
    blockPublicAcls: null,
    ignorePublicAcls: null,
    blockPublicPolicy: null,
    restrictPublicBuckets: null,
    policyIsPublic: null,
    encryptionEnabled: null,
    encryptionAlgorithm: null,
    kmsKeyId: null,
    versioningStatus: null,
    lifecycleEnabled: null,
    lifecycleRuleCount: null,
    accessLoggingEnabled: null,
    accessLogTargetBucket: null,
    accessLogTargetPrefix: null,
    objectLockEnabled: null,
    ownershipControls: null,
    lastSecurityScanAt: new Date().toISOString(),
    error: null
  };
  const callErrors = [];

  const safeCall = async (label, allowedMissingCodes, handler) => {
    try {
      await handler();
    } catch (error) {
      if (isMissingBucketConfigError(error, allowedMissingCodes)) {
        return;
      }
      callErrors.push(`${label}: ${error?.message || String(error)}`);
    }
  };

  await safeCall(
    'PublicAccessBlock',
    ['NoSuchPublicAccessBlockConfiguration', 'NoSuchPublicAccessBlockConfigurationException', 'NotFound'],
    async () => {
      const output = await scheduledAwsSend(
        clients.s3Client,
        new GetPublicAccessBlockCommand({
          Bucket: bucketName
        })
      );
      const cfg = output?.PublicAccessBlockConfiguration || {};
      posture.blockPublicAcls = boolOrNull(cfg.BlockPublicAcls);
      posture.ignorePublicAcls = boolOrNull(cfg.IgnorePublicAcls);
      posture.blockPublicPolicy = boolOrNull(cfg.BlockPublicPolicy);
      posture.restrictPublicBuckets = boolOrNull(cfg.RestrictPublicBuckets);
      const values = [posture.blockPublicAcls, posture.ignorePublicAcls, posture.blockPublicPolicy, posture.restrictPublicBuckets];
      posture.publicAccessBlockEnabled = values.every((value) => value === true);
    }
  );

  await safeCall('PolicyStatus', ['NoSuchBucketPolicy', 'NoSuchPolicy', 'NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketPolicyStatusCommand({
        Bucket: bucketName
      })
    );
    posture.policyIsPublic = boolOrNull(output?.PolicyStatus?.IsPublic);
  });

  await safeCall(
    'Encryption',
    ['ServerSideEncryptionConfigurationNotFoundError', 'NoSuchServerSideEncryptionConfiguration', 'NotFound'],
    async () => {
      const output = await scheduledAwsSend(
        clients.s3Client,
        new GetBucketEncryptionCommand({
          Bucket: bucketName
        })
      );
      const rule = asArray(output?.ServerSideEncryptionConfiguration?.Rules)[0] || null;
      const byDefault = rule?.ApplyServerSideEncryptionByDefault || null;
      posture.encryptionEnabled = true;
      posture.encryptionAlgorithm = byDefault?.SSEAlgorithm || null;
      posture.kmsKeyId = byDefault?.KMSMasterKeyID || null;
    }
  );
  if (posture.encryptionEnabled === null) {
    posture.encryptionEnabled = false;
  }

  await safeCall('Versioning', ['NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketVersioningCommand({
        Bucket: bucketName
      })
    );
    posture.versioningStatus = output?.Status || 'Disabled';
  });
  if (!posture.versioningStatus) {
    posture.versioningStatus = 'Disabled';
  }

  await safeCall('Lifecycle', ['NoSuchLifecycleConfiguration', 'NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketLifecycleConfigurationCommand({
        Bucket: bucketName
      })
    );
    const rules = asArray(output?.Rules);
    posture.lifecycleRuleCount = rules.length;
    posture.lifecycleEnabled = rules.length > 0;
  });
  if (posture.lifecycleEnabled === null) {
    posture.lifecycleEnabled = false;
  }
  if (posture.lifecycleRuleCount === null) {
    posture.lifecycleRuleCount = 0;
  }

  await safeCall('Logging', ['NoSuchBucket', 'NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketLoggingCommand({
        Bucket: bucketName
      })
    );
    const logging = output?.LoggingEnabled || null;
    posture.accessLoggingEnabled = Boolean(logging);
    posture.accessLogTargetBucket = logging?.TargetBucket || null;
    posture.accessLogTargetPrefix = logging?.TargetPrefix || null;
  });
  if (posture.accessLoggingEnabled === null) {
    posture.accessLoggingEnabled = false;
  }

  await safeCall('ObjectLock', ['ObjectLockConfigurationNotFoundError', 'NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetObjectLockConfigurationCommand({
        Bucket: bucketName
      })
    );
    const status = String(output?.ObjectLockConfiguration?.ObjectLockEnabled || '').trim();
    if (!status) {
      posture.objectLockEnabled = false;
    } else {
      posture.objectLockEnabled = status.toLowerCase() === 'enabled';
    }
  });
  if (posture.objectLockEnabled === null) {
    posture.objectLockEnabled = false;
  }

  await safeCall('OwnershipControls', ['OwnershipControlsNotFoundError', 'NoSuchOwnershipControls', 'NotFound'], async () => {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketOwnershipControlsCommand({
        Bucket: bucketName
      })
    );
    const rule = asArray(output?.OwnershipControls?.Rules)[0] || null;
    posture.ownershipControls = rule?.ObjectOwnership || null;
  });

  posture.error = callErrors.length ? callErrors.join(' | ') : null;
  return posture;
}

function buildEfsName(fileSystem) {
  if (fileSystem?.Name) {
    return String(fileSystem.Name);
  }

  const tags = asArray(fileSystem?.Tags);
  const nameTag = tags.find((tag) => String(tag?.Key || '').toLowerCase() === 'name');
  if (nameTag?.Value) {
    return String(nameTag.Value);
  }

  return '';
}

function normalizeEfsSizeBytes(sizeInBytes) {
  if (!sizeInBytes || typeof sizeInBytes !== 'object') {
    return null;
  }

  const candidates = [sizeInBytes.Value, sizeInBytes.ValueInStandard, sizeInBytes.ValueInIA, sizeInBytes.ValueInArchive];
  for (const candidate of candidates) {
    const numeric = toFiniteNumber(candidate);
    if (numeric !== null && numeric >= 0) {
      return Math.round(numeric);
    }
  }
  return null;
}

async function listEfsFileSystems(account, options = {}) {
  const regions = normalizeRegionList(options.regions || account.efsRegions || account.region || DEFAULT_REGION, account.region);
  const results = [];

  for (const region of regions) {
    const client = createEfsClient(account, region);
    try {
      let marker;
      do {
        const output = await scheduledAwsSend(
          client,
          new DescribeFileSystemsCommand({
            Marker: marker
          })
        );

        const fileSystems = asArray(output?.FileSystems);
        for (const fileSystem of fileSystems) {
          results.push({
            fileSystemId: String(fileSystem?.FileSystemId || '').trim(),
            name: buildEfsName(fileSystem) || null,
            region,
            lifecycleState: fileSystem?.LifeCycleState || null,
            performanceMode: fileSystem?.PerformanceMode || null,
            throughputMode: fileSystem?.ThroughputMode || null,
            encrypted: typeof fileSystem?.Encrypted === 'boolean' ? fileSystem.Encrypted : null,
            provisionedThroughputInMibps: toFiniteNumber(fileSystem?.ProvisionedThroughputInMibps),
            sizeBytes: normalizeEfsSizeBytes(fileSystem?.SizeInBytes),
            creationTime: fileSystem?.CreationTime ? new Date(fileSystem.CreationTime).toISOString() : null
          });
        }

        marker = output?.NextMarker;
      } while (marker);
    } finally {
      try {
        client.destroy();
      } catch (_error) {
        // Ignore destroy errors.
      }
    }
  }

  return results.filter((row) => row.fileSystemId);
}

async function getBucketRegion(account, bucketName, clients = createAwsClients(account)) {
  try {
    const output = await scheduledAwsSend(
      clients.s3Client,
      new GetBucketLocationCommand({
        Bucket: bucketName
      })
    );
    return normalizeBucketRegion(output?.LocationConstraint, account.region || DEFAULT_REGION);
  } catch (error) {
    const hintedRegion = normalizeBucketRegion(
      error?.$metadata?.httpHeaders?.['x-amz-bucket-region'] ||
        error?.BucketRegion ||
        error?.Region ||
        error?.region ||
        null,
      ''
    );
    if (hintedRegion) {
      return hintedRegion;
    }
    throw error;
  }
}

async function deepScanBucketObjects(account, bucketName, options = {}) {
  const bucketRegion = normalizeBucketRegion(
    options.bucketRegion || account.region || DEFAULT_REGION,
    account.region || DEFAULT_REGION
  );
  const externalClient = options.s3Client || null;
  const s3Client = externalClient || createS3Client(account, bucketRegion);
  let continuationToken;
  let pageCount = 0;
  let usageBytes = 0;
  let objectCount = 0;

  try {
    do {
      if (awsThrottle.deepScanMaxPagesPerBucket > 0 && pageCount >= awsThrottle.deepScanMaxPagesPerBucket) {
        throw new Error(
          `Deep scan safety limit reached for ${bucketName}: ${awsThrottle.deepScanMaxPagesPerBucket} page(s). Increase AWS_DEEP_SCAN_MAX_PAGES_PER_BUCKET to continue.`
        );
      }

      const output = await scheduledAwsSend(
        s3Client,
        new ListObjectsV2Command({
          Bucket: bucketName,
          MaxKeys: 1000,
          ContinuationToken: continuationToken
        })
      );
      const contents = asArray(output?.Contents);
      for (const object of contents) {
        usageBytes += Math.max(0, Number(object?.Size || 0));
        objectCount += 1;
      }

      continuationToken = output?.IsTruncated ? output?.NextContinuationToken : undefined;
      pageCount += 1;

      // Yield to event loop during long scans.
      if (pageCount % 25 === 0) {
        await sleep(0);
      }
    } while (continuationToken);

    return {
      usageBytes: Math.round(usageBytes),
      objectCount,
      pageCount,
      bucketRegion
    };
  } finally {
    if (!externalClient) {
      try {
        s3Client.destroy();
      } catch (_error) {
        // Ignore destroy errors.
      }
    }
  }
}

module.exports = {
  awsThrottle,
  getAwsAccountConfigsFromEnv,
  toPublicAwsAccount,
  createS3Client,
  createAwsClients,
  destroyAwsClients,
  listBucketsForAccount,
  listEfsFileSystems,
  getBucketStorageMetrics,
  getBucketRequestMetrics,
  getBucketSecurityPosture,
  getBucketRegion,
  deepScanBucketObjects
};
