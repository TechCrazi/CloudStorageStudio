require('dotenv').config();

const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');
const {
  db,
  upsertSubscriptions,
  getSubscriptions,
  setSelectedSubscriptions,
  getSelectedSubscriptionIds,
  upsertStorageAccounts,
  getStorageAccounts,
  getStorageAccountById,
  upsertContainersForAccount,
  getContainersForAccount,
  updateContainerSize,
  updateStorageAccountMetrics,
  upsertStorageAccountSecurity,
  getStorageAccountSecurity,
  getStorageAccountSecurityMany,
  upsertIpAliases,
  getIpAliases,
  upsertWasabiAccounts,
  getWasabiAccounts,
  getWasabiAccountById,
  updateWasabiAccountSync,
  replaceWasabiBucketsForAccount,
  getWasabiBuckets,
  upsertAwsAccounts,
  getAwsAccounts,
  getAwsAccountById,
  updateAwsAccountSync,
  replaceAwsBucketsForAccount,
  getAwsBuckets,
  replaceAwsEfsForAccount,
  getAwsEfs,
  upsertVsaxGroups,
  setSelectedVsaxGroups,
  getSelectedVsaxGroupNames,
  updateVsaxGroupSync,
  replaceVsaxInventoryForGroup,
  getVsaxGroups,
  getVsaxDisks,
  upsertPricingSnapshot,
  getPricingSnapshot
} = require('./db');
const {
  listSubscriptions,
  listStorageAccounts,
  listContainersForAccount,
  calculateContainerSize,
  getStorageAccountSecurityProfile,
  getStorageAccountMetrics24h,
  getStorageAccountMetrics30d
} = require('./azure');
const {
  getWasabiAccountConfigsFromEnv,
  toPublicWasabiAccount,
  listBucketsForAccount,
  buildWasabiStatsDateRange,
  getBucketLatestUtilization
} = require('./wasabi');
const {
  awsThrottle,
  getAwsAccountConfigsFromEnv,
  toPublicAwsAccount,
  createAwsClients,
  destroyAwsClients,
  listBucketsForAccount: listAwsBucketsForAccount,
  listEfsFileSystems,
  getBucketStorageMetrics,
  getBucketRequestMetrics,
  getBucketSecurityPosture,
  getBucketRegion,
  deepScanBucketObjects
} = require('./aws');
const { vsaxThrottle, parseVsaxConfigFromEnv, toPublicVsaxConfig, fetchVsaxInventory, fetchVsaxGroupCatalog } = require('./vsax');
const { createTokenProvider } = require('./auth');
const { configureProxyFromEnv } = require('./proxy');
const { fetchAzureHotLrsPricingAssumptions, fetchWasabiPayGoPricingAssumptions } = require('./pricing');
const { createLogger, loggingConfig, parseBoolean } = require('./logger');

const app = express();
const port = Number.parseInt(process.env.PORT || '8787', 10);
const cacheTtlMinutes = Number.parseInt(process.env.CACHE_TTL_MINUTES || '360', 10);
const securityCacheTtlMinutes = Number.parseInt(process.env.SECURITY_CACHE_TTL_MINUTES || '720', 10);
const metricsCacheTtlMinutes = Number.parseInt(process.env.METRICS_CACHE_TTL_MINUTES || '60', 10);
const azureMetricsSyncIntervalHours = Math.max(1, Math.round(toFiniteNumber(process.env.AZURE_METRICS_SYNC_INTERVAL_HOURS, 12)));
const accountSyncConcurrency = Number.parseInt(process.env.ACCOUNT_SYNC_CONCURRENCY || '2', 10);
const containerSyncConcurrency = Number.parseInt(process.env.CONTAINER_SYNC_CONCURRENCY || '2', 10);
const uiPullAllConcurrency = Number.parseInt(process.env.UI_PULL_ALL_CONCURRENCY || '2', 10);
const proxyInfo = configureProxyFromEnv();
const pullAllJobHistoryLimit = Number.parseInt(process.env.PULL_ALL_JOB_HISTORY_LIMIT || '20', 10);
const pricingSyncIntervalHours = Math.max(1, Math.round(toFiniteNumber(process.env.PRICING_SYNC_INTERVAL_HOURS, 24)));
const pricingProfileName = 'azure-hot-lrs-default';
const pricingProviderName = 'azure';
const pricingArmRegionName = String(process.env.PRICING_ARM_REGION_NAME || 'eastus').trim().toLowerCase() || 'eastus';
const pricingStorageProductName = String(process.env.PRICING_STORAGE_PRODUCT_NAME || 'General Block Blob v2').trim() || 'General Block Blob v2';
const pricingStorageSkuName = String(process.env.PRICING_STORAGE_SKU_NAME || 'Hot LRS').trim() || 'Hot LRS';
const pricingEgressProductName = String(process.env.PRICING_EGRESS_PRODUCT_NAME || 'Rtn Preference: MGN').trim() || 'Rtn Preference: MGN';
const wasabiSyncIntervalHours = Math.max(1, Math.round(toFiniteNumber(process.env.WASABI_SYNC_INTERVAL_HOURS, 24)));
const wasabiCacheTtlHours = Math.max(1, toFiniteNumber(process.env.WASABI_CACHE_TTL_HOURS, 24));
const wasabiAccountSyncConcurrency = Math.max(1, Math.round(toFiniteNumber(process.env.WASABI_ACCOUNT_SYNC_CONCURRENCY, 2)));
const wasabiBucketSyncConcurrency = Math.max(1, Math.round(toFiniteNumber(process.env.WASABI_BUCKET_SYNC_CONCURRENCY, 4)));
const awsSyncIntervalHours = Math.max(1, Math.round(toFiniteNumber(process.env.AWS_SYNC_INTERVAL_HOURS, 24)));
const awsCacheTtlHours = Math.max(1, toFiniteNumber(process.env.AWS_CACHE_TTL_HOURS, 24));
const awsAccountSyncConcurrency = Math.max(1, Math.round(toFiniteNumber(process.env.AWS_ACCOUNT_SYNC_CONCURRENCY, 2)));
const awsBucketSyncConcurrency = Math.max(1, Math.round(toFiniteNumber(process.env.AWS_BUCKET_SYNC_CONCURRENCY, 4)));
const awsDefaultDeepScan = parseBoolean(process.env.AWS_DEEP_SCAN_DEFAULT, false);
const awsDefaultRequestMetrics = parseBoolean(process.env.AWS_REQUEST_METRICS_DEFAULT, false);
const awsDefaultSecurityScan = parseBoolean(process.env.AWS_SECURITY_SCAN_DEFAULT, false);
const vsaxSyncIntervalHours = Math.max(1, Math.round(toFiniteNumber(process.env.VSAX_SYNC_INTERVAL_HOURS, 24)));
const vsaxCacheTtlHours = Math.max(1, toFiniteNumber(process.env.VSAX_CACHE_TTL_HOURS, 24));
const vsaxGroupSyncConcurrency = Math.max(1, Math.round(toFiniteNumber(process.env.VSAX_GROUP_SYNC_CONCURRENCY, 1)));
const wasabiPricingSyncIntervalHours = Math.max(
  1,
  Math.round(toFiniteNumber(process.env.WASABI_PRICING_SYNC_INTERVAL_HOURS, 24))
);
const wasabiPricingProfileName = 'wasabi-storage-default';
const wasabiPricingProviderName = 'wasabi';
const wasabiPricingSourceUrl = String(process.env.WASABI_PRICING_SOURCE_URL || 'https://wasabi.com/pricing/faq').trim() || 'https://wasabi.com/pricing/faq';
const pullAllJobs = [];
let azureMetricsSyncInFlight = false;
let awsSyncInFlight = false;
let vsaxSyncInFlight = false;
const logger = createLogger('server');
const requestLogger = logger.child('http');

function toFiniteNumber(raw, fallback) {
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : fallback;
}

const fallbackPricingAssumptions = {
  currency: process.env.PRICING_CURRENCY || 'USD',
  regionLabel: process.env.PRICING_REGION_LABEL || 'US East',
  source: process.env.PRICING_SOURCE_URL || 'https://prices.azure.com/api/retail/prices',
  asOfDate: process.env.PRICING_AS_OF_DATE || '2026-02-13',
  bytesPerGb: Math.max(1, Math.round(toFiniteNumber(process.env.PRICING_BYTES_PER_GB, 1000000000))),
  daysInMonth: Math.max(1, toFiniteNumber(process.env.PRICING_DAYS_IN_MONTH, 30)),
  storageHotLrsGbMonthTiers: [
    { upToGb: 51200, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_STORAGE_HOT_LRS_TIER1_GB_MONTH, 0.0208)) },
    { upToGb: 512000, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_STORAGE_HOT_LRS_TIER2_GB_MONTH, 0.019968)) },
    { upToGb: null, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_STORAGE_HOT_LRS_TIER3_GB_MONTH, 0.019136)) }
  ],
  egressInternetGbTiers: [
    { upToGb: 100, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER0_GB, 0)) },
    { upToGb: 10335, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER1_GB, 0.087)) },
    { upToGb: 51295, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER2_GB, 0.083)) },
    { upToGb: 153695, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER3_GB, 0.07)) },
    { upToGb: 512095, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER4_GB, 0.05)) },
    { upToGb: null, unitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_EGRESS_TIER5_GB, 0.05)) }
  ],
  ingressPerGb: Math.max(0, toFiniteNumber(process.env.PRICING_INGRESS_GB, 0)),
  transactionUnitSize: Math.max(1, Math.round(toFiniteNumber(process.env.PRICING_TRANSACTION_UNIT_SIZE, 10000))),
  transactionUnitPrice: Math.max(0, toFiniteNumber(process.env.PRICING_TRANSACTION_UNIT_PRICE, 0.004)),
  transactionRateLabel: process.env.PRICING_TRANSACTION_LABEL || 'Hot Read/All Other Ops'
};

const fallbackWasabiPricingAssumptions = {
  currency: process.env.WASABI_PRICING_CURRENCY || 'USD',
  source: wasabiPricingSourceUrl,
  asOfDate: process.env.WASABI_PRICING_AS_OF_DATE || '2026-02-13',
  bytesPerTb: Math.max(1, Math.round(toFiniteNumber(process.env.WASABI_PRICING_BYTES_PER_TB, 1099511627776))),
  daysInMonth: Math.max(1, toFiniteNumber(process.env.WASABI_PRICING_DAYS_IN_MONTH, 30)),
  storagePricePerTbMonth: Math.max(0, toFiniteNumber(process.env.WASABI_PRICING_STORAGE_TB_MONTH, 9)),
  minimumBillableTb: Math.max(0, toFiniteNumber(process.env.WASABI_PRICING_MIN_BILLABLE_TB, 1))
};

const awsPricingAssumptions = {
  currency: process.env.AWS_PRICING_CURRENCY || 'USD',
  regionLabel: process.env.AWS_PRICING_REGION_LABEL || 'US East (N. Virginia)',
  source: process.env.AWS_PRICING_SOURCE_URL || 'https://aws.amazon.com/s3/pricing/',
  asOfDate: process.env.AWS_PRICING_AS_OF_DATE || '2026-02-17',
  bytesPerGb: Math.max(1, Math.round(toFiniteNumber(process.env.AWS_PRICING_BYTES_PER_GB, 1073741824))),
  daysInMonth: Math.max(1, toFiniteNumber(process.env.AWS_PRICING_DAYS_IN_MONTH, 30)),
  s3StorageStandardGbMonth: Math.max(0, toFiniteNumber(process.env.AWS_PRICING_S3_STANDARD_GB_MONTH, 0.023)),
  s3EgressPerGb: Math.max(0, toFiniteNumber(process.env.AWS_PRICING_S3_EGRESS_GB, 0.09)),
  s3EgressFreeGb: Math.max(0, toFiniteNumber(process.env.AWS_PRICING_S3_EGRESS_FREE_GB, 0)),
  s3RequestUnitSize: Math.max(1, Math.round(toFiniteNumber(process.env.AWS_PRICING_S3_REQUEST_UNIT_SIZE, 1000))),
  s3RequestUnitPrice: Math.max(0, toFiniteNumber(process.env.AWS_PRICING_S3_REQUEST_UNIT_PRICE, 0.0004)),
  s3RequestRateLabel: process.env.AWS_PRICING_S3_REQUEST_LABEL || 'All requests (blended estimate)',
  efsStandardGbMonth: Math.max(0, toFiniteNumber(process.env.AWS_PRICING_EFS_STANDARD_GB_MONTH, 0.3))
};

const vsaxPricingAssumptions = {
  currency: process.env.VSAX_PRICING_CURRENCY || 'USD',
  source: process.env.VSAX_PRICING_SOURCE_URL || 'https://www.kaseya.com/pricing/',
  asOfDate: process.env.VSAX_PRICING_AS_OF_DATE || '2026-02-17',
  bytesPerTb: Math.max(1, Math.round(toFiniteNumber(process.env.VSAX_PRICING_BYTES_PER_TB, 1099511627776))),
  daysInMonth: Math.max(1, toFiniteNumber(process.env.VSAX_PRICING_DAYS_IN_MONTH, 30)),
  storagePricePerTbMonth: Math.max(0, toFiniteNumber(process.env.VSAX_PRICING_STORAGE_TB_MONTH, 120))
};

function clonePricingAssumptions(assumptions) {
  try {
    return JSON.parse(JSON.stringify(assumptions || {}));
  } catch (_error) {
    return {
      ...fallbackPricingAssumptions
    };
  }
}

const cachedPricingSnapshot = getPricingSnapshot(pricingProviderName, pricingProfileName);
let activePricingAssumptions =
  cachedPricingSnapshot?.assumptions && typeof cachedPricingSnapshot.assumptions === 'object'
    ? clonePricingAssumptions(cachedPricingSnapshot.assumptions)
    : clonePricingAssumptions(fallbackPricingAssumptions);
let pricingSyncState = {
  status: cachedPricingSnapshot ? 'cached' : 'fallback',
  source: cachedPricingSnapshot ? 'sqlite-cache' : 'env-fallback',
  profile: pricingProfileName,
  provider: pricingProviderName,
  intervalHours: pricingSyncIntervalHours,
  armRegionName: pricingArmRegionName,
  lastAttemptAt: null,
  lastSuccessAt: cachedPricingSnapshot?.synced_at || null,
  syncedAt: cachedPricingSnapshot?.synced_at || null,
  lastError: cachedPricingSnapshot?.last_error || null
};

const cachedWasabiPricingSnapshot = getPricingSnapshot(wasabiPricingProviderName, wasabiPricingProfileName);
let activeWasabiPricingAssumptions =
  cachedWasabiPricingSnapshot?.assumptions && typeof cachedWasabiPricingSnapshot.assumptions === 'object'
    ? clonePricingAssumptions(cachedWasabiPricingSnapshot.assumptions)
    : clonePricingAssumptions(fallbackWasabiPricingAssumptions);
let wasabiPricingSyncState = {
  status: cachedWasabiPricingSnapshot ? 'cached' : 'fallback',
  source: cachedWasabiPricingSnapshot ? 'sqlite-cache' : 'env-fallback',
  profile: wasabiPricingProfileName,
  provider: wasabiPricingProviderName,
  intervalHours: wasabiPricingSyncIntervalHours,
  sourceUrl: wasabiPricingSourceUrl,
  lastAttemptAt: null,
  lastSuccessAt: cachedWasabiPricingSnapshot?.synced_at || null,
  syncedAt: cachedWasabiPricingSnapshot?.synced_at || null,
  lastError: cachedWasabiPricingSnapshot?.last_error || null
};

const tokenProvider = createTokenProvider({
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET
});

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

if (loggingConfig.httpRequests) {
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
      return next();
    }

    const requestId = randomUUID().slice(0, 8);
    const startedAtNs = process.hrtime.bigint();
    res.setHeader('x-request-id', requestId);

    if (loggingConfig.httpDebug) {
      requestLogger.debug('Incoming API request', {
        requestId,
        method: req.method,
        path: req.originalUrl,
        query: req.query
      });
    }

    res.on('finish', () => {
      const durationMs = Number(process.hrtime.bigint() - startedAtNs) / 1e6;
      const meta = {
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Number(durationMs.toFixed(2))
      };

      if (res.statusCode >= 500) {
        requestLogger.error('API request completed with server error', meta);
      } else if (res.statusCode >= 400) {
        requestLogger.warn('API request completed with client error', meta);
      } else {
        requestLogger.info('API request completed', meta);
      }
    });

    return next();
  });
}

function ensureServicePrincipalConfigured() {
  if (!tokenProvider.isConfigured) {
    const err = new Error(`Service principal auth is not configured: ${tokenProvider.missing.join(', ')}`);
    err.statusCode = 500;
    throw err;
  }
}

function parseSubscriptionIds(raw) {
  if (!raw) {
    return [];
  }
  if (Array.isArray(raw)) {
    return raw.filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseAccountIds(raw) {
  return parseSubscriptionIds(raw)
    .map((value) => String(value || '').trim().toLowerCase())
    .filter(Boolean);
}

function parseGroupNames(raw) {
  return parseSubscriptionIds(raw)
    .map((value) => String(value || '').trim())
    .filter(Boolean);
}

function parseIpAliasRows(raw) {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((row) => {
      if (!row || typeof row !== 'object') {
        return null;
      }
      const ipAddress = String(row.ipAddress || row.ip || '')
        .trim()
        .toLowerCase();
      const serverName = String(row.serverName || row.server_name || '').trim();
      if (!ipAddress || !serverName) {
        return null;
      }
      return { ipAddress, serverName };
    })
    .filter(Boolean);
}

function toCsvScalar(value) {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch (_error) {
      return '';
    }
  }
  return String(value);
}

function escapeCsvCell(value) {
  const text = toCsvScalar(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsvText(columns, rows) {
  const header = columns.map((column) => escapeCsvCell(column)).join(',');
  const body = rows
    .map((row) => columns.map((column) => escapeCsvCell(row[column])).join(','))
    .join('\n');
  return body ? `${header}\n${body}` : header;
}

function csvFileTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function sendCsvResponse(res, { filenamePrefix, columns, rows }) {
  const filename = `${filenamePrefix}-${csvFileTimestamp()}.csv`;
  const csv = buildCsvText(columns, rows);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=\"${filename}\"`);
  res.send(`\uFEFF${csv}`);
}

function parseJsonSafe(raw) {
  if (!raw || typeof raw !== 'string') {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function resolveExportSubscriptionIds(rawSubscriptionIds) {
  const explicitIds = parseSubscriptionIds(rawSubscriptionIds);
  if (explicitIds.length) {
    return explicitIds;
  }
  const selectedIds = getSelectedSubscriptionIds();
  if (selectedIds.length) {
    return selectedIds;
  }
  return getSubscriptions().map((subscription) => subscription.subscription_id);
}

function getActivePricingAssumptions() {
  if (activePricingAssumptions && typeof activePricingAssumptions === 'object') {
    return clonePricingAssumptions(activePricingAssumptions);
  }
  return clonePricingAssumptions(fallbackPricingAssumptions);
}

function getActiveWasabiPricingAssumptions() {
  if (activeWasabiPricingAssumptions && typeof activeWasabiPricingAssumptions === 'object') {
    return clonePricingAssumptions(activeWasabiPricingAssumptions);
  }
  return clonePricingAssumptions(fallbackWasabiPricingAssumptions);
}

function getPricingSyncIntervalMs() {
  return pricingSyncIntervalHours * 60 * 60 * 1000;
}

function getWasabiPricingSyncIntervalMs() {
  return wasabiPricingSyncIntervalHours * 60 * 60 * 1000;
}

function parseTimeMs(raw) {
  const timeMs = new Date(raw || '').getTime();
  return Number.isFinite(timeMs) ? timeMs : 0;
}

function isPricingSnapshotFresh(snapshot) {
  if (!snapshot?.synced_at) {
    return false;
  }
  const ageMs = Date.now() - parseTimeMs(snapshot.synced_at);
  return ageMs >= 0 && ageMs < getPricingSyncIntervalMs();
}

function isWasabiPricingSnapshotFresh(snapshot) {
  if (!snapshot?.synced_at) {
    return false;
  }
  const ageMs = Date.now() - parseTimeMs(snapshot.synced_at);
  return ageMs >= 0 && ageMs < getWasabiPricingSyncIntervalMs();
}

function applyCachedPricingSnapshot(snapshot, sourceLabel = 'sqlite-cache') {
  if (!snapshot?.assumptions || typeof snapshot.assumptions !== 'object') {
    return false;
  }

  activePricingAssumptions = clonePricingAssumptions({
    ...fallbackPricingAssumptions,
    ...snapshot.assumptions
  });

  pricingSyncState = {
    ...pricingSyncState,
    status: snapshot.fetch_status || 'cached',
    source: sourceLabel,
    syncedAt: snapshot.synced_at || pricingSyncState.syncedAt,
    lastSuccessAt: snapshot.synced_at || pricingSyncState.lastSuccessAt,
    lastError: snapshot.last_error || null
  };

  return true;
}

function applyCachedWasabiPricingSnapshot(snapshot, sourceLabel = 'sqlite-cache') {
  if (!snapshot?.assumptions || typeof snapshot.assumptions !== 'object') {
    return false;
  }

  activeWasabiPricingAssumptions = clonePricingAssumptions({
    ...fallbackWasabiPricingAssumptions,
    ...snapshot.assumptions
  });

  wasabiPricingSyncState = {
    ...wasabiPricingSyncState,
    status: snapshot.fetch_status || 'cached',
    source: sourceLabel,
    syncedAt: snapshot.synced_at || wasabiPricingSyncState.syncedAt,
    lastSuccessAt: snapshot.synced_at || wasabiPricingSyncState.lastSuccessAt,
    lastError: snapshot.last_error || null
  };

  return true;
}

function persistPricingSnapshot({
  assumptions,
  source,
  asOfDate,
  syncedAt,
  fetchStatus,
  lastError
}) {
  upsertPricingSnapshot({
    provider: pricingProviderName,
    profile: pricingProfileName,
    assumptions,
    currency: assumptions?.currency || fallbackPricingAssumptions.currency,
    regionLabel: assumptions?.regionLabel || fallbackPricingAssumptions.regionLabel,
    source: source || assumptions?.source || fallbackPricingAssumptions.source,
    asOfDate: asOfDate || assumptions?.asOfDate || fallbackPricingAssumptions.asOfDate,
    syncedAt,
    fetchStatus,
    lastError
  });
}

function persistWasabiPricingSnapshot({
  assumptions,
  source,
  asOfDate,
  syncedAt,
  fetchStatus,
  lastError
}) {
  upsertPricingSnapshot({
    provider: wasabiPricingProviderName,
    profile: wasabiPricingProfileName,
    assumptions,
    currency: assumptions?.currency || fallbackWasabiPricingAssumptions.currency,
    regionLabel: assumptions?.regionLabel || 'Wasabi',
    source: source || assumptions?.source || fallbackWasabiPricingAssumptions.source,
    asOfDate: asOfDate || assumptions?.asOfDate || fallbackWasabiPricingAssumptions.asOfDate,
    syncedAt,
    fetchStatus,
    lastError
  });
}

async function syncPricingSnapshotFromRetail({ force = false } = {}) {
  const startedAt = new Date().toISOString();
  logger.debug('Azure pricing snapshot sync started', {
    force
  });
  pricingSyncState = {
    ...pricingSyncState,
    status: 'syncing',
    lastAttemptAt: startedAt
  };

  const cachedSnapshot = getPricingSnapshot(pricingProviderName, pricingProfileName);
  if (!force && isPricingSnapshotFresh(cachedSnapshot)) {
    logger.debug('Azure pricing snapshot is fresh; reusing cache', {
      syncedAt: cachedSnapshot?.synced_at || null
    });
    applyCachedPricingSnapshot(cachedSnapshot, 'sqlite-cache');
    pricingSyncState = {
      ...pricingSyncState,
      status: 'cached',
      source: 'sqlite-cache',
      lastAttemptAt: startedAt
    };
    return {
      synced: false,
      skipped: true,
      source: 'sqlite-cache'
    };
  }

  try {
    const syncedAt = new Date().toISOString();
    const live = await fetchAzureHotLrsPricingAssumptions({
      armRegionName: pricingArmRegionName,
      storageProductName: pricingStorageProductName,
      storageSkuName: pricingStorageSkuName,
      egressProductName: pricingEgressProductName,
      fallbackAssumptions: fallbackPricingAssumptions,
      sourceUrl: fallbackPricingAssumptions.source
    });

    const assumptions = clonePricingAssumptions(live.assumptions);
    activePricingAssumptions = assumptions;
    persistPricingSnapshot({
      assumptions,
      source: assumptions.source,
      asOfDate: assumptions.asOfDate,
      syncedAt,
      fetchStatus: 'ok',
      lastError: null
    });

    pricingSyncState = {
      ...pricingSyncState,
      status: 'ok',
      source: 'azure-retail-api',
      syncedAt,
      lastSuccessAt: syncedAt,
      lastError: null
    };

    return {
      synced: true,
      skipped: false,
      source: 'azure-retail-api'
    };
  } catch (error) {
    const message = error?.message || String(error);
    logger.warn('Azure pricing snapshot sync failed', {
      error: message,
      hasCachedSnapshot: Boolean(cachedSnapshot)
    });
    const active = getActivePricingAssumptions();
    const fallbackSource = cachedSnapshot ? 'sqlite-cache' : 'env-fallback';

    if (!cachedSnapshot) {
      persistPricingSnapshot({
        assumptions: active,
        source: active.source || fallbackPricingAssumptions.source,
        asOfDate: active.asOfDate || fallbackPricingAssumptions.asOfDate,
        syncedAt: new Date().toISOString(),
        fetchStatus: 'error',
        lastError: message
      });
    }

    pricingSyncState = {
      ...pricingSyncState,
      status: 'error',
      source: fallbackSource,
      lastError: message
    };

    return {
      synced: false,
      skipped: false,
      source: fallbackSource,
      error: message
    };
  }
}

async function syncWasabiPricingSnapshotFromPublicSite({ force = false } = {}) {
  const startedAt = new Date().toISOString();
  logger.debug('Wasabi pricing snapshot sync started', {
    force
  });
  wasabiPricingSyncState = {
    ...wasabiPricingSyncState,
    status: 'syncing',
    lastAttemptAt: startedAt
  };

  const cachedSnapshot = getPricingSnapshot(wasabiPricingProviderName, wasabiPricingProfileName);
  if (!force && isWasabiPricingSnapshotFresh(cachedSnapshot)) {
    logger.debug('Wasabi pricing snapshot is fresh; reusing cache', {
      syncedAt: cachedSnapshot?.synced_at || null
    });
    applyCachedWasabiPricingSnapshot(cachedSnapshot, 'sqlite-cache');
    wasabiPricingSyncState = {
      ...wasabiPricingSyncState,
      status: 'cached',
      source: 'sqlite-cache',
      lastAttemptAt: startedAt
    };
    return {
      synced: false,
      skipped: true,
      source: 'sqlite-cache'
    };
  }

  try {
    const syncedAt = new Date().toISOString();
    const live = await fetchWasabiPayGoPricingAssumptions({
      sourceUrl: wasabiPricingSourceUrl,
      fallbackAssumptions: fallbackWasabiPricingAssumptions
    });

    const assumptions = clonePricingAssumptions(live.assumptions);
    activeWasabiPricingAssumptions = assumptions;
    persistWasabiPricingSnapshot({
      assumptions,
      source: assumptions.source,
      asOfDate: assumptions.asOfDate,
      syncedAt,
      fetchStatus: 'ok',
      lastError: null
    });

    wasabiPricingSyncState = {
      ...wasabiPricingSyncState,
      status: 'ok',
      source: 'wasabi-pricing-page',
      syncedAt,
      lastSuccessAt: syncedAt,
      lastError: null
    };

    return {
      synced: true,
      skipped: false,
      source: 'wasabi-pricing-page'
    };
  } catch (error) {
    const message = error?.message || String(error);
    logger.warn('Wasabi pricing snapshot sync failed', {
      error: message,
      hasCachedSnapshot: Boolean(cachedSnapshot)
    });
    const active = getActiveWasabiPricingAssumptions();
    const fallbackSource = cachedSnapshot ? 'sqlite-cache' : 'env-fallback';

    if (!cachedSnapshot) {
      persistWasabiPricingSnapshot({
        assumptions: active,
        source: active.source || fallbackWasabiPricingAssumptions.source,
        asOfDate: active.asOfDate || fallbackWasabiPricingAssumptions.asOfDate,
        syncedAt: new Date().toISOString(),
        fetchStatus: 'error',
        lastError: message
      });
    }

    wasabiPricingSyncState = {
      ...wasabiPricingSyncState,
      status: 'error',
      source: fallbackSource,
      lastError: message
    };

    return {
      synced: false,
      skipped: false,
      source: fallbackSource,
      error: message
    };
  }
}

function startPricingSyncScheduler() {
  logger.info('Starting Azure pricing sync scheduler', {
    intervalHours: pricingSyncIntervalHours,
    profile: pricingProfileName,
    region: pricingArmRegionName
  });

  const timer = setInterval(() => {
    logger.debug('Azure pricing sync tick started', {
      force: false
    });
    void syncPricingSnapshotFromRetail({ force: false }).then((result) => {
      if (result?.synced) {
        logger.info('Pricing sync complete', { source: result.source });
      } else if (result?.error) {
        logger.warn('Pricing sync failed; using fallback source', {
          source: result.source,
          error: result.error
        });
      }
    });
  }, getPricingSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  logger.debug('Azure pricing initial sync started', {
    force: true
  });
  void syncPricingSnapshotFromRetail({ force: true }).then((result) => {
    if (result?.synced) {
      logger.info('Pricing sync complete', { source: result.source, initialRun: true });
    } else if (result?.error) {
      logger.warn('Pricing sync failed; using fallback source', {
        source: result.source,
        error: result.error,
        initialRun: true
      });
    }
  });
}

function startWasabiPricingSyncScheduler() {
  logger.info('Starting Wasabi pricing sync scheduler', {
    intervalHours: wasabiPricingSyncIntervalHours,
    profile: wasabiPricingProfileName
  });

  const timer = setInterval(() => {
    logger.debug('Wasabi pricing sync tick started', {
      force: false
    });
    void syncWasabiPricingSnapshotFromPublicSite({ force: false }).then((result) => {
      if (result?.synced) {
        logger.info('Wasabi pricing sync complete', { source: result.source });
      } else if (result?.error) {
        logger.warn('Wasabi pricing sync failed; using fallback source', {
          source: result.source,
          error: result.error
        });
      }
    });
  }, getWasabiPricingSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  logger.debug('Wasabi pricing initial sync started', {
    force: true
  });
  void syncWasabiPricingSnapshotFromPublicSite({ force: true }).then((result) => {
    if (result?.synced) {
      logger.info('Wasabi pricing sync complete', { source: result.source, initialRun: true });
    } else if (result?.error) {
      logger.warn('Wasabi pricing sync failed; using fallback source', {
        source: result.source,
        error: result.error,
        initialRun: true
      });
    }
  });
}

function getVsaxCacheTtlMs() {
  return vsaxCacheTtlHours * 60 * 60 * 1000;
}

function getVsaxSyncIntervalMs() {
  return vsaxSyncIntervalHours * 60 * 60 * 1000;
}

function resolveVsaxConfig() {
  try {
    const config = parseVsaxConfigFromEnv();
    if (!config.configured) {
      return {
        config,
        error: `Missing required VSAx environment values: ${config.missing.join(', ')}`,
        groups: []
      };
    }

    const envGroups = Array.isArray(config.groups) ? config.groups : [];
    return {
      config,
      error: null,
      groups: envGroups
    };
  } catch (error) {
    return {
      config: null,
      error: error.message || String(error),
      groups: []
    };
  }
}

function normalizeVsaxGroupRows(rows = []) {
  return (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      ...row,
      group_name: String(row?.group_name || '').trim()
    }))
    .filter((row) => row.group_name);
}

function resolveVsaxSelectedGroups({ availableGroups = [], requestedGroups = [] } = {}) {
  const availableSet = new Set(
    (Array.isArray(availableGroups) ? availableGroups : [])
      .map((name) => String(name || '').trim())
      .filter(Boolean)
  );

  const selected = (Array.isArray(requestedGroups) ? requestedGroups : [])
    .map((name) => String(name || '').trim())
    .filter((name) => name && availableSet.has(name));

  return Array.from(new Set(selected));
}

async function syncVsaxGroupCatalogFromEnv({ throwOnError = false, forceDiscover = false } = {}) {
  const resolved = resolveVsaxConfig();
  if (resolved.error) {
    logger.warn('VSAx configuration parse failed', {
      error: resolved.error,
      throwOnError
    });
    if (throwOnError) {
      const err = new Error(resolved.error);
      err.statusCode = 500;
      throw err;
    }
    return resolved;
  }

  const envGroups = Array.isArray(resolved.groups) ? resolved.groups : [];
  const envFilterDefined = Boolean(resolved.config?.groupFilterDefined);
  let availableGroups = [];
  let catalogSource = 'sqlite-cache';
  let discoveryMeta = {
    pageCount: 0,
    assetCount: 0
  };

  if (envFilterDefined) {
    availableGroups = envGroups;
    upsertVsaxGroups(availableGroups);
    catalogSource = 'env-filter';
  } else {
    const cachedGroupRows = normalizeVsaxGroupRows(getVsaxGroups());
    if (!forceDiscover && cachedGroupRows.length > 0) {
      availableGroups = cachedGroupRows.map((row) => row.group_name);
      catalogSource = 'sqlite-cache';
    } else {
      const discovered = await fetchVsaxGroupCatalog({
        baseUrl: resolved.config.baseUrl,
        tokenId: resolved.config.tokenId,
        tokenSecret: resolved.config.tokenSecret,
        pageSize: resolved.config.pageSize,
        maxPages: resolved.config.maxPages,
        assetFilter: resolved.config.assetFilter
      });
      availableGroups = Array.isArray(discovered.groups) ? discovered.groups : [];
      discoveryMeta = {
        pageCount: Number(discovered.pageCount || 0),
        assetCount: Number(discovered.assetCount || 0)
      };
      upsertVsaxGroups(availableGroups);
      catalogSource = 'vsax-api-discovery';
    }
  }

  let selectedGroups = getSelectedVsaxGroupNames();
  selectedGroups = resolveVsaxSelectedGroups({
    availableGroups,
    requestedGroups: selectedGroups
  });

  if (!selectedGroups.length && availableGroups.length) {
    selectedGroups = [...availableGroups];
    setSelectedVsaxGroups(selectedGroups);
  }

  const groupRows = normalizeVsaxGroupRows(getVsaxGroups());
  return {
    ...resolved,
    groups: availableGroups,
    selectedGroups,
    groupRows,
    catalogSource,
    discovery: discoveryMeta
  };
}

function shouldSyncVsaxGroup(cachedGroup, force) {
  if (force) {
    return true;
  }
  if (!cachedGroup || !cachedGroup.last_sync_at) {
    return true;
  }
  const ageMs = Date.now() - parseTimeMs(cachedGroup.last_sync_at);
  return ageMs > getVsaxCacheTtlMs();
}

function summarizeVsaxGroupSyncResult(result = {}) {
  return {
    groupName: result.groupName || '',
    scanned: Boolean(result.scanned),
    skipped: Boolean(result.skipped),
    hadError: Boolean(result.hadError),
    error: result.error || null,
    deviceCount: Number(result.deviceCount || 0),
    diskCount: Number(result.diskCount || 0),
    totalAllocatedBytes: Number(result.totalAllocatedBytes || 0),
    totalUsedBytes: Number(result.totalUsedBytes || 0),
    pageCount: Number(result.pageCount || 0),
    assetCount: Number(result.assetCount || 0)
  };
}

async function syncSingleVsaxGroup({ config, groupName, force = false }) {
  const normalizedGroupName = String(groupName || '').trim();
  logger.debug('Starting VSAx group sync', {
    groupName: normalizedGroupName,
    force
  });

  const cachedGroup = getVsaxGroups([normalizedGroupName])[0] || null;
  if (!shouldSyncVsaxGroup(cachedGroup, force)) {
    logger.debug('Skipping VSAx group sync due to fresh cache', {
      groupName: normalizedGroupName
    });
    return summarizeVsaxGroupSyncResult({
      groupName: normalizedGroupName,
      scanned: false,
      skipped: true,
      hadError: Boolean(cachedGroup?.last_error),
      error: cachedGroup?.last_error || null,
      deviceCount: Number(cachedGroup?.device_count || 0),
      diskCount: Number(cachedGroup?.disk_count || 0),
      totalAllocatedBytes: Number(cachedGroup?.total_allocated_bytes || 0),
      totalUsedBytes: Number(cachedGroup?.total_used_bytes || 0)
    });
  }

  try {
    const inventory = await fetchVsaxInventory({
      baseUrl: config.baseUrl,
      tokenId: config.tokenId,
      tokenSecret: config.tokenSecret,
      include: config.include,
      pageSize: config.pageSize,
      maxPages: config.maxPages,
      selectedGroups: [normalizedGroupName],
      assetFilter: config.assetFilter
    });

    const filter = normalizedGroupName.toLowerCase();
    const groupDevices = inventory.devices.filter((row) => String(row.groupName || '').toLowerCase() === filter);
    const groupDisks = inventory.disks.filter((row) => String(row.groupName || '').toLowerCase() === filter);

    if (groupDisks.length > 0) {
      const sampleDisk = groupDisks[0];
      logger.debug('VSAx disk sample after parse', {
        groupName: normalizedGroupName,
        deviceName: sampleDisk.deviceName,
        diskName: sampleDisk.diskName,
        totalBytes: sampleDisk.totalBytes,
        usedBytes: sampleDisk.usedBytes,
        freeBytes: sampleDisk.freeBytes,
        freePercentage: sampleDisk.freePercentage
      });
    }

    replaceVsaxInventoryForGroup(normalizedGroupName, {
      devices: groupDevices,
      disks: groupDisks
    });

    updateVsaxGroupSync({
      groupName: normalizedGroupName,
      error: null
    });

    const totalAllocatedBytes = groupDevices.reduce((sum, row) => sum + Number(row.diskTotalBytes || 0), 0);
    const totalUsedBytes = groupDevices.reduce((sum, row) => sum + Number(row.diskUsedBytes || 0), 0);

    logger.debug('VSAx group sync completed', {
      groupName: normalizedGroupName,
      deviceCount: groupDevices.length,
      diskCount: groupDisks.length,
      totalAllocatedBytes,
      totalUsedBytes
    });

    return summarizeVsaxGroupSyncResult({
      groupName: normalizedGroupName,
      scanned: true,
      skipped: false,
      hadError: false,
      deviceCount: groupDevices.length,
      diskCount: groupDisks.length,
      totalAllocatedBytes,
      totalUsedBytes,
      pageCount: inventory.pageCount,
      assetCount: inventory.assetCount
    });
  } catch (error) {
    const message = error?.message || String(error);
    logger.warn('VSAx group sync failed', {
      groupName: normalizedGroupName,
      error: message
    });

    updateVsaxGroupSync({
      groupName: normalizedGroupName,
      error: message
    });

    const cachedAfterError = getVsaxGroups([normalizedGroupName])[0] || null;
    return summarizeVsaxGroupSyncResult({
      groupName: normalizedGroupName,
      scanned: true,
      skipped: false,
      hadError: true,
      error: message,
      deviceCount: Number(cachedAfterError?.device_count || 0),
      diskCount: Number(cachedAfterError?.disk_count || 0),
      totalAllocatedBytes: Number(cachedAfterError?.total_allocated_bytes || 0),
      totalUsedBytes: Number(cachedAfterError?.total_used_bytes || 0)
    });
  }
}

async function syncVsaxGroups({ groupNames = [], force = false }) {
  const catalog = await syncVsaxGroupCatalogFromEnv({ throwOnError: true });
  const availableGroups = Array.isArray(catalog.groups) ? catalog.groups : [];
  const selectedGroups = Array.isArray(catalog.selectedGroups) ? catalog.selectedGroups : [];
  const requestedGroups = new Set(parseGroupNames(groupNames));
  const targetGroups = requestedGroups.size
    ? availableGroups.filter((group) => requestedGroups.has(group))
    : selectedGroups;

  logger.info('VSAx sync requested', {
    requestedGroups: Array.from(requestedGroups),
    selectedGroupCount: selectedGroups.length,
    availableGroupCount: availableGroups.length,
    targetGroupCount: targetGroups.length,
    force
  });

  const unknownGroups = requestedGroups.size
    ? Array.from(requestedGroups).filter((groupName) => !availableGroups.includes(groupName))
    : [];
  if (unknownGroups.length) {
    const err = new Error(`Unknown VSAx group(s): ${unknownGroups.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const groupResults = await mapWithConcurrency(targetGroups, vsaxGroupSyncConcurrency, async (groupName) =>
    syncSingleVsaxGroup({
      config: catalog.config,
      groupName,
      force
    })
  );

  const summary = {
    groupCount: targetGroups.length,
    scannedGroups: groupResults.filter((result) => result.scanned && !result.skipped).length,
    skippedGroups: groupResults.filter((result) => result.skipped).length,
    failedGroups: groupResults.filter((result) => result.hadError).length,
    deviceCount: groupResults.reduce((sum, result) => sum + Number(result.deviceCount || 0), 0),
    diskCount: groupResults.reduce((sum, result) => sum + Number(result.diskCount || 0), 0),
    totalAllocatedBytes: groupResults.reduce((sum, result) => sum + Number(result.totalAllocatedBytes || 0), 0),
    totalUsedBytes: groupResults.reduce((sum, result) => sum + Number(result.totalUsedBytes || 0), 0),
    pageCount: groupResults.reduce((sum, result) => sum + Number(result.pageCount || 0), 0),
    assetCount: groupResults.reduce((sum, result) => sum + Number(result.assetCount || 0), 0)
  };

  const allGroupRows = normalizeVsaxGroupRows(getVsaxGroups());
  const persistedSelectedGroups = resolveVsaxSelectedGroups({
    availableGroups: allGroupRows.map((row) => row.group_name),
    requestedGroups: getSelectedVsaxGroupNames()
  });
  const selectedSet = new Set(persistedSelectedGroups);

  return {
    summary,
    groupResults,
    groups: allGroupRows.filter((row) => selectedSet.has(row.group_name)),
    selectedGroups: persistedSelectedGroups,
    availableGroups: allGroupRows,
    availableGroupNames: allGroupRows.map((row) => row.group_name)
  };
}

function startVsaxSyncScheduler() {
  logger.info('Starting VSAx inventory sync scheduler', {
    intervalHours: vsaxSyncIntervalHours,
    cacheTtlHours: vsaxCacheTtlHours,
    groupWorkers: vsaxGroupSyncConcurrency
  });

  const runTick = async (initialRun) => {
    if (vsaxSyncInFlight) {
      logger.warn('VSAx sync tick skipped because previous run is still active', {
        initialRun
      });
      return;
    }

    vsaxSyncInFlight = true;
    try {
      const result = await syncVsaxGroups({
        force: false
      });

      if (result.summary.groupCount > 0) {
        logger.info('VSAx sync complete', {
          groupCount: result.summary.groupCount,
          scannedGroups: result.summary.scannedGroups,
          skippedGroups: result.summary.skippedGroups,
          failedGroups: result.summary.failedGroups,
          deviceCount: result.summary.deviceCount,
          diskCount: result.summary.diskCount,
          initialRun
        });
      } else {
        logger.info('VSAx sync skipped', {
          reason: 'no VSAx groups selected',
          initialRun
        });
      }
    } catch (error) {
      logger.warn('VSAx sync failed', {
        error: error.message || String(error),
        initialRun
      });
    } finally {
      vsaxSyncInFlight = false;
    }
  };

  const timer = setInterval(() => {
    void runTick(false);
  }, getVsaxSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  void runTick(true);
}

function getWasabiCacheTtlMs() {
  return wasabiCacheTtlHours * 60 * 60 * 1000;
}

function getWasabiSyncIntervalMs() {
  return wasabiSyncIntervalHours * 60 * 60 * 1000;
}

function resolveWasabiConfig() {
  try {
    const accounts = getWasabiAccountConfigsFromEnv();
    return {
      accounts,
      error: null
    };
  } catch (error) {
    return {
      accounts: [],
      error: error.message || String(error)
    };
  }
}

function syncWasabiAccountCatalogFromEnv({ throwOnError = false } = {}) {
  const resolved = resolveWasabiConfig();
  if (resolved.error) {
    logger.warn('Wasabi account catalog parse failed', {
      error: resolved.error,
      throwOnError
    });
    if (throwOnError) {
      const err = new Error(resolved.error);
      err.statusCode = 500;
      throw err;
    }
    return resolved;
  }

  const accountRows = resolved.accounts.map((account) => ({
    accountId: account.accountId,
    displayName: account.displayName,
    region: account.region,
    s3Endpoint: account.s3Endpoint,
    statsEndpoint: account.statsEndpoint
  }));
  upsertWasabiAccounts(accountRows);

  return {
    accounts: resolved.accounts,
    error: null
  };
}

function shouldSyncWasabiAccount(cachedAccount, force) {
  if (force) {
    return true;
  }
  if (!cachedAccount || !cachedAccount.last_sync_at) {
    return true;
  }
  const ageMs = Date.now() - parseTimeMs(cachedAccount.last_sync_at);
  return ageMs > getWasabiCacheTtlMs();
}

function summarizeWasabiAccountSyncResult(result = {}) {
  return {
    accountId: result.accountId || '',
    accountName: result.accountName || '',
    scanned: Boolean(result.scanned),
    skipped: Boolean(result.skipped),
    hadError: Boolean(result.hadError),
    accountError: result.accountError || null,
    bucketCount: Number(result.bucketCount || 0),
    bucketStatsScanned: Number(result.bucketStatsScanned || 0),
    bucketErrors: Number(result.bucketErrors || 0)
  };
}

async function syncSingleWasabiAccount({ accountConfig, force = false }) {
  logger.debug('Starting Wasabi account sync', {
    accountId: accountConfig.accountId,
    accountName: accountConfig.displayName,
    force
  });
  const cachedAccount = getWasabiAccountById(accountConfig.accountId);
  if (!shouldSyncWasabiAccount(cachedAccount, force)) {
    logger.debug('Skipping Wasabi account sync due to fresh cache', {
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName
    });
    return summarizeWasabiAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: false,
      skipped: true,
      hadError: Boolean(cachedAccount?.last_error),
      bucketCount: getWasabiBuckets(accountConfig.accountId).length
    });
  }

  const cachedBuckets = getWasabiBuckets(accountConfig.accountId);
  const cachedByName = new Map(cachedBuckets.map((bucket) => [bucket.bucket_name, bucket]));

  try {
    const listedBuckets = await listBucketsForAccount(accountConfig);
    const dateRange = buildWasabiStatsDateRange(new Date());

    const bucketResults = await mapWithConcurrency(listedBuckets, wasabiBucketSyncConcurrency, async (bucket) => {
      try {
        const stats = await getBucketLatestUtilization(accountConfig, bucket.bucketName, dateRange);
        return {
          bucketName: bucket.bucketName,
          createdAt: bucket.createdAt || null,
          usageBytes: stats.usageBytes,
          objectCount: stats.objectCount,
          utilizationFromDate: stats.fromDate,
          utilizationToDate: stats.toDate,
          utilizationRecordedAt: stats.utilizationRecordedAt,
          error: null
        };
      } catch (error) {
        return {
          bucketName: bucket.bucketName,
          createdAt: bucket.createdAt || null,
          usageBytes: null,
          objectCount: null,
          utilizationFromDate: dateRange.fromDate,
          utilizationToDate: dateRange.toDate,
          utilizationRecordedAt: null,
          error: error.message || String(error)
        };
      }
    });

    const bucketRows = bucketResults.map((result) => {
      if (!result?.error) {
        return result;
      }

      const cachedBucket = cachedByName.get(result.bucketName);
      return {
        ...result,
        usageBytes: cachedBucket?.usage_bytes ?? 0,
        objectCount: cachedBucket?.object_count ?? 0,
        utilizationRecordedAt: cachedBucket?.utilization_recorded_at || null
      };
    });

    replaceWasabiBucketsForAccount(accountConfig.accountId, bucketRows);
    const bucketErrors = bucketRows.filter((bucket) => bucket.error).length;
    updateWasabiAccountSync({
      accountId: accountConfig.accountId,
      error: bucketErrors ? `${bucketErrors} bucket stat request(s) failed.` : null
    });

    if (bucketErrors > 0) {
      logger.warn('Wasabi account sync completed with bucket errors', {
        accountId: accountConfig.accountId,
        accountName: accountConfig.displayName,
        bucketCount: bucketRows.length,
        bucketErrors
      });
    } else {
      logger.debug('Wasabi account sync completed', {
        accountId: accountConfig.accountId,
        accountName: accountConfig.displayName,
        bucketCount: bucketRows.length
      });
    }

    return summarizeWasabiAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: true,
      skipped: false,
      hadError: bucketErrors > 0,
      bucketCount: bucketRows.length,
      bucketStatsScanned: bucketRows.length,
      bucketErrors
    });
  } catch (error) {
    logger.warn('Wasabi account sync failed', {
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      error: error.message || String(error)
    });
    updateWasabiAccountSync({
      accountId: accountConfig.accountId,
      error: error.message || String(error)
    });
    return summarizeWasabiAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: true,
      skipped: false,
      hadError: true,
      accountError: error.message || String(error),
      bucketCount: cachedBuckets.length,
      bucketStatsScanned: 0,
      bucketErrors: 0
    });
  }
}

async function syncWasabiAccounts({ accountIds = [], force = false }) {
  const catalog = syncWasabiAccountCatalogFromEnv({ throwOnError: true });
  const configuredAccounts = catalog.accounts;
  const filterIds = new Set(parseSubscriptionIds(accountIds));

  const targetAccounts = filterIds.size
    ? configuredAccounts.filter((account) => filterIds.has(account.accountId))
    : configuredAccounts;

  logger.info('Wasabi sync requested', {
    requestedAccountIds: accountIds,
    targetAccountCount: targetAccounts.length,
    force
  });

  const unknownRequested = filterIds.size
    ? Array.from(filterIds).filter((accountId) => !configuredAccounts.some((account) => account.accountId === accountId))
    : [];
  if (unknownRequested.length) {
    const err = new Error(`Unknown Wasabi accountId(s): ${unknownRequested.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const accountResults = await mapWithConcurrency(targetAccounts, wasabiAccountSyncConcurrency, async (account) =>
    syncSingleWasabiAccount({
      accountConfig: account,
      force
    })
  );

  const summary = {
    accountCount: targetAccounts.length,
    scannedAccounts: accountResults.filter((result) => result.scanned && !result.skipped).length,
    skippedAccounts: accountResults.filter((result) => result.skipped).length,
    failedAccounts: accountResults.filter((result) => result.hadError).length,
    bucketCount: accountResults.reduce((sum, result) => sum + Number(result.bucketCount || 0), 0),
    bucketErrors: accountResults.reduce((sum, result) => sum + Number(result.bucketErrors || 0), 0)
  };

  return {
    summary,
    accountResults,
    accounts: getWasabiAccounts()
  };
}

function startWasabiSyncScheduler() {
  logger.info('Starting Wasabi inventory sync scheduler', {
    intervalHours: wasabiSyncIntervalHours,
    cacheTtlHours: wasabiCacheTtlHours
  });

  const timer = setInterval(() => {
    void syncWasabiAccounts({ force: false }).then((result) => {
      if (result.summary.accountCount > 0) {
        logger.info('Wasabi sync complete', {
          accountCount: result.summary.accountCount,
          scannedAccounts: result.summary.scannedAccounts,
          skippedAccounts: result.summary.skippedAccounts,
          failedAccounts: result.summary.failedAccounts
        });
      }
    }).catch((error) => {
      logger.warn('Wasabi sync failed', {
        error: error.message || String(error)
      });
    });
  }, getWasabiSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  void syncWasabiAccounts({ force: false }).then((result) => {
    if (result.summary.accountCount > 0) {
      logger.info('Wasabi startup sync complete', {
        accountCount: result.summary.accountCount,
        scannedAccounts: result.summary.scannedAccounts,
        skippedAccounts: result.summary.skippedAccounts,
        failedAccounts: result.summary.failedAccounts
      });
    } else {
      logger.info('Wasabi startup sync skipped', {
        reason: 'no Wasabi accounts configured'
      });
    }
  }).catch((error) => {
    logger.warn('Wasabi startup sync failed', {
      error: error.message || String(error)
    });
  });
}

function getAwsCacheTtlMs() {
  return awsCacheTtlHours * 60 * 60 * 1000;
}

function getAwsSyncIntervalMs() {
  return awsSyncIntervalHours * 60 * 60 * 1000;
}

function resolveAwsConfig() {
  try {
    const accounts = getAwsAccountConfigsFromEnv();
    return {
      accounts,
      error: null
    };
  } catch (error) {
    return {
      accounts: [],
      error: error.message || String(error)
    };
  }
}

function syncAwsAccountCatalogFromEnv({ throwOnError = false } = {}) {
  const resolved = resolveAwsConfig();
  if (resolved.error) {
    logger.warn('AWS account catalog parse failed', {
      error: resolved.error,
      throwOnError
    });
    if (throwOnError) {
      const err = new Error(resolved.error);
      err.statusCode = 500;
      throw err;
    }
    return resolved;
  }

  const accountRows = resolved.accounts.map((account) => ({
    accountId: account.accountId,
    displayName: account.displayName,
    region: account.region,
    cloudWatchRegion: account.cloudWatchRegion,
    s3Endpoint: account.s3Endpoint,
    forcePathStyle: account.forcePathStyle,
    requestMetricsEnabledByDefault: account.requestMetricsEnabledByDefault
  }));
  upsertAwsAccounts(accountRows);

  return {
    accounts: resolved.accounts,
    error: null
  };
}

function shouldSyncAwsAccount(cachedAccount, force) {
  if (force) {
    return true;
  }
  if (!cachedAccount || !cachedAccount.last_sync_at) {
    return true;
  }
  const ageMs = Date.now() - parseTimeMs(cachedAccount.last_sync_at);
  return ageMs > getAwsCacheTtlMs();
}

function summarizeAwsAccountSyncResult(result = {}) {
  return {
    accountId: result.accountId || '',
    accountName: result.accountName || '',
    scanned: Boolean(result.scanned),
    skipped: Boolean(result.skipped),
    hadError: Boolean(result.hadError),
    accountError: result.accountError || null,
    bucketCount: Number(result.bucketCount || 0),
    bucketScanned: Number(result.bucketScanned || 0),
    bucketErrors: Number(result.bucketErrors || 0),
    requestMetricBuckets: Number(result.requestMetricBuckets || 0),
    securityScanBuckets: Number(result.securityScanBuckets || 0),
    securityErrorBuckets: Number(result.securityErrorBuckets || 0),
    efsCount: Number(result.efsCount || 0),
    efsError: result.efsError || null,
    deepScan: Boolean(result.deepScan)
  };
}

function toNullableBoolean(value) {
  if (value === null || value === undefined) {
    return null;
  }
  return Boolean(value);
}

function mapCachedAwsBucketSecurity(bucket = {}) {
  return {
    publicAccessBlockEnabled: toNullableBoolean(bucket.public_access_block_enabled),
    blockPublicAcls: toNullableBoolean(bucket.block_public_acls),
    ignorePublicAcls: toNullableBoolean(bucket.ignore_public_acls),
    blockPublicPolicy: toNullableBoolean(bucket.block_public_policy),
    restrictPublicBuckets: toNullableBoolean(bucket.restrict_public_buckets),
    policyIsPublic: toNullableBoolean(bucket.policy_is_public),
    encryptionEnabled: toNullableBoolean(bucket.encryption_enabled),
    encryptionAlgorithm: bucket.encryption_algorithm || null,
    kmsKeyId: bucket.kms_key_id || null,
    versioningStatus: bucket.versioning_status || null,
    lifecycleEnabled: toNullableBoolean(bucket.lifecycle_enabled),
    lifecycleRuleCount: bucket.lifecycle_rule_count === null || bucket.lifecycle_rule_count === undefined ? null : Number(bucket.lifecycle_rule_count),
    accessLoggingEnabled: toNullableBoolean(bucket.access_logging_enabled),
    accessLogTargetBucket: bucket.access_log_target_bucket || null,
    accessLogTargetPrefix: bucket.access_log_target_prefix || null,
    objectLockEnabled: toNullableBoolean(bucket.object_lock_enabled),
    ownershipControls: bucket.ownership_controls || null,
    lastSecurityScanAt: bucket.last_security_scan_at || null,
    securityError: bucket.security_error || null
  };
}

function mapAwsBucketWithCacheFallback(bucketResult, cachedBucket, scanMode) {
  if (!bucketResult?.error) {
    return bucketResult;
  }

  return {
    ...bucketResult,
    usageBytes: cachedBucket?.usage_bytes ?? 0,
    objectCount: cachedBucket?.object_count ?? 0,
    egressBytes24h: cachedBucket?.egress_bytes_24h ?? null,
    ingressBytes24h: cachedBucket?.ingress_bytes_24h ?? null,
    transactions24h: cachedBucket?.transactions_24h ?? null,
    egressBytes30d: cachedBucket?.egress_bytes_30d ?? null,
    ingressBytes30d: cachedBucket?.ingress_bytes_30d ?? null,
    transactions30d: cachedBucket?.transactions_30d ?? null,
    requestMetricsAvailable: Number(cachedBucket?.request_metrics_available || 0) === 1,
    requestMetricsError: cachedBucket?.request_metrics_error || null,
    sizeSource: scanMode === 'deep' ? 'list-objects-v2' : cachedBucket?.size_source || 'cloudwatch',
    storageTypeHint: cachedBucket?.storage_type_hint || null,
    scanMode,
    ...mapCachedAwsBucketSecurity(cachedBucket || {})
  };
}

async function syncSingleAwsAccount({
  accountConfig,
  force = false,
  deepScan = false,
  includeRequestMetrics = false,
  includeSecurity = false
}) {
  logger.debug('Starting AWS account sync', {
    accountId: accountConfig.accountId,
    accountName: accountConfig.displayName,
    force,
    deepScan,
    includeRequestMetrics,
    includeSecurity
  });

  const cachedAccount = getAwsAccountById(accountConfig.accountId);
  if (!shouldSyncAwsAccount(cachedAccount, force)) {
    logger.debug('Skipping AWS account sync due to fresh cache', {
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName
    });
    return summarizeAwsAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: false,
      skipped: true,
      hadError: false,
      accountError: cachedAccount?.last_error || null,
      bucketCount: getAwsBuckets(accountConfig.accountId).length,
      securityScanBuckets: getAwsBuckets(accountConfig.accountId).filter((bucket) => bucket.last_security_scan_at).length,
      securityErrorBuckets: getAwsBuckets(accountConfig.accountId).filter((bucket) => bucket.security_error).length,
      efsCount: getAwsEfs(accountConfig.accountId).length,
      deepScan
    });
  }

  const cachedBuckets = getAwsBuckets(accountConfig.accountId);
  const cachedByName = new Map(cachedBuckets.map((bucket) => [bucket.bucket_name, bucket]));
  const clients = createAwsClients(accountConfig);

  try {
    const listedBuckets = await listAwsBucketsForAccount(accountConfig, clients);
    const scanMode = deepScan ? 'deep' : 'low-cost';

    const bucketResults = await mapWithConcurrency(listedBuckets, awsBucketSyncConcurrency, async (bucket) => {
      try {
        const storageMetrics = await getBucketStorageMetrics(accountConfig, bucket.bucketName, clients);
        let usageBytes = storageMetrics.usageBytes;
        let objectCount = storageMetrics.objectCount;
        let sizeSource = 'cloudwatch';
        let storageTypeHint = storageMetrics.usageStorageType || storageMetrics.objectStorageType || null;

        if (deepScan) {
          let bucketRegion = accountConfig.region;
          try {
            bucketRegion = await getBucketRegion(accountConfig, bucket.bucketName, clients);
          } catch (_error) {
            // Fallback to configured account region if bucket location lookup is blocked.
            bucketRegion = accountConfig.region;
          }
          const deepStats = await deepScanBucketObjects(accountConfig, bucket.bucketName, {
            bucketRegion
          });
          usageBytes = deepStats.usageBytes;
          objectCount = deepStats.objectCount;
          sizeSource = 'list-objects-v2';
          storageTypeHint = deepStats.bucketRegion ? `bucket-region:${deepStats.bucketRegion}` : null;
        }

        let egress24h = null;
        let ingress24h = null;
        let transactions24h = null;
        let egress30d = null;
        let ingress30d = null;
        let transactions30d = null;
        let requestMetricsAvailable = false;
        let requestMetricsError = null;
        let security = mapCachedAwsBucketSecurity(cachedByName.get(bucket.bucketName) || {});
        const shouldReadRequestMetrics = includeRequestMetrics || Boolean(accountConfig.requestMetricsEnabledByDefault);

        if (shouldReadRequestMetrics) {
          const [window24h, window30d] = await Promise.all([
            getBucketRequestMetrics({
              account: accountConfig,
              bucketName: bucket.bucketName,
              windowHours: 24,
              clients
            }),
            getBucketRequestMetrics({
              account: accountConfig,
              bucketName: bucket.bucketName,
              windowHours: 30 * 24,
              periodSeconds: 24 * 60 * 60,
              clients
            })
          ]);

          egress24h = window24h.egressBytes;
          ingress24h = window24h.ingressBytes;
          transactions24h = window24h.transactions;
          egress30d = window30d.egressBytes;
          ingress30d = window30d.ingressBytes;
          transactions30d = window30d.transactions;
          requestMetricsAvailable = Boolean(window24h.available || window30d.available);
          requestMetricsError = window24h.error || window30d.error || null;
        }

        if (includeSecurity) {
          security = await getBucketSecurityPosture({
            account: accountConfig,
            bucketName: bucket.bucketName,
            clients
          });
        }

        return {
          bucketName: bucket.bucketName,
          createdAt: bucket.createdAt || null,
          usageBytes,
          objectCount,
          egressBytes24h: egress24h,
          ingressBytes24h: ingress24h,
          transactions24h,
          egressBytes30d: egress30d,
          ingressBytes30d: ingress30d,
          transactions30d,
          requestMetricsAvailable,
          requestMetricsError,
          sizeSource,
          storageTypeHint,
          scanMode,
          ...security,
          error: null
        };
      } catch (error) {
        return {
          bucketName: bucket.bucketName,
          createdAt: bucket.createdAt || null,
          usageBytes: null,
          objectCount: null,
          egressBytes24h: null,
          ingressBytes24h: null,
          transactions24h: null,
          egressBytes30d: null,
          ingressBytes30d: null,
          transactions30d: null,
          requestMetricsAvailable: false,
          requestMetricsError: null,
          sizeSource: deepScan ? 'list-objects-v2' : 'cloudwatch',
          storageTypeHint: null,
          scanMode,
          ...mapCachedAwsBucketSecurity(cachedByName.get(bucket.bucketName) || {}),
          error: error.message || String(error)
        };
      }
    });

    const bucketRows = bucketResults.map((result) => {
      const cachedBucket = cachedByName.get(result.bucketName);
      const merged = mapAwsBucketWithCacheFallback(result, cachedBucket, scanMode);
      if (!includeSecurity) {
        return {
          ...merged,
          ...mapCachedAwsBucketSecurity(cachedBucket || {})
        };
      }
      return merged;
    });

    replaceAwsBucketsForAccount(accountConfig.accountId, bucketRows);
    const bucketErrors = bucketRows.filter((bucket) => bucket.error).length;
    const requestMetricBuckets = bucketRows.filter((bucket) => bucket.requestMetricsAvailable).length;
    const securityScanBuckets = bucketRows.filter((bucket) => bucket.lastSecurityScanAt).length;
    const securityErrorBuckets = bucketRows.filter((bucket) => bucket.securityError).length;
    let efsCount = 0;
    let efsError = null;

    try {
      const efsFileSystems = await listEfsFileSystems(accountConfig, {
        regions: accountConfig.efsRegions
      });
      const efsRows = efsFileSystems.map((fileSystem) => ({
        fileSystemId: fileSystem.fileSystemId,
        name: fileSystem.name,
        region: fileSystem.region,
        lifecycleState: fileSystem.lifecycleState,
        performanceMode: fileSystem.performanceMode,
        throughputMode: fileSystem.throughputMode,
        encrypted: fileSystem.encrypted,
        provisionedThroughputInMibps: fileSystem.provisionedThroughputInMibps,
        sizeBytes: fileSystem.sizeBytes,
        creationTime: fileSystem.creationTime,
        error: null
      }));
      replaceAwsEfsForAccount(accountConfig.accountId, efsRows);
      efsCount = efsRows.length;
    } catch (error) {
      efsError = error.message || String(error);
      logger.warn('AWS EFS sync failed for account', {
        accountId: accountConfig.accountId,
        accountName: accountConfig.displayName,
        error: efsError
      });
      efsCount = getAwsEfs(accountConfig.accountId).length;
    }

    const accountErrorParts = [];
    if (bucketErrors) {
      accountErrorParts.push(`${bucketErrors} bucket request(s) failed.`);
    }
    if (securityErrorBuckets > 0) {
      accountErrorParts.push(`${securityErrorBuckets} bucket security profile(s) failed.`);
    }
    if (efsError) {
      accountErrorParts.push(`EFS sync failed: ${efsError}`);
    }

    updateAwsAccountSync({
      accountId: accountConfig.accountId,
      error: accountErrorParts.length ? accountErrorParts.join(' ') : null
    });

    if (bucketErrors > 0 || securityErrorBuckets > 0 || efsError) {
      logger.warn('AWS account sync completed with errors', {
        accountId: accountConfig.accountId,
        accountName: accountConfig.displayName,
        bucketCount: bucketRows.length,
        bucketErrors,
        securityScanBuckets,
        securityErrorBuckets,
        efsError
      });
    } else {
      logger.debug('AWS account sync completed', {
        accountId: accountConfig.accountId,
        accountName: accountConfig.displayName,
        bucketCount: bucketRows.length,
        requestMetricBuckets,
        securityScanBuckets,
        efsCount
      });
    }

    return summarizeAwsAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: true,
      skipped: false,
      hadError: bucketErrors > 0 || Boolean(efsError),
      bucketCount: bucketRows.length,
      bucketScanned: bucketRows.length,
      bucketErrors,
      requestMetricBuckets,
      securityScanBuckets,
      securityErrorBuckets,
      efsCount,
      efsError,
      deepScan
    });
  } catch (error) {
    logger.warn('AWS account sync failed', {
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      error: error.message || String(error)
    });
    updateAwsAccountSync({
      accountId: accountConfig.accountId,
      error: error.message || String(error)
    });
    return summarizeAwsAccountSyncResult({
      accountId: accountConfig.accountId,
      accountName: accountConfig.displayName,
      scanned: true,
      skipped: false,
      hadError: true,
      accountError: error.message || String(error),
      bucketCount: cachedBuckets.length,
      bucketScanned: 0,
      bucketErrors: 0,
      securityScanBuckets: cachedBuckets.filter((bucket) => bucket.last_security_scan_at).length,
      securityErrorBuckets: cachedBuckets.filter((bucket) => bucket.security_error).length,
      efsCount: getAwsEfs(accountConfig.accountId).length,
      deepScan
    });
  } finally {
    destroyAwsClients(clients);
  }
}

async function syncAwsAccounts({
  accountIds = [],
  force = false,
  deepScan = awsDefaultDeepScan,
  includeRequestMetrics = awsDefaultRequestMetrics,
  includeSecurity = awsDefaultSecurityScan
}) {
  const catalog = syncAwsAccountCatalogFromEnv({ throwOnError: true });
  const configuredAccounts = catalog.accounts;
  const filterIds = new Set(parseAccountIds(accountIds));
  const targetAccounts = filterIds.size
    ? configuredAccounts.filter((account) => filterIds.has(account.accountId))
    : configuredAccounts;

  logger.info('AWS sync requested', {
    requestedAccountIds: accountIds,
    targetAccountCount: targetAccounts.length,
    force,
    deepScan: Boolean(deepScan),
    includeRequestMetrics: Boolean(includeRequestMetrics),
    includeSecurity: Boolean(includeSecurity)
  });

  const unknownRequested = filterIds.size
    ? Array.from(filterIds).filter((accountId) => !configuredAccounts.some((account) => account.accountId === accountId))
    : [];
  if (unknownRequested.length) {
    const err = new Error(`Unknown AWS accountId(s): ${unknownRequested.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }

  const accountResults = await mapWithConcurrency(targetAccounts, awsAccountSyncConcurrency, async (account) =>
    syncSingleAwsAccount({
      accountConfig: account,
      force,
      deepScan: Boolean(deepScan),
      includeRequestMetrics: Boolean(includeRequestMetrics),
      includeSecurity: Boolean(includeSecurity)
    })
  );

  const summary = {
    accountCount: targetAccounts.length,
    scannedAccounts: accountResults.filter((result) => result.scanned && !result.skipped).length,
    skippedAccounts: accountResults.filter((result) => result.skipped).length,
    failedAccounts: accountResults.filter((result) => result.hadError).length,
    bucketCount: accountResults.reduce((sum, result) => sum + Number(result.bucketCount || 0), 0),
    bucketErrors: accountResults.reduce((sum, result) => sum + Number(result.bucketErrors || 0), 0),
    requestMetricBuckets: accountResults.reduce((sum, result) => sum + Number(result.requestMetricBuckets || 0), 0),
    securityScanBuckets: accountResults.reduce((sum, result) => sum + Number(result.securityScanBuckets || 0), 0),
    securityErrorBuckets: accountResults.reduce((sum, result) => sum + Number(result.securityErrorBuckets || 0), 0),
    efsCount: accountResults.reduce((sum, result) => sum + Number(result.efsCount || 0), 0),
    efsErrors: accountResults.reduce((sum, result) => sum + (result.efsError ? 1 : 0), 0),
    deepScan: Boolean(deepScan),
    includeRequestMetrics: Boolean(includeRequestMetrics),
    includeSecurity: Boolean(includeSecurity)
  };

  return {
    summary,
    accountResults,
    accounts: getAwsAccounts()
  };
}

function startAwsSyncScheduler() {
  logger.info('Starting AWS inventory sync scheduler', {
    intervalHours: awsSyncIntervalHours,
    cacheTtlHours: awsCacheTtlHours,
    defaultDeepScan: awsDefaultDeepScan,
    defaultRequestMetrics: awsDefaultRequestMetrics,
    defaultSecurityScan: awsDefaultSecurityScan
  });

  const runTick = async (initialRun) => {
    if (awsSyncInFlight) {
      logger.warn('AWS sync tick skipped because previous run is still active', {
        initialRun
      });
      return;
    }

    awsSyncInFlight = true;
    try {
      const result = await syncAwsAccounts({
        force: false,
        deepScan: false,
        includeRequestMetrics: false,
        includeSecurity: false
      });
      if (result.summary.accountCount > 0) {
        logger.info('AWS sync complete', {
          accountCount: result.summary.accountCount,
          scannedAccounts: result.summary.scannedAccounts,
          skippedAccounts: result.summary.skippedAccounts,
          failedAccounts: result.summary.failedAccounts,
          requestMetricBuckets: result.summary.requestMetricBuckets,
          securityScanBuckets: result.summary.securityScanBuckets,
          securityErrorBuckets: result.summary.securityErrorBuckets,
          efsCount: result.summary.efsCount,
          efsErrors: result.summary.efsErrors,
          initialRun
        });
      } else {
        logger.info('AWS sync skipped', {
          reason: 'no AWS accounts configured',
          initialRun
        });
      }
    } catch (error) {
      logger.warn('AWS sync failed', {
        error: error.message || String(error),
        initialRun
      });
    } finally {
      awsSyncInFlight = false;
    }
  };

  const timer = setInterval(() => {
    void runTick(false);
  }, getAwsSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  void runTick(true);
}

function createPullAllJob({ subscriptionIds, force }) {
  return {
    id: randomUUID(),
    type: 'pull_all',
    status: 'running',
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    finishedAt: null,
    subscriptionIds: Array.isArray(subscriptionIds) ? [...subscriptionIds] : [],
    force: Boolean(force),
    message: 'Initializing',
    totalAccounts: 0,
    completedAccounts: 0,
    failedAccounts: 0,
    accountStates: {}
  };
}

function addPullAllJob(job) {
  pullAllJobs.unshift(job);
  while (pullAllJobs.length > pullAllJobHistoryLimit) {
    pullAllJobs.pop();
  }
}

function getLatestPullAllJob() {
  return pullAllJobs[0] || null;
}

function getRunningPullAllJob() {
  return pullAllJobs.find((job) => job.status === 'running') || null;
}

function formatJobPayload(job) {
  if (!job) {
    return null;
  }

  return {
    id: job.id,
    type: job.type,
    status: job.status,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
    subscriptionIds: job.subscriptionIds,
    force: job.force,
    message: job.message,
    totalAccounts: job.totalAccounts,
    completedAccounts: job.completedAccounts,
    failedAccounts: job.failedAccounts,
    accountStates: Object.values(job.accountStates).sort((a, b) => a.name.localeCompare(b.name))
  };
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function run() {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= items.length) {
        return;
      }
      try {
        results[current] = await worker(items[current], current);
      } catch (error) {
        results[current] = { error: error.message || String(error) };
      }
    }
  }

  const runners = Array.from({ length: Math.max(1, limit) }, () => run());
  await Promise.all(runners);
  return results;
}

function shouldScanContainer(container, force) {
  if (force) {
    return true;
  }
  if (!container.last_size_scan_at) {
    return true;
  }
  const lastScan = new Date(container.last_size_scan_at).getTime();
  const ageMs = Date.now() - lastScan;
  return ageMs > cacheTtlMinutes * 60 * 1000;
}

function shouldScanSecurityProfile(profileRecord, force) {
  if (force) {
    return true;
  }
  if (!profileRecord || !profileRecord.last_security_scan_at) {
    return true;
  }
  const lastScan = new Date(profileRecord.last_security_scan_at).getTime();
  const ageMs = Date.now() - lastScan;
  return ageMs > securityCacheTtlMinutes * 60 * 1000;
}

function shouldScanMetrics(account, force) {
  if (force) {
    return true;
  }
  if (!account || !account.metrics_last_scan_at) {
    return true;
  }
  // Backfill safeguard: if 30-day fields are missing, force a metrics refresh
  // even when 24h metrics cache is still within TTL.
  const missing30dMetric =
    account.metrics_egress_bytes_30d === null ||
    account.metrics_egress_bytes_30d === undefined ||
    account.metrics_ingress_bytes_30d === null ||
    account.metrics_ingress_bytes_30d === undefined ||
    account.metrics_transactions_30d === null ||
    account.metrics_transactions_30d === undefined;
  if (missing30dMetric) {
    return true;
  }
  const lastScan = new Date(account.metrics_last_scan_at).getTime();
  const ageMs = Date.now() - lastScan;
  return ageMs > metricsCacheTtlMinutes * 60 * 1000;
}

async function syncStorageAccountSecurity({ armToken, accountId, force = false }) {
  logger.debug('Starting storage account security sync', {
    accountId,
    force
  });
  const account = getStorageAccountById(accountId);
  if (!account) {
    const err = new Error(`Storage account not found in cache: ${accountId}`);
    err.statusCode = 404;
    throw err;
  }

  const cached = getStorageAccountSecurity(accountId);
  const shouldScan = shouldScanSecurityProfile(cached, force);

  if (!shouldScan) {
    logger.debug('Skipping security sync due to fresh cache', {
      accountId,
      accountName: account.name
    });
    return {
      accountId,
      accountName: account.name,
      scanned: false,
      skipped: true,
      hadError: Boolean(cached?.last_error)
    };
  }

  try {
    const profile = await getStorageAccountSecurityProfile(armToken, accountId);
    upsertStorageAccountSecurity({
      accountId,
      profile,
      error: null
    });
    logger.debug('Completed storage account security sync', {
      accountId,
      accountName: account.name
    });
    return {
      accountId,
      accountName: account.name,
      scanned: true,
      skipped: false,
      hadError: false
    };
  } catch (error) {
    logger.warn('Storage account security sync failed', {
      accountId,
      accountName: account.name,
      error: error.message || String(error)
    });
    upsertStorageAccountSecurity({
      accountId,
      profile: cached?.profile || null,
      error: error.message || String(error)
    });
    return {
      accountId,
      accountName: account.name,
      scanned: true,
      skipped: false,
      hadError: true,
      error: error.message || String(error)
    };
  }
}

async function syncStorageAccountMetrics({ armToken, accountId, force = false }) {
  logger.debug('Starting storage account metrics sync', {
    accountId,
    force
  });
  const account = getStorageAccountById(accountId);
  if (!account) {
    const err = new Error(`Storage account not found in cache: ${accountId}`);
    err.statusCode = 404;
    throw err;
  }

  const shouldScan = shouldScanMetrics(account, force);
  if (!shouldScan) {
    logger.debug('Skipping metrics sync due to fresh cache', {
      accountId,
      accountName: account.name
    });
    return {
      accountId,
      accountName: account.name,
      scanned: false,
      skipped: true,
      hadError: Boolean(account.metrics_last_error)
    };
  }

  try {
    const [metrics24h, metrics30d] = await Promise.all([
      getStorageAccountMetrics24h(armToken, accountId),
      getStorageAccountMetrics30d(armToken, accountId)
    ]);
    updateStorageAccountMetrics({
      accountId,
      usedCapacityBytes: metrics24h.usedCapacityBytes,
      totalEgressBytes24h: metrics24h.totalEgressBytes24h,
      totalIngressBytes24h: metrics24h.totalIngressBytes24h,
      totalTransactions24h: metrics24h.totalTransactions24h,
      totalEgressBytes30d: metrics30d.totalEgressBytes30d,
      totalIngressBytes30d: metrics30d.totalIngressBytes30d,
      totalTransactions30d: metrics30d.totalTransactions30d,
      error: null
    });
    logger.debug('Completed storage account metrics sync', {
      accountId,
      accountName: account.name
    });
    return {
      accountId,
      accountName: account.name,
      scanned: true,
      skipped: false,
      hadError: false
    };
  } catch (error) {
    logger.warn('Storage account metrics sync failed', {
      accountId,
      accountName: account.name,
      error: error.message || String(error)
    });
    updateStorageAccountMetrics({
      accountId,
      usedCapacityBytes: account.metrics_used_capacity_bytes,
      totalEgressBytes24h: account.metrics_egress_bytes_24h,
      totalIngressBytes24h: account.metrics_ingress_bytes_24h,
      totalTransactions24h: account.metrics_transactions_24h,
      totalEgressBytes30d: account.metrics_egress_bytes_30d,
      totalIngressBytes30d: account.metrics_ingress_bytes_30d,
      totalTransactions30d: account.metrics_transactions_30d,
      error: error.message || String(error)
    });
    return {
      accountId,
      accountName: account.name,
      scanned: true,
      skipped: false,
      hadError: true,
      error: error.message || String(error)
    };
  }
}

function getAzureMetricsSchedulerSubscriptionIds() {
  const selected = getSelectedSubscriptionIds();
  if (selected.length) {
    return selected;
  }
  return getSubscriptions().map((subscription) => subscription.subscription_id).filter(Boolean);
}

async function runAzureMetricsScheduledSync({ force = true } = {}) {
  if (!tokenProvider.isConfigured) {
    return {
      skipped: true,
      reason: 'service_principal_not_configured'
    };
  }

  const subscriptionIds = getAzureMetricsSchedulerSubscriptionIds();
  if (!subscriptionIds.length) {
    return {
      skipped: true,
      reason: 'no_subscriptions_selected_or_cached'
    };
  }

  const armToken = await tokenProvider.getArmToken();
  const subscriptionResults = await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
    const accounts = await listStorageAccounts(armToken, subscriptionId);
    upsertStorageAccounts(subscriptionId, accounts);
    return {
      subscriptionId,
      accountCount: accounts.length
    };
  });
  const subscriptionErrors = subscriptionResults.filter((result) => result && result.error).length;

  const accounts = getStorageAccounts(subscriptionIds);
  if (!accounts.length) {
    return {
      skipped: true,
      reason: 'no_storage_accounts_in_scope',
      subscriptionCount: subscriptionIds.length,
      subscriptionErrors
    };
  }

  const metricsResults = await mapWithConcurrency(accounts, accountSyncConcurrency, (account) =>
    syncStorageAccountMetrics({
      armToken,
      accountId: account.account_id,
      force
    })
  );

  return {
    skipped: false,
    subscriptionCount: subscriptionIds.length,
    subscriptionErrors,
    accountCount: accounts.length,
    scannedAccounts: metricsResults.filter((result) => result && result.scanned && !result.skipped).length,
    skippedAccounts: metricsResults.filter((result) => result && result.skipped).length,
    failedAccounts: metricsResults.filter((result) => result && (result.hadError || result.error)).length
  };
}

function getAzureMetricsSyncIntervalMs() {
  return azureMetricsSyncIntervalHours * 60 * 60 * 1000;
}

function startAzureMetricsSyncScheduler() {
  logger.info('Starting Azure metrics sync scheduler', {
    intervalHours: azureMetricsSyncIntervalHours,
    force: true
  });

  const runTick = async (initialRun) => {
    if (azureMetricsSyncInFlight) {
      logger.warn('Azure metrics sync tick skipped because previous run is still active', {
        initialRun
      });
      return;
    }

    azureMetricsSyncInFlight = true;
    try {
      const result = await runAzureMetricsScheduledSync({ force: true });
      if (result.skipped) {
        logger.info('Azure metrics scheduled sync skipped', {
          reason: result.reason || 'unknown',
          subscriptionCount: result.subscriptionCount || 0,
          initialRun
        });
        return;
      }

      logger.info('Azure metrics scheduled sync completed', {
        subscriptionCount: result.subscriptionCount || 0,
        subscriptionErrors: result.subscriptionErrors || 0,
        accountCount: result.accountCount || 0,
        scannedAccounts: result.scannedAccounts || 0,
        skippedAccounts: result.skippedAccounts || 0,
        failedAccounts: result.failedAccounts || 0,
        initialRun
      });
    } catch (error) {
      logger.warn('Azure metrics scheduled sync failed', {
        error: error.message || String(error),
        initialRun
      });
    } finally {
      azureMetricsSyncInFlight = false;
    }
  };

  const timer = setInterval(() => {
    void runTick(false);
  }, getAzureMetricsSyncIntervalMs());

  if (typeof timer.unref === 'function') {
    timer.unref();
  }

  void runTick(true);
}

async function syncAccountContainersAndSizes({ armToken, storageToken, accountId, force = false }) {
  logger.debug('Starting container size sync', {
    accountId,
    force
  });
  const account = getStorageAccountById(accountId);
  if (!account) {
    const err = new Error(`Storage account not found in cache: ${accountId}`);
    err.statusCode = 404;
    throw err;
  }

  const containers = await listContainersForAccount(armToken, accountId);
  const normalized = containers.map((c) => ({ name: c.name }));
  upsertContainersForAccount(accountId, normalized);

  const cachedContainers = getContainersForAccount(accountId);
  const scanTargets = cachedContainers.filter((c) => shouldScanContainer(c, force));

  const scanResults = await mapWithConcurrency(scanTargets, containerSyncConcurrency, async (container) => {
    try {
      const stats = await calculateContainerSize(storageToken, account.blob_endpoint, container.container_name);
      updateContainerSize({
        accountId,
        containerName: container.container_name,
        sizeBytes: stats.sizeBytes,
        blobCount: stats.blobCount,
        error: null
      });
      return {
        container: container.container_name,
        scanned: true,
        sizeBytes: stats.sizeBytes,
        blobCount: stats.blobCount
      };
    } catch (error) {
      logger.warn('Container size scan failed', {
        accountId,
        accountName: account.name,
        containerName: container.container_name,
        error: error.message || String(error)
      });
      updateContainerSize({
        accountId,
        containerName: container.container_name,
        sizeBytes: container.last_size_bytes || 0,
        blobCount: container.blob_count || 0,
        error: error.message || String(error)
      });
      return {
        container: container.container_name,
        scanned: true,
        error: error.message || String(error)
      };
    }
  });

  const scanned = scanResults.filter((r) => r && r.scanned).length;
  const errors = scanResults.filter((r) => r && r.error).length;
  const skipped = cachedContainers.length - scanned;
  const metricsResult = await syncStorageAccountMetrics({ armToken, accountId, force });

  logger.debug('Completed container size sync', {
    accountId,
    accountName: account.name,
    containerCount: cachedContainers.length,
    scanned,
    skipped,
    errors,
    metricsHadError: Boolean(metricsResult?.hadError)
  });

  return {
    accountId,
    accountName: account.name,
    containerCount: cachedContainers.length,
    scanned,
    skipped,
    errors,
    metricsScanned: Boolean(metricsResult?.scanned && !metricsResult?.skipped),
    metricsSkipped: Boolean(metricsResult?.skipped),
    metricsHadError: Boolean(metricsResult?.hadError),
    metricsError: metricsResult?.error || null
  };
}

async function runPullAllJob(job) {
  logger.info('Pull-all job started', {
    jobId: job.id,
    force: job.force,
    subscriptionIds: job.subscriptionIds
  });
  try {
    const [armToken, storageToken] = await Promise.all([tokenProvider.getArmToken(), tokenProvider.getStorageToken()]);

    let subscriptionIds = job.subscriptionIds;
    if (!subscriptionIds.length) {
      subscriptionIds = getSelectedSubscriptionIds();
      job.subscriptionIds = subscriptionIds;
    }
    if (!subscriptionIds.length) {
      throw new Error('No subscription selected.');
    }

    job.message = 'Refreshing storage accounts from selected subscriptions.';

    await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
      const accounts = await listStorageAccounts(armToken, subscriptionId);
      upsertStorageAccounts(subscriptionId, accounts);
      return true;
    });

    const accounts = getStorageAccounts(subscriptionIds);
    job.totalAccounts = accounts.length;
    job.message = `Processing ${accounts.length} storage account(s).`;
    logger.info('Pull-all job account scope resolved', {
      jobId: job.id,
      subscriptionCount: subscriptionIds.length,
      accountCount: accounts.length
    });

    for (const account of accounts) {
      job.accountStates[account.account_id] = {
        accountId: account.account_id,
        name: account.name,
        status: 'queued',
        label: 'Queued',
        percent: 0,
        updatedAt: new Date().toISOString(),
        errors: 0
      };
    }

    let nextIndex = 0;
    const workerCount = Math.max(1, uiPullAllConcurrency);

    async function worker() {
      while (true) {
        const current = nextIndex;
        nextIndex += 1;
        if (current >= accounts.length) {
          return;
        }

        const account = accounts[current];
        const state = job.accountStates[account.account_id];
        if (state) {
          state.status = 'running';
          state.label = 'Fetching from Azure...';
          state.percent = 100;
          state.updatedAt = new Date().toISOString();
        }

        try {
          const result = await syncAccountContainersAndSizes({
            armToken,
            storageToken,
            accountId: account.account_id,
            force: job.force
          });

          if (state) {
            const hasErrors = Number(result.errors || 0) > 0 || Boolean(result.metricsHadError);
            state.status = hasErrors ? 'error' : 'done';
            state.label = hasErrors
              ? `Done with ${Number(result.errors || 0) + (result.metricsHadError ? 1 : 0)} error(s)`
              : `Done (${result.scanned || 0}/${result.containerCount || 0} scanned)`;
            state.percent = 100;
            state.updatedAt = new Date().toISOString();
            state.errors = Number(result.errors || 0) + (result.metricsHadError ? 1 : 0);
          }

          if ((result.errors || 0) > 0 || result.metricsHadError) {
            job.failedAccounts += 1;
            logger.warn('Pull-all account processed with errors', {
              jobId: job.id,
              accountId: account.account_id,
              accountName: account.name,
              containerErrors: Number(result.errors || 0),
              metricsHadError: Boolean(result.metricsHadError)
            });
          } else {
            logger.debug('Pull-all account processed', {
              jobId: job.id,
              accountId: account.account_id,
              accountName: account.name,
              scanned: Number(result.scanned || 0),
              skipped: Number(result.skipped || 0)
            });
          }
        } catch (error) {
          job.failedAccounts += 1;
          logger.warn('Pull-all account processing failed', {
            jobId: job.id,
            accountId: account.account_id,
            accountName: account.name,
            error: error.message || String(error)
          });
          if (state) {
            state.status = 'error';
            state.label = `Failed: ${error.message || String(error)}`;
            state.percent = 100;
            state.updatedAt = new Date().toISOString();
            state.errors = 1;
          }
        } finally {
          job.completedAccounts += 1;
          job.message = `Processed ${job.completedAccounts}/${job.totalAccounts} account(s).`;
        }
      }
    }

    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    job.finishedAt = new Date().toISOString();
    job.status = job.failedAccounts > 0 ? 'completed_with_errors' : 'completed';
    job.message =
      job.failedAccounts > 0
        ? `Completed with ${job.failedAccounts} account(s) with errors.`
        : 'Completed successfully.';
    if (job.failedAccounts > 0) {
      logger.warn('Pull-all job completed with errors', {
        jobId: job.id,
        totalAccounts: job.totalAccounts,
        completedAccounts: job.completedAccounts,
        failedAccounts: job.failedAccounts
      });
    } else {
      logger.info('Pull-all job completed', {
        jobId: job.id,
        totalAccounts: job.totalAccounts,
        completedAccounts: job.completedAccounts,
        failedAccounts: job.failedAccounts
      });
    }
  } catch (error) {
    job.finishedAt = new Date().toISOString();
    job.status = 'failed';
    job.message = error.message || String(error);
    logger.error('Pull-all job failed', {
      jobId: job.id,
      error: error.message || String(error)
    });
  }
}

function getAzureContainerExportRows(subscriptionIds = []) {
  const hasFilter = Array.isArray(subscriptionIds) && subscriptionIds.length > 0;
  const placeholders = hasFilter ? subscriptionIds.map(() => '?').join(',') : '';
  const query = `
SELECT
  sa.subscription_id,
  s.display_name AS subscription_name,
  sa.account_id,
  sa.name AS account_name,
  c.container_name,
  c.last_size_bytes,
  c.blob_count,
  c.last_size_scan_at,
  c.last_error,
  c.last_seen_at
FROM containers c
JOIN storage_accounts sa ON sa.account_id = c.account_id
LEFT JOIN subscriptions s ON s.subscription_id = sa.subscription_id
WHERE c.is_active=1 AND sa.is_active=1 ${hasFilter ? `AND sa.subscription_id IN (${placeholders})` : ''}
ORDER BY s.display_name COLLATE NOCASE, sa.name COLLATE NOCASE, c.container_name COLLATE NOCASE
`;

  return db.prepare(query).all(...(hasFilter ? subscriptionIds : []));
}

function getAzureStorageContainerExportRows(subscriptionIds = []) {
  const unavailableText = 'info not available at this point';
  const accountRows = getStorageAccounts(subscriptionIds);
  const containerRows = getAzureContainerExportRows(subscriptionIds);
  const containerByAccount = new Map();

  for (const container of containerRows) {
    const accountId = container.account_id;
    if (!containerByAccount.has(accountId)) {
      containerByAccount.set(accountId, []);
    }
    containerByAccount.get(accountId).push(container);
  }

  const rows = [];
  for (const account of accountRows) {
    const accountContainers = containerByAccount.get(account.account_id) || [];
    const common = {
      subscription_id: account.subscription_id,
      subscription_name: account.subscription_name || account.subscription_id,
      account_id: account.account_id,
      account_name: account.name,
      resource_group_name: account.resource_group_name || '',
      location: account.location || '',
      kind: account.kind || '',
      sku_name: account.sku_name || '',
      tags_json: account.tags_json || (account.tags ? JSON.stringify(account.tags) : ''),
      account_container_count: account.container_count ?? '',
      account_total_size_bytes: account.total_size_bytes ?? '',
      account_total_blob_count: account.total_blob_count ?? '',
      account_last_size_scan_at: account.last_size_scan_at || ''
    };

    if (!accountContainers.length) {
      rows.push({
        ...common,
        container_name: unavailableText,
        container_size_bytes: unavailableText,
        container_blob_count: unavailableText,
        container_last_size_scan_at: '',
        container_last_error: ''
      });
      continue;
    }

    for (const container of accountContainers) {
      const hasContainerError = Boolean(container.last_error);
      const sizeUnknown =
        container.last_size_bytes === null ||
        container.last_size_bytes === undefined ||
        (hasContainerError && Number(container.last_size_bytes) === 0);
      const blobCountUnknown =
        container.blob_count === null ||
        container.blob_count === undefined ||
        (hasContainerError && Number(container.blob_count) === 0);

      rows.push({
        ...common,
        container_name: container.container_name || unavailableText,
        container_size_bytes: sizeUnknown ? unavailableText : container.last_size_bytes,
        container_blob_count: blobCountUnknown ? unavailableText : container.blob_count,
        container_last_size_scan_at: container.last_size_scan_at || '',
        container_last_error: container.last_error || ''
      });
    }
  }

  return rows.sort((left, right) => {
    const sub = String(left.subscription_name || '').localeCompare(String(right.subscription_name || ''), undefined, {
      sensitivity: 'base',
      numeric: true
    });
    if (sub !== 0) {
      return sub;
    }
    const account = String(left.account_name || '').localeCompare(String(right.account_name || ''), undefined, {
      sensitivity: 'base',
      numeric: true
    });
    if (account !== 0) {
      return account;
    }
    return String(left.container_name || '').localeCompare(String(right.container_name || ''), undefined, {
      sensitivity: 'base',
      numeric: true
    });
  });
}

function getAzureSecurityExportRows(subscriptionIds = []) {
  const hasFilter = Array.isArray(subscriptionIds) && subscriptionIds.length > 0;
  const placeholders = hasFilter ? subscriptionIds.map(() => '?').join(',') : '';
  const query = `
SELECT
  sa.subscription_id,
  s.display_name AS subscription_name,
  sa.account_id,
  sa.name AS account_name,
  sas.last_security_scan_at,
  sas.last_error,
  sas.profile_json
FROM storage_accounts sa
LEFT JOIN subscriptions s ON s.subscription_id = sa.subscription_id
LEFT JOIN storage_account_security sas ON sas.account_id = sa.account_id
WHERE sa.is_active=1 ${hasFilter ? `AND sa.subscription_id IN (${placeholders})` : ''}
ORDER BY s.display_name COLLATE NOCASE, sa.name COLLATE NOCASE
`;

  return db.prepare(query).all(...(hasFilter ? subscriptionIds : [])).map((row) => {
    const profile = parseJsonSafe(row.profile_json);
    const security = profile?.security || {};
    const network = profile?.network || {};
    const lifecycle = profile?.lifecycleManagement || {};
    const diagnostics = profile?.diagnostics || {};

    const ipRules = Array.isArray(network.ipRules) ? network.ipRules : [];
    const vnetRules = Array.isArray(network.virtualNetworkRules) ? network.virtualNetworkRules : [];
    const privateEndpoints = Array.isArray(network.privateEndpointConnections) ? network.privateEndpointConnections : [];

    return {
      subscription_id: row.subscription_id,
      subscription_name: row.subscription_name || row.subscription_id,
      account_id: row.account_id,
      account_name: row.account_name,
      last_security_scan_at: row.last_security_scan_at,
      last_error: row.last_error,
      public_network_access: security.publicNetworkAccess ?? '',
      minimum_tls_version: security.minimumTlsVersion ?? '',
      allow_blob_public_access: security.allowBlobPublicAccess ?? '',
      allow_shared_key_access: security.allowSharedKeyAccess ?? '',
      supports_https_only: security.supportsHttpsTrafficOnly ?? '',
      network_default_action: network.defaultAction ?? '',
      ip_rule_count: ipRules.length,
      ip_rules: ipRules
        .map((rule) => rule?.value || '')
        .filter(Boolean)
        .join('; '),
      vnet_rule_count: vnetRules.length,
      private_endpoint_count: privateEndpoints.length,
      lifecycle_enabled: lifecycle.enabled ?? '',
      lifecycle_total_rules: lifecycle.totalRules ?? '',
      diagnostics_setting_count: diagnostics.settingCount ?? '',
      profile_json: row.profile_json || ''
    };
  });
}

function getWasabiBucketExportRows(accountIds = []) {
  const ids = Array.isArray(accountIds)
    ? accountIds
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean)
    : [];
  const hasFilter = ids.length > 0;
  const placeholders = hasFilter ? ids.map(() => '?').join(',') : '';
  const query = `
SELECT
  wa.account_id,
  wa.display_name AS account_name,
  wa.region AS account_region,
  wb.bucket_name,
  wb.created_at,
  wb.usage_bytes,
  wb.object_count,
  wb.utilization_from_date,
  wb.utilization_to_date,
  wb.utilization_recorded_at,
  wb.last_sync_at,
  wb.last_error
FROM wasabi_buckets wb
JOIN wasabi_accounts wa ON wa.account_id = wb.account_id
WHERE wa.is_active=1 AND wb.is_active=1 ${hasFilter ? `AND LOWER(wa.account_id) IN (${placeholders})` : ''}
ORDER BY wa.display_name COLLATE NOCASE, wb.bucket_name COLLATE NOCASE
`;

  return db.prepare(query).all(...(hasFilter ? ids : []));
}

function getAwsBucketExportRows(accountIds = []) {
  const ids = Array.isArray(accountIds)
    ? accountIds
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean)
    : [];
  const hasFilter = ids.length > 0;
  const placeholders = hasFilter ? ids.map(() => '?').join(',') : '';
  const query = `
SELECT
  aa.account_id,
  aa.display_name AS account_name,
  aa.region AS account_region,
  aa.cloudwatch_region,
  ab.bucket_name,
  ab.created_at,
  ab.usage_bytes,
  ab.object_count,
  ab.egress_bytes_24h,
  ab.ingress_bytes_24h,
  ab.transactions_24h,
  ab.egress_bytes_30d,
  ab.ingress_bytes_30d,
  ab.transactions_30d,
  ab.request_metrics_available,
  ab.request_metrics_error,
  ab.size_source,
  ab.storage_type_hint,
  ab.scan_mode,
  ab.public_access_block_enabled,
  ab.block_public_acls,
  ab.ignore_public_acls,
  ab.block_public_policy,
  ab.restrict_public_buckets,
  ab.policy_is_public,
  ab.encryption_enabled,
  ab.encryption_algorithm,
  ab.kms_key_id,
  ab.versioning_status,
  ab.lifecycle_enabled,
  ab.lifecycle_rule_count,
  ab.access_logging_enabled,
  ab.access_log_target_bucket,
  ab.access_log_target_prefix,
  ab.object_lock_enabled,
  ab.ownership_controls,
  ab.last_security_scan_at,
  ab.security_error,
  ab.last_sync_at,
  ab.last_error
FROM aws_buckets ab
JOIN aws_accounts aa ON aa.account_id = ab.account_id
WHERE aa.is_active=1 AND ab.is_active=1 ${hasFilter ? `AND LOWER(aa.account_id) IN (${placeholders})` : ''}
ORDER BY aa.display_name COLLATE NOCASE, ab.bucket_name COLLATE NOCASE
`;

  return db.prepare(query).all(...(hasFilter ? ids : []));
}

app.get('/api/config', (_req, res) => {
  const safeClientId = tokenProvider.clientId
    ? `${tokenProvider.clientId.slice(0, 8)}...${tokenProvider.clientId.slice(-4)}`
    : null;
  const wasabiConfig = resolveWasabiConfig();
  const awsConfig = resolveAwsConfig();
  const vsaxConfig = resolveVsaxConfig();
  const vsaxGroupRows = normalizeVsaxGroupRows(getVsaxGroups());
  const vsaxSelectedGroups = resolveVsaxSelectedGroups({
    availableGroups: vsaxGroupRows.map((row) => row.group_name),
    requestedGroups: getSelectedVsaxGroupNames()
  });

  return res.json({
    authMode: 'service_principal',
    configured: tokenProvider.isConfigured,
    missing: tokenProvider.missing,
    azureClientId: safeClientId,
    azureTenantId: tokenProvider.tenantId || null,
    proxy: proxyInfo,
    uiPullAllConcurrency: Math.max(1, uiPullAllConcurrency),
    pricingAssumptions: getActivePricingAssumptions(),
    pricingSync: {
      ...pricingSyncState
    },
    wasabi: {
      configured: wasabiConfig.accounts.length > 0 && !wasabiConfig.error,
      configError: wasabiConfig.error,
      accountCount: wasabiConfig.accounts.length,
      syncIntervalHours: wasabiSyncIntervalHours,
      cacheTtlHours: wasabiCacheTtlHours,
      accounts: wasabiConfig.accounts.map((account) => toPublicWasabiAccount(account)),
      pricingAssumptions: getActiveWasabiPricingAssumptions(),
      pricingSync: {
        ...wasabiPricingSyncState
      }
    },
    aws: {
      configured: awsConfig.accounts.length > 0 && !awsConfig.error,
      configError: awsConfig.error,
      accountCount: awsConfig.accounts.length,
      syncIntervalHours: awsSyncIntervalHours,
      cacheTtlHours: awsCacheTtlHours,
      defaultDeepScan: awsDefaultDeepScan,
      defaultRequestMetrics: awsDefaultRequestMetrics,
      defaultSecurityScan: awsDefaultSecurityScan,
      accounts: awsConfig.accounts.map((account) => toPublicAwsAccount(account)),
      pricingAssumptions: {
        ...awsPricingAssumptions
      }
    },
    vsax: {
      configured: Boolean(vsaxConfig.config?.configured) && !vsaxConfig.error,
      configError: vsaxConfig.error,
      groupCount: vsaxGroupRows.length,
      selectedGroupCount: vsaxSelectedGroups.length,
      syncIntervalHours: vsaxSyncIntervalHours,
      cacheTtlHours: vsaxCacheTtlHours,
      groups: Array.isArray(vsaxConfig.groups) ? vsaxConfig.groups : [],
      config: toPublicVsaxConfig(vsaxConfig.config || {}),
      pricingAssumptions: {
        ...vsaxPricingAssumptions
      }
    },
    throttling: {
      accountSyncConcurrency: Math.max(1, accountSyncConcurrency),
      containerSyncConcurrency: Math.max(1, containerSyncConcurrency),
      securityCacheTtlMinutes: Math.max(1, securityCacheTtlMinutes),
      metricsCacheTtlMinutes: Math.max(1, metricsCacheTtlMinutes),
      azureMetricsSyncIntervalHours: Math.max(1, azureMetricsSyncIntervalHours),
      azureApiMaxConcurrency: Number.parseInt(process.env.AZURE_API_MAX_CONCURRENCY || '4', 10),
      azureApiMinIntervalMs: Number.parseInt(process.env.AZURE_API_MIN_INTERVAL_MS || '75', 10),
      awsApiMaxConcurrency: Math.max(1, awsThrottle.maxConcurrent),
      awsApiMinIntervalMs: Math.max(0, awsThrottle.minIntervalMs),
      awsApiRetries: Math.max(1, awsThrottle.maxRetries),
      awsAccountSyncConcurrency: Math.max(1, awsAccountSyncConcurrency),
      awsBucketSyncConcurrency: Math.max(1, awsBucketSyncConcurrency),
      vsaxApiMaxConcurrency: Math.max(1, vsaxThrottle.maxConcurrent),
      vsaxApiMinIntervalMs: Math.max(0, vsaxThrottle.minIntervalMs),
      vsaxApiRetries: Math.max(1, vsaxThrottle.maxRetries),
      vsaxGroupSyncConcurrency: Math.max(1, vsaxGroupSyncConcurrency)
    },
    logging: {
      enableDebug: loggingConfig.enableDebug,
      enableInfo: loggingConfig.enableInfo,
      enableWarn: loggingConfig.enableWarn,
      enableError: loggingConfig.enableError,
      httpRequests: loggingConfig.httpRequests,
      httpDebug: loggingConfig.httpDebug,
      json: loggingConfig.json,
      includeTimestamp: loggingConfig.includeTimestamp,
      maxValueLength: loggingConfig.maxValueLength
    }
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.get('/api/export/csv/azure/subscriptions', (req, res, next) => {
  try {
    const rows = getSubscriptions().map((subscription) => ({
      subscription_id: subscription.subscription_id,
      display_name: subscription.display_name,
      tenant_id: subscription.tenant_id,
      state: subscription.state,
      is_selected: Number(subscription.is_selected) === 1 ? 1 : 0,
      is_active: Number(subscription.is_active) === 1 ? 1 : 0,
      last_seen_at: subscription.last_seen_at
    }));

    sendCsvResponse(res, {
      filenamePrefix: 'azure-subscriptions',
      columns: ['subscription_id', 'display_name', 'tenant_id', 'state', 'is_selected', 'is_active', 'last_seen_at'],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/azure/storage-accounts', (req, res, next) => {
  try {
    const subscriptionIds = resolveExportSubscriptionIds(req.query.subscriptionIds);
    const rows = getStorageAccounts(subscriptionIds).map((account) => ({
      subscription_id: account.subscription_id,
      subscription_name: account.subscription_name || account.subscription_id,
      account_id: account.account_id,
      name: account.name,
      resource_group_name: account.resource_group_name,
      location: account.location,
      kind: account.kind,
      sku_name: account.sku_name,
      tags_json: account.tags ? JSON.stringify(account.tags) : '',
      blob_endpoint: account.blob_endpoint,
      container_count: account.container_count,
      total_size_bytes: account.total_size_bytes,
      total_blob_count: account.total_blob_count,
      last_size_scan_at: account.last_size_scan_at,
      last_security_scan_at: account.last_security_scan_at,
      last_security_error: account.last_security_error,
      metrics_used_capacity_bytes: account.metrics_used_capacity_bytes,
      metrics_egress_bytes_24h: account.metrics_egress_bytes_24h,
      metrics_egress_bytes_30d: account.metrics_egress_bytes_30d,
      metrics_ingress_bytes_24h: account.metrics_ingress_bytes_24h,
      metrics_ingress_bytes_30d: account.metrics_ingress_bytes_30d,
      metrics_transactions_24h: account.metrics_transactions_24h,
      metrics_transactions_30d: account.metrics_transactions_30d,
      metrics_last_scan_at: account.metrics_last_scan_at,
      metrics_last_error: account.metrics_last_error
    }));

    sendCsvResponse(res, {
      filenamePrefix: 'azure-storage-accounts',
      columns: [
        'subscription_id',
        'subscription_name',
        'account_id',
        'name',
        'resource_group_name',
        'location',
        'kind',
        'sku_name',
        'tags_json',
        'blob_endpoint',
        'container_count',
        'total_size_bytes',
        'total_blob_count',
        'last_size_scan_at',
        'last_security_scan_at',
        'last_security_error',
        'metrics_used_capacity_bytes',
        'metrics_egress_bytes_24h',
        'metrics_egress_bytes_30d',
        'metrics_ingress_bytes_24h',
        'metrics_ingress_bytes_30d',
        'metrics_transactions_24h',
        'metrics_transactions_30d',
        'metrics_last_scan_at',
        'metrics_last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/azure/containers', (req, res, next) => {
  try {
    const subscriptionIds = resolveExportSubscriptionIds(req.query.subscriptionIds);
    const rows = getAzureContainerExportRows(subscriptionIds);

    sendCsvResponse(res, {
      filenamePrefix: 'azure-containers',
      columns: [
        'subscription_id',
        'subscription_name',
        'account_id',
        'account_name',
        'container_name',
        'last_size_bytes',
        'blob_count',
        'last_size_scan_at',
        'last_error',
        'last_seen_at'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/azure/storage-containers', (req, res, next) => {
  try {
    const subscriptionIds = resolveExportSubscriptionIds(req.query.subscriptionIds);
    const rows = getAzureStorageContainerExportRows(subscriptionIds);

    sendCsvResponse(res, {
      filenamePrefix: 'azure-storage-containers',
      columns: [
        'subscription_id',
        'subscription_name',
        'account_id',
        'account_name',
        'resource_group_name',
        'location',
        'kind',
        'sku_name',
        'tags_json',
        'account_container_count',
        'account_total_size_bytes',
        'account_total_blob_count',
        'account_last_size_scan_at',
        'container_name',
        'container_size_bytes',
        'container_blob_count',
        'container_last_size_scan_at',
        'container_last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/azure/security', (req, res, next) => {
  try {
    const subscriptionIds = resolveExportSubscriptionIds(req.query.subscriptionIds);
    const rows = getAzureSecurityExportRows(subscriptionIds);

    sendCsvResponse(res, {
      filenamePrefix: 'azure-security',
      columns: [
        'subscription_id',
        'subscription_name',
        'account_id',
        'account_name',
        'last_security_scan_at',
        'last_error',
        'public_network_access',
        'minimum_tls_version',
        'allow_blob_public_access',
        'allow_shared_key_access',
        'supports_https_only',
        'network_default_action',
        'ip_rule_count',
        'ip_rules',
        'vnet_rule_count',
        'private_endpoint_count',
        'lifecycle_enabled',
        'lifecycle_total_rules',
        'diagnostics_setting_count',
        'profile_json'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/wasabi/accounts', (req, res, next) => {
  try {
    const accountIds = parseAccountIds(req.query.accountIds);
    const accountFilter = new Set(accountIds);
    const rows = getWasabiAccounts()
      .filter((account) => !accountFilter.size || accountFilter.has(String(account.account_id || '').trim().toLowerCase()))
      .map((account) => ({
      account_id: account.account_id,
      display_name: account.display_name,
      region: account.region,
      s3_endpoint: account.s3_endpoint,
      stats_endpoint: account.stats_endpoint,
      bucket_count: account.bucket_count,
      total_usage_bytes: account.total_usage_bytes,
      total_object_count: account.total_object_count,
      bucket_names_csv: account.bucket_names_csv || '',
      last_sync_at: account.last_sync_at,
      last_error: account.last_error
      }));

    sendCsvResponse(res, {
      filenamePrefix: 'wasabi-accounts',
      columns: [
        'account_id',
        'display_name',
        'region',
        's3_endpoint',
        'stats_endpoint',
        'bucket_count',
        'total_usage_bytes',
        'total_object_count',
        'bucket_names_csv',
        'last_sync_at',
        'last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/wasabi/buckets', (req, res, next) => {
  try {
    const accountIds = parseAccountIds(req.query.accountIds);
    const rows = getWasabiBucketExportRows(accountIds);
    sendCsvResponse(res, {
      filenamePrefix: 'wasabi-buckets',
      columns: [
        'account_id',
        'account_name',
        'account_region',
        'bucket_name',
        'created_at',
        'usage_bytes',
        'object_count',
        'utilization_from_date',
        'utilization_to_date',
        'utilization_recorded_at',
        'last_sync_at',
        'last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/aws/accounts', (req, res, next) => {
  try {
    const accountIds = parseAccountIds(req.query.accountIds);
    const filter = new Set(accountIds);
    const rows = getAwsAccounts()
      .filter((account) => !filter.size || filter.has(String(account.account_id || '').trim().toLowerCase()))
      .map((account) => ({
        account_id: account.account_id,
        display_name: account.display_name,
        region: account.region,
        cloudwatch_region: account.cloudwatch_region,
        s3_endpoint: account.s3_endpoint,
        force_path_style: Number(account.force_path_style) === 1 ? 1 : 0,
        request_metrics_enabled_default: Number(account.request_metrics_enabled_default) === 1 ? 1 : 0,
        bucket_count: account.bucket_count,
        total_usage_bytes: account.total_usage_bytes,
        total_object_count: account.total_object_count,
        total_egress_bytes_24h: account.total_egress_bytes_24h,
        total_ingress_bytes_24h: account.total_ingress_bytes_24h,
        total_transactions_24h: account.total_transactions_24h,
        total_egress_bytes_30d: account.total_egress_bytes_30d,
        total_ingress_bytes_30d: account.total_ingress_bytes_30d,
        total_transactions_30d: account.total_transactions_30d,
        security_scan_bucket_count: account.security_scan_bucket_count,
        security_error_bucket_count: account.security_error_bucket_count,
        last_security_scan_at: account.last_security_scan_at,
        bucket_names_csv: account.bucket_names_csv || '',
        last_sync_at: account.last_sync_at || account.last_bucket_sync_at,
        last_error: account.last_error
      }));

    sendCsvResponse(res, {
      filenamePrefix: 'aws-accounts',
      columns: [
        'account_id',
        'display_name',
        'region',
        'cloudwatch_region',
        's3_endpoint',
        'force_path_style',
        'request_metrics_enabled_default',
        'bucket_count',
        'total_usage_bytes',
        'total_object_count',
        'total_egress_bytes_24h',
        'total_ingress_bytes_24h',
        'total_transactions_24h',
        'total_egress_bytes_30d',
        'total_ingress_bytes_30d',
        'total_transactions_30d',
        'security_scan_bucket_count',
        'security_error_bucket_count',
        'last_security_scan_at',
        'bucket_names_csv',
        'last_sync_at',
        'last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/aws/buckets', (req, res, next) => {
  try {
    const accountIds = parseAccountIds(req.query.accountIds);
    const rows = getAwsBucketExportRows(accountIds);
    sendCsvResponse(res, {
      filenamePrefix: 'aws-buckets',
      columns: [
        'account_id',
        'account_name',
        'account_region',
        'cloudwatch_region',
        'bucket_name',
        'created_at',
        'usage_bytes',
        'object_count',
        'egress_bytes_24h',
        'ingress_bytes_24h',
        'transactions_24h',
        'egress_bytes_30d',
        'ingress_bytes_30d',
        'transactions_30d',
        'request_metrics_available',
        'request_metrics_error',
        'size_source',
        'storage_type_hint',
        'scan_mode',
        'public_access_block_enabled',
        'block_public_acls',
        'ignore_public_acls',
        'block_public_policy',
        'restrict_public_buckets',
        'policy_is_public',
        'encryption_enabled',
        'encryption_algorithm',
        'kms_key_id',
        'versioning_status',
        'lifecycle_enabled',
        'lifecycle_rule_count',
        'access_logging_enabled',
        'access_log_target_bucket',
        'access_log_target_prefix',
        'object_lock_enabled',
        'ownership_controls',
        'last_security_scan_at',
        'security_error',
        'last_sync_at',
        'last_error'
      ],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/export/csv/ip-aliases', (_req, res, next) => {
  try {
    const rows = getIpAliases();
    sendCsvResponse(res, {
      filenamePrefix: 'ip-aliases',
      columns: ['ip_address', 'server_name', 'updated_at'],
      rows
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/subscriptions/sync', async (_req, res, next) => {
  try {
    ensureServicePrincipalConfigured();
    logger.info('Subscriptions sync requested');
    const armToken = await tokenProvider.getArmToken();

    const subs = await listSubscriptions(armToken);
    upsertSubscriptions(subs);
    logger.info('Subscriptions sync completed', {
      subscriptionCount: subs.length
    });
    res.json({ subscriptions: getSubscriptions() });
  } catch (error) {
    next(error);
  }
});

app.get('/api/subscriptions', (_req, res) => {
  res.json({ subscriptions: getSubscriptions() });
});

app.post('/api/subscriptions/select', (req, res, next) => {
  try {
    const ids = parseSubscriptionIds(req.body?.subscriptionIds);
    setSelectedSubscriptions(ids);
    res.json({ selectedSubscriptionIds: getSelectedSubscriptionIds() });
  } catch (error) {
    next(error);
  }
});

app.post('/api/storage-accounts/sync', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();
    const armToken = await tokenProvider.getArmToken();

    let subscriptionIds = parseSubscriptionIds(req.body?.subscriptionIds);
    if (!subscriptionIds.length) {
      subscriptionIds = getSelectedSubscriptionIds();
    }
    if (!subscriptionIds.length) {
      return res.status(400).json({ error: 'No subscription selected.' });
    }

    logger.info('Storage account sync requested', {
      subscriptionCount: subscriptionIds.length
    });

    const results = await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
      const accounts = await listStorageAccounts(armToken, subscriptionId);
      upsertStorageAccounts(subscriptionId, accounts);
      return { subscriptionId, accountCount: accounts.length };
    });

    const errors = results.filter((r) => r?.error);
    const totalAccounts = results.filter((r) => !r?.error).reduce((sum, r) => sum + r.accountCount, 0);
    logger.info('Storage account sync completed', {
      subscriptionCount: subscriptionIds.length,
      totalAccounts,
      subscriptionErrors: errors.length
    });

    res.json({
      results,
      totalAccounts,
      errors,
      storageAccounts: getStorageAccounts(subscriptionIds)
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/storage-accounts', (req, res, next) => {
  try {
    const subscriptionIds = parseSubscriptionIds(req.query.subscriptionIds);
    const resolvedSubs = subscriptionIds.length ? subscriptionIds : getSelectedSubscriptionIds();
    res.json({ storageAccounts: getStorageAccounts(resolvedSubs) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/containers', (req, res, next) => {
  try {
    const accountId = req.query.accountId;
    if (!accountId) {
      return res.status(400).json({ error: 'accountId is required' });
    }
    res.json({ containers: getContainersForAccount(String(accountId)) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/security', (req, res, next) => {
  try {
    const accountId = req.query.accountId;
    if (!accountId) {
      return res.status(400).json({ error: 'accountId is required' });
    }
    res.json({ security: getStorageAccountSecurity(String(accountId)) });
  } catch (error) {
    next(error);
  }
});

app.post('/api/security/list', (req, res, next) => {
  try {
    const accountIds = parseSubscriptionIds(req.body?.accountIds);
    res.json({ security: getStorageAccountSecurityMany(accountIds) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/ip-aliases', (_req, res, next) => {
  try {
    res.json({ aliases: getIpAliases() });
  } catch (error) {
    next(error);
  }
});

app.post('/api/ip-aliases/import', (req, res, next) => {
  try {
    const rows = parseIpAliasRows(req.body?.rows);
    if (!rows.length) {
      return res.status(400).json({ error: 'No valid IP mapping rows provided.' });
    }

    upsertIpAliases(rows, { replace: Boolean(req.body?.replace) });
    res.json({
      imported: rows.length,
      aliases: getIpAliases()
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/wasabi/accounts', (_req, res, next) => {
  try {
    const catalog = syncWasabiAccountCatalogFromEnv({ throwOnError: false });
    if (catalog.error) {
      return res.json({
        configured: false,
        configError: catalog.error,
        accounts: [],
        pricingAssumptions: getActiveWasabiPricingAssumptions(),
        pricingSync: {
          ...wasabiPricingSyncState
        }
      });
    }
    res.json({
      configured: catalog.accounts.length > 0 && !catalog.error,
      configError: catalog.error || null,
      accounts: getWasabiAccounts(),
      pricingAssumptions: getActiveWasabiPricingAssumptions(),
      pricingSync: {
        ...wasabiPricingSyncState
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/wasabi/buckets', (req, res, next) => {
  try {
    const accountId = String(req.query.accountId || '').trim();
    if (!accountId) {
      return res.status(400).json({ error: 'accountId is required' });
    }
    res.json({
      accountId,
      buckets: getWasabiBuckets(accountId)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/wasabi/sync', async (req, res, next) => {
  try {
    logger.info('Wasabi sync endpoint requested');
    const payload = await syncWasabiAccounts({
      accountIds: parseSubscriptionIds(req.body?.accountIds),
      force: Boolean(req.body?.force)
    });

    res.json({
      ...payload,
      pricingAssumptions: getActiveWasabiPricingAssumptions(),
      pricingSync: {
        ...wasabiPricingSyncState
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/aws/accounts', (_req, res, next) => {
  try {
    const catalog = syncAwsAccountCatalogFromEnv({ throwOnError: false });
    if (catalog.error) {
      return res.json({
        configured: false,
        configError: catalog.error,
        accounts: [],
        syncIntervalHours: awsSyncIntervalHours,
        cacheTtlHours: awsCacheTtlHours,
        defaultDeepScan: awsDefaultDeepScan,
        defaultRequestMetrics: awsDefaultRequestMetrics,
        defaultSecurityScan: awsDefaultSecurityScan,
        pricingAssumptions: {
          ...awsPricingAssumptions
        }
      });
    }

    return res.json({
      configured: catalog.accounts.length > 0 && !catalog.error,
      configError: null,
      syncIntervalHours: awsSyncIntervalHours,
      cacheTtlHours: awsCacheTtlHours,
      defaultDeepScan: awsDefaultDeepScan,
      defaultRequestMetrics: awsDefaultRequestMetrics,
      defaultSecurityScan: awsDefaultSecurityScan,
      pricingAssumptions: {
        ...awsPricingAssumptions
      },
      accounts: getAwsAccounts()
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/aws/buckets', (req, res, next) => {
  try {
    const accountId = String(req.query.accountId || '').trim().toLowerCase();
    if (!accountId) {
      return res.status(400).json({ error: 'accountId is required' });
    }
    return res.json({
      accountId,
      buckets: getAwsBuckets(accountId)
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/aws/efs', (req, res, next) => {
  try {
    const accountId = String(req.query.accountId || '').trim().toLowerCase();
    if (!accountId) {
      return res.status(400).json({ error: 'accountId is required' });
    }
    return res.json({
      accountId,
      fileSystems: getAwsEfs(accountId)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/aws/sync', async (req, res, next) => {
  try {
    logger.info('AWS sync endpoint requested');
    const deepScan =
      req.body?.deepScan === undefined || req.body?.deepScan === null
        ? awsDefaultDeepScan
        : Boolean(req.body?.deepScan);
    const includeRequestMetrics =
      req.body?.includeRequestMetrics === undefined || req.body?.includeRequestMetrics === null
        ? awsDefaultRequestMetrics
        : Boolean(req.body?.includeRequestMetrics);
    const includeSecurity =
      req.body?.includeSecurity === undefined || req.body?.includeSecurity === null
        ? awsDefaultSecurityScan
        : Boolean(req.body?.includeSecurity);

    const payload = await syncAwsAccounts({
      accountIds: parseSubscriptionIds(req.body?.accountIds),
      force: Boolean(req.body?.force),
      deepScan,
      includeRequestMetrics,
      includeSecurity
    });

    return res.json({
      ...payload,
      pricingAssumptions: {
        ...awsPricingAssumptions
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/vsax/groups', async (req, res, next) => {
  try {
    const forceDiscover = parseBoolean(req.query.refreshCatalog, false);
    const catalog = await syncVsaxGroupCatalogFromEnv({ throwOnError: false, forceDiscover });
    if (catalog.error) {
      return res.json({
        configured: false,
        configError: catalog.error,
        syncIntervalHours: vsaxSyncIntervalHours,
        cacheTtlHours: vsaxCacheTtlHours,
        groups: [],
        availableGroups: [],
        selectedGroupNames: [],
        configuredGroups: [],
        catalogSource: null,
        pricingAssumptions: {
          ...vsaxPricingAssumptions
        },
        config: toPublicVsaxConfig(catalog.config || {})
      });
    }

    const allGroups = normalizeVsaxGroupRows(getVsaxGroups());
    const availableGroups = allGroups.map((row) => row.group_name);
    const selectedGroupNames = resolveVsaxSelectedGroups({
      availableGroups,
      requestedGroups: getSelectedVsaxGroupNames()
    });
    const selectedSet = new Set(selectedGroupNames);
    const visibleGroups = allGroups.filter((row) => selectedSet.has(row.group_name));

    return res.json({
      configured: true,
      configError: null,
      syncIntervalHours: vsaxSyncIntervalHours,
      cacheTtlHours: vsaxCacheTtlHours,
      configuredGroups: Array.isArray(catalog.groups) ? catalog.groups : [],
      availableGroups: allGroups,
      selectedGroupNames,
      catalogSource: catalog.catalogSource || null,
      discovery: catalog.discovery || null,
      config: toPublicVsaxConfig(catalog.config || {}),
      pricingAssumptions: {
        ...vsaxPricingAssumptions
      },
      groups: visibleGroups
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/vsax/groups/select', async (req, res, next) => {
  try {
    const catalog = await syncVsaxGroupCatalogFromEnv({ throwOnError: true, forceDiscover: false });
    const availableGroups = Array.isArray(catalog.groups) ? catalog.groups : [];
    const requestedGroups = parseGroupNames(req.body?.groupNames);

    const unknownGroups = requestedGroups.filter((groupName) => !availableGroups.includes(groupName));
    if (unknownGroups.length) {
      return res.status(400).json({
        error: `Unknown VSAx group(s): ${unknownGroups.join(', ')}`
      });
    }

    setSelectedVsaxGroups(requestedGroups);
    const selectedGroupNames = resolveVsaxSelectedGroups({
      availableGroups,
      requestedGroups: getSelectedVsaxGroupNames()
    });
    const allGroups = normalizeVsaxGroupRows(getVsaxGroups());
    const selectedSet = new Set(selectedGroupNames);

    res.json({
      selectedGroupNames,
      availableGroups: allGroups,
      groups: allGroups.filter((row) => selectedSet.has(row.group_name))
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/vsax/disks', (req, res, next) => {
  try {
    const groupName = String(req.query.groupName || '').trim();
    if (!groupName) {
      return res.status(400).json({ error: 'groupName is required' });
    }
    return res.json({
      groupName,
      disks: getVsaxDisks(groupName)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/vsax/sync', async (req, res, next) => {
  try {
    logger.info('VSAx sync endpoint requested');
    const payload = await syncVsaxGroups({
      groupNames: parseGroupNames(req.body?.groupNames),
      force: Boolean(req.body?.force)
    });

    return res.json({
      ...payload,
      pricingAssumptions: {
        ...vsaxPricingAssumptions
      }
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/security/sync-account', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    const { accountId, force } = req.body || {};
    if (!accountId || typeof accountId !== 'string') {
      return res.status(400).json({ error: 'accountId is required' });
    }

    const armToken = await tokenProvider.getArmToken();
    logger.info('Security sync requested for account', {
      accountId,
      force: Boolean(force)
    });
    const result = await syncStorageAccountSecurity({
      armToken,
      accountId,
      force: Boolean(force)
    });

    res.json({
      result,
      security: getStorageAccountSecurity(accountId),
      storageAccount: getStorageAccounts().find((a) => a.account_id === accountId) || null
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/security/sync-all', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    let subscriptionIds = parseSubscriptionIds(req.body?.subscriptionIds);
    if (!subscriptionIds.length) {
      subscriptionIds = getSelectedSubscriptionIds();
    }
    if (!subscriptionIds.length) {
      return res.status(400).json({ error: 'No subscription selected.' });
    }

    logger.info('Security sync-all requested', {
      subscriptionCount: subscriptionIds.length,
      force: Boolean(req.body?.force)
    });

    const armToken = await tokenProvider.getArmToken();

    await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
      const accounts = await listStorageAccounts(armToken, subscriptionId);
      upsertStorageAccounts(subscriptionId, accounts);
      return true;
    });

    const accounts = getStorageAccounts(subscriptionIds);
    const accountResults = await mapWithConcurrency(accounts, accountSyncConcurrency, async (account) => {
      return syncStorageAccountSecurity({
        armToken,
        accountId: account.account_id,
        force: Boolean(req.body?.force)
      });
    });

    const failed = accountResults.filter((result) => result?.hadError).length;
    const scanned = accountResults.filter((result) => result?.scanned && !result?.skipped).length;
    const skipped = accountResults.filter((result) => result?.skipped).length;
    logger.info('Security sync-all completed', {
      accountCount: accounts.length,
      scannedAccounts: scanned,
      skippedAccounts: skipped,
      failedAccounts: failed
    });

    res.json({
      summary: {
        accountCount: accounts.length,
        scannedAccounts: scanned,
        skippedAccounts: skipped,
        failedAccounts: failed
      },
      accountResults,
      storageAccounts: getStorageAccounts(subscriptionIds)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/metrics/sync-all', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    let subscriptionIds = parseSubscriptionIds(req.body?.subscriptionIds);
    if (!subscriptionIds.length) {
      subscriptionIds = getSelectedSubscriptionIds();
    }
    if (!subscriptionIds.length) {
      return res.status(400).json({ error: 'No subscription selected.' });
    }

    logger.info('Metrics sync-all requested', {
      subscriptionCount: subscriptionIds.length,
      force: Boolean(req.body?.force)
    });

    const armToken = await tokenProvider.getArmToken();

    await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
      const accounts = await listStorageAccounts(armToken, subscriptionId);
      upsertStorageAccounts(subscriptionId, accounts);
      return true;
    });

    const accounts = getStorageAccounts(subscriptionIds);
    const accountResults = await mapWithConcurrency(accounts, accountSyncConcurrency, async (account) => {
      return syncStorageAccountMetrics({
        armToken,
        accountId: account.account_id,
        force: Boolean(req.body?.force)
      });
    });

    const failed = accountResults.filter((result) => result?.hadError).length;
    const scanned = accountResults.filter((result) => result?.scanned && !result?.skipped).length;
    const skipped = accountResults.filter((result) => result?.skipped).length;
    logger.info('Metrics sync-all completed', {
      accountCount: accounts.length,
      scannedAccounts: scanned,
      skippedAccounts: skipped,
      failedAccounts: failed
    });

    res.json({
      summary: {
        accountCount: accounts.length,
        scannedAccounts: scanned,
        skippedAccounts: skipped,
        failedAccounts: failed
      },
      accountResults,
      storageAccounts: getStorageAccounts(subscriptionIds)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/containers/sync-account', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    const { accountId, force } = req.body || {};
    if (!accountId || typeof accountId !== 'string') {
      return res.status(400).json({ error: 'accountId is required' });
    }

    const [armToken, storageToken] = await Promise.all([
      tokenProvider.getArmToken(),
      tokenProvider.getStorageToken()
    ]);

    logger.info('Container sync requested for account', {
      accountId,
      force: Boolean(force)
    });

    const result = await syncAccountContainersAndSizes({
      armToken,
      storageToken,
      accountId,
      force: Boolean(force)
    });

    res.json({
      result,
      containers: getContainersForAccount(accountId),
      storageAccount: getStorageAccounts().find((a) => a.account_id === accountId) || null
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/jobs/pull-all/start', (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    const running = getRunningPullAllJob();
    if (running) {
      return res.status(409).json({
        error: 'A pull-all job is already running.',
        job: formatJobPayload(running)
      });
    }

    const job = createPullAllJob({
      subscriptionIds: parseSubscriptionIds(req.body?.subscriptionIds),
      force: Boolean(req.body?.force)
    });
    addPullAllJob(job);
    logger.info('Pull-all job created', {
      jobId: job.id,
      force: job.force,
      subscriptionCount: job.subscriptionIds.length
    });

    // Run in the background so refresh/navigation does not stop processing.
    void runPullAllJob(job);

    return res.status(202).json({ job: formatJobPayload(job) });
  } catch (error) {
    next(error);
  }
});

app.get('/api/jobs/pull-all/status', (req, res) => {
  const jobId = typeof req.query.jobId === 'string' ? req.query.jobId : '';
  const job = jobId ? pullAllJobs.find((candidate) => candidate.id === jobId) || null : getLatestPullAllJob();
  res.json({ job: formatJobPayload(job) });
});

app.post('/api/containers/sync-all', async (req, res, next) => {
  try {
    ensureServicePrincipalConfigured();

    let subscriptionIds = parseSubscriptionIds(req.body?.subscriptionIds);
    if (!subscriptionIds.length) {
      subscriptionIds = getSelectedSubscriptionIds();
    }
    if (!subscriptionIds.length) {
      return res.status(400).json({ error: 'No subscription selected.' });
    }

    logger.info('Container sync-all requested', {
      subscriptionCount: subscriptionIds.length,
      force: Boolean(req.body?.force)
    });

    const [armToken, storageToken] = await Promise.all([
      tokenProvider.getArmToken(),
      tokenProvider.getStorageToken()
    ]);

    await mapWithConcurrency(subscriptionIds, accountSyncConcurrency, async (subscriptionId) => {
      const accounts = await listStorageAccounts(armToken, subscriptionId);
      upsertStorageAccounts(subscriptionId, accounts);
      return true;
    });

    const accounts = getStorageAccounts(subscriptionIds);
    const accountResults = await mapWithConcurrency(accounts, accountSyncConcurrency, async (account) => {
      return syncAccountContainersAndSizes({
        armToken,
        storageToken,
        accountId: account.account_id,
        force: Boolean(req.body?.force)
      });
    });

    const errors = accountResults.filter((r) => r?.error);
    const summary = {
      accountCount: accounts.length,
      failedAccounts: errors.length,
      metricsErrorAccounts: accountResults.filter((r) => r?.metricsHadError).length,
      scannedContainers: accountResults
        .filter((r) => !r?.error)
        .reduce((sum, r) => sum + (r.scanned || 0), 0),
      skippedContainers: accountResults
        .filter((r) => !r?.error)
        .reduce((sum, r) => sum + (r.skipped || 0), 0)
    };
    logger.info('Container sync-all completed', summary);

    res.json({
      summary,
      accountResults,
      storageAccounts: getStorageAccounts(subscriptionIds)
    });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, _next) => {
  const status = err.statusCode || 500;
  const meta = {
    method: req.method,
    path: req.originalUrl,
    statusCode: status,
    error: err.message || 'Unexpected error'
  };
  if (status >= 500) {
    logger.error('Unhandled request error', {
      ...meta,
      stack: err.stack || null
    });
  } else {
    logger.warn('Handled request error', meta);
  }
  res.status(status).json({
    error: err.message || 'Unexpected error'
  });
});

app.listen(port, () => {
  logger.info('CloudStorageStudio listening', {
    url: `http://localhost:${port}`
  });
  if (proxyInfo.enabled) {
    logger.info('Azure outbound proxy enabled', {
      proxy: proxyInfo.proxy
    });
  } else if (proxyInfo.error) {
    logger.warn('Azure outbound proxy not enabled due to configuration error', {
      error: proxyInfo.error
    });
  }
  logger.info('Pricing sync configured', {
    profile: pricingProfileName,
    region: pricingArmRegionName,
    intervalHours: pricingSyncIntervalHours
  });
  logger.info('Azure metrics sync configured', {
    intervalHours: azureMetricsSyncIntervalHours,
    force: true
  });
  logger.info('Wasabi pricing sync configured', {
    profile: wasabiPricingProfileName,
    source: wasabiPricingSourceUrl,
    intervalHours: wasabiPricingSyncIntervalHours
  });
  logger.info('Wasabi sync configured', {
    intervalHours: wasabiSyncIntervalHours,
    cacheTtlHours: wasabiCacheTtlHours,
    accountWorkers: wasabiAccountSyncConcurrency,
    bucketWorkers: wasabiBucketSyncConcurrency
  });
  logger.info('AWS sync configured', {
    intervalHours: awsSyncIntervalHours,
    cacheTtlHours: awsCacheTtlHours,
    accountWorkers: awsAccountSyncConcurrency,
    bucketWorkers: awsBucketSyncConcurrency,
    apiMaxConcurrency: awsThrottle.maxConcurrent,
    apiMinIntervalMs: awsThrottle.minIntervalMs,
    apiRetries: awsThrottle.maxRetries,
    defaultDeepScan: awsDefaultDeepScan,
    defaultRequestMetrics: awsDefaultRequestMetrics,
    defaultSecurityScan: awsDefaultSecurityScan
  });
  logger.info('VSAx sync configured', {
    intervalHours: vsaxSyncIntervalHours,
    cacheTtlHours: vsaxCacheTtlHours,
    groupWorkers: vsaxGroupSyncConcurrency,
    apiMaxConcurrency: vsaxThrottle.maxConcurrent,
    apiMinIntervalMs: vsaxThrottle.minIntervalMs,
    apiRetries: vsaxThrottle.maxRetries
  });
  logger.info('Log settings', {
    enableDebug: loggingConfig.enableDebug,
    enableInfo: loggingConfig.enableInfo,
    enableWarn: loggingConfig.enableWarn,
    enableError: loggingConfig.enableError,
    httpRequests: loggingConfig.httpRequests,
    httpDebug: loggingConfig.httpDebug,
    json: loggingConfig.json
  });
  startPricingSyncScheduler();
  startAzureMetricsSyncScheduler();
  startWasabiPricingSyncScheduler();
  startWasabiSyncScheduler();
  startAwsSyncScheduler();
  startVsaxSyncScheduler();
});
