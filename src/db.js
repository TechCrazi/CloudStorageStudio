const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(process.env.SQLITE_PATH || './data/cloud-storage-studio.db');
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS subscriptions (
  subscription_id TEXT PRIMARY KEY,
  display_name TEXT,
  tenant_id TEXT,
  state TEXT,
  is_selected INTEGER NOT NULL DEFAULT 1,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS storage_accounts (
  account_id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  name TEXT NOT NULL,
  resource_group_name TEXT,
  location TEXT,
  kind TEXT,
  sku_name TEXT,
  tags_json TEXT,
  blob_endpoint TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_account_sync_at TEXT,
  metrics_used_capacity_bytes INTEGER,
  metrics_egress_bytes_24h INTEGER,
  metrics_ingress_bytes_24h INTEGER,
  metrics_transactions_24h INTEGER,
  metrics_egress_bytes_30d INTEGER,
  metrics_ingress_bytes_30d INTEGER,
  metrics_transactions_30d INTEGER,
  metrics_last_scan_at TEXT,
  metrics_last_error TEXT,
  FOREIGN KEY(subscription_id) REFERENCES subscriptions(subscription_id)
);

CREATE TABLE IF NOT EXISTS containers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  container_name TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_size_bytes INTEGER,
  blob_count INTEGER,
  last_size_scan_at TEXT,
  last_error TEXT,
  UNIQUE(account_id, container_name),
  FOREIGN KEY(account_id) REFERENCES storage_accounts(account_id)
);

CREATE TABLE IF NOT EXISTS storage_account_security (
  account_id TEXT PRIMARY KEY,
  profile_json TEXT,
  last_security_scan_at TEXT,
  last_error TEXT,
  FOREIGN KEY(account_id) REFERENCES storage_accounts(account_id)
);

CREATE TABLE IF NOT EXISTS ip_aliases (
  ip_address TEXT PRIMARY KEY,
  server_name TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pricing_cache (
  provider TEXT NOT NULL,
  profile TEXT NOT NULL,
  currency TEXT,
  region_label TEXT,
  source TEXT,
  as_of_date TEXT,
  assumptions_json TEXT NOT NULL,
  synced_at TEXT NOT NULL,
  fetch_status TEXT NOT NULL DEFAULT 'ok',
  last_error TEXT,
  PRIMARY KEY(provider, profile)
);

CREATE TABLE IF NOT EXISTS wasabi_accounts (
  account_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  region TEXT,
  s3_endpoint TEXT,
  stats_endpoint TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_sync_at TEXT,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS wasabi_buckets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  created_at TEXT,
  usage_bytes INTEGER,
  object_count INTEGER,
  utilization_from_date TEXT,
  utilization_to_date TEXT,
  utilization_recorded_at TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_sync_at TEXT,
  last_error TEXT,
  UNIQUE(account_id, bucket_name),
  FOREIGN KEY(account_id) REFERENCES wasabi_accounts(account_id)
);

CREATE TABLE IF NOT EXISTS aws_accounts (
  account_id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  region TEXT,
  cloudwatch_region TEXT,
  s3_endpoint TEXT,
  force_path_style INTEGER NOT NULL DEFAULT 0,
  request_metrics_enabled_default INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_sync_at TEXT,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS aws_buckets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  created_at TEXT,
  usage_bytes INTEGER,
  object_count INTEGER,
  egress_bytes_24h INTEGER,
  ingress_bytes_24h INTEGER,
  transactions_24h INTEGER,
  egress_bytes_30d INTEGER,
  ingress_bytes_30d INTEGER,
  transactions_30d INTEGER,
  request_metrics_available INTEGER NOT NULL DEFAULT 0,
  request_metrics_error TEXT,
  size_source TEXT,
  storage_type_hint TEXT,
  scan_mode TEXT,
  public_access_block_enabled INTEGER,
  block_public_acls INTEGER,
  ignore_public_acls INTEGER,
  block_public_policy INTEGER,
  restrict_public_buckets INTEGER,
  policy_is_public INTEGER,
  encryption_enabled INTEGER,
  encryption_algorithm TEXT,
  kms_key_id TEXT,
  versioning_status TEXT,
  lifecycle_enabled INTEGER,
  lifecycle_rule_count INTEGER,
  access_logging_enabled INTEGER,
  access_log_target_bucket TEXT,
  access_log_target_prefix TEXT,
  object_lock_enabled INTEGER,
  ownership_controls TEXT,
  last_security_scan_at TEXT,
  security_error TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_sync_at TEXT,
  last_error TEXT,
  UNIQUE(account_id, bucket_name),
  FOREIGN KEY(account_id) REFERENCES aws_accounts(account_id)
);

CREATE TABLE IF NOT EXISTS aws_efs_file_systems (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT NOT NULL,
  file_system_id TEXT NOT NULL,
  name TEXT,
  region TEXT,
  lifecycle_state TEXT,
  performance_mode TEXT,
  throughput_mode TEXT,
  encrypted INTEGER,
  provisioned_throughput_mibps REAL,
  size_bytes INTEGER,
  creation_time TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  last_seen_at TEXT NOT NULL,
  last_sync_at TEXT,
  last_error TEXT,
  UNIQUE(account_id, file_system_id),
  FOREIGN KEY(account_id) REFERENCES aws_accounts(account_id)
);

CREATE INDEX IF NOT EXISTS idx_accounts_sub ON storage_accounts(subscription_id);
CREATE INDEX IF NOT EXISTS idx_containers_acc ON containers(account_id);
CREATE INDEX IF NOT EXISTS idx_ip_aliases_name ON ip_aliases(server_name);
CREATE INDEX IF NOT EXISTS idx_pricing_cache_synced ON pricing_cache(synced_at);
CREATE INDEX IF NOT EXISTS idx_wasabi_buckets_acc ON wasabi_buckets(account_id);
CREATE INDEX IF NOT EXISTS idx_wasabi_accounts_seen ON wasabi_accounts(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_aws_buckets_acc ON aws_buckets(account_id);
CREATE INDEX IF NOT EXISTS idx_aws_accounts_seen ON aws_accounts(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_aws_efs_acc ON aws_efs_file_systems(account_id);
`);

function ensureColumn(tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
}

ensureColumn('storage_accounts', 'resource_group_name', 'TEXT');
ensureColumn('storage_accounts', 'tags_json', 'TEXT');
ensureColumn('storage_accounts', 'metrics_used_capacity_bytes', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_egress_bytes_24h', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_ingress_bytes_24h', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_transactions_24h', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_egress_bytes_30d', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_ingress_bytes_30d', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_transactions_30d', 'INTEGER');
ensureColumn('storage_accounts', 'metrics_last_scan_at', 'TEXT');
ensureColumn('storage_accounts', 'metrics_last_error', 'TEXT');
ensureColumn('aws_accounts', 'cloudwatch_region', 'TEXT');
ensureColumn('aws_accounts', 's3_endpoint', 'TEXT');
ensureColumn('aws_accounts', 'force_path_style', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('aws_accounts', 'request_metrics_enabled_default', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('aws_accounts', 'last_sync_at', 'TEXT');
ensureColumn('aws_accounts', 'last_error', 'TEXT');
ensureColumn('aws_buckets', 'egress_bytes_24h', 'INTEGER');
ensureColumn('aws_buckets', 'ingress_bytes_24h', 'INTEGER');
ensureColumn('aws_buckets', 'transactions_24h', 'INTEGER');
ensureColumn('aws_buckets', 'egress_bytes_30d', 'INTEGER');
ensureColumn('aws_buckets', 'ingress_bytes_30d', 'INTEGER');
ensureColumn('aws_buckets', 'transactions_30d', 'INTEGER');
ensureColumn('aws_buckets', 'request_metrics_available', 'INTEGER NOT NULL DEFAULT 0');
ensureColumn('aws_buckets', 'request_metrics_error', 'TEXT');
ensureColumn('aws_buckets', 'size_source', 'TEXT');
ensureColumn('aws_buckets', 'storage_type_hint', 'TEXT');
ensureColumn('aws_buckets', 'scan_mode', 'TEXT');
ensureColumn('aws_buckets', 'public_access_block_enabled', 'INTEGER');
ensureColumn('aws_buckets', 'block_public_acls', 'INTEGER');
ensureColumn('aws_buckets', 'ignore_public_acls', 'INTEGER');
ensureColumn('aws_buckets', 'block_public_policy', 'INTEGER');
ensureColumn('aws_buckets', 'restrict_public_buckets', 'INTEGER');
ensureColumn('aws_buckets', 'policy_is_public', 'INTEGER');
ensureColumn('aws_buckets', 'encryption_enabled', 'INTEGER');
ensureColumn('aws_buckets', 'encryption_algorithm', 'TEXT');
ensureColumn('aws_buckets', 'kms_key_id', 'TEXT');
ensureColumn('aws_buckets', 'versioning_status', 'TEXT');
ensureColumn('aws_buckets', 'lifecycle_enabled', 'INTEGER');
ensureColumn('aws_buckets', 'lifecycle_rule_count', 'INTEGER');
ensureColumn('aws_buckets', 'access_logging_enabled', 'INTEGER');
ensureColumn('aws_buckets', 'access_log_target_bucket', 'TEXT');
ensureColumn('aws_buckets', 'access_log_target_prefix', 'TEXT');
ensureColumn('aws_buckets', 'object_lock_enabled', 'INTEGER');
ensureColumn('aws_buckets', 'ownership_controls', 'TEXT');
ensureColumn('aws_buckets', 'last_security_scan_at', 'TEXT');
ensureColumn('aws_buckets', 'security_error', 'TEXT');
ensureColumn('aws_efs_file_systems', 'name', 'TEXT');
ensureColumn('aws_efs_file_systems', 'region', 'TEXT');
ensureColumn('aws_efs_file_systems', 'lifecycle_state', 'TEXT');
ensureColumn('aws_efs_file_systems', 'performance_mode', 'TEXT');
ensureColumn('aws_efs_file_systems', 'throughput_mode', 'TEXT');
ensureColumn('aws_efs_file_systems', 'encrypted', 'INTEGER');
ensureColumn('aws_efs_file_systems', 'provisioned_throughput_mibps', 'REAL');
ensureColumn('aws_efs_file_systems', 'size_bytes', 'INTEGER');
ensureColumn('aws_efs_file_systems', 'creation_time', 'TEXT');
ensureColumn('aws_efs_file_systems', 'last_sync_at', 'TEXT');
ensureColumn('aws_efs_file_systems', 'last_error', 'TEXT');

const upsertSubscriptionStmt = db.prepare(`
INSERT INTO subscriptions (subscription_id, display_name, tenant_id, state, is_selected, is_active, last_seen_at)
VALUES (@subscription_id, @display_name, @tenant_id, @state, @is_selected, 1, @last_seen_at)
ON CONFLICT(subscription_id) DO UPDATE SET
  display_name=excluded.display_name,
  tenant_id=excluded.tenant_id,
  state=excluded.state,
  is_active=1,
  last_seen_at=excluded.last_seen_at,
  is_selected=COALESCE(subscriptions.is_selected, 1)
`);

const upsertAccountStmt = db.prepare(`
INSERT INTO storage_accounts (
  account_id, subscription_id, name, resource_group_name, location, kind, sku_name, tags_json, blob_endpoint,
  is_active, last_seen_at, last_account_sync_at
)
VALUES (
  @account_id, @subscription_id, @name, @resource_group_name, @location, @kind, @sku_name, @tags_json, @blob_endpoint,
  1, @last_seen_at, @last_account_sync_at
)
ON CONFLICT(account_id) DO UPDATE SET
  subscription_id=excluded.subscription_id,
  name=excluded.name,
  resource_group_name=excluded.resource_group_name,
  location=excluded.location,
  kind=excluded.kind,
  sku_name=excluded.sku_name,
  tags_json=excluded.tags_json,
  blob_endpoint=excluded.blob_endpoint,
  is_active=1,
  last_seen_at=excluded.last_seen_at,
  last_account_sync_at=excluded.last_account_sync_at
`);

const upsertContainerStmt = db.prepare(`
INSERT INTO containers (
  account_id, container_name, is_active, last_seen_at
)
VALUES (
  @account_id, @container_name, 1, @last_seen_at
)
ON CONFLICT(account_id, container_name) DO UPDATE SET
  is_active=1,
  last_seen_at=excluded.last_seen_at
`);

const updateContainerSizeStmt = db.prepare(`
UPDATE containers
SET last_size_bytes=@last_size_bytes,
    blob_count=@blob_count,
    last_size_scan_at=@last_size_scan_at,
    last_error=@last_error
WHERE account_id=@account_id AND container_name=@container_name
`);

const updateStorageAccountMetricsStmt = db.prepare(`
UPDATE storage_accounts
SET metrics_used_capacity_bytes=@metrics_used_capacity_bytes,
    metrics_egress_bytes_24h=@metrics_egress_bytes_24h,
    metrics_ingress_bytes_24h=@metrics_ingress_bytes_24h,
    metrics_transactions_24h=@metrics_transactions_24h,
    metrics_egress_bytes_30d=@metrics_egress_bytes_30d,
    metrics_ingress_bytes_30d=@metrics_ingress_bytes_30d,
    metrics_transactions_30d=@metrics_transactions_30d,
    metrics_last_scan_at=@metrics_last_scan_at,
    metrics_last_error=@metrics_last_error
WHERE account_id=@account_id
`);

const upsertStorageAccountSecurityStmt = db.prepare(`
INSERT INTO storage_account_security (
  account_id, profile_json, last_security_scan_at, last_error
)
VALUES (
  @account_id, @profile_json, @last_security_scan_at, @last_error
)
ON CONFLICT(account_id) DO UPDATE SET
  profile_json=excluded.profile_json,
  last_security_scan_at=excluded.last_security_scan_at,
  last_error=excluded.last_error
`);

const upsertIpAliasStmt = db.prepare(`
INSERT INTO ip_aliases (
  ip_address, server_name, updated_at
)
VALUES (
  @ip_address, @server_name, @updated_at
)
ON CONFLICT(ip_address) DO UPDATE SET
  server_name=excluded.server_name,
  updated_at=excluded.updated_at
`);

const deleteAllIpAliasesStmt = db.prepare('DELETE FROM ip_aliases');

const upsertPricingSnapshotStmt = db.prepare(`
INSERT INTO pricing_cache (
  provider, profile, currency, region_label, source, as_of_date, assumptions_json, synced_at, fetch_status, last_error
)
VALUES (
  @provider, @profile, @currency, @region_label, @source, @as_of_date, @assumptions_json, @synced_at, @fetch_status, @last_error
)
ON CONFLICT(provider, profile) DO UPDATE SET
  currency=excluded.currency,
  region_label=excluded.region_label,
  source=excluded.source,
  as_of_date=excluded.as_of_date,
  assumptions_json=excluded.assumptions_json,
  synced_at=excluded.synced_at,
  fetch_status=excluded.fetch_status,
  last_error=excluded.last_error
`);

const upsertWasabiAccountStmt = db.prepare(`
INSERT INTO wasabi_accounts (
  account_id, display_name, region, s3_endpoint, stats_endpoint, is_active, last_seen_at
)
VALUES (
  @account_id, @display_name, @region, @s3_endpoint, @stats_endpoint, 1, @last_seen_at
)
ON CONFLICT(account_id) DO UPDATE SET
  display_name=excluded.display_name,
  region=excluded.region,
  s3_endpoint=excluded.s3_endpoint,
  stats_endpoint=excluded.stats_endpoint,
  is_active=1,
  last_seen_at=excluded.last_seen_at
`);

const markWasabiAccountsInactiveStmt = db.prepare(`
UPDATE wasabi_accounts SET is_active=0 WHERE account_id IN (SELECT account_id FROM wasabi_accounts)
`);

const updateWasabiAccountSyncStmt = db.prepare(`
UPDATE wasabi_accounts
SET last_sync_at=@last_sync_at,
    last_error=@last_error
WHERE account_id=@account_id
`);

const markWasabiBucketsInactiveByAccountStmt = db.prepare(`
UPDATE wasabi_buckets SET is_active=0 WHERE account_id=@account_id
`);

const upsertWasabiBucketStmt = db.prepare(`
INSERT INTO wasabi_buckets (
  account_id,
  bucket_name,
  created_at,
  usage_bytes,
  object_count,
  utilization_from_date,
  utilization_to_date,
  utilization_recorded_at,
  is_active,
  last_seen_at,
  last_sync_at,
  last_error
)
VALUES (
  @account_id,
  @bucket_name,
  @created_at,
  @usage_bytes,
  @object_count,
  @utilization_from_date,
  @utilization_to_date,
  @utilization_recorded_at,
  1,
  @last_seen_at,
  @last_sync_at,
  @last_error
)
ON CONFLICT(account_id, bucket_name) DO UPDATE SET
  created_at=excluded.created_at,
  usage_bytes=excluded.usage_bytes,
  object_count=excluded.object_count,
  utilization_from_date=excluded.utilization_from_date,
  utilization_to_date=excluded.utilization_to_date,
  utilization_recorded_at=excluded.utilization_recorded_at,
  is_active=1,
  last_seen_at=excluded.last_seen_at,
  last_sync_at=excluded.last_sync_at,
  last_error=excluded.last_error
`);

const upsertAwsAccountStmt = db.prepare(`
INSERT INTO aws_accounts (
  account_id,
  display_name,
  region,
  cloudwatch_region,
  s3_endpoint,
  force_path_style,
  request_metrics_enabled_default,
  is_active,
  last_seen_at
)
VALUES (
  @account_id,
  @display_name,
  @region,
  @cloudwatch_region,
  @s3_endpoint,
  @force_path_style,
  @request_metrics_enabled_default,
  1,
  @last_seen_at
)
ON CONFLICT(account_id) DO UPDATE SET
  display_name=excluded.display_name,
  region=excluded.region,
  cloudwatch_region=excluded.cloudwatch_region,
  s3_endpoint=excluded.s3_endpoint,
  force_path_style=excluded.force_path_style,
  request_metrics_enabled_default=excluded.request_metrics_enabled_default,
  is_active=1,
  last_seen_at=excluded.last_seen_at
`);

const markAwsAccountsInactiveStmt = db.prepare(`
UPDATE aws_accounts SET is_active=0 WHERE account_id IN (SELECT account_id FROM aws_accounts)
`);

const updateAwsAccountSyncStmt = db.prepare(`
UPDATE aws_accounts
SET last_sync_at=@last_sync_at,
    last_error=@last_error
WHERE account_id=@account_id
`);

const markAwsBucketsInactiveByAccountStmt = db.prepare(`
UPDATE aws_buckets SET is_active=0 WHERE account_id=@account_id
`);

const upsertAwsBucketStmt = db.prepare(`
INSERT INTO aws_buckets (
  account_id,
  bucket_name,
  created_at,
  usage_bytes,
  object_count,
  egress_bytes_24h,
  ingress_bytes_24h,
  transactions_24h,
  egress_bytes_30d,
  ingress_bytes_30d,
  transactions_30d,
  request_metrics_available,
  request_metrics_error,
  size_source,
  storage_type_hint,
  scan_mode,
  public_access_block_enabled,
  block_public_acls,
  ignore_public_acls,
  block_public_policy,
  restrict_public_buckets,
  policy_is_public,
  encryption_enabled,
  encryption_algorithm,
  kms_key_id,
  versioning_status,
  lifecycle_enabled,
  lifecycle_rule_count,
  access_logging_enabled,
  access_log_target_bucket,
  access_log_target_prefix,
  object_lock_enabled,
  ownership_controls,
  last_security_scan_at,
  security_error,
  is_active,
  last_seen_at,
  last_sync_at,
  last_error
)
VALUES (
  @account_id,
  @bucket_name,
  @created_at,
  @usage_bytes,
  @object_count,
  @egress_bytes_24h,
  @ingress_bytes_24h,
  @transactions_24h,
  @egress_bytes_30d,
  @ingress_bytes_30d,
  @transactions_30d,
  @request_metrics_available,
  @request_metrics_error,
  @size_source,
  @storage_type_hint,
  @scan_mode,
  @public_access_block_enabled,
  @block_public_acls,
  @ignore_public_acls,
  @block_public_policy,
  @restrict_public_buckets,
  @policy_is_public,
  @encryption_enabled,
  @encryption_algorithm,
  @kms_key_id,
  @versioning_status,
  @lifecycle_enabled,
  @lifecycle_rule_count,
  @access_logging_enabled,
  @access_log_target_bucket,
  @access_log_target_prefix,
  @object_lock_enabled,
  @ownership_controls,
  @last_security_scan_at,
  @security_error,
  1,
  @last_seen_at,
  @last_sync_at,
  @last_error
)
ON CONFLICT(account_id, bucket_name) DO UPDATE SET
  created_at=excluded.created_at,
  usage_bytes=excluded.usage_bytes,
  object_count=excluded.object_count,
  egress_bytes_24h=excluded.egress_bytes_24h,
  ingress_bytes_24h=excluded.ingress_bytes_24h,
  transactions_24h=excluded.transactions_24h,
  egress_bytes_30d=excluded.egress_bytes_30d,
  ingress_bytes_30d=excluded.ingress_bytes_30d,
  transactions_30d=excluded.transactions_30d,
  request_metrics_available=excluded.request_metrics_available,
  request_metrics_error=excluded.request_metrics_error,
  size_source=excluded.size_source,
  storage_type_hint=excluded.storage_type_hint,
  scan_mode=excluded.scan_mode,
  public_access_block_enabled=excluded.public_access_block_enabled,
  block_public_acls=excluded.block_public_acls,
  ignore_public_acls=excluded.ignore_public_acls,
  block_public_policy=excluded.block_public_policy,
  restrict_public_buckets=excluded.restrict_public_buckets,
  policy_is_public=excluded.policy_is_public,
  encryption_enabled=excluded.encryption_enabled,
  encryption_algorithm=excluded.encryption_algorithm,
  kms_key_id=excluded.kms_key_id,
  versioning_status=excluded.versioning_status,
  lifecycle_enabled=excluded.lifecycle_enabled,
  lifecycle_rule_count=excluded.lifecycle_rule_count,
  access_logging_enabled=excluded.access_logging_enabled,
  access_log_target_bucket=excluded.access_log_target_bucket,
  access_log_target_prefix=excluded.access_log_target_prefix,
  object_lock_enabled=excluded.object_lock_enabled,
  ownership_controls=excluded.ownership_controls,
  last_security_scan_at=excluded.last_security_scan_at,
  security_error=excluded.security_error,
  is_active=1,
  last_seen_at=excluded.last_seen_at,
  last_sync_at=excluded.last_sync_at,
  last_error=excluded.last_error
`);

const markAwsEfsInactiveByAccountStmt = db.prepare(`
UPDATE aws_efs_file_systems SET is_active=0 WHERE account_id=@account_id
`);

const upsertAwsEfsStmt = db.prepare(`
INSERT INTO aws_efs_file_systems (
  account_id,
  file_system_id,
  name,
  region,
  lifecycle_state,
  performance_mode,
  throughput_mode,
  encrypted,
  provisioned_throughput_mibps,
  size_bytes,
  creation_time,
  is_active,
  last_seen_at,
  last_sync_at,
  last_error
)
VALUES (
  @account_id,
  @file_system_id,
  @name,
  @region,
  @lifecycle_state,
  @performance_mode,
  @throughput_mode,
  @encrypted,
  @provisioned_throughput_mibps,
  @size_bytes,
  @creation_time,
  1,
  @last_seen_at,
  @last_sync_at,
  @last_error
)
ON CONFLICT(account_id, file_system_id) DO UPDATE SET
  name=excluded.name,
  region=excluded.region,
  lifecycle_state=excluded.lifecycle_state,
  performance_mode=excluded.performance_mode,
  throughput_mode=excluded.throughput_mode,
  encrypted=excluded.encrypted,
  provisioned_throughput_mibps=excluded.provisioned_throughput_mibps,
  size_bytes=excluded.size_bytes,
  creation_time=excluded.creation_time,
  is_active=1,
  last_seen_at=excluded.last_seen_at,
  last_sync_at=excluded.last_sync_at,
  last_error=excluded.last_error
`);

const markSubscriptionsInactiveStmt = db.prepare(`
UPDATE subscriptions SET is_active=0 WHERE subscription_id IN (SELECT subscription_id FROM subscriptions)
`);

function nowIso() {
  return new Date().toISOString();
}

function extractResourceGroupName(accountId) {
  const parts = String(accountId || '').split('/');
  const index = parts.findIndex((part) => part.toLowerCase() === 'resourcegroups');
  if (index >= 0 && parts[index + 1]) {
    return parts[index + 1];
  }
  return null;
}

function normalizeTagsJson(tags) {
  if (!tags || typeof tags !== 'object') {
    return null;
  }
  const keys = Object.keys(tags);
  if (!keys.length) {
    return null;
  }
  return JSON.stringify(tags);
}

function upsertSubscriptions(subscriptions) {
  const seenAt = nowIso();
  const tx = db.transaction((items) => {
    markSubscriptionsInactiveStmt.run();
    for (const sub of items) {
      upsertSubscriptionStmt.run({
        subscription_id: sub.subscriptionId,
        display_name: sub.displayName || sub.subscriptionId,
        tenant_id: sub.tenantId || null,
        state: sub.state || null,
        is_selected: 1,
        last_seen_at: seenAt
      });
    }
  });
  tx(subscriptions);
}

function getSubscriptions() {
  return db.prepare(`
    SELECT subscription_id, display_name, tenant_id, state, is_selected, is_active, last_seen_at
    FROM subscriptions
    WHERE is_active=1
    ORDER BY display_name COLLATE NOCASE
  `).all();
}

function setSelectedSubscriptions(subscriptionIds) {
  const tx = db.transaction((ids) => {
    db.prepare('UPDATE subscriptions SET is_selected=0').run();
    const stmt = db.prepare('UPDATE subscriptions SET is_selected=1 WHERE subscription_id=?');
    for (const id of ids) {
      stmt.run(id);
    }
  });
  tx(subscriptionIds);
}

function getSelectedSubscriptionIds() {
  return db.prepare('SELECT subscription_id FROM subscriptions WHERE is_active=1 AND is_selected=1').all().map((r) => r.subscription_id);
}

function upsertStorageAccounts(subscriptionId, accounts) {
  const seenAt = nowIso();
  const tx = db.transaction((subId, items) => {
    db.prepare('UPDATE storage_accounts SET is_active=0 WHERE subscription_id=?').run(subId);
    for (const account of items) {
      upsertAccountStmt.run({
        account_id: account.id,
        subscription_id: subscriptionId,
        name: account.name,
        resource_group_name: extractResourceGroupName(account.id),
        location: account.location || null,
        kind: account.kind || null,
        sku_name: account.sku?.name || null,
        tags_json: normalizeTagsJson(account.tags),
        blob_endpoint: account.properties?.primaryEndpoints?.blob || null,
        last_seen_at: seenAt,
        last_account_sync_at: seenAt
      });
    }
  });
  tx(subscriptionId, accounts);
}

function getStorageAccounts(subscriptionIds = []) {
  const hasFilter = subscriptionIds.length > 0;
  const placeholders = subscriptionIds.map(() => '?').join(',');
  const query = `
SELECT
  sa.account_id,
  sa.subscription_id,
  sa.name,
  sa.resource_group_name,
  sa.location,
  sa.kind,
  sa.sku_name,
  sa.tags_json,
  sa.blob_endpoint,
  sa.last_account_sync_at,
  sa.metrics_used_capacity_bytes,
  sa.metrics_egress_bytes_24h,
  sa.metrics_ingress_bytes_24h,
  sa.metrics_transactions_24h,
  sa.metrics_egress_bytes_30d,
  sa.metrics_ingress_bytes_30d,
  sa.metrics_transactions_30d,
  sa.metrics_last_scan_at,
  sa.metrics_last_error,
  IFNULL(SUM(CASE WHEN c.is_active=1 THEN c.last_size_bytes ELSE 0 END), 0) AS total_size_bytes,
  IFNULL(SUM(CASE WHEN c.is_active=1 THEN c.blob_count ELSE 0 END), 0) AS total_blob_count,
  IFNULL(SUM(CASE WHEN c.is_active=1 THEN 1 ELSE 0 END), 0) AS container_count,
  MAX(c.last_size_scan_at) AS last_size_scan_at,
  MAX(sas.last_security_scan_at) AS last_security_scan_at,
  MAX(sas.last_error) AS last_security_error,
  s.display_name AS subscription_name
FROM storage_accounts sa
LEFT JOIN containers c ON c.account_id = sa.account_id
LEFT JOIN subscriptions s ON s.subscription_id = sa.subscription_id
LEFT JOIN storage_account_security sas ON sas.account_id = sa.account_id
WHERE sa.is_active=1 ${hasFilter ? `AND sa.subscription_id IN (${placeholders})` : ''}
GROUP BY sa.account_id
ORDER BY sa.name COLLATE NOCASE
`;
  return db.prepare(query).all(...subscriptionIds).map((row) => ({
    ...row,
    tags: parseJsonObject(row.tags_json) || {}
  }));
}

function getStorageAccountById(accountId) {
  const row = db.prepare(`
    SELECT
      account_id, subscription_id, name, resource_group_name, location, kind, sku_name, tags_json, blob_endpoint,
      last_account_sync_at,
      metrics_used_capacity_bytes,
      metrics_egress_bytes_24h,
      metrics_ingress_bytes_24h,
      metrics_transactions_24h,
      metrics_egress_bytes_30d,
      metrics_ingress_bytes_30d,
      metrics_transactions_30d,
      metrics_last_scan_at,
      metrics_last_error
    FROM storage_accounts
    WHERE account_id=? AND is_active=1
  `).get(accountId);

  if (!row) {
    return null;
  }

  return {
    ...row,
    tags: parseJsonObject(row.tags_json) || {}
  };
}

function upsertContainersForAccount(accountId, containers) {
  const seenAt = nowIso();
  const tx = db.transaction((acctId, items) => {
    db.prepare('UPDATE containers SET is_active=0 WHERE account_id=?').run(acctId);
    for (const container of items) {
      upsertContainerStmt.run({
        account_id: acctId,
        container_name: container.name,
        last_seen_at: seenAt
      });
    }
  });
  tx(accountId, containers);
}

function getContainersForAccount(accountId) {
  return db.prepare(`
    SELECT account_id, container_name, is_active, last_size_bytes, blob_count, last_size_scan_at, last_error
    FROM containers
    WHERE account_id=? AND is_active=1
    ORDER BY container_name COLLATE NOCASE
  `).all(accountId);
}

function updateContainerSize({ accountId, containerName, sizeBytes, blobCount, error }) {
  updateContainerSizeStmt.run({
    account_id: accountId,
    container_name: containerName,
    last_size_bytes: sizeBytes,
    blob_count: blobCount,
    last_size_scan_at: nowIso(),
    last_error: error || null
  });
}

function toIntegerOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.round(numeric);
}

function updateStorageAccountMetrics({
  accountId,
  usedCapacityBytes,
  totalEgressBytes24h,
  totalIngressBytes24h,
  totalTransactions24h,
  totalEgressBytes30d,
  totalIngressBytes30d,
  totalTransactions30d,
  error
}) {
  updateStorageAccountMetricsStmt.run({
    account_id: accountId,
    metrics_used_capacity_bytes: toIntegerOrNull(usedCapacityBytes),
    metrics_egress_bytes_24h: toIntegerOrNull(totalEgressBytes24h),
    metrics_ingress_bytes_24h: toIntegerOrNull(totalIngressBytes24h),
    metrics_transactions_24h: toIntegerOrNull(totalTransactions24h),
    metrics_egress_bytes_30d: toIntegerOrNull(totalEgressBytes30d),
    metrics_ingress_bytes_30d: toIntegerOrNull(totalIngressBytes30d),
    metrics_transactions_30d: toIntegerOrNull(totalTransactions30d),
    metrics_last_scan_at: nowIso(),
    metrics_last_error: error || null
  });
}

function parseJsonObject(raw) {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function normalizeIpAddress(value) {
  return String(value || '').trim().toLowerCase();
}

function upsertStorageAccountSecurity({ accountId, profile, error }) {
  upsertStorageAccountSecurityStmt.run({
    account_id: accountId,
    profile_json: profile ? JSON.stringify(profile) : null,
    last_security_scan_at: nowIso(),
    last_error: error || null
  });
}

function getStorageAccountSecurity(accountId) {
  const row = db.prepare(`
    SELECT account_id, profile_json, last_security_scan_at, last_error
    FROM storage_account_security
    WHERE account_id=?
  `).get(accountId);

  if (!row) {
    return null;
  }

  return {
    account_id: row.account_id,
    profile: parseJsonObject(row.profile_json),
    last_security_scan_at: row.last_security_scan_at,
    last_error: row.last_error
  };
}

function getStorageAccountSecurityMany(accountIds = []) {
  const ids = Array.isArray(accountIds) ? accountIds.filter(Boolean) : [];
  if (!ids.length) {
    return [];
  }

  const placeholders = ids.map(() => '?').join(',');
  const query = `
    SELECT account_id, profile_json, last_security_scan_at, last_error
    FROM storage_account_security
    WHERE account_id IN (${placeholders})
  `;

  return db
    .prepare(query)
    .all(...ids)
    .map((row) => ({
      account_id: row.account_id,
      profile: parseJsonObject(row.profile_json),
      last_security_scan_at: row.last_security_scan_at,
      last_error: row.last_error
    }));
}

function upsertIpAliases(rows = [], options = {}) {
  const entries = Array.isArray(rows) ? rows : [];
  const replace = Boolean(options?.replace);
  const updatedAt = nowIso();

  const tx = db.transaction((items, shouldReplace, now) => {
    if (shouldReplace) {
      deleteAllIpAliasesStmt.run();
    }

    for (const row of items) {
      const ipAddress = normalizeIpAddress(row?.ipAddress || row?.ip || '');
      const serverName = String(row?.serverName || row?.server_name || '').trim();
      if (!ipAddress || !serverName) {
        continue;
      }

      upsertIpAliasStmt.run({
        ip_address: ipAddress,
        server_name: serverName,
        updated_at: now
      });
    }
  });

  tx(entries, replace, updatedAt);
}

function getIpAliases() {
  return db
    .prepare(`
      SELECT ip_address, server_name, updated_at
      FROM ip_aliases
      ORDER BY ip_address
    `)
    .all();
}

function upsertWasabiAccounts(accounts = []) {
  const seenAt = nowIso();
  const items = Array.isArray(accounts) ? accounts : [];

  const tx = db.transaction((rows, timestamp) => {
    markWasabiAccountsInactiveStmt.run();
    for (const row of rows) {
      upsertWasabiAccountStmt.run({
        account_id: String(row?.accountId || row?.account_id || '').trim(),
        display_name: String(row?.displayName || row?.display_name || row?.accountId || '').trim(),
        region: row?.region || null,
        s3_endpoint: row?.s3Endpoint || row?.s3_endpoint || null,
        stats_endpoint: row?.statsEndpoint || row?.stats_endpoint || null,
        last_seen_at: timestamp
      });
    }
  });

  tx(
    items.filter((row) => {
      const accountId = String(row?.accountId || row?.account_id || '').trim();
      return Boolean(accountId);
    }),
    seenAt
  );
}

function getWasabiAccounts(accountIds = []) {
  const ids = Array.isArray(accountIds) ? accountIds.filter(Boolean) : [];
  const hasFilter = ids.length > 0;
  const placeholders = ids.map(() => '?').join(',');

  const query = `
SELECT
  wa.account_id,
  wa.display_name,
  wa.region,
  wa.s3_endpoint,
  wa.stats_endpoint,
  wa.is_active,
  wa.last_seen_at,
  wa.last_sync_at,
  wa.last_error,
  IFNULL(SUM(CASE WHEN wb.is_active=1 THEN wb.usage_bytes ELSE 0 END), 0) AS total_usage_bytes,
  IFNULL(SUM(CASE WHEN wb.is_active=1 THEN wb.object_count ELSE 0 END), 0) AS total_object_count,
  IFNULL(SUM(CASE WHEN wb.is_active=1 THEN 1 ELSE 0 END), 0) AS bucket_count,
  IFNULL(GROUP_CONCAT(CASE WHEN wb.is_active=1 THEN wb.bucket_name END, ' '), '') AS bucket_names_csv,
  MAX(wb.last_sync_at) AS last_bucket_sync_at,
  MAX(wb.last_error) AS last_bucket_error
FROM wasabi_accounts wa
LEFT JOIN wasabi_buckets wb ON wb.account_id = wa.account_id
WHERE wa.is_active=1 ${hasFilter ? `AND wa.account_id IN (${placeholders})` : ''}
GROUP BY wa.account_id
ORDER BY wa.display_name COLLATE NOCASE
`;

  return db
    .prepare(query)
    .all(...ids)
    .map((row) => ({
      ...row,
      bucket_names_csv: row.bucket_names_csv || '',
      last_error: row.last_error || row.last_bucket_error || null
    }));
}

function getWasabiAccountById(accountId) {
  if (!accountId) {
    return null;
  }
  return (
    db
      .prepare(
        `
      SELECT account_id, display_name, region, s3_endpoint, stats_endpoint, is_active, last_seen_at, last_sync_at, last_error
      FROM wasabi_accounts
      WHERE account_id=? AND is_active=1
      LIMIT 1
    `
      )
      .get(String(accountId)) || null
  );
}

function updateWasabiAccountSync({ accountId, error }) {
  updateWasabiAccountSyncStmt.run({
    account_id: String(accountId),
    last_sync_at: nowIso(),
    last_error: error || null
  });
}

function replaceWasabiBucketsForAccount(accountId, buckets = []) {
  const seenAt = nowIso();
  const syncedAt = seenAt;
  const items = Array.isArray(buckets) ? buckets : [];

  const tx = db.transaction((targetAccountId, rows, lastSeenAt, lastSyncAt) => {
    markWasabiBucketsInactiveByAccountStmt.run({ account_id: targetAccountId });

    for (const row of rows) {
      upsertWasabiBucketStmt.run({
        account_id: targetAccountId,
        bucket_name: String(row?.bucketName || row?.bucket_name || '').trim(),
        created_at: row?.createdAt || row?.created_at || null,
        usage_bytes: toIntegerOrNull(row?.usageBytes ?? row?.usage_bytes ?? 0),
        object_count: toIntegerOrNull(row?.objectCount ?? row?.object_count ?? 0),
        utilization_from_date: row?.utilizationFromDate || row?.utilization_from_date || null,
        utilization_to_date: row?.utilizationToDate || row?.utilization_to_date || null,
        utilization_recorded_at: row?.utilizationRecordedAt || row?.utilization_recorded_at || null,
        last_seen_at: lastSeenAt,
        last_sync_at: row?.lastSyncAt || row?.last_sync_at || lastSyncAt,
        last_error: row?.error || row?.last_error || null
      });
    }
  });

  tx(
    String(accountId),
    items.filter((row) => {
      const bucketName = String(row?.bucketName || row?.bucket_name || '').trim();
      return Boolean(bucketName);
    }),
    seenAt,
    syncedAt
  );
}

function getWasabiBuckets(accountId) {
  return db
    .prepare(
      `
      SELECT
        account_id,
        bucket_name,
        created_at,
        usage_bytes,
        object_count,
        utilization_from_date,
        utilization_to_date,
        utilization_recorded_at,
        is_active,
        last_seen_at,
        last_sync_at,
        last_error
      FROM wasabi_buckets
      WHERE account_id=? AND is_active=1
      ORDER BY bucket_name COLLATE NOCASE
    `
    )
    .all(String(accountId));
}

function upsertAwsAccounts(accounts = []) {
  const seenAt = nowIso();
  const items = Array.isArray(accounts) ? accounts : [];

  const tx = db.transaction((rows, timestamp) => {
    markAwsAccountsInactiveStmt.run();
    for (const row of rows) {
      upsertAwsAccountStmt.run({
        account_id: String(row?.accountId || row?.account_id || '').trim().toLowerCase(),
        display_name: String(row?.displayName || row?.display_name || row?.accountId || '').trim(),
        region: row?.region || null,
        cloudwatch_region: row?.cloudWatchRegion || row?.cloudwatch_region || null,
        s3_endpoint: row?.s3Endpoint || row?.s3_endpoint || null,
        force_path_style: Boolean(row?.forcePathStyle || row?.force_path_style) ? 1 : 0,
        request_metrics_enabled_default: Boolean(
          row?.requestMetricsEnabledByDefault || row?.request_metrics_enabled_default
        )
          ? 1
          : 0,
        last_seen_at: timestamp
      });
    }
  });

  tx(
    items.filter((row) => {
      const accountId = String(row?.accountId || row?.account_id || '').trim();
      return Boolean(accountId);
    }),
    seenAt
  );
}

function getAwsAccounts(accountIds = []) {
  const ids = Array.isArray(accountIds)
    ? accountIds
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean)
    : [];
  const hasFilter = ids.length > 0;
  const placeholders = ids.map(() => '?').join(',');

  const query = `
SELECT
  aa.account_id,
  aa.display_name,
  aa.region,
  aa.cloudwatch_region,
  aa.s3_endpoint,
  aa.force_path_style,
  aa.request_metrics_enabled_default,
  aa.is_active,
  aa.last_seen_at,
  aa.last_sync_at,
  aa.last_error,
  IFNULL(ab_agg.total_usage_bytes, 0) AS total_usage_bytes,
  IFNULL(ab_agg.total_object_count, 0) AS total_object_count,
  IFNULL(ab_agg.bucket_count, 0) AS bucket_count,
  ab_agg.total_egress_bytes_24h AS total_egress_bytes_24h,
  ab_agg.total_ingress_bytes_24h AS total_ingress_bytes_24h,
  ab_agg.total_transactions_24h AS total_transactions_24h,
  ab_agg.total_egress_bytes_30d AS total_egress_bytes_30d,
  ab_agg.total_ingress_bytes_30d AS total_ingress_bytes_30d,
  ab_agg.total_transactions_30d AS total_transactions_30d,
  ab_agg.last_bucket_sync_at AS last_bucket_sync_at,
  ab_agg.last_security_scan_at AS last_security_scan_at,
  ab_agg.last_bucket_error AS last_bucket_error,
  IFNULL(ab_agg.security_scan_bucket_count, 0) AS security_scan_bucket_count,
  IFNULL(ab_agg.security_error_bucket_count, 0) AS security_error_bucket_count,
  IFNULL(ab_agg.bucket_names_csv, '') AS bucket_names_csv,
  IFNULL(ae_agg.efs_count, 0) AS efs_count,
  IFNULL(ae_agg.total_efs_size_bytes, 0) AS total_efs_size_bytes,
  ae_agg.last_efs_sync_at AS last_efs_sync_at,
  ae_agg.last_efs_error AS last_efs_error,
  IFNULL(ae_agg.efs_names_csv, '') AS efs_names_csv
FROM aws_accounts aa
LEFT JOIN (
  SELECT
    account_id,
    IFNULL(SUM(CASE WHEN is_active=1 THEN usage_bytes ELSE 0 END), 0) AS total_usage_bytes,
    IFNULL(SUM(CASE WHEN is_active=1 THEN object_count ELSE 0 END), 0) AS total_object_count,
    IFNULL(SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END), 0) AS bucket_count,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND egress_bytes_24h IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(egress_bytes_24h, 0) ELSE 0 END)
      ELSE NULL
    END AS total_egress_bytes_24h,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND ingress_bytes_24h IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(ingress_bytes_24h, 0) ELSE 0 END)
      ELSE NULL
    END AS total_ingress_bytes_24h,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND transactions_24h IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(transactions_24h, 0) ELSE 0 END)
      ELSE NULL
    END AS total_transactions_24h,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND egress_bytes_30d IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(egress_bytes_30d, 0) ELSE 0 END)
      ELSE NULL
    END AS total_egress_bytes_30d,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND ingress_bytes_30d IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(ingress_bytes_30d, 0) ELSE 0 END)
      ELSE NULL
    END AS total_ingress_bytes_30d,
    CASE
      WHEN SUM(CASE WHEN is_active=1 AND transactions_30d IS NOT NULL THEN 1 ELSE 0 END) > 0
        THEN SUM(CASE WHEN is_active=1 THEN IFNULL(transactions_30d, 0) ELSE 0 END)
      ELSE NULL
    END AS total_transactions_30d,
    MAX(CASE WHEN is_active=1 THEN last_sync_at ELSE NULL END) AS last_bucket_sync_at,
    MAX(CASE WHEN is_active=1 THEN last_security_scan_at ELSE NULL END) AS last_security_scan_at,
    MAX(CASE WHEN is_active=1 THEN last_error ELSE NULL END) AS last_bucket_error,
    IFNULL(SUM(CASE WHEN is_active=1 AND last_security_scan_at IS NOT NULL THEN 1 ELSE 0 END), 0) AS security_scan_bucket_count,
    IFNULL(SUM(CASE WHEN is_active=1 AND security_error IS NOT NULL AND security_error <> '' THEN 1 ELSE 0 END), 0) AS security_error_bucket_count,
    IFNULL(GROUP_CONCAT(CASE WHEN is_active=1 THEN bucket_name END, ' '), '') AS bucket_names_csv
  FROM aws_buckets
  GROUP BY account_id
) ab_agg ON ab_agg.account_id = aa.account_id
LEFT JOIN (
  SELECT
    account_id,
    IFNULL(SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END), 0) AS efs_count,
    IFNULL(SUM(CASE WHEN is_active=1 THEN IFNULL(size_bytes, 0) ELSE 0 END), 0) AS total_efs_size_bytes,
    MAX(CASE WHEN is_active=1 THEN last_sync_at ELSE NULL END) AS last_efs_sync_at,
    MAX(CASE WHEN is_active=1 THEN last_error ELSE NULL END) AS last_efs_error,
    IFNULL(GROUP_CONCAT(CASE WHEN is_active=1 THEN COALESCE(name, file_system_id) END, ' '), '') AS efs_names_csv
  FROM aws_efs_file_systems
  GROUP BY account_id
) ae_agg ON ae_agg.account_id = aa.account_id
WHERE aa.is_active=1 ${hasFilter ? `AND LOWER(aa.account_id) IN (${placeholders})` : ''}
ORDER BY aa.display_name COLLATE NOCASE
`;

  return db
    .prepare(query)
    .all(...(hasFilter ? ids : []))
    .map((row) => ({
      ...row,
      last_error: row.last_error || row.last_bucket_error || row.last_efs_error || null
    }));
}

function getAwsAccountById(accountId) {
  if (!accountId) {
    return null;
  }
  return (
    db
      .prepare(
        `
      SELECT
        account_id, display_name, region, cloudwatch_region, s3_endpoint, force_path_style,
        request_metrics_enabled_default, is_active, last_seen_at, last_sync_at, last_error
      FROM aws_accounts
      WHERE account_id=? AND is_active=1
      LIMIT 1
    `
      )
      .get(String(accountId).trim().toLowerCase()) || null
  );
}

function updateAwsAccountSync({ accountId, error }) {
  updateAwsAccountSyncStmt.run({
    account_id: String(accountId || '').trim().toLowerCase(),
    last_sync_at: nowIso(),
    last_error: error || null
  });
}

function replaceAwsBucketsForAccount(accountId, buckets = []) {
  const seenAt = nowIso();
  const syncedAt = seenAt;
  const rows = Array.isArray(buckets) ? buckets : [];
  const normalizedAccountId = String(accountId || '').trim().toLowerCase();

  const tx = db.transaction((targetAccountId, items, lastSeenAt, lastSyncAt) => {
    markAwsBucketsInactiveByAccountStmt.run({ account_id: targetAccountId });

    for (const row of items) {
      upsertAwsBucketStmt.run({
        account_id: targetAccountId,
        bucket_name: String(row?.bucketName || row?.bucket_name || '').trim(),
        created_at: row?.createdAt || row?.created_at || null,
        usage_bytes: toIntegerOrNull(row?.usageBytes ?? row?.usage_bytes ?? 0),
        object_count: toIntegerOrNull(row?.objectCount ?? row?.object_count ?? 0),
        egress_bytes_24h: toIntegerOrNull(row?.egressBytes24h ?? row?.egress_bytes_24h),
        ingress_bytes_24h: toIntegerOrNull(row?.ingressBytes24h ?? row?.ingress_bytes_24h),
        transactions_24h: toIntegerOrNull(row?.transactions24h ?? row?.transactions_24h),
        egress_bytes_30d: toIntegerOrNull(row?.egressBytes30d ?? row?.egress_bytes_30d),
        ingress_bytes_30d: toIntegerOrNull(row?.ingressBytes30d ?? row?.ingress_bytes_30d),
        transactions_30d: toIntegerOrNull(row?.transactions30d ?? row?.transactions_30d),
        request_metrics_available: row?.requestMetricsAvailable ? 1 : 0,
        request_metrics_error: row?.requestMetricsError || row?.request_metrics_error || null,
        size_source: row?.sizeSource || row?.size_source || null,
        storage_type_hint: row?.storageTypeHint || row?.storage_type_hint || null,
        scan_mode: row?.scanMode || row?.scan_mode || null,
        public_access_block_enabled:
          row?.publicAccessBlockEnabled === null || row?.publicAccessBlockEnabled === undefined
            ? null
            : row?.publicAccessBlockEnabled
              ? 1
              : 0,
        block_public_acls:
          row?.blockPublicAcls === null || row?.blockPublicAcls === undefined ? null : row?.blockPublicAcls ? 1 : 0,
        ignore_public_acls:
          row?.ignorePublicAcls === null || row?.ignorePublicAcls === undefined ? null : row?.ignorePublicAcls ? 1 : 0,
        block_public_policy:
          row?.blockPublicPolicy === null || row?.blockPublicPolicy === undefined
            ? null
            : row?.blockPublicPolicy
              ? 1
              : 0,
        restrict_public_buckets:
          row?.restrictPublicBuckets === null || row?.restrictPublicBuckets === undefined
            ? null
            : row?.restrictPublicBuckets
              ? 1
              : 0,
        policy_is_public:
          row?.policyIsPublic === null || row?.policyIsPublic === undefined ? null : row?.policyIsPublic ? 1 : 0,
        encryption_enabled:
          row?.encryptionEnabled === null || row?.encryptionEnabled === undefined ? null : row?.encryptionEnabled ? 1 : 0,
        encryption_algorithm: row?.encryptionAlgorithm || row?.encryption_algorithm || null,
        kms_key_id: row?.kmsKeyId || row?.kms_key_id || null,
        versioning_status: row?.versioningStatus || row?.versioning_status || null,
        lifecycle_enabled:
          row?.lifecycleEnabled === null || row?.lifecycleEnabled === undefined ? null : row?.lifecycleEnabled ? 1 : 0,
        lifecycle_rule_count: toIntegerOrNull(row?.lifecycleRuleCount ?? row?.lifecycle_rule_count ?? null),
        access_logging_enabled:
          row?.accessLoggingEnabled === null || row?.accessLoggingEnabled === undefined
            ? null
            : row?.accessLoggingEnabled
              ? 1
              : 0,
        access_log_target_bucket: row?.accessLogTargetBucket || row?.access_log_target_bucket || null,
        access_log_target_prefix: row?.accessLogTargetPrefix || row?.access_log_target_prefix || null,
        object_lock_enabled:
          row?.objectLockEnabled === null || row?.objectLockEnabled === undefined ? null : row?.objectLockEnabled ? 1 : 0,
        ownership_controls: row?.ownershipControls || row?.ownership_controls || null,
        last_security_scan_at: row?.lastSecurityScanAt || row?.last_security_scan_at || null,
        security_error: row?.securityError || row?.security_error || null,
        last_seen_at: lastSeenAt,
        last_sync_at: row?.lastSyncAt || row?.last_sync_at || lastSyncAt,
        last_error: row?.error || row?.last_error || null
      });
    }
  });

  tx(
    normalizedAccountId,
    rows.filter((row) => {
      const bucketName = String(row?.bucketName || row?.bucket_name || '').trim();
      return Boolean(bucketName);
    }),
    seenAt,
    syncedAt
  );
}

function getAwsBuckets(accountId) {
  return db
    .prepare(
      `
      SELECT
        account_id,
        bucket_name,
        created_at,
        usage_bytes,
        object_count,
        egress_bytes_24h,
        ingress_bytes_24h,
        transactions_24h,
        egress_bytes_30d,
        ingress_bytes_30d,
        transactions_30d,
        request_metrics_available,
        request_metrics_error,
        size_source,
        storage_type_hint,
        scan_mode,
        public_access_block_enabled,
        block_public_acls,
        ignore_public_acls,
        block_public_policy,
        restrict_public_buckets,
        policy_is_public,
        encryption_enabled,
        encryption_algorithm,
        kms_key_id,
        versioning_status,
        lifecycle_enabled,
        lifecycle_rule_count,
        access_logging_enabled,
        access_log_target_bucket,
        access_log_target_prefix,
        object_lock_enabled,
        ownership_controls,
        last_security_scan_at,
        security_error,
        is_active,
        last_seen_at,
        last_sync_at,
        last_error
      FROM aws_buckets
      WHERE account_id=? AND is_active=1
      ORDER BY bucket_name COLLATE NOCASE
    `
    )
    .all(String(accountId || '').trim().toLowerCase());
}

function replaceAwsEfsForAccount(accountId, fileSystems = []) {
  const seenAt = nowIso();
  const syncedAt = seenAt;
  const rows = Array.isArray(fileSystems) ? fileSystems : [];
  const normalizedAccountId = String(accountId || '').trim().toLowerCase();

  const tx = db.transaction((targetAccountId, items, lastSeenAt, lastSyncAt) => {
    markAwsEfsInactiveByAccountStmt.run({ account_id: targetAccountId });

    for (const row of items) {
      upsertAwsEfsStmt.run({
        account_id: targetAccountId,
        file_system_id: String(row?.fileSystemId || row?.file_system_id || '').trim(),
        name: row?.name || null,
        region: row?.region || null,
        lifecycle_state: row?.lifecycleState || row?.lifecycle_state || null,
        performance_mode: row?.performanceMode || row?.performance_mode || null,
        throughput_mode: row?.throughputMode || row?.throughput_mode || null,
        encrypted: row?.encrypted === null || row?.encrypted === undefined ? null : row?.encrypted ? 1 : 0,
        provisioned_throughput_mibps: row?.provisionedThroughputInMibps ?? row?.provisioned_throughput_mibps ?? null,
        size_bytes: toIntegerOrNull(row?.sizeBytes ?? row?.size_bytes ?? null),
        creation_time: row?.creationTime || row?.creation_time || null,
        last_seen_at: lastSeenAt,
        last_sync_at: row?.lastSyncAt || row?.last_sync_at || lastSyncAt,
        last_error: row?.error || row?.last_error || null
      });
    }
  });

  tx(
    normalizedAccountId,
    rows.filter((row) => {
      const fileSystemId = String(row?.fileSystemId || row?.file_system_id || '').trim();
      return Boolean(fileSystemId);
    }),
    seenAt,
    syncedAt
  );
}

function getAwsEfs(accountId) {
  return db
    .prepare(
      `
      SELECT
        account_id,
        file_system_id,
        name,
        region,
        lifecycle_state,
        performance_mode,
        throughput_mode,
        encrypted,
        provisioned_throughput_mibps,
        size_bytes,
        creation_time,
        is_active,
        last_seen_at,
        last_sync_at,
        last_error
      FROM aws_efs_file_systems
      WHERE account_id=? AND is_active=1
      ORDER BY COALESCE(name, file_system_id) COLLATE NOCASE
    `
    )
    .all(String(accountId || '').trim().toLowerCase());
}

function upsertPricingSnapshot({
  provider,
  profile,
  assumptions,
  currency,
  regionLabel,
  source,
  asOfDate,
  syncedAt,
  fetchStatus,
  lastError
}) {
  upsertPricingSnapshotStmt.run({
    provider: String(provider || '').trim().toLowerCase(),
    profile: String(profile || '').trim().toLowerCase(),
    currency: currency || null,
    region_label: regionLabel || null,
    source: source || null,
    as_of_date: asOfDate || null,
    assumptions_json: JSON.stringify(assumptions || {}),
    synced_at: syncedAt || nowIso(),
    fetch_status: fetchStatus || 'ok',
    last_error: lastError || null
  });
}

function getPricingSnapshot(provider, profile) {
  const row = db
    .prepare(
      `
      SELECT provider, profile, currency, region_label, source, as_of_date, assumptions_json, synced_at, fetch_status, last_error
      FROM pricing_cache
      WHERE provider=? AND profile=?
      LIMIT 1
    `
    )
    .get(String(provider || '').trim().toLowerCase(), String(profile || '').trim().toLowerCase());

  if (!row) {
    return null;
  }

  return {
    provider: row.provider,
    profile: row.profile,
    currency: row.currency,
    region_label: row.region_label,
    source: row.source,
    as_of_date: row.as_of_date,
    assumptions: parseJsonObject(row.assumptions_json),
    synced_at: row.synced_at,
    fetch_status: row.fetch_status,
    last_error: row.last_error
  };
}

module.exports = {
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
  upsertPricingSnapshot,
  getPricingSnapshot
};
