const ui = {
  refreshSubsBtn: document.getElementById('refreshSubsBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  providerTabs: Array.from(document.querySelectorAll('.provider-tab[data-provider]')),
  providerPanelUnified: document.getElementById('providerPanelUnified'),
  providerPanelAzure: document.getElementById('providerPanelAzure'),
  providerPanelAws: document.getElementById('providerPanelAws'),
  providerPanelGcp: document.getElementById('providerPanelGcp'),
  providerPanelWasabi: document.getElementById('providerPanelWasabi'),
  providerPanelVsax: document.getElementById('providerPanelVsax'),
  providerPanelOther: document.getElementById('providerPanelOther'),
  unifiedStatsBody: document.getElementById('unifiedStatsBody'),
  unifiedStatsCoverage: document.getElementById('unifiedStatsCoverage'),
  unifiedPricingAssumptions: document.getElementById('unifiedPricingAssumptions'),
  ipAliasTabBtn: document.getElementById('ipAliasTabBtn'),
  ipAliasGlobalPanel: document.getElementById('ipAliasGlobalPanel'),
  azureScopeTabs: document.getElementById('azureScopeTabs'),
  azureScopeHint: document.getElementById('azureScopeHint'),
  saveSubsBtn: document.getElementById('saveSubsBtn'),
  syncAccountsBtn: document.getElementById('syncAccountsBtn'),
  pullAllBtn: document.getElementById('pullAllBtn'),
  pullAllMetricsBtn: document.getElementById('pullAllMetricsBtn'),
  pullAllSecurityBtn: document.getElementById('pullAllSecurityBtn'),
  azureExportInventoryBtn: document.getElementById('azureExportInventoryBtn'),
  azureExportSecurityBtn: document.getElementById('azureExportSecurityBtn'),
  awsLoadBtn: document.getElementById('awsLoadBtn'),
  awsSecurityLoadBtn: document.getElementById('awsSecurityLoadBtn'),
  awsDeepLoadBtn: document.getElementById('awsDeepLoadBtn'),
  awsExportAllBtn: document.getElementById('awsExportAllBtn'),
  awsContentTabs: Array.from(document.querySelectorAll('[data-aws-view]')),
  awsInventoryView: document.getElementById('awsInventoryView'),
  awsSecurityView: document.getElementById('awsSecurityView'),
  awsConfigInfo: document.getElementById('awsConfigInfo'),
  awsTotalStorage: document.getElementById('awsTotalStorage'),
  awsTotalObjects: document.getElementById('awsTotalObjects'),
  awsTotalEfsCount: document.getElementById('awsTotalEfsCount'),
  awsTotalEfsStorage: document.getElementById('awsTotalEfsStorage'),
  awsTotalEgress24h: document.getElementById('awsTotalEgress24h'),
  awsTotalIngress24h: document.getElementById('awsTotalIngress24h'),
  awsTotalTransactions24h: document.getElementById('awsTotalTransactions24h'),
  awsTotalEgress30d: document.getElementById('awsTotalEgress30d'),
  awsTotalIngress30d: document.getElementById('awsTotalIngress30d'),
  awsTotalTransactions30d: document.getElementById('awsTotalTransactions30d'),
  awsEstimatedCost24h: document.getElementById('awsEstimatedCost24h'),
  awsEstimatedCost30d: document.getElementById('awsEstimatedCost30d'),
  awsTotalsCoverage: document.getElementById('awsTotalsCoverage'),
  awsNotes: document.getElementById('awsNotes'),
  awsSearchInput: document.getElementById('awsSearchInput'),
  awsSecuritySearchInput: document.getElementById('awsSecuritySearchInput'),
  awsAccountsTableHead: document.getElementById('awsAccountsTableHead'),
  awsAccountsBody: document.getElementById('awsAccountsBody'),
  awsSecurityAccountsBody: document.getElementById('awsSecurityAccountsBody'),
  gcpLoadBtn: document.getElementById('gcpLoadBtn'),
  wasabiLoadBtn: document.getElementById('wasabiLoadBtn'),
  wasabiExportAllBtn: document.getElementById('wasabiExportAllBtn'),
  wasabiConfigInfo: document.getElementById('wasabiConfigInfo'),
  wasabiTotalStorage: document.getElementById('wasabiTotalStorage'),
  wasabiTotalObjects: document.getElementById('wasabiTotalObjects'),
  wasabiEstimatedCost24h: document.getElementById('wasabiEstimatedCost24h'),
  wasabiEstimatedCost30d: document.getElementById('wasabiEstimatedCost30d'),
  wasabiTotalsCoverage: document.getElementById('wasabiTotalsCoverage'),
  wasabiPricingAssumptions: document.getElementById('wasabiPricingAssumptions'),
  wasabiSearchInput: document.getElementById('wasabiSearchInput'),
  wasabiAccountsTableHead: document.getElementById('wasabiAccountsTableHead'),
  wasabiAccountsBody: document.getElementById('wasabiAccountsBody'),
  vsaxRefreshGroupsBtn: document.getElementById('vsaxRefreshGroupsBtn'),
  vsaxLoadBtn: document.getElementById('vsaxLoadBtn'),
  saveVsaxGroupsBtn: document.getElementById('saveVsaxGroupsBtn'),
  vsaxGroupList: document.getElementById('vsaxGroupList'),
  vsaxConfigInfo: document.getElementById('vsaxConfigInfo'),
  vsaxTotalAllocated: document.getElementById('vsaxTotalAllocated'),
  vsaxTotalUsed: document.getElementById('vsaxTotalUsed'),
  vsaxEstimatedCost24h: document.getElementById('vsaxEstimatedCost24h'),
  vsaxEstimatedCost30d: document.getElementById('vsaxEstimatedCost30d'),
  vsaxTotalsCoverage: document.getElementById('vsaxTotalsCoverage'),
  vsaxPricingAssumptions: document.getElementById('vsaxPricingAssumptions'),
  vsaxSearchInput: document.getElementById('vsaxSearchInput'),
  vsaxGroupsBody: document.getElementById('vsaxGroupsBody'),
  otherLoadBtn: document.getElementById('otherLoadBtn'),
  userInfo: document.getElementById('userInfo'),
  subsList: document.getElementById('subsList'),
  azureContentTabs: Array.from(document.querySelectorAll('[data-azure-view]')),
  azureInventoryView: document.getElementById('azureInventoryView'),
  azureSecurityView: document.getElementById('azureSecurityView'),
  ipAliasInput: document.getElementById('ipAliasInput'),
  importIpAliasBtn: document.getElementById('importIpAliasBtn'),
  reloadIpAliasBtn: document.getElementById('reloadIpAliasBtn'),
  exportIpAliasBtn: document.getElementById('exportIpAliasBtn'),
  ipAliasStatus: document.getElementById('ipAliasStatus'),
  accountSearchInput: document.getElementById('accountSearchInput'),
  securitySearchInput: document.getElementById('securitySearchInput'),
  scopeTotalUsedCap: document.getElementById('scopeTotalUsedCap'),
  scopeTotalUsedCap30d: document.getElementById('scopeTotalUsedCap30d'),
  scopeTotalEgress24h: document.getElementById('scopeTotalEgress24h'),
  scopeTotalEgress30d: document.getElementById('scopeTotalEgress30d'),
  scopeTotalIngress24h: document.getElementById('scopeTotalIngress24h'),
  scopeTotalIngress30d: document.getElementById('scopeTotalIngress30d'),
  scopeTotalTransactions24h: document.getElementById('scopeTotalTransactions24h'),
  scopeTotalTransactions30d: document.getElementById('scopeTotalTransactions30d'),
  scopeCostUsedCap24h: document.getElementById('scopeCostUsedCap24h'),
  scopeCostUsedCap30d: document.getElementById('scopeCostUsedCap30d'),
  scopeCostEgress24h: document.getElementById('scopeCostEgress24h'),
  scopeCostEgress30d: document.getElementById('scopeCostEgress30d'),
  scopeCostIngress24h: document.getElementById('scopeCostIngress24h'),
  scopeCostIngress30d: document.getElementById('scopeCostIngress30d'),
  scopeCostTransactions24h: document.getElementById('scopeCostTransactions24h'),
  scopeCostTransactions30d: document.getElementById('scopeCostTransactions30d'),
  scopeCostTotal24h: document.getElementById('scopeCostTotal24h'),
  scopeCostTotal30d: document.getElementById('scopeCostTotal30d'),
  scopeTotalsCoverage: document.getElementById('scopeTotalsCoverage'),
  scopePricingAssumptions: document.getElementById('scopePricingAssumptions'),
  accountsTableHead: document.querySelector('#azureInventoryView thead'),
  accountsBody: document.getElementById('accountsBody'),
  securityAccountsBody: document.getElementById('securityAccountsBody'),
  activityToggleBtn: document.getElementById('activityToggleBtn'),
  activityDrawer: document.getElementById('activityDrawer'),
  activityResizeHandle: document.getElementById('activityResizeHandle'),
  activityShrinkBtn: document.getElementById('activityShrinkBtn'),
  activityExpandBtn: document.getElementById('activityExpandBtn'),
  activityCloseBtn: document.getElementById('activityCloseBtn'),
  log: document.getElementById('log')
};

const state = {
  themeMode: 'gray',
  ipAliasPanelOpen: false,
  activeProvider: 'azure',
  activeAzureScope: 'all-selected',
  activeAzureView: 'inventory',
  activeAwsView: 'inventory',
  config: null,
  subscriptions: [],
  storageAccounts: [],
  containersByAccount: {},
  containerLoadErrorsByAccount: {},
  loadingContainersByAccount: {},
  expandedContainerAccountIds: new Set(),
  securityByAccount: {},
  loadingSecurityByAccount: {},
  expandedSecurityAccountIds: new Set(),
  securityPrefetchPromise: null,
  ipAliasesByAddress: {},
  accountProgress: {},
  pullAllActive: false,
  pullMetricsAllActive: false,
  pullSecurityAllActive: false,
  exportCsvActive: false,
  pullAllJobId: '',
  pullAllPollTimer: null,
  awsAccounts: [],
  awsBucketsByAccount: {},
  awsEfsByAccount: {},
  awsBucketLoadErrorsByAccount: {},
  awsEfsLoadErrorsByAccount: {},
  awsLoadingBucketsByAccount: {},
  awsLoadingEfsByAccount: {},
  expandedAwsAccountIds: new Set(),
  expandedAwsSecurityAccountIds: new Set(),
  awsSyncingAccountIds: new Set(),
  awsDeepSyncingAccountIds: new Set(),
  awsSyncAllActive: false,
  awsDeepSyncAllActive: false,
  wasabiAccounts: [],
  wasabiBucketsByAccount: {},
  wasabiBucketLoadErrorsByAccount: {},
  wasabiLoadingBucketsByAccount: {},
  expandedWasabiAccountIds: new Set(),
  wasabiSyncingAccountIds: new Set(),
  wasabiSyncAllActive: false,
  vsaxGroups: [],
  vsaxDisksByGroup: {},
  vsaxDiskLoadErrorsByGroup: {},
  vsaxLoadingDisksByGroup: {},
  expandedVsaxGroupNames: new Set(),
  vsaxSyncingGroupNames: new Set(),
  vsaxSyncAllActive: false,
  vsaxAvailableGroups: [],
  vsaxSelectedGroupNames: [],
  logLines: [],
  activityDrawerWidth: 460,
  accountSort: {
    key: 'name',
    direction: 'asc'
  },
  wasabiSort: {
    key: 'account',
    direction: 'asc'
  },
  awsSort: {
    key: 'account',
    direction: 'asc'
  }
};

const ACTIVITY_DRAWER_WIDTH_KEY = 'cloudstoragestudio.activityDrawerWidth';
const THEME_MODE_KEY = 'cloudstoragestudio.themeMode';
const IP_ALIAS_PANEL_OPEN_KEY = 'cloudstoragestudio.ipAliasPanelOpen';
const ACTIVE_PROVIDER_KEY = 'cloudstoragestudio.activeProvider';
const ACTIVE_AZURE_VIEW_KEY = 'cloudstoragestudio.activeAzureView';
const ACTIVE_AWS_VIEW_KEY = 'cloudstoragestudio.activeAwsView';
const ACTIVITY_DRAWER_WIDTH_DEFAULT = 460;
const ACTIVITY_DRAWER_WIDTH_MIN = 340;
const ACTIVITY_DRAWER_WIDTH_MAX = 1400;
const ACTIVITY_DRAWER_WIDTH_STEP = 120;
const ALLOWED_PROVIDERS = new Set(['unified', 'azure', 'aws', 'gcp', 'wasabi', 'vsax', 'other']);
const ALLOWED_AZURE_VIEWS = new Set(['inventory', 'security']);
const ALLOWED_AWS_VIEWS = new Set(['inventory', 'security']);
const ALLOWED_THEME_MODES = new Set(['gray', 'dark']);
const THEME_MODE_LABELS = {
  gray: 'Gray',
  dark: 'Dark'
};
const DEFAULT_PRICING_ASSUMPTIONS = {
  currency: 'USD',
  regionLabel: 'US East',
  source: 'https://prices.azure.com/api/retail/prices',
  asOfDate: '2026-02-13',
  bytesPerGb: 1000000000,
  daysInMonth: 30,
  storageHotLrsGbMonthTiers: [
    { upToGb: 51200, unitPrice: 0.0208 },
    { upToGb: 512000, unitPrice: 0.019968 },
    { upToGb: null, unitPrice: 0.019136 }
  ],
  egressInternetGbTiers: [
    { upToGb: 100, unitPrice: 0 },
    { upToGb: 10335, unitPrice: 0.087 },
    { upToGb: 51295, unitPrice: 0.083 },
    { upToGb: 153695, unitPrice: 0.07 },
    { upToGb: 512095, unitPrice: 0.05 },
    { upToGb: null, unitPrice: 0.05 }
  ],
  ingressPerGb: 0,
  transactionUnitSize: 10000,
  transactionUnitPrice: 0.004,
  transactionRateLabel: 'Hot Read/All Other Ops'
};

const DEFAULT_WASABI_PRICING_ASSUMPTIONS = {
  currency: 'USD',
  source: 'https://wasabi.com/pricing/faq',
  asOfDate: '2026-02-13',
  bytesPerTb: 1099511627776,
  daysInMonth: 30,
  storagePricePerTbMonth: 9,
  minimumBillableTb: 1
};

const DEFAULT_VSAX_PRICING_ASSUMPTIONS = {
  currency: 'USD',
  source: 'https://www.kaseya.com/pricing/',
  asOfDate: '2026-02-17',
  bytesPerTb: 1099511627776,
  daysInMonth: 30,
  storagePricePerTbMonth: 120
};

const DEFAULT_AWS_PRICING_ASSUMPTIONS = {
  currency: 'USD',
  regionLabel: 'US East (N. Virginia)',
  source: 'https://aws.amazon.com/s3/pricing/',
  asOfDate: '2026-02-17',
  bytesPerGb: 1073741824,
  daysInMonth: 30,
  s3StorageStandardGbMonth: 0.023,
  s3EgressPerGb: 0.09,
  s3EgressFreeGb: 0,
  s3RequestUnitSize: 1000,
  s3RequestUnitPrice: 0.0004,
  s3RequestRateLabel: 'All requests (blended estimate)',
  efsStandardGbMonth: 0.3
};

function log(message, isError = false) {
  const stamp = new Date().toLocaleTimeString();
  const line = `[${stamp}] ${message}`;
  state.logLines.unshift(line);
  state.logLines = state.logLines.slice(0, 15);
  ui.log.textContent = state.logLines.join('\n');

  if (isError) {
    console.error(message);
    setActivityDrawerOpen(true);
  }
}

function setActivityDrawerOpen(open) {
  ui.activityDrawer.classList.toggle('open', Boolean(open));
}

function isActivityDrawerCompactViewport() {
  return window.innerWidth <= 900;
}

function getActivityDrawerMaxWidth() {
  const maxByViewport = Math.max(ACTIVITY_DRAWER_WIDTH_MIN, window.innerWidth - 72);
  return Math.min(ACTIVITY_DRAWER_WIDTH_MAX, maxByViewport);
}

function getCurrentActivityDrawerWidth() {
  const measured = Math.round(ui.activityDrawer.getBoundingClientRect().width);
  if (Number.isFinite(measured) && measured > 0) {
    return measured;
  }
  return state.activityDrawerWidth || ACTIVITY_DRAWER_WIDTH_DEFAULT;
}

function applyActivityDrawerWidth(width, persist = true) {
  const numericWidth = Number(width);
  const fallback = state.activityDrawerWidth || ACTIVITY_DRAWER_WIDTH_DEFAULT;
  const next = clamp(Number.isFinite(numericWidth) ? numericWidth : fallback, ACTIVITY_DRAWER_WIDTH_MIN, getActivityDrawerMaxWidth());
  state.activityDrawerWidth = next;

  if (isActivityDrawerCompactViewport()) {
    ui.activityDrawer.style.removeProperty('--activity-drawer-width');
    return;
  }

  ui.activityDrawer.style.setProperty('--activity-drawer-width', `${next}px`);

  if (persist) {
    localStorage.setItem(ACTIVITY_DRAWER_WIDTH_KEY, String(next));
  }
}

function loadActivityDrawerWidth() {
  const raw = localStorage.getItem(ACTIVITY_DRAWER_WIDTH_KEY);
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed >= ACTIVITY_DRAWER_WIDTH_MIN) {
    state.activityDrawerWidth = parsed;
  } else {
    state.activityDrawerWidth = ACTIVITY_DRAWER_WIDTH_DEFAULT;
  }

  applyActivityDrawerWidth(state.activityDrawerWidth, false);
}

function applyThemeMode(mode, persist = true) {
  const nextMode = ALLOWED_THEME_MODES.has(mode) ? mode : 'gray';
  state.themeMode = nextMode;
  document.body.setAttribute('data-theme', nextMode);

  if (ui.themeToggleBtn) {
    const label = THEME_MODE_LABELS[nextMode] || 'Gray';
    ui.themeToggleBtn.setAttribute('aria-label', `Toggle theme: ${label.toLowerCase()} mode`);
    ui.themeToggleBtn.setAttribute('title', `Theme: ${label} (click to toggle)`);
  }

  if (persist) {
    localStorage.setItem(THEME_MODE_KEY, nextMode);
  }
}

function loadThemeMode() {
  const saved = localStorage.getItem(THEME_MODE_KEY);
  const normalized = saved === 'dark' ? 'dark' : 'gray';
  applyThemeMode(normalized, false);
}

function loadNavigationState() {
  const savedProvider = localStorage.getItem(ACTIVE_PROVIDER_KEY);
  const savedAzureView = localStorage.getItem(ACTIVE_AZURE_VIEW_KEY);
  const savedAwsView = localStorage.getItem(ACTIVE_AWS_VIEW_KEY);

  if (ALLOWED_PROVIDERS.has(savedProvider)) {
    state.activeProvider = savedProvider;
  }
  if (ALLOWED_AZURE_VIEWS.has(savedAzureView)) {
    state.activeAzureView = savedAzureView;
  }
  if (ALLOWED_AWS_VIEWS.has(savedAwsView)) {
    state.activeAwsView = savedAwsView;
  }
}

function toggleThemeMode() {
  const next = state.themeMode === 'dark' ? 'gray' : 'dark';
  applyThemeMode(next, true);
}

function setIpAliasPanelOpen(open, persist = true) {
  const isOpen = Boolean(open);
  state.ipAliasPanelOpen = isOpen;

  if (ui.ipAliasGlobalPanel) {
    ui.ipAliasGlobalPanel.hidden = !isOpen;
    ui.ipAliasGlobalPanel.classList.toggle('open', isOpen);
  }
  if (ui.ipAliasTabBtn) {
    ui.ipAliasTabBtn.classList.toggle('active', isOpen);
    ui.ipAliasTabBtn.setAttribute('aria-selected', String(isOpen));
  }

  if (persist) {
    localStorage.setItem(IP_ALIAS_PANEL_OPEN_KEY, isOpen ? '1' : '0');
  }
}

function loadIpAliasPanelState() {
  const raw = localStorage.getItem(IP_ALIAS_PANEL_OPEN_KEY);
  const isOpen = raw === '1';
  setIpAliasPanelOpen(isOpen, false);
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const order = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const normalized = bytes / 1024 ** order;
  return `${normalized.toFixed(normalized >= 10 || order === 0 ? 0 : 2)} ${units[order]}`;
}

function formatBytesOrDash(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return formatBytes(value);
}

function formatWholeNumberOrDash(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return '-';
  }
  return Math.round(numeric).toLocaleString();
}

function formatWholeNumber(value) {
  const numeric = Number(value || 0);
  if (!Number.isFinite(numeric)) {
    return '0';
  }
  return Math.max(0, Math.round(numeric)).toLocaleString();
}

function formatCurrency(value, currency = 'USD') {
  const numeric = Number(value || 0);
  const normalized = Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: normalized < 1 ? 4 : 2
    }).format(normalized);
  } catch (_error) {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: normalized < 1 ? 4 : 2
    }).format(normalized);
  }
}

function toFiniteNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeTierPricing(tiers, defaultTiers) {
  const candidate = Array.isArray(tiers) && tiers.length ? tiers : defaultTiers;
  const mapped = candidate
    .map((tier) => {
      const upToRaw = tier?.upToGb;
      const upToGb = upToRaw === null || upToRaw === undefined || upToRaw === '' ? null : Number(upToRaw);
      const unitPrice = Math.max(0, toFiniteNumber(tier?.unitPrice, 0));
      return {
        upToGb: Number.isFinite(upToGb) ? upToGb : null,
        unitPrice
      };
    })
    .sort((left, right) => {
      if (left.upToGb === null && right.upToGb === null) {
        return 0;
      }
      if (left.upToGb === null) {
        return 1;
      }
      if (right.upToGb === null) {
        return -1;
      }
      return left.upToGb - right.upToGb;
    });
  return mapped;
}

function calculateTieredCost(quantity, tiers) {
  let remaining = Math.max(0, toFiniteNumber(quantity, 0));
  if (!remaining || !Array.isArray(tiers) || !tiers.length) {
    return 0;
  }

  let previousLimit = 0;
  let totalCost = 0;

  for (const tier of tiers) {
    const limit = tier.upToGb === null ? Number.POSITIVE_INFINITY : Math.max(previousLimit, tier.upToGb);
    const availableInTier = Number.isFinite(limit) ? Math.max(0, limit - previousLimit) : remaining;
    const quantityInTier = Math.max(0, Math.min(remaining, availableInTier));

    if (quantityInTier > 0) {
      totalCost += quantityInTier * Math.max(0, toFiniteNumber(tier.unitPrice, 0));
      remaining -= quantityInTier;
    }

    previousLimit = limit;
    if (remaining <= 0) {
      break;
    }
  }

  return totalCost;
}

function toLocalDate(iso) {
  if (!iso) {
    return '-';
  }
  return new Date(iso).toLocaleString();
}

function normalizeSearch(value) {
  return String(value || '').toLowerCase().trim();
}

function normalizeIpAddress(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeIpRuleValue(rule) {
  if (rule === null || rule === undefined) {
    return '';
  }
  if (typeof rule === 'string') {
    return rule.trim();
  }
  if (typeof rule !== 'object') {
    return String(rule).trim();
  }

  const candidates = [
    rule.value,
    rule.ipAddressOrRange,
    rule.IPAddressOrRange,
    rule.ipAddress,
    rule.address,
    rule.cidr,
    rule.range
  ];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  for (const value of Object.values(rule)) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function normalizeIpRuleValues(rules) {
  if (!Array.isArray(rules)) {
    return [];
  }

  return rules
    .map((rule) => normalizeIpRuleValue(rule))
    .filter(Boolean);
}

function containsSearch(value, query) {
  return normalizeSearch(value).includes(query);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatBool(value) {
  if (value === true) {
    return 'Yes';
  }
  if (value === false) {
    return 'No';
  }
  return '-';
}

function formatText(value) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}

function formatKnownText(value, fallback = 'Unknown') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return String(value);
}

function toNullableBool(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return numeric !== 0;
  }
  const normalized = String(value).trim().toLowerCase();
  if (['true', 'yes', 'enabled', '1'].includes(normalized)) {
    return true;
  }
  if (['false', 'no', 'disabled', '0'].includes(normalized)) {
    return false;
  }
  return null;
}

function formatNullableBool(value, yesLabel = 'Yes', noLabel = 'No', unknownLabel = '-') {
  const normalized = toNullableBool(value);
  if (normalized === null) {
    return unknownLabel;
  }
  return normalized ? yesLabel : noLabel;
}

function shortenText(value, maxLength = 90) {
  const text = String(value || '');
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}...`;
}

function toTimestampOrNull(value) {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatTags(tags) {
  if (!tags || typeof tags !== 'object') {
    return '';
  }
  const entries = Object.entries(tags);
  if (!entries.length) {
    return '';
  }
  return entries
    .map(([key, value]) => `${key}=${value}`)
    .join(', ');
}

function setIpAliasStatus(message, isError = false) {
  if (!ui.ipAliasStatus) {
    return;
  }
  ui.ipAliasStatus.textContent = message;
  ui.ipAliasStatus.classList.toggle('error', Boolean(isError));
}

function ingestIpAliases(rows = []) {
  const next = {};
  for (const row of rows) {
    const ipAddress = normalizeIpAddress(row?.ip_address || row?.ipAddress || row?.ip || '');
    const serverName = String(row?.server_name || row?.serverName || '').trim();
    if (!ipAddress || !serverName) {
      continue;
    }
    next[ipAddress] = serverName;
  }
  state.ipAliasesByAddress = next;
  const count = Object.keys(next).length;
  setIpAliasStatus(count ? `Loaded ${count} IP mapping(s).` : 'No IP mappings saved yet.');
}

function resolveIpAlias(ipAddress) {
  const key = normalizeIpAddress(ipAddress);
  if (!key) {
    return '';
  }
  return state.ipAliasesByAddress[key] || '';
}

function parseIpAliasImportText(rawText) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  const invalid = [];

  for (const line of lines) {
    const splitMatch = line.match(/^([^,\t|]+)[,\t|]+(.+)$/);
    let ipAddress = '';
    let serverName = '';
    if (splitMatch) {
      ipAddress = splitMatch[1].trim();
      serverName = splitMatch[2].trim();
    } else {
      const fallback = line.match(/^(\S+)\s+(.+)$/);
      if (fallback) {
        ipAddress = fallback[1].trim();
        serverName = fallback[2].trim();
      }
    }

    if (!ipAddress || !serverName) {
      invalid.push(line);
      continue;
    }

    rows.push({ ipAddress, serverName });
  }

  return { rows, invalid };
}

function allSubscriptionIdsFromState() {
  return state.subscriptions.map((sub) => sub.subscription_id);
}

function selectedSubscriptionIdsFromState() {
  const ids = state.subscriptions.filter((sub) => Number(sub.is_selected) === 1).map((sub) => sub.subscription_id);
  return ids.length ? ids : allSubscriptionIdsFromState();
}

function selectedSubscriptionIdsFromUiOrState() {
  const ids = selectedSubscriptionIds();
  return ids.length ? ids : selectedSubscriptionIdsFromState();
}

function renderProviderPanels() {
  const panelMap = {
    unified: ui.providerPanelUnified,
    azure: ui.providerPanelAzure,
    aws: ui.providerPanelAws,
    gcp: ui.providerPanelGcp,
    wasabi: ui.providerPanelWasabi,
    vsax: ui.providerPanelVsax,
    other: ui.providerPanelOther
  };

  for (const [provider, panel] of Object.entries(panelMap)) {
    if (!panel) {
      continue;
    }
    panel.classList.toggle('provider-panel-active', provider === state.activeProvider);
  }

  for (const tab of ui.providerTabs) {
    const provider = tab.getAttribute('data-provider');
    const isActive = provider === state.activeProvider;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  }

  syncPullButtonsDisabledState();
  syncAwsButtonsDisabledState();
  syncWasabiButtonsDisabledState();
  syncVsaxButtonsDisabledState();
  renderAwsContentViews();
  renderUnifiedStats();
}

function setActiveProvider(provider, options = {}) {
  const persist = options.persist !== false;
  if (!ALLOWED_PROVIDERS.has(provider)) {
    return;
  }
  state.activeProvider = provider;
  if (persist) {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
  }
  renderProviderPanels();
  if (provider === 'aws' && !state.awsAccounts.length) {
    void refreshAwsAccountsFromCache();
  }
  if (provider === 'wasabi' && !state.wasabiAccounts.length) {
    void refreshWasabiAccountsFromCache();
  }
  if (provider === 'vsax' && !state.vsaxGroups.length) {
    void refreshVsaxGroupsFromCache();
  }
}

function buildAzureScopeTabs() {
  const selectedIds = selectedSubscriptionIdsFromUiOrState();
  const selectedSet = new Set(selectedIds);
  const selectedSubs = state.subscriptions.filter((sub) => selectedSet.has(sub.subscription_id));
  const scopedSubs = selectedSubs.length ? selectedSubs : state.subscriptions;

  const tabs = [
    {
      id: 'all-selected',
      label: selectedSubs.length ? `All selected (${selectedSubs.length})` : `All subscriptions (${scopedSubs.length})`
    }
  ];

  for (const sub of scopedSubs) {
    tabs.push({
      id: `sub:${sub.subscription_id}`,
      subscriptionId: sub.subscription_id,
      label: sub.display_name || sub.subscription_id
    });
  }

  return tabs;
}

function getAzureScopeSubscriptionIds() {
  if (state.activeAzureScope.startsWith('sub:')) {
    return [state.activeAzureScope.slice(4)];
  }

  const selectedIds = selectedSubscriptionIdsFromUiOrState();
  return selectedIds.length ? selectedIds : allSubscriptionIdsFromState();
}

function renderAzureScopeTabs() {
  if (!ui.azureScopeTabs) {
    return;
  }

  const tabs = buildAzureScopeTabs();
  if (!tabs.some((tab) => tab.id === state.activeAzureScope)) {
    state.activeAzureScope = tabs[0]?.id || 'all-selected';
  }

  ui.azureScopeTabs.innerHTML = '';
  for (const tab of tabs) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `subtab ${tab.id === state.activeAzureScope ? 'active' : ''}`;
    button.textContent = tab.label;
    button.setAttribute('data-scope-id', tab.id);
    button.title = tab.label;
    ui.azureScopeTabs.appendChild(button);
  }

  const scopeIds = getAzureScopeSubscriptionIds();
  const label =
    state.activeAzureScope === 'all-selected'
      ? `Scoped to ${scopeIds.length} selected subscription(s).`
      : `Scoped to ${tabs.find((tab) => tab.id === state.activeAzureScope)?.label || state.activeAzureScope}.`;
  ui.azureScopeHint.textContent = label;
}

function selectedSubscriptionIds() {
  return Array.from(ui.subsList.querySelectorAll('input[type="checkbox"]:checked')).map((el) => el.value);
}

function selectedVsaxGroupNames() {
  if (!ui.vsaxGroupList) {
    return [];
  }
  return Array.from(ui.vsaxGroupList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((el) => String(el.value || '').trim())
    .filter(Boolean);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(payload.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

function parseCsvFilename(contentDisposition, fallback = 'export.csv') {
  if (!contentDisposition || typeof contentDisposition !== 'string') {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1].trim().replace(/^"|"$/g, ''));
    } catch (_error) {
      // Ignore decode failures and fall through to plain filename parsing.
    }
  }

  const basicMatch = contentDisposition.match(/filename\s*=\s*"?([^\";]+)"?/i);
  if (basicMatch && basicMatch[1]) {
    return basicMatch[1].trim();
  }

  return fallback;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function downloadCsvFile(path, fallbackFilename) {
  const res = await fetch(path);
  if (!res.ok) {
    const raw = await res.text().catch(() => '');
    let message = `HTTP ${res.status}`;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.error === 'string') {
          message = parsed.error;
        }
      } catch (_error) {
        message = raw.slice(0, 240);
      }
    }
    throw new Error(message);
  }

  const blob = await res.blob();
  const filename = parseCsvFilename(res.headers.get('Content-Disposition'), fallbackFilename);
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 2000);
}

function buildExportQuery(params = {}) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      const cleaned = value.map((item) => String(item || '').trim()).filter(Boolean);
      if (cleaned.length) {
        searchParams.set(key, cleaned.join(','));
      }
      continue;
    }
    if (value === null || value === undefined || value === '') {
      continue;
    }
    searchParams.set(key, String(value));
  }

  const text = searchParams.toString();
  return text ? `?${text}` : '';
}

async function runCsvExport(actionLabel, runner, options = {}) {
  if (state.exportCsvActive) {
    throw new Error('Another CSV export is already running.');
  }

  const button = options.button || null;
  const runningLabel = options.runningLabel || 'Exporting...';
  const originalLabel = button ? button.textContent : '';

  state.exportCsvActive = true;
  if (button) {
    button.textContent = runningLabel;
  }
  syncPullButtonsDisabledState();
  syncAwsButtonsDisabledState();
  syncWasabiButtonsDisabledState();
  syncVsaxButtonsDisabledState();
  renderAwsAccounts();
  renderWasabiAccounts();
  renderVsaxGroups();

  try {
    await runner();
    log(`${actionLabel} export complete.`);
  } finally {
    state.exportCsvActive = false;
    if (button) {
      button.textContent = originalLabel;
    }
    syncPullButtonsDisabledState();
    syncAwsButtonsDisabledState();
    syncWasabiButtonsDisabledState();
    syncVsaxButtonsDisabledState();
    renderAwsAccounts();
    renderWasabiAccounts();
    renderVsaxGroups();
  }
}

async function exportAzureInventoryCsv() {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to export Azure inventory CSV files.');
  }

  await saveSubscriptionSelection();
  const subscriptionIds = selectedSubscriptionIdsFromUiOrState();
  if (!subscriptionIds.length) {
    throw new Error('No subscription selected.');
  }

  const scopeQuery = buildExportQuery({ subscriptionIds });
  await downloadCsvFile(`/api/export/csv/azure/storage-containers${scopeQuery}`, 'azure-storage-containers.csv');
  log('Exported CSV: Azure storage + containers.');
}

async function exportAzureSecurityCsv() {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to export Azure security CSV files.');
  }

  await saveSubscriptionSelection();
  const subscriptionIds = selectedSubscriptionIdsFromUiOrState();
  if (!subscriptionIds.length) {
    throw new Error('No subscription selected.');
  }

  const scopeQuery = buildExportQuery({ subscriptionIds });
  await downloadCsvFile(`/api/export/csv/azure/security${scopeQuery}`, 'azure-security.csv');
  log('Exported CSV: Azure security profiles.');
}

async function exportAwsAllCsv() {
  const configured = Boolean(state.config?.aws?.configured);
  if (!configured) {
    throw new Error('AWS is not configured.');
  }

  const exports = [
    {
      label: 'AWS accounts',
      path: '/api/export/csv/aws/accounts',
      fallbackFilename: 'aws-accounts.csv'
    },
    {
      label: 'AWS buckets',
      path: '/api/export/csv/aws/buckets',
      fallbackFilename: 'aws-buckets.csv'
    }
  ];

  for (const item of exports) {
    await downloadCsvFile(item.path, item.fallbackFilename);
    log(`Exported CSV: ${item.label}.`);
    await wait(120);
  }
}

async function exportAwsAccountCsv(accountId) {
  const id = String(accountId || '').trim();
  if (!id) {
    throw new Error('Missing AWS account id.');
  }

  const scopeQuery = buildExportQuery({ accountIds: [id] });
  const account = state.awsAccounts.find((row) => row.account_id === id);
  const displayName = account?.display_name || id;
  await downloadCsvFile(`/api/export/csv/aws/buckets${scopeQuery}`, `aws-buckets-${id}.csv`);
  log(`Exported CSV: AWS account buckets (${displayName}).`);
}

async function exportWasabiAllCsv() {
  const configured = Boolean(state.config?.wasabi?.configured);
  if (!configured) {
    throw new Error('Wasabi is not configured.');
  }

  const exports = [
    {
      label: 'Wasabi accounts',
      path: '/api/export/csv/wasabi/accounts',
      fallbackFilename: 'wasabi-accounts.csv'
    },
    {
      label: 'Wasabi buckets',
      path: '/api/export/csv/wasabi/buckets',
      fallbackFilename: 'wasabi-buckets.csv'
    }
  ];

  for (const item of exports) {
    await downloadCsvFile(item.path, item.fallbackFilename);
    log(`Exported CSV: ${item.label}.`);
    await wait(120);
  }
}

async function exportWasabiAccountCsv(accountId) {
  const id = String(accountId || '').trim();
  if (!id) {
    throw new Error('Missing Wasabi account id.');
  }

  const scopeQuery = buildExportQuery({ accountIds: [id] });
  const account = state.wasabiAccounts.find((row) => row.account_id === id);
  const displayName = account?.display_name || id;
  await downloadCsvFile(`/api/export/csv/wasabi/buckets${scopeQuery}`, `wasabi-buckets-${id}.csv`);
  log(`Exported CSV: Wasabi account buckets (${displayName}).`);
}

async function exportIpAliasCsv() {
  await downloadCsvFile('/api/export/csv/ip-aliases', 'ip-aliases.csv');
  log('Exported CSV: IP aliases.');
}

function stopPullAllPolling() {
  if (state.pullAllPollTimer) {
    clearTimeout(state.pullAllPollTimer);
    state.pullAllPollTimer = null;
  }
}

function ensureProgressEntries() {
  for (const account of state.storageAccounts) {
    if (!state.accountProgress[account.account_id]) {
      state.accountProgress[account.account_id] = {
        status: 'idle',
        percent: 0,
        label: 'Idle'
      };
    }
  }
}

function setAccountProgress(accountId, patch) {
  const existing = state.accountProgress[accountId] || {
    status: 'idle',
    percent: 0,
    label: 'Idle'
  };

  state.accountProgress[accountId] = {
    ...existing,
    ...patch
  };
}

function syncPullButtonsDisabledState() {
  const noSubscriptions = !state.subscriptions.length;
  const providerLocked = state.activeProvider !== 'azure';
  const disabled =
    providerLocked ||
    noSubscriptions ||
    state.pullAllActive ||
    state.pullMetricsAllActive ||
    state.pullSecurityAllActive ||
    state.exportCsvActive;
  ui.pullAllBtn.disabled = disabled;
  ui.pullAllMetricsBtn.disabled = disabled;
  ui.pullAllSecurityBtn.disabled = disabled;
  if (ui.azureExportInventoryBtn) {
    ui.azureExportInventoryBtn.disabled = disabled;
  }
  if (ui.azureExportSecurityBtn) {
    ui.azureExportSecurityBtn.disabled = disabled;
  }
  if (ui.exportIpAliasBtn) {
    ui.exportIpAliasBtn.disabled = state.exportCsvActive;
  }
}

function syncAwsButtonsDisabledState() {
  if (!ui.awsLoadBtn) {
    return;
  }

  const configured = Boolean(state.config?.aws?.configured);
  const disabled =
    !configured ||
    state.awsSyncAllActive ||
    state.awsDeepSyncAllActive ||
    state.awsSyncingAccountIds.size > 0 ||
    state.awsDeepSyncingAccountIds.size > 0 ||
    state.exportCsvActive;

  ui.awsLoadBtn.disabled = disabled;
  if (ui.awsSecurityLoadBtn) {
    ui.awsSecurityLoadBtn.disabled = disabled;
  }
  if (ui.awsDeepLoadBtn) {
    ui.awsDeepLoadBtn.disabled = disabled;
  }
  if (ui.awsExportAllBtn) {
    ui.awsExportAllBtn.disabled = disabled;
  }
}

function syncWasabiButtonsDisabledState() {
  if (!ui.wasabiLoadBtn) {
    return;
  }
  const configured = Boolean(state.config?.wasabi?.configured);
  const disabled =
    !configured || state.wasabiSyncAllActive || state.wasabiSyncingAccountIds.size > 0 || state.exportCsvActive;
  ui.wasabiLoadBtn.disabled = disabled;
  if (ui.wasabiExportAllBtn) {
    ui.wasabiExportAllBtn.disabled = disabled;
  }
}

function syncVsaxButtonsDisabledState() {
  if (!ui.vsaxLoadBtn) {
    return;
  }

  const configured = Boolean(state.config?.vsax?.configured);
  const isBusy = state.vsaxSyncAllActive || state.vsaxSyncingGroupNames.size > 0 || state.exportCsvActive;
  const selectedCount = selectedVsaxGroupNames().length || state.vsaxSelectedGroupNames.length;
  ui.vsaxLoadBtn.disabled = !configured || isBusy || selectedCount === 0;
  if (ui.vsaxRefreshGroupsBtn) {
    ui.vsaxRefreshGroupsBtn.disabled = !configured || isBusy;
  }
  if (ui.saveVsaxGroupsBtn) {
    ui.saveVsaxGroupsBtn.disabled = !configured || isBusy || !state.vsaxAvailableGroups.length;
  }
}

function renderSubscriptions() {
  if (!state.subscriptions.length) {
    ui.subsList.innerHTML = '<p class="muted">No subscriptions loaded yet.</p>';
    ui.saveSubsBtn.disabled = true;
    ui.syncAccountsBtn.disabled = true;
    syncPullButtonsDisabledState();
    renderAzureScopeTabs();
    renderScopeTotals();
    return;
  }

  ui.subsList.innerHTML = '';
  for (const sub of state.subscriptions) {
    const label = document.createElement('label');
    const checked = Number(sub.is_selected) === 1;
    label.innerHTML = `
      <input type="checkbox" value="${sub.subscription_id}" ${checked ? 'checked' : ''} />
      <span>${sub.display_name} (${sub.subscription_id})</span>
    `;
    ui.subsList.appendChild(label);
  }

  ui.saveSubsBtn.disabled = false;
  ui.syncAccountsBtn.disabled = false;
  syncPullButtonsDisabledState();
  renderAzureScopeTabs();
  renderScopeTotals();
}

function renderVsaxGroupSelection() {
  if (!ui.vsaxGroupList) {
    return;
  }

  const configured = Boolean(state.config?.vsax?.configured);
  const configError = state.config?.vsax?.configError || '';
  const available = Array.isArray(state.vsaxAvailableGroups) ? state.vsaxAvailableGroups : [];
  const selectedFromState = Array.isArray(state.vsaxSelectedGroupNames) ? state.vsaxSelectedGroupNames : [];
  const selectedSet = new Set(selectedFromState.map((name) => String(name || '').trim()).filter(Boolean));

  if (!configured) {
    ui.vsaxGroupList.innerHTML = `<p class="muted">${escapeHtml(
      configError || 'Configure VSAX_BASE_URL, VSAX_API_TOKEN_ID, and VSAX_API_TOKEN_SECRET to load VSAx groups.'
    )}</p>`;
    syncVsaxButtonsDisabledState();
    return;
  }

  if (!available.length) {
    ui.vsaxGroupList.innerHTML = '<p class="muted">No VSAx groups found yet. Click "Load groups".</p>';
    syncVsaxButtonsDisabledState();
    return;
  }

  ui.vsaxGroupList.innerHTML = '';
  for (const group of available) {
    const groupName = String(group?.group_name || '').trim();
    if (!groupName) {
      continue;
    }
    const checked = selectedSet.size
      ? selectedSet.has(groupName)
      : Number(group?.is_selected) === 1;
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="checkbox" value="${escapeHtml(groupName)}" ${checked ? 'checked' : ''} />
      <span>${escapeHtml(groupName)}</span>
    `;
    ui.vsaxGroupList.appendChild(label);
  }

  syncVsaxButtonsDisabledState();
}

function renderAzureContentViews() {
  const isInventory = state.activeAzureView === 'inventory';
  if (ui.azureInventoryView) {
    ui.azureInventoryView.classList.toggle('azure-content-view-active', isInventory);
  }
  if (ui.azureSecurityView) {
    ui.azureSecurityView.classList.toggle('azure-content-view-active', !isInventory);
  }

  for (const tab of ui.azureContentTabs) {
    const view = tab.getAttribute('data-azure-view') || 'inventory';
    const isActive = view === state.activeAzureView;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  }
}

function setActiveAzureView(view, options = {}) {
  const persist = options.persist !== false;
  if (!ALLOWED_AZURE_VIEWS.has(view)) {
    return;
  }
  state.activeAzureView = view;
  if (persist) {
    localStorage.setItem(ACTIVE_AZURE_VIEW_KEY, view);
  }
  renderAzureContentViews();
  if (view === 'security') {
    renderSecurityAccounts();
    void preloadSecurityForScopedAccounts(false);
  }
}

function renderAwsContentViews() {
  const isInventory = state.activeAwsView === 'inventory';
  if (ui.awsInventoryView) {
    ui.awsInventoryView.classList.toggle('azure-content-view-active', isInventory);
  }
  if (ui.awsSecurityView) {
    ui.awsSecurityView.classList.toggle('azure-content-view-active', !isInventory);
  }

  for (const tab of ui.awsContentTabs) {
    const view = tab.getAttribute('data-aws-view') || 'inventory';
    const isActive = view === state.activeAwsView;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  }
}

function setActiveAwsView(view, options = {}) {
  const persist = options.persist !== false;
  if (!ALLOWED_AWS_VIEWS.has(view)) {
    return;
  }
  state.activeAwsView = view;
  if (persist) {
    localStorage.setItem(ACTIVE_AWS_VIEW_KEY, view);
  }
  renderAwsContentViews();
  if (view === 'security') {
    renderAwsSecurityAccounts();
  }
}

function getScopedAccounts() {
  const scopeIds = new Set(getAzureScopeSubscriptionIds());
  return state.storageAccounts.filter((account) => scopeIds.has(account.subscription_id));
}

function summarizeScopedMetric(accounts, metricField) {
  let total = 0;
  let accountCountWithMetric = 0;

  for (const account of accounts) {
    const rawValue = account?.[metricField];
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      continue;
    }

    const numeric = Number(rawValue);
    if (!Number.isFinite(numeric)) {
      continue;
    }

    total += numeric;
    accountCountWithMetric += 1;
  }

  return {
    total,
    accountCountWithMetric
  };
}

function getPricingAssumptions() {
  const fromConfig = state.config?.pricingAssumptions || {};

  return {
    currency: String(fromConfig.currency || DEFAULT_PRICING_ASSUMPTIONS.currency),
    regionLabel: String(fromConfig.regionLabel || DEFAULT_PRICING_ASSUMPTIONS.regionLabel),
    source: String(fromConfig.source || DEFAULT_PRICING_ASSUMPTIONS.source),
    asOfDate: String(fromConfig.asOfDate || DEFAULT_PRICING_ASSUMPTIONS.asOfDate),
    bytesPerGb: Math.max(1, Math.round(toFiniteNumber(fromConfig.bytesPerGb, DEFAULT_PRICING_ASSUMPTIONS.bytesPerGb))),
    daysInMonth: Math.max(1, toFiniteNumber(fromConfig.daysInMonth, DEFAULT_PRICING_ASSUMPTIONS.daysInMonth)),
    storageHotLrsGbMonthTiers: normalizeTierPricing(
      fromConfig.storageHotLrsGbMonthTiers,
      DEFAULT_PRICING_ASSUMPTIONS.storageHotLrsGbMonthTiers
    ),
    egressInternetGbTiers: normalizeTierPricing(fromConfig.egressInternetGbTiers, DEFAULT_PRICING_ASSUMPTIONS.egressInternetGbTiers),
    ingressPerGb: Math.max(0, toFiniteNumber(fromConfig.ingressPerGb, DEFAULT_PRICING_ASSUMPTIONS.ingressPerGb)),
    transactionUnitSize: Math.max(
      1,
      Math.round(toFiniteNumber(fromConfig.transactionUnitSize, DEFAULT_PRICING_ASSUMPTIONS.transactionUnitSize))
    ),
    transactionUnitPrice: Math.max(
      0,
      toFiniteNumber(fromConfig.transactionUnitPrice, DEFAULT_PRICING_ASSUMPTIONS.transactionUnitPrice)
    ),
    transactionRateLabel: String(fromConfig.transactionRateLabel || DEFAULT_PRICING_ASSUMPTIONS.transactionRateLabel)
  };
}

function getWasabiPricingAssumptions() {
  const fromConfig = state.config?.wasabi?.pricingAssumptions || {};
  return {
    currency: String(fromConfig.currency || DEFAULT_WASABI_PRICING_ASSUMPTIONS.currency),
    source: String(fromConfig.source || DEFAULT_WASABI_PRICING_ASSUMPTIONS.source),
    asOfDate: String(fromConfig.asOfDate || DEFAULT_WASABI_PRICING_ASSUMPTIONS.asOfDate),
    bytesPerTb: Math.max(1, Math.round(toFiniteNumber(fromConfig.bytesPerTb, DEFAULT_WASABI_PRICING_ASSUMPTIONS.bytesPerTb))),
    daysInMonth: Math.max(1, toFiniteNumber(fromConfig.daysInMonth, DEFAULT_WASABI_PRICING_ASSUMPTIONS.daysInMonth)),
    storagePricePerTbMonth: Math.max(
      0,
      toFiniteNumber(fromConfig.storagePricePerTbMonth, DEFAULT_WASABI_PRICING_ASSUMPTIONS.storagePricePerTbMonth)
    ),
    minimumBillableTb: Math.max(
      0,
      toFiniteNumber(fromConfig.minimumBillableTb, DEFAULT_WASABI_PRICING_ASSUMPTIONS.minimumBillableTb)
    )
  };
}

function getVsaxPricingAssumptions() {
  const fromConfig = state.config?.vsax?.pricingAssumptions || {};
  return {
    currency: String(fromConfig.currency || DEFAULT_VSAX_PRICING_ASSUMPTIONS.currency),
    source: String(fromConfig.source || DEFAULT_VSAX_PRICING_ASSUMPTIONS.source),
    asOfDate: String(fromConfig.asOfDate || DEFAULT_VSAX_PRICING_ASSUMPTIONS.asOfDate),
    bytesPerTb: Math.max(1, Math.round(toFiniteNumber(fromConfig.bytesPerTb, DEFAULT_VSAX_PRICING_ASSUMPTIONS.bytesPerTb))),
    daysInMonth: Math.max(1, toFiniteNumber(fromConfig.daysInMonth, DEFAULT_VSAX_PRICING_ASSUMPTIONS.daysInMonth)),
    storagePricePerTbMonth: Math.max(
      0,
      toFiniteNumber(fromConfig.storagePricePerTbMonth, DEFAULT_VSAX_PRICING_ASSUMPTIONS.storagePricePerTbMonth)
    )
  };
}

function getAwsPricingAssumptions() {
  const fromConfig = state.config?.aws?.pricingAssumptions || {};
  return {
    currency: String(fromConfig.currency || DEFAULT_AWS_PRICING_ASSUMPTIONS.currency),
    regionLabel: String(fromConfig.regionLabel || DEFAULT_AWS_PRICING_ASSUMPTIONS.regionLabel),
    source: String(fromConfig.source || DEFAULT_AWS_PRICING_ASSUMPTIONS.source),
    asOfDate: String(fromConfig.asOfDate || DEFAULT_AWS_PRICING_ASSUMPTIONS.asOfDate),
    bytesPerGb: Math.max(1, Math.round(toFiniteNumber(fromConfig.bytesPerGb, DEFAULT_AWS_PRICING_ASSUMPTIONS.bytesPerGb))),
    daysInMonth: Math.max(1, toFiniteNumber(fromConfig.daysInMonth, DEFAULT_AWS_PRICING_ASSUMPTIONS.daysInMonth)),
    s3StorageStandardGbMonth: Math.max(
      0,
      toFiniteNumber(fromConfig.s3StorageStandardGbMonth, DEFAULT_AWS_PRICING_ASSUMPTIONS.s3StorageStandardGbMonth)
    ),
    s3EgressPerGb: Math.max(0, toFiniteNumber(fromConfig.s3EgressPerGb, DEFAULT_AWS_PRICING_ASSUMPTIONS.s3EgressPerGb)),
    s3EgressFreeGb: Math.max(0, toFiniteNumber(fromConfig.s3EgressFreeGb, DEFAULT_AWS_PRICING_ASSUMPTIONS.s3EgressFreeGb)),
    s3RequestUnitSize: Math.max(
      1,
      Math.round(toFiniteNumber(fromConfig.s3RequestUnitSize, DEFAULT_AWS_PRICING_ASSUMPTIONS.s3RequestUnitSize))
    ),
    s3RequestUnitPrice: Math.max(
      0,
      toFiniteNumber(fromConfig.s3RequestUnitPrice, DEFAULT_AWS_PRICING_ASSUMPTIONS.s3RequestUnitPrice)
    ),
    s3RequestRateLabel: String(fromConfig.s3RequestRateLabel || DEFAULT_AWS_PRICING_ASSUMPTIONS.s3RequestRateLabel),
    efsStandardGbMonth: Math.max(0, toFiniteNumber(fromConfig.efsStandardGbMonth, DEFAULT_AWS_PRICING_ASSUMPTIONS.efsStandardGbMonth))
  };
}

function estimateWasabiStorageCost(usageBytes, pricing) {
  const bytes = Math.max(0, toFiniteNumber(usageBytes, 0));
  const tb = bytes / Math.max(1, pricing.bytesPerTb);
  const billableTb = Math.max(tb, pricing.minimumBillableTb);
  const estimated30d = billableTb * pricing.storagePricePerTbMonth;
  const estimated24h = estimated30d / Math.max(1, pricing.daysInMonth);
  return {
    rawTb: tb,
    billableTb,
    estimated24h,
    estimated30d
  };
}

function estimateVsaxStorageCost(usageBytes, pricing) {
  const bytes = Math.max(0, toFiniteNumber(usageBytes, 0));
  const tb = bytes / Math.max(1, pricing.bytesPerTb);
  const estimated30d = tb * pricing.storagePricePerTbMonth;
  const estimated24h = estimated30d / Math.max(1, pricing.daysInMonth);
  return {
    rawTb: tb,
    estimated24h,
    estimated30d
  };
}

function computeAzureScopeStats(accounts, pricing = getPricingAssumptions()) {
  const scopedAccounts = Array.isArray(accounts) ? accounts : [];
  const accountCount = scopedAccounts.length;
  const usedCapacity = summarizeScopedMetric(scopedAccounts, 'metrics_used_capacity_bytes');
  const egress24h = summarizeScopedMetric(scopedAccounts, 'metrics_egress_bytes_24h');
  const egress30d = summarizeScopedMetric(scopedAccounts, 'metrics_egress_bytes_30d');
  const ingress24h = summarizeScopedMetric(scopedAccounts, 'metrics_ingress_bytes_24h');
  const ingress30d = summarizeScopedMetric(scopedAccounts, 'metrics_ingress_bytes_30d');
  const transactions24h = summarizeScopedMetric(scopedAccounts, 'metrics_transactions_24h');
  const transactions30d = summarizeScopedMetric(scopedAccounts, 'metrics_transactions_30d');

  const usedCapacityGb = usedCapacity.total / pricing.bytesPerGb;
  const egressGb24h = egress24h.total / pricing.bytesPerGb;
  const egressGb30d = egress30d.total / pricing.bytesPerGb;
  const ingressGb24h = ingress24h.total / pricing.bytesPerGb;
  const ingressGb30d = ingress30d.total / pricing.bytesPerGb;

  const usedCapacityMonthlyCost = calculateTieredCost(usedCapacityGb, pricing.storageHotLrsGbMonthTiers);
  const usedCapacityDailyCost = usedCapacityMonthlyCost / pricing.daysInMonth;
  const egressCost24h = calculateTieredCost(egressGb24h, pricing.egressInternetGbTiers);
  const egressCost30d = calculateTieredCost(egressGb30d, pricing.egressInternetGbTiers);
  const ingressCost24h = ingressGb24h * pricing.ingressPerGb;
  const ingressCost30d = ingressGb30d * pricing.ingressPerGb;
  const transactionsCost24h = (transactions24h.total / pricing.transactionUnitSize) * pricing.transactionUnitPrice;
  const transactionsCost30d = (transactions30d.total / pricing.transactionUnitSize) * pricing.transactionUnitPrice;
  const totalEstimatedCost24h = usedCapacityDailyCost + egressCost24h + ingressCost24h + transactionsCost24h;
  const totalEstimatedCost30d = usedCapacityMonthlyCost + egressCost30d + ingressCost30d + transactionsCost30d;

  return {
    accountCount,
    usedCapacity,
    egress24h,
    egress30d,
    ingress24h,
    ingress30d,
    transactions24h,
    transactions30d,
    costs: {
      usedCapacityDailyCost,
      usedCapacityMonthlyCost,
      egressCost24h,
      egressCost30d,
      ingressCost24h,
      ingressCost30d,
      transactionsCost24h,
      transactionsCost30d,
      totalEstimatedCost24h,
      totalEstimatedCost30d
    },
    pricing
  };
}

function computeWasabiProviderStats(accounts, pricing = getWasabiPricingAssumptions()) {
  const accountList = Array.isArray(accounts) ? accounts : [];
  const summary = accountList.reduce(
    (acc, account) => {
      const usageBytes = Math.max(0, Number(account.total_usage_bytes || 0));
      const objectCount = Math.max(0, Number(account.total_object_count || 0));
      const estimate = estimateWasabiStorageCost(usageBytes, pricing);

      acc.storageBytes += usageBytes;
      acc.objectCount += objectCount;
      acc.estimated24h += estimate.estimated24h;
      acc.estimated30d += estimate.estimated30d;
      acc.bucketCount += Math.max(0, Number(account.bucket_count || 0));
      return acc;
    },
    {
      accountCount: accountList.length,
      storageBytes: 0,
      objectCount: 0,
      estimated24h: 0,
      estimated30d: 0,
      bucketCount: 0
    }
  );

  return {
    ...summary,
    pricing
  };
}

function computeVsaxProviderStats(groups, pricing = getVsaxPricingAssumptions()) {
  const list = Array.isArray(groups) ? groups : [];
  const summary = list.reduce(
    (acc, group) => {
      const allocatedBytes = Math.max(0, Number(group.total_allocated_bytes || 0));
      const usedBytes = Math.max(0, Number(group.total_used_bytes || 0));
      const deviceCount = Math.max(0, Number(group.device_count || 0));
      const diskCount = Math.max(0, Number(group.disk_count || 0));
      const estimate = estimateVsaxStorageCost(usedBytes, pricing);

      acc.groupCount += 1;
      acc.deviceCount += deviceCount;
      acc.diskCount += diskCount;
      acc.allocatedBytes += allocatedBytes;
      acc.usedBytes += usedBytes;
      acc.estimated24h += estimate.estimated24h;
      acc.estimated30d += estimate.estimated30d;
      return acc;
    },
    {
      groupCount: 0,
      deviceCount: 0,
      diskCount: 0,
      allocatedBytes: 0,
      usedBytes: 0,
      estimated24h: 0,
      estimated30d: 0
    }
  );

  return {
    ...summary,
    pricing
  };
}

function computeAwsAccountDerivedMetrics(account, pricing) {
  const s3StorageBytesRaw = account?.total_usage_bytes;
  const efsStorageBytesRaw = account?.total_efs_size_bytes;
  const objectsRaw = account?.total_object_count;
  const egress24hRaw = account?.total_egress_bytes_24h;
  const egress30dRaw = account?.total_egress_bytes_30d;
  const ingress24hRaw = account?.total_ingress_bytes_24h;
  const ingress30dRaw = account?.total_ingress_bytes_30d;
  const tx24hRaw = account?.total_transactions_24h;
  const tx30dRaw = account?.total_transactions_30d;

  const s3StorageBytes = Number.isFinite(Number(s3StorageBytesRaw)) ? Math.max(0, Number(s3StorageBytesRaw)) : null;
  const efsStorageBytes = Number.isFinite(Number(efsStorageBytesRaw)) ? Math.max(0, Number(efsStorageBytesRaw)) : null;
  const objects = Number.isFinite(Number(objectsRaw)) ? Math.max(0, Number(objectsRaw)) : null;
  const egress24h = Number.isFinite(Number(egress24hRaw)) ? Math.max(0, Number(egress24hRaw)) : null;
  const egress30d = Number.isFinite(Number(egress30dRaw)) ? Math.max(0, Number(egress30dRaw)) : null;
  const ingress24h = Number.isFinite(Number(ingress24hRaw)) ? Math.max(0, Number(ingress24hRaw)) : null;
  const ingress30d = Number.isFinite(Number(ingress30dRaw)) ? Math.max(0, Number(ingress30dRaw)) : null;
  const tx24h = Number.isFinite(Number(tx24hRaw)) ? Math.max(0, Number(tx24hRaw)) : null;
  const tx30d = Number.isFinite(Number(tx30dRaw)) ? Math.max(0, Number(tx30dRaw)) : null;

  const s3StorageGb = (s3StorageBytes || 0) / pricing.bytesPerGb;
  const efsStorageGb = (efsStorageBytes || 0) / pricing.bytesPerGb;
  const egress24hGb = (egress24h || 0) / pricing.bytesPerGb;
  const egress30dGb = (egress30d || 0) / pricing.bytesPerGb;

  const s3StorageMonthlyCost = s3StorageGb * pricing.s3StorageStandardGbMonth;
  const s3StorageDailyCost = s3StorageMonthlyCost / pricing.daysInMonth;
  const efsStorageMonthlyCost = efsStorageGb * pricing.efsStandardGbMonth;
  const efsStorageDailyCost = efsStorageMonthlyCost / pricing.daysInMonth;
  const egressCost24h = Math.max(0, egress24hGb - pricing.s3EgressFreeGb) * pricing.s3EgressPerGb;
  const egressCost30d = Math.max(0, egress30dGb - pricing.s3EgressFreeGb) * pricing.s3EgressPerGb;
  const transactionsCost24h = ((tx24h || 0) / pricing.s3RequestUnitSize) * pricing.s3RequestUnitPrice;
  const transactionsCost30d = ((tx30d || 0) / pricing.s3RequestUnitSize) * pricing.s3RequestUnitPrice;

  const totalEstimatedCost24h = s3StorageDailyCost + efsStorageDailyCost + egressCost24h + transactionsCost24h;
  const totalEstimatedCost30d = s3StorageMonthlyCost + efsStorageMonthlyCost + egressCost30d + transactionsCost30d;

  return {
    s3StorageBytes,
    efsStorageBytes,
    storageBytes: (s3StorageBytes || 0) + (efsStorageBytes || 0),
    objects,
    egress24h,
    egress30d,
    ingress24h,
    ingress30d,
    tx24h,
    tx30d,
    efsCount: Number.isFinite(Number(account?.efs_count)) ? Math.max(0, Number(account.efs_count)) : null,
    costs: {
      s3StorageDailyCost,
      s3StorageMonthlyCost,
      efsStorageDailyCost,
      efsStorageMonthlyCost,
      egressCost24h,
      egressCost30d,
      transactionsCost24h,
      transactionsCost30d,
      totalEstimatedCost24h,
      totalEstimatedCost30d
    }
  };
}

function computeAwsProviderStats(accounts, pricing = getAwsPricingAssumptions()) {
  const scopedAccounts = Array.isArray(accounts) ? accounts : [];
  const summary = {
    accountCount: scopedAccounts.length,
    storage: { total: 0, accountCountWithMetric: 0 },
    s3Storage: { total: 0, accountCountWithMetric: 0 },
    efsStorage: { total: 0, accountCountWithMetric: 0 },
    objects: { total: 0, accountCountWithMetric: 0 },
    egress24h: { total: 0, accountCountWithMetric: 0 },
    egress30d: { total: 0, accountCountWithMetric: 0 },
    ingress24h: { total: 0, accountCountWithMetric: 0 },
    ingress30d: { total: 0, accountCountWithMetric: 0 },
    transactions24h: { total: 0, accountCountWithMetric: 0 },
    transactions30d: { total: 0, accountCountWithMetric: 0 },
    efsCount: { total: 0, accountCountWithMetric: 0 },
    securityScanBuckets: { total: 0, accountCountWithMetric: 0 },
    securityErrorBuckets: { total: 0, accountCountWithMetric: 0 },
    costs: {
      s3StorageDailyCost: 0,
      s3StorageMonthlyCost: 0,
      efsStorageDailyCost: 0,
      efsStorageMonthlyCost: 0,
      egressCost24h: 0,
      egressCost30d: 0,
      transactionsCost24h: 0,
      transactionsCost30d: 0,
      totalEstimatedCost24h: 0,
      totalEstimatedCost30d: 0
    }
  };

  for (const account of scopedAccounts) {
    const derived = computeAwsAccountDerivedMetrics(account, pricing);

    if (derived.storageBytes !== null) {
      summary.storage.total += derived.storageBytes;
      summary.storage.accountCountWithMetric += 1;
    }
    if (derived.s3StorageBytes !== null) {
      summary.s3Storage.total += derived.s3StorageBytes;
      summary.s3Storage.accountCountWithMetric += 1;
    }
    if (derived.efsStorageBytes !== null && (derived.efsCount || 0) > 0) {
      summary.efsStorage.total += derived.efsStorageBytes;
      summary.efsStorage.accountCountWithMetric += 1;
    }
    if (derived.objects !== null) {
      summary.objects.total += derived.objects;
      summary.objects.accountCountWithMetric += 1;
    }
    if (derived.egress24h !== null) {
      summary.egress24h.total += derived.egress24h;
      summary.egress24h.accountCountWithMetric += 1;
    }
    if (derived.egress30d !== null) {
      summary.egress30d.total += derived.egress30d;
      summary.egress30d.accountCountWithMetric += 1;
    }
    if (derived.ingress24h !== null) {
      summary.ingress24h.total += derived.ingress24h;
      summary.ingress24h.accountCountWithMetric += 1;
    }
    if (derived.ingress30d !== null) {
      summary.ingress30d.total += derived.ingress30d;
      summary.ingress30d.accountCountWithMetric += 1;
    }
    if (derived.tx24h !== null) {
      summary.transactions24h.total += derived.tx24h;
      summary.transactions24h.accountCountWithMetric += 1;
    }
    if (derived.tx30d !== null) {
      summary.transactions30d.total += derived.tx30d;
      summary.transactions30d.accountCountWithMetric += 1;
    }
    if (derived.efsCount !== null && derived.efsCount > 0) {
      summary.efsCount.total += derived.efsCount;
      summary.efsCount.accountCountWithMetric += 1;
    }
    if (Number.isFinite(Number(account?.security_scan_bucket_count))) {
      summary.securityScanBuckets.total += Math.max(0, Number(account.security_scan_bucket_count));
      summary.securityScanBuckets.accountCountWithMetric += 1;
    }
    if (Number.isFinite(Number(account?.security_error_bucket_count))) {
      summary.securityErrorBuckets.total += Math.max(0, Number(account.security_error_bucket_count));
      summary.securityErrorBuckets.accountCountWithMetric += 1;
    }

    summary.costs.s3StorageDailyCost += derived.costs.s3StorageDailyCost;
    summary.costs.s3StorageMonthlyCost += derived.costs.s3StorageMonthlyCost;
    summary.costs.efsStorageDailyCost += derived.costs.efsStorageDailyCost;
    summary.costs.efsStorageMonthlyCost += derived.costs.efsStorageMonthlyCost;
    summary.costs.egressCost24h += derived.costs.egressCost24h;
    summary.costs.egressCost30d += derived.costs.egressCost30d;
    summary.costs.transactionsCost24h += derived.costs.transactionsCost24h;
    summary.costs.transactionsCost30d += derived.costs.transactionsCost30d;
    summary.costs.totalEstimatedCost24h += derived.costs.totalEstimatedCost24h;
    summary.costs.totalEstimatedCost30d += derived.costs.totalEstimatedCost30d;
  }

  return {
    ...summary,
    pricing
  };
}

function formatMetricValue(value, formatter) {
  if (value === null || value === undefined) {
    return '-';
  }
  return formatter(value);
}

function renderUnifiedStatRow(row) {
  return `
    <tr class="${row.isTotal ? 'unified-total-row' : ''}">
      <td>${escapeHtml(row.provider)}</td>
      <td>${escapeHtml(formatWholeNumber(row.accountCount))}</td>
      <td>${escapeHtml(formatMetricValue(row.storageInUseBytes, formatBytes))}</td>
      <td>${escapeHtml(formatMetricValue(row.egress24hBytes, formatBytes))}</td>
      <td>${escapeHtml(formatMetricValue(row.egress30dBytes, formatBytes))}</td>
      <td>${escapeHtml(formatMetricValue(row.ingress24hBytes, formatBytes))}</td>
      <td>${escapeHtml(formatMetricValue(row.ingress30dBytes, formatBytes))}</td>
      <td>${escapeHtml(formatMetricValue(row.transactions24h, formatWholeNumber))}</td>
      <td>${escapeHtml(formatMetricValue(row.transactions30d, formatWholeNumber))}</td>
      <td>${escapeHtml(formatMetricValue(row.estimatedCost24h, (value) => formatCurrency(value, row.currency)))}</td>
      <td>${escapeHtml(formatMetricValue(row.estimatedCost30d, (value) => formatCurrency(value, row.currency)))}</td>
      <td>${escapeHtml(row.notes)}</td>
    </tr>
  `;
}

function renderUnifiedStats() {
  if (!ui.unifiedStatsBody) {
    return;
  }

  const azureStats = computeAzureScopeStats(getScopedAccounts(), getPricingAssumptions());
  const awsStats = computeAwsProviderStats(state.awsAccounts, getAwsPricingAssumptions());
  const wasabiStats = computeWasabiProviderStats(state.wasabiAccounts, getWasabiPricingAssumptions());
  const vsaxStats = computeVsaxProviderStats(state.vsaxGroups, getVsaxPricingAssumptions());

  const rows = [
    {
      provider: 'Azure',
      accountCount: azureStats.accountCount,
      storageInUseBytes: azureStats.usedCapacity.total,
      egress24hBytes: azureStats.egress24h.total,
      egress30dBytes: azureStats.egress30d.total,
      ingress24hBytes: azureStats.ingress24h.total,
      ingress30dBytes: azureStats.ingress30d.total,
      transactions24h: azureStats.transactions24h.total,
      transactions30d: azureStats.transactions30d.total,
      estimatedCost24h: azureStats.costs.totalEstimatedCost24h,
      estimatedCost30d: azureStats.costs.totalEstimatedCost30d,
      currency: azureStats.pricing.currency,
      notes:
        azureStats.accountCount > 0
          ? `Coverage used ${azureStats.usedCapacity.accountCountWithMetric}/${azureStats.accountCount}, egr24 ${azureStats.egress24h.accountCountWithMetric}/${azureStats.accountCount}, egr30 ${azureStats.egress30d.accountCountWithMetric}/${azureStats.accountCount}, ing24 ${azureStats.ingress24h.accountCountWithMetric}/${azureStats.accountCount}, ing30 ${azureStats.ingress30d.accountCountWithMetric}/${azureStats.accountCount}, tx24 ${azureStats.transactions24h.accountCountWithMetric}/${azureStats.accountCount}, tx30 ${azureStats.transactions30d.accountCountWithMetric}/${azureStats.accountCount}.`
          : 'No Azure accounts in current selected scope.'
    },
    {
      provider: 'Wasabi',
      accountCount: wasabiStats.accountCount,
      storageInUseBytes: wasabiStats.storageBytes,
      egress24hBytes: null,
      egress30dBytes: null,
      ingress24hBytes: null,
      ingress30dBytes: null,
      transactions24h: null,
      transactions30d: null,
      estimatedCost24h: wasabiStats.estimated24h,
      estimatedCost30d: wasabiStats.estimated30d,
      currency: wasabiStats.pricing.currency,
      notes:
        wasabiStats.accountCount > 0
          ? `${wasabiStats.bucketCount.toLocaleString()} cached bucket(s). Ingress/egress/transaction metrics are not exposed by current Wasabi utilization API integration.`
          : 'No Wasabi accounts configured or loaded.'
    },
    {
      provider: 'VSAx',
      accountCount: vsaxStats.groupCount,
      storageInUseBytes: vsaxStats.usedBytes,
      egress24hBytes: null,
      egress30dBytes: null,
      ingress24hBytes: null,
      ingress30dBytes: null,
      transactions24h: null,
      transactions30d: null,
      estimatedCost24h: vsaxStats.estimated24h,
      estimatedCost30d: vsaxStats.estimated30d,
      currency: vsaxStats.pricing.currency,
      notes:
        vsaxStats.groupCount > 0
          ? `${vsaxStats.deviceCount.toLocaleString()} device(s), ${vsaxStats.diskCount.toLocaleString()} disk row(s) in cache. Disk usage cost estimate only (${formatCurrency(vsaxStats.pricing.storagePricePerTbMonth, vsaxStats.pricing.currency)}/TB-month).`
          : 'No VSAx groups loaded.'
    },
    {
      provider: 'AWS',
      accountCount: awsStats.accountCount,
      storageInUseBytes: awsStats.storage.accountCountWithMetric > 0 ? awsStats.storage.total : null,
      egress24hBytes: awsStats.egress24h.accountCountWithMetric > 0 ? awsStats.egress24h.total : null,
      egress30dBytes: awsStats.egress30d.accountCountWithMetric > 0 ? awsStats.egress30d.total : null,
      ingress24hBytes: awsStats.ingress24h.accountCountWithMetric > 0 ? awsStats.ingress24h.total : null,
      ingress30dBytes: awsStats.ingress30d.accountCountWithMetric > 0 ? awsStats.ingress30d.total : null,
      transactions24h: awsStats.transactions24h.accountCountWithMetric > 0 ? awsStats.transactions24h.total : null,
      transactions30d: awsStats.transactions30d.accountCountWithMetric > 0 ? awsStats.transactions30d.total : null,
      estimatedCost24h: awsStats.costs.totalEstimatedCost24h,
      estimatedCost30d: awsStats.costs.totalEstimatedCost30d,
      currency: awsStats.pricing.currency,
      notes:
        awsStats.accountCount > 0
          ? `Coverage storage ${awsStats.storage.accountCountWithMetric}/${awsStats.accountCount}, objects ${awsStats.objects.accountCountWithMetric}/${awsStats.accountCount}, egr24 ${awsStats.egress24h.accountCountWithMetric}/${awsStats.accountCount}, egr30 ${awsStats.egress30d.accountCountWithMetric}/${awsStats.accountCount}, ing24 ${awsStats.ingress24h.accountCountWithMetric}/${awsStats.accountCount}, ing30 ${awsStats.ingress30d.accountCountWithMetric}/${awsStats.accountCount}, tx24 ${awsStats.transactions24h.accountCountWithMetric}/${awsStats.accountCount}, tx30 ${awsStats.transactions30d.accountCountWithMetric}/${awsStats.accountCount}, efs ${awsStats.efsCount.accountCountWithMetric}/${awsStats.accountCount}; security scanned buckets ${formatWholeNumber(awsStats.securityScanBuckets.total)}, security errors ${formatWholeNumber(awsStats.securityErrorBuckets.total)}.`
          : 'No AWS accounts configured or loaded.'
    },
    {
      provider: 'GCP',
      accountCount: 0,
      storageInUseBytes: null,
      egress24hBytes: null,
      egress30dBytes: null,
      ingress24hBytes: null,
      ingress30dBytes: null,
      transactions24h: null,
      transactions30d: null,
      estimatedCost24h: null,
      estimatedCost30d: null,
      currency: 'USD',
      notes: 'Provider integration not implemented yet.'
    },
    {
      provider: 'Other',
      accountCount: 0,
      storageInUseBytes: null,
      egress24hBytes: null,
      egress30dBytes: null,
      ingress24hBytes: null,
      ingress30dBytes: null,
      transactions24h: null,
      transactions30d: null,
      estimatedCost24h: null,
      estimatedCost30d: null,
      currency: 'USD',
      notes: 'Provider integration not implemented yet.'
    }
  ];

  const totalRow = rows.reduce(
    (acc, row) => ({
      provider: 'Total',
      accountCount: acc.accountCount + Number(row.accountCount || 0),
      storageInUseBytes: acc.storageInUseBytes + Number(row.storageInUseBytes || 0),
      egress24hBytes: acc.egress24hBytes + Number(row.egress24hBytes || 0),
      egress30dBytes: acc.egress30dBytes + Number(row.egress30dBytes || 0),
      ingress24hBytes: acc.ingress24hBytes + Number(row.ingress24hBytes || 0),
      ingress30dBytes: acc.ingress30dBytes + Number(row.ingress30dBytes || 0),
      transactions24h: acc.transactions24h + Number(row.transactions24h || 0),
      transactions30d: acc.transactions30d + Number(row.transactions30d || 0),
      estimatedCost24h: acc.estimatedCost24h + Number(row.estimatedCost24h || 0),
      estimatedCost30d: acc.estimatedCost30d + Number(row.estimatedCost30d || 0),
      currency: 'USD',
      notes: 'Sum of displayed provider rows.',
      isTotal: true
    }),
    {
      provider: 'Total',
      accountCount: 0,
      storageInUseBytes: 0,
      egress24hBytes: 0,
      egress30dBytes: 0,
      ingress24hBytes: 0,
      ingress30dBytes: 0,
      transactions24h: 0,
      transactions30d: 0,
      estimatedCost24h: 0,
      estimatedCost30d: 0,
      currency: 'USD',
      notes: '',
      isTotal: true
    }
  );

  ui.unifiedStatsBody.innerHTML = [...rows, totalRow].map((row) => renderUnifiedStatRow(row)).join('');

  if (ui.unifiedStatsCoverage) {
    ui.unifiedStatsCoverage.textContent = `Azure scoped accounts: ${azureStats.accountCount}. AWS accounts: ${awsStats.accountCount}. Wasabi accounts: ${wasabiStats.accountCount}. VSAx groups: ${vsaxStats.groupCount}. Other providers pending integration.`;
  }

  if (ui.unifiedPricingAssumptions) {
    ui.unifiedPricingAssumptions.textContent = `Pricing references: Azure (${azureStats.pricing.regionLabel}) from ${azureStats.pricing.source} as of ${azureStats.pricing.asOfDate}; AWS (${awsStats.pricing.regionLabel}) from ${awsStats.pricing.source} as of ${awsStats.pricing.asOfDate}; Wasabi from ${wasabiStats.pricing.source} as of ${wasabiStats.pricing.asOfDate}; VSAx from ${vsaxStats.pricing.source} as of ${vsaxStats.pricing.asOfDate}.`;
  }
}

function renderScopeTotals() {
  if (
    !ui.scopeTotalUsedCap ||
    !ui.scopeTotalUsedCap30d ||
    !ui.scopeTotalEgress24h ||
    !ui.scopeTotalEgress30d ||
    !ui.scopeTotalIngress24h ||
    !ui.scopeTotalIngress30d ||
    !ui.scopeTotalTransactions24h ||
    !ui.scopeTotalTransactions30d ||
    !ui.scopeCostUsedCap24h ||
    !ui.scopeCostUsedCap30d ||
    !ui.scopeCostEgress24h ||
    !ui.scopeCostEgress30d ||
    !ui.scopeCostIngress24h ||
    !ui.scopeCostIngress30d ||
    !ui.scopeCostTransactions24h ||
    !ui.scopeCostTransactions30d ||
    !ui.scopeCostTotal24h ||
    !ui.scopeCostTotal30d ||
    !ui.scopeTotalsCoverage
  ) {
    return;
  }

  const summary = computeAzureScopeStats(getScopedAccounts(), getPricingAssumptions());
  const totalAccounts = summary.accountCount;
  const { pricing } = summary;

  ui.scopeTotalUsedCap.textContent = formatBytes(summary.usedCapacity.total);
  ui.scopeTotalUsedCap30d.textContent = formatBytes(summary.usedCapacity.total);
  ui.scopeTotalEgress24h.textContent = formatBytes(summary.egress24h.total);
  ui.scopeTotalEgress30d.textContent = formatBytes(summary.egress30d.total);
  ui.scopeTotalIngress24h.textContent = formatBytes(summary.ingress24h.total);
  ui.scopeTotalIngress30d.textContent = formatBytes(summary.ingress30d.total);
  ui.scopeTotalTransactions24h.textContent = formatWholeNumber(summary.transactions24h.total);
  ui.scopeTotalTransactions30d.textContent = formatWholeNumber(summary.transactions30d.total);

  ui.scopeCostUsedCap24h.textContent = formatCurrency(summary.costs.usedCapacityDailyCost, pricing.currency);
  ui.scopeCostUsedCap30d.textContent = formatCurrency(summary.costs.usedCapacityMonthlyCost, pricing.currency);
  ui.scopeCostEgress24h.textContent = formatCurrency(summary.costs.egressCost24h, pricing.currency);
  ui.scopeCostEgress30d.textContent = formatCurrency(summary.costs.egressCost30d, pricing.currency);
  ui.scopeCostIngress24h.textContent = formatCurrency(summary.costs.ingressCost24h, pricing.currency);
  ui.scopeCostIngress30d.textContent = formatCurrency(summary.costs.ingressCost30d, pricing.currency);
  ui.scopeCostTransactions24h.textContent = formatCurrency(summary.costs.transactionsCost24h, pricing.currency);
  ui.scopeCostTransactions30d.textContent = formatCurrency(summary.costs.transactionsCost30d, pricing.currency);
  ui.scopeCostTotal24h.textContent = formatCurrency(summary.costs.totalEstimatedCost24h, pricing.currency);
  ui.scopeCostTotal30d.textContent = formatCurrency(summary.costs.totalEstimatedCost30d, pricing.currency);

  ui.scopeTotalsCoverage.textContent = `${totalAccounts} account(s) in scope. Coverage: used ${summary.usedCapacity.accountCountWithMetric}/${totalAccounts}, egress24h ${summary.egress24h.accountCountWithMetric}/${totalAccounts}, egress30d ${summary.egress30d.accountCountWithMetric}/${totalAccounts}, ingress24h ${summary.ingress24h.accountCountWithMetric}/${totalAccounts}, ingress30d ${summary.ingress30d.accountCountWithMetric}/${totalAccounts}, txns24h ${summary.transactions24h.accountCountWithMetric}/${totalAccounts}, txns30d ${summary.transactions30d.accountCountWithMetric}/${totalAccounts}.`;
  if (ui.scopePricingAssumptions) {
    ui.scopePricingAssumptions.textContent = `Estimate assumptions: Hot LRS blob storage (${pricing.regionLabel}) from ${pricing.source} as of ${pricing.asOfDate}; storage billed per GB-month (24h is prorated, 30d is monthly estimate with ${pricing.daysInMonth}-day month); ingress ${formatCurrency(pricing.ingressPerGb, pricing.currency)}/GB; transactions ${formatCurrency(pricing.transactionUnitPrice, pricing.currency)}/${pricing.transactionUnitSize.toLocaleString()} (${pricing.transactionRateLabel}).`;
  }

  renderUnifiedStats();
}

function pruneAccountScopedState() {
  const liveIds = new Set(state.storageAccounts.map((account) => account.account_id));

  for (const accountId of Object.keys(state.accountProgress)) {
    if (!liveIds.has(accountId)) {
      delete state.accountProgress[accountId];
    }
  }
  for (const accountId of Object.keys(state.containersByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.containersByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.containerLoadErrorsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.containerLoadErrorsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.loadingContainersByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.loadingContainersByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.securityByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.securityByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.loadingSecurityByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.loadingSecurityByAccount[accountId];
    }
  }

  for (const accountId of Array.from(state.expandedContainerAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.expandedContainerAccountIds.delete(accountId);
    }
  }
  for (const accountId of Array.from(state.expandedSecurityAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.expandedSecurityAccountIds.delete(accountId);
    }
  }
}

function pruneAwsAccountScopedState() {
  const liveIds = new Set(state.awsAccounts.map((account) => account.account_id));

  for (const accountId of Object.keys(state.awsBucketsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsBucketsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.awsBucketLoadErrorsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsBucketLoadErrorsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.awsLoadingBucketsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsLoadingBucketsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.awsEfsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsEfsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.awsEfsLoadErrorsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsEfsLoadErrorsByAccount[accountId];
    }
  }
  for (const accountId of Object.keys(state.awsLoadingEfsByAccount)) {
    if (!liveIds.has(accountId)) {
      delete state.awsLoadingEfsByAccount[accountId];
    }
  }

  for (const accountId of Array.from(state.expandedAwsAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.expandedAwsAccountIds.delete(accountId);
    }
  }
  for (const accountId of Array.from(state.expandedAwsSecurityAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.expandedAwsSecurityAccountIds.delete(accountId);
    }
  }
  for (const accountId of Array.from(state.awsSyncingAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.awsSyncingAccountIds.delete(accountId);
    }
  }
  for (const accountId of Array.from(state.awsDeepSyncingAccountIds)) {
    if (!liveIds.has(accountId)) {
      state.awsDeepSyncingAccountIds.delete(accountId);
    }
  }
}

function progressCellMarkup(progress) {
  const statusClass = `progress-${progress.status}`;
  const percent = clamp(Number(progress.percent || 0), 0, 100);

  return `
    <div class="progress-cell">
      <div class="progress-track ${statusClass}">
        <div class="progress-fill" style="width:${percent}%"></div>
      </div>
      <div class="progress-label">${progress.label || 'Idle'}</div>
    </div>
  `;
}

function buildContainerDetailMarkup(accountId) {
  const isLoading = Boolean(state.loadingContainersByAccount[accountId]);
  const containers = state.containersByAccount[accountId];
  const loadError = state.containerLoadErrorsByAccount[accountId];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading container details from cache...</div>';
  }

  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load containers: ${escapeHtml(loadError)}</div>`;
  }

  if (!Array.isArray(containers) || !containers.length) {
    return '<div class="detail-wrap detail-muted">No containers cached for this account.</div>';
  }

  const hasPermissionMismatch = containers.some((container) => {
    const errorText = String(container.last_error || '');
    return errorText.includes('AuthorizationPermissionMismatch') || errorText.includes('AuthorizationFailure');
  });

  const rows = containers
    .map((container) => {
      return `
        <tr>
          <td>${escapeHtml(container.container_name || '-')}</td>
          <td>${escapeHtml(String(container.blob_count ?? '-'))}</td>
          <td>${escapeHtml(formatBytes(container.last_size_bytes))}</td>
          <td>${escapeHtml(toLocalDate(container.last_size_scan_at))}</td>
          <td class="${container.last_error ? 'error' : ''}">${escapeHtml(container.last_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      ${
        hasPermissionMismatch
          ? '<div class="detail-error">Permission/network issue on one or more containers. Verify Storage Blob Data Reader role and firewall/private endpoint access.</div>'
          : ''
      }
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Container</th>
              <th>Blob count</th>
              <th>Size</th>
              <th>Last scanned</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function buildSecurityProfileMarkup(account, record) {
  if (!record) {
    return '<div class="detail-wrap detail-muted">No security profile cached for this account.</div>';
  }

  const profile = record.profile;
  if (!profile) {
    return `<div class="detail-wrap detail-muted">${
      record.last_security_scan_at
        ? `No profile details available. Last checked ${escapeHtml(toLocalDate(record.last_security_scan_at))}.`
        : 'No security profile cached for this account.'
    }</div>`;
  }

  const security = profile.security || {};
  const network = profile.network || {};
  const lifecycle = profile.lifecycleManagement || {};
  const diagnostics = profile.diagnostics || {};
  const blobService = profile.blobService || {};
  const accountTags = account?.tags || {};

  const ipRules = normalizeIpRuleValues(network.ipRules);
  const vnetRules = Array.isArray(network.virtualNetworkRules)
    ? network.virtualNetworkRules.map((rule) => rule?.id).filter(Boolean)
    : [];
  const privateEndpoints = Array.isArray(network.privateEndpointConnections)
    ? network.privateEndpointConnections
        .map((connection) => `${connection?.name || 'private-endpoint'} (${connection?.status || 'Unknown'})`)
        .filter(Boolean)
    : [];
  const enabledDiagSettings = Array.isArray(diagnostics.settings)
    ? diagnostics.settings.map((setting) => setting?.name).filter(Boolean)
    : [];

  return `
    <div class="detail-wrap">
      ${
        record.last_error
          ? `<div class="detail-error">Last scan error: ${escapeHtml(record.last_error)}</div>`
          : ''
      }
      <div class="security-grid">
        <div class="security-item"><span class="security-label">Last scanned</span><span>${escapeHtml(
          toLocalDate(record.last_security_scan_at)
        )}</span></div>
        <div class="security-item"><span class="security-label">Public network access</span><span>${escapeHtml(
          formatText(security.publicNetworkAccess)
        )}</span></div>
        <div class="security-item"><span class="security-label">Resource group</span><span>${escapeHtml(
          formatText(account?.resource_group_name)
        )}</span></div>
        <div class="security-item"><span class="security-label">Firewall default action</span><span>${escapeHtml(
          formatText(network.defaultAction)
        )}</span></div>
        <div class="security-item"><span class="security-label">TLS minimum</span><span>${escapeHtml(
          formatText(security.minimumTlsVersion)
        )}</span></div>
        <div class="security-item"><span class="security-label">HTTPS required</span><span>${escapeHtml(
          formatBool(security.supportsHttpsTrafficOnly)
        )}</span></div>
        <div class="security-item"><span class="security-label">Shared key access</span><span>${escapeHtml(
          formatBool(security.allowSharedKeyAccess)
        )}</span></div>
        <div class="security-item"><span class="security-label">Blob public access allowed</span><span>${escapeHtml(
          formatBool(security.allowBlobPublicAccess)
        )}</span></div>
        <div class="security-item"><span class="security-label">Lifecycle policy</span><span>${escapeHtml(
          lifecycle.enabled ? `Enabled (${lifecycle.totalRules || 0} rules)` : 'Not enabled'
        )}</span></div>
        <div class="security-item"><span class="security-label">Diagnostic settings</span><span>${escapeHtml(
          `${diagnostics.settingCount || 0}`
        )}</span></div>
        <div class="security-item"><span class="security-label">Delete retention enabled</span><span>${escapeHtml(
          formatBool(blobService.deleteRetentionPolicy?.enabled)
        )}</span></div>
        <div class="security-item"><span class="security-label">Versioning enabled</span><span>${escapeHtml(
          formatBool(blobService.versioningEnabled)
        )}</span></div>
        <div class="security-item"><span class="security-label">Change feed enabled</span><span>${escapeHtml(
          formatBool(blobService.changeFeedEnabled)
        )}</span></div>
      </div>
      <div class="security-lists">
        <div>
          <h3>Allowed IP rules (${ipRules.length})</h3>
          ${renderIpRuleList(ipRules)}
        </div>
        <div>
          <h3>Virtual network rules (${vnetRules.length})</h3>
          ${renderList(vnetRules)}
        </div>
        <div>
          <h3>Private endpoints (${privateEndpoints.length})</h3>
          ${renderList(privateEndpoints)}
        </div>
        <div>
          <h3>Diagnostic settings</h3>
          ${renderList(enabledDiagSettings)}
        </div>
        <div>
          <h3>Resource tags (${Object.keys(accountTags).length})</h3>
          ${renderList(Object.entries(accountTags).map(([key, value]) => `${key}=${value}`))}
        </div>
      </div>
    </div>
  `;
}

function securitySummaryForRecord(record) {
  const profile = record?.profile;
  if (!profile) {
    return {
      publicNetworkAccess: 'Unknown',
      minimumTlsVersion: 'Unknown',
      lifecycle: 'Unknown',
      ipRuleCount: '-',
      ipRulePreview: '-',
      ipRulePreviewFull: 'No cached security profile yet.'
    };
  }

  const security = profile.security || {};
  const network = profile.network || {};
  const lifecycle = profile.lifecycleManagement || {};
  const ipRules = normalizeIpRuleValues(network.ipRules);
  const previewItems = ipRules.slice(0, 2);
  const remaining = Math.max(0, ipRules.length - previewItems.length);
  const ipRulePreview = !ipRules.length ? 'None' : remaining > 0 ? `${previewItems.join(', ')} +${remaining}` : previewItems.join(', ');

  return {
    publicNetworkAccess: formatKnownText(security.publicNetworkAccess),
    minimumTlsVersion: formatKnownText(security.minimumTlsVersion),
    lifecycle: lifecycle.enabled ? `Enabled (${lifecycle.totalRules || 0})` : 'Not enabled',
    ipRuleCount: String(ipRules.length),
    ipRulePreview,
    ipRulePreviewFull: ipRules.length ? ipRules.join(', ') : 'No IP rules configured.'
  };
}

function getAccountContainerCount(account) {
  const cachedContainers = state.containersByAccount[account.account_id];
  if (Array.isArray(cachedContainers)) {
    return cachedContainers.length;
  }
  const fallback = Number(account.container_count || 0);
  return Number.isFinite(fallback) ? fallback : 0;
}

function getInventoryAccountSortValue(account, sortKey) {
  switch (sortKey) {
    case 'name':
      return account.name || '';
    case 'subscription':
      return account.subscription_name || account.subscription_id || '';
    case 'resourceGroup':
      return account.resource_group_name || '';
    case 'region':
      return account.location || '';
    case 'tags':
      return formatTags(account.tags);
    case 'containers':
      return getAccountContainerCount(account);
    case 'totalSize':
      return Number(account.total_size_bytes || 0);
    case 'usedCapacity':
      return account.metrics_used_capacity_bytes === null || account.metrics_used_capacity_bytes === undefined
        ? null
        : Number(account.metrics_used_capacity_bytes);
    case 'egress24h':
      return account.metrics_egress_bytes_24h === null || account.metrics_egress_bytes_24h === undefined
        ? null
        : Number(account.metrics_egress_bytes_24h);
    case 'ingress24h':
      return account.metrics_ingress_bytes_24h === null || account.metrics_ingress_bytes_24h === undefined
        ? null
        : Number(account.metrics_ingress_bytes_24h);
    case 'transactions24h':
      return account.metrics_transactions_24h === null || account.metrics_transactions_24h === undefined
        ? null
        : Number(account.metrics_transactions_24h);
    case 'lastSizePull':
      return toTimestampOrNull(account.last_size_scan_at);
    case 'lastMetricsPull':
    case 'lastSecurityPull':
      return toTimestampOrNull(account.metrics_last_scan_at);
    default:
      return account.name || '';
  }
}

function compareInventorySortValues(left, right) {
  const leftEmpty = left === null || left === undefined || left === '';
  const rightEmpty = right === null || right === undefined || right === '';

  if (leftEmpty && rightEmpty) {
    return 0;
  }
  if (leftEmpty) {
    return 1;
  }
  if (rightEmpty) {
    return -1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    if (!Number.isFinite(left) && !Number.isFinite(right)) {
      return 0;
    }
    if (!Number.isFinite(left)) {
      return 1;
    }
    if (!Number.isFinite(right)) {
      return -1;
    }
    return left - right;
  }

  return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
}

function getSortedInventoryAccounts(accounts) {
  const sortKey = state.accountSort?.key || 'name';
  const sortDirection = state.accountSort?.direction === 'desc' ? 'desc' : 'asc';
  const multiplier = sortDirection === 'desc' ? -1 : 1;

  return [...accounts].sort((leftAccount, rightAccount) => {
    const leftValue = getInventoryAccountSortValue(leftAccount, sortKey);
    const rightValue = getInventoryAccountSortValue(rightAccount, sortKey);
    const primary = compareInventorySortValues(leftValue, rightValue);
    if (primary !== 0) {
      return primary * multiplier;
    }

    const leftName = getInventoryAccountSortValue(leftAccount, 'name');
    const rightName = getInventoryAccountSortValue(rightAccount, 'name');
    return compareInventorySortValues(leftName, rightName);
  });
}

function renderInventorySortHeaderState() {
  const sortButtons = document.querySelectorAll('.sort-header-btn[data-sort-key]');
  const activeKey = state.accountSort?.key || 'name';
  const activeDirection = state.accountSort?.direction === 'desc' ? 'desc' : 'asc';

  for (const button of sortButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }
    const sortKey = button.getAttribute('data-sort-key') || '';
    const sortLabel = button.getAttribute('data-sort-label') || sortKey;
    const isActive = sortKey === activeKey;
    const indicator = button.querySelector('.sort-indicator');
    const th = button.closest('th');

    button.classList.toggle('active', isActive);
    if (indicator) {
      indicator.textContent = isActive ? (activeDirection === 'asc' ? '↑' : '↓') : '↕';
    }
    if (th) {
      th.setAttribute('aria-sort', isActive ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none');
    }

    const nextDirectionLabel = isActive && activeDirection === 'asc' ? 'descending' : 'ascending';
    button.setAttribute('aria-label', `${sortLabel}. Click to sort ${nextDirectionLabel}.`);
  }
}

function renderAccounts() {
  ensureProgressEntries();
  ui.accountsBody.innerHTML = '';
  renderInventorySortHeaderState();
  renderScopeTotals();

  const scopedAccounts = getScopedAccounts();
  if (!scopedAccounts.length) {
    ui.accountsBody.innerHTML = '<tr><td colspan="16" class="muted">No storage accounts in this scope.</td></tr>';
    return;
  }

  const query = normalizeSearch(ui.accountSearchInput.value);
  const filteredAccounts = query
    ? scopedAccounts.filter((acct) => {
        const tagsText = formatTags(acct.tags);
        return [
          acct.name,
          acct.subscription_name || acct.subscription_id,
          acct.subscription_id,
          acct.resource_group_name,
          acct.location,
          tagsText,
          formatBytesOrDash(acct.metrics_used_capacity_bytes),
          formatBytesOrDash(acct.metrics_egress_bytes_24h),
          formatBytesOrDash(acct.metrics_egress_bytes_30d),
          formatBytesOrDash(acct.metrics_ingress_bytes_24h),
          formatBytesOrDash(acct.metrics_ingress_bytes_30d),
          formatWholeNumberOrDash(acct.metrics_transactions_24h),
          formatWholeNumberOrDash(acct.metrics_transactions_30d)
        ].some((field) => containsSearch(field, query));
      })
    : scopedAccounts;

  if (!filteredAccounts.length) {
    ui.accountsBody.innerHTML = '<tr><td colspan="16" class="muted">No storage accounts match this search.</td></tr>';
    return;
  }

  const sortedAccounts = getSortedInventoryAccounts(filteredAccounts);

  for (const account of sortedAccounts) {
    const accountId = account.account_id;
    const isExpanded = state.expandedContainerAccountIds.has(accountId);
    const progress = state.accountProgress[accountId] || { status: 'idle', percent: 0, label: 'Idle' };
    const isActionBlocked =
      progress.status === 'running' || state.pullAllActive || state.pullMetricsAllActive || state.pullSecurityAllActive;
    const tagsText = formatTags(account.tags);
    const tagsSummary = tagsText ? shortenText(tagsText, 110) : '-';
    const cachedContainerCount = getAccountContainerCount(account);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class="row-toggle" data-action="toggle-containers" data-account-id="${accountId}" title="${
        isExpanded ? 'Collapse container details' : 'Expand container details'
      }">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(account.name || '-')}</td>
      <td>${escapeHtml(account.subscription_name || account.subscription_id || '-')}</td>
      <td>${escapeHtml(account.resource_group_name || '-')}</td>
      <td>${escapeHtml(account.location || '-')}</td>
      <td class="tags-cell" title="${escapeHtml(tagsText || 'No tags')}">${escapeHtml(tagsSummary)}</td>
      <td>${escapeHtml(String(cachedContainerCount))}</td>
      <td>${escapeHtml(formatBytes(account.total_size_bytes))}</td>
      <td class="metric-cell" title="${escapeHtml(formatBytesOrDash(account.metrics_used_capacity_bytes))}">${escapeHtml(
      formatBytesOrDash(account.metrics_used_capacity_bytes)
    )}</td>
      <td class="metric-cell" title="${escapeHtml(formatBytesOrDash(account.metrics_egress_bytes_24h))}">${escapeHtml(
      formatBytesOrDash(account.metrics_egress_bytes_24h)
    )}</td>
      <td class="metric-cell" title="${escapeHtml(formatBytesOrDash(account.metrics_ingress_bytes_24h))}">${escapeHtml(
      formatBytesOrDash(account.metrics_ingress_bytes_24h)
    )}</td>
      <td class="metric-cell" title="${escapeHtml(formatWholeNumberOrDash(account.metrics_transactions_24h))}">${escapeHtml(
      formatWholeNumberOrDash(account.metrics_transactions_24h)
    )}</td>
      <td>${escapeHtml(toLocalDate(account.last_size_scan_at))}</td>
      <td>${escapeHtml(toLocalDate(account.metrics_last_scan_at))}</td>
      <td>${progressCellMarkup(progress)}</td>
      <td>
        <div class="actions">
          <button data-action="pull" data-account-id="${accountId}" ${isActionBlocked ? 'disabled' : ''}>Pull sizes</button>
          <button data-action="open-security" data-account-id="${accountId}">Security view</button>
        </div>
      </td>
    `;
    ui.accountsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      detailRow.innerHTML = `<td colspan="16">${buildContainerDetailMarkup(accountId)}</td>`;
      ui.accountsBody.appendChild(detailRow);
    }
  }
}

function renderSecurityAccounts() {
  ui.securityAccountsBody.innerHTML = '';

  const scopedAccounts = getScopedAccounts();
  if (!scopedAccounts.length) {
    ui.securityAccountsBody.innerHTML = '<tr><td colspan="12" class="muted">No storage accounts in this scope.</td></tr>';
    return;
  }

  const query = normalizeSearch(ui.securitySearchInput.value);
  const filteredAccounts = query
    ? scopedAccounts.filter((account) => {
        const record = state.securityByAccount[account.account_id] || null;
        const summary = securitySummaryForRecord(record);
        return [
          account.name,
          account.subscription_name || account.subscription_id,
          account.subscription_id,
          account.resource_group_name,
          summary.publicNetworkAccess,
          summary.minimumTlsVersion,
          summary.lifecycle,
          summary.ipRuleCount,
          summary.ipRulePreview,
          summary.ipRulePreviewFull,
          record?.last_error
        ].some((field) => containsSearch(field, query));
      })
    : scopedAccounts;

  if (!filteredAccounts.length) {
    ui.securityAccountsBody.innerHTML = '<tr><td colspan="12" class="muted">No security rows match this search.</td></tr>';
    return;
  }

  for (const account of filteredAccounts) {
    const accountId = account.account_id;
    const record = state.securityByAccount[accountId] || null;
    const summary = securitySummaryForRecord(record);
    const isExpanded = state.expandedSecurityAccountIds.has(accountId);
    const isLoading = Boolean(state.loadingSecurityByAccount[accountId]);
    const isActionBlocked = state.pullAllActive || state.pullMetricsAllActive || state.pullSecurityAllActive;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class="row-toggle" data-action="toggle-security-details" data-account-id="${accountId}" title="${
        isExpanded ? 'Collapse security details' : 'Expand security details'
      }">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(account.name || '-')}</td>
      <td>${escapeHtml(account.subscription_name || account.subscription_id || '-')}</td>
      <td>${escapeHtml(account.resource_group_name || '-')}</td>
      <td>${escapeHtml(toLocalDate(record?.last_security_scan_at || account.last_security_scan_at))}</td>
      <td>${escapeHtml(summary.publicNetworkAccess)}</td>
      <td>${escapeHtml(summary.minimumTlsVersion)}</td>
      <td>${escapeHtml(summary.lifecycle)}</td>
      <td>${escapeHtml(summary.ipRuleCount)}</td>
      <td class="ip-preview-cell" title="${escapeHtml(summary.ipRulePreviewFull)}">${escapeHtml(summary.ipRulePreview)}</td>
      <td class="${record?.last_error ? 'error' : ''}">${escapeHtml(record?.last_error || account.last_security_error || '-')}</td>
      <td>
        <div class="actions">
          <button data-action="pull-security" data-account-id="${accountId}" ${isActionBlocked ? 'disabled' : ''}>Pull security</button>
        </div>
      </td>
    `;
    ui.securityAccountsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      if (isLoading) {
        detailRow.innerHTML = '<td colspan="12"><div class="detail-wrap detail-muted">Loading security profile from cache...</div></td>';
      } else {
        detailRow.innerHTML = `<td colspan="12">${buildSecurityProfileMarkup(account, record)}</td>`;
      }
      ui.securityAccountsBody.appendChild(detailRow);
    }
  }
}

function formatAwsAggregateMetric(metricSummary, formatter) {
  if (!metricSummary || Number(metricSummary.accountCountWithMetric || 0) === 0) {
    return '-';
  }
  return formatter(metricSummary.total || 0);
}

function renderAwsBucketDetailMarkup(accountId, pricing) {
  const isLoading = Boolean(state.awsLoadingBucketsByAccount[accountId]);
  const loadError = state.awsBucketLoadErrorsByAccount[accountId];
  const buckets = state.awsBucketsByAccount[accountId];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading bucket details from cache...</div>';
  }
  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load buckets: ${escapeHtml(loadError)}</div>`;
  }
  if (!Array.isArray(buckets) || !buckets.length) {
    return '<div class="detail-wrap detail-muted">No buckets cached for this account.</div>';
  }

  const rows = buckets
    .map((bucket) => {
      const usageBytes = Number.isFinite(Number(bucket.usage_bytes)) ? Math.max(0, Number(bucket.usage_bytes)) : 0;
      const egressBytes24h = Number.isFinite(Number(bucket.egress_bytes_24h)) ? Math.max(0, Number(bucket.egress_bytes_24h)) : 0;
      const tx24h = Number.isFinite(Number(bucket.transactions_24h)) ? Math.max(0, Number(bucket.transactions_24h)) : 0;
      const storageDailyCost = ((usageBytes / pricing.bytesPerGb) * pricing.s3StorageStandardGbMonth) / pricing.daysInMonth;
      const egressCost24h = Math.max(0, egressBytes24h / pricing.bytesPerGb - pricing.s3EgressFreeGb) * pricing.s3EgressPerGb;
      const txCost24h = (tx24h / pricing.s3RequestUnitSize) * pricing.s3RequestUnitPrice;
      const totalCost24h = storageDailyCost + egressCost24h + txCost24h;

      return `
        <tr>
          <td>${escapeHtml(bucket.bucket_name || '-')}</td>
          <td>${escapeHtml(formatBytesOrDash(bucket.usage_bytes))}</td>
          <td>${escapeHtml(formatWholeNumberOrDash(bucket.object_count))}</td>
          <td>${escapeHtml(formatBytesOrDash(bucket.egress_bytes_24h))}</td>
          <td>${escapeHtml(formatBytesOrDash(bucket.ingress_bytes_24h))}</td>
          <td>${escapeHtml(formatWholeNumberOrDash(bucket.transactions_24h))}</td>
          <td>${escapeHtml(formatCurrency(totalCost24h, pricing.currency))}</td>
          <td>${escapeHtml(toLocalDate(bucket.last_sync_at))}</td>
          <td>${escapeHtml(formatText(bucket.size_source))}</td>
          <td class="${bucket.last_error ? 'error' : ''}">${escapeHtml(bucket.last_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      <h3>S3 buckets</h3>
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Used capacity</th>
              <th>Objects</th>
              <th>Egress 24h</th>
              <th>Ingress 24h</th>
              <th>Txns 24h</th>
              <th>Est. cost 24h</th>
              <th>Last sync</th>
              <th>Source</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAwsBucketSecurityDetailMarkup(accountId) {
  const isLoading = Boolean(state.awsLoadingBucketsByAccount[accountId]);
  const loadError = state.awsBucketLoadErrorsByAccount[accountId];
  const buckets = state.awsBucketsByAccount[accountId];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading bucket security details from cache...</div>';
  }
  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load bucket security: ${escapeHtml(loadError)}</div>`;
  }
  if (!Array.isArray(buckets) || !buckets.length) {
    return '<div class="detail-wrap detail-muted">No buckets cached for this account.</div>';
  }

  const rows = buckets
    .map((bucket) => {
      const lifecycleRuleCount = Number.isFinite(Number(bucket.lifecycle_rule_count))
        ? Math.max(0, Math.round(Number(bucket.lifecycle_rule_count)))
        : 0;
      const publicAccess = formatNullableBool(bucket.public_access_block_enabled, 'Blocked', 'Open', '-');
      const policyPublic = formatNullableBool(bucket.policy_is_public, 'Public', 'Not public', '-');
      const encryption = formatNullableBool(bucket.encryption_enabled, 'Enabled', 'Not set', '-');
      const versioningStatus = bucket.versioning_status || '-';
      const lifecycle = formatNullableBool(
        bucket.lifecycle_enabled,
        `Enabled (${lifecycleRuleCount.toLocaleString()} rule${lifecycleRuleCount === 1 ? '' : 's'})`,
        'Not enabled',
        '-'
      );
      const logging = formatNullableBool(bucket.access_logging_enabled, 'Enabled', 'Disabled', '-');

      return `
        <tr>
          <td>${escapeHtml(bucket.bucket_name || '-')}</td>
          <td>${escapeHtml(publicAccess)}</td>
          <td>${escapeHtml(policyPublic)}</td>
          <td>${escapeHtml(encryption)}</td>
          <td>${escapeHtml(bucket.encryption_algorithm || '-')}</td>
          <td>${escapeHtml(versioningStatus)}</td>
          <td>${escapeHtml(lifecycle)}</td>
          <td>${escapeHtml(logging)}</td>
          <td>${escapeHtml(formatNullableBool(bucket.object_lock_enabled, 'Enabled', 'Disabled', '-'))}</td>
          <td>${escapeHtml(bucket.ownership_controls || '-')}</td>
          <td>${escapeHtml(toLocalDate(bucket.last_security_scan_at))}</td>
          <td class="${bucket.security_error ? 'error' : ''}">${escapeHtml(bucket.security_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      <h3>Bucket security posture</h3>
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Public access block</th>
              <th>Policy status</th>
              <th>Encryption</th>
              <th>Enc. algo</th>
              <th>Versioning</th>
              <th>Lifecycle</th>
              <th>Access logging</th>
              <th>Object lock</th>
              <th>Ownership</th>
              <th>Last sec scan</th>
              <th>Sec error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAwsEfsDetailMarkup(accountId, pricing) {
  const isLoading = Boolean(state.awsLoadingEfsByAccount[accountId]);
  const loadError = state.awsEfsLoadErrorsByAccount[accountId];
  const fileSystems = state.awsEfsByAccount[accountId];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading EFS details from cache...</div>';
  }
  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load EFS file systems: ${escapeHtml(loadError)}</div>`;
  }
  if (!Array.isArray(fileSystems) || !fileSystems.length) {
    return '<div class="detail-wrap detail-muted">No EFS file systems cached for this account.</div>';
  }

  const rows = fileSystems
    .map((fileSystem) => {
      const sizeBytes = Number.isFinite(Number(fileSystem.size_bytes)) ? Math.max(0, Number(fileSystem.size_bytes)) : 0;
      const monthlyCost = (sizeBytes / pricing.bytesPerGb) * pricing.efsStandardGbMonth;
      const dailyCost = monthlyCost / pricing.daysInMonth;
      return `
        <tr>
          <td>${escapeHtml(fileSystem.name || fileSystem.file_system_id || '-')}</td>
          <td>${escapeHtml(fileSystem.file_system_id || '-')}</td>
          <td>${escapeHtml(fileSystem.region || '-')}</td>
          <td>${escapeHtml(formatBytesOrDash(fileSystem.size_bytes))}</td>
          <td>${escapeHtml(formatText(fileSystem.performance_mode))}</td>
          <td>${escapeHtml(formatText(fileSystem.throughput_mode))}</td>
          <td>${escapeHtml(fileSystem.encrypted === null || fileSystem.encrypted === undefined ? '-' : fileSystem.encrypted ? 'Yes' : 'No')}</td>
          <td>${escapeHtml(formatCurrency(dailyCost, pricing.currency))}</td>
          <td>${escapeHtml(toLocalDate(fileSystem.last_sync_at))}</td>
          <td class="${fileSystem.last_error ? 'error' : ''}">${escapeHtml(fileSystem.last_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      <h3>EFS file systems</h3>
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>File system ID</th>
              <th>Region</th>
              <th>Used size</th>
              <th>Performance</th>
              <th>Throughput</th>
              <th>Encrypted</th>
              <th>Est. cost 24h</th>
              <th>Last sync</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAwsAccountDetailMarkup(accountId) {
  const pricing = getAwsPricingAssumptions();
  return `${renderAwsBucketDetailMarkup(accountId, pricing)}${renderAwsEfsDetailMarkup(accountId, pricing)}`;
}

function renderAwsTotals() {
  if (
    !ui.awsTotalStorage ||
    !ui.awsTotalObjects ||
    !ui.awsTotalEfsCount ||
    !ui.awsTotalEfsStorage ||
    !ui.awsTotalEgress24h ||
    !ui.awsTotalIngress24h ||
    !ui.awsTotalTransactions24h ||
    !ui.awsTotalEgress30d ||
    !ui.awsTotalIngress30d ||
    !ui.awsTotalTransactions30d ||
    !ui.awsEstimatedCost24h ||
    !ui.awsEstimatedCost30d ||
    !ui.awsTotalsCoverage ||
    !ui.awsNotes
  ) {
    return;
  }

  const totals = computeAwsProviderStats(state.awsAccounts, getAwsPricingAssumptions());

  ui.awsTotalStorage.textContent = formatAwsAggregateMetric(totals.storage, formatBytes);
  ui.awsTotalObjects.textContent = formatAwsAggregateMetric(totals.objects, formatWholeNumber);
  ui.awsTotalEfsCount.textContent = formatAwsAggregateMetric(totals.efsCount, formatWholeNumber);
  ui.awsTotalEfsStorage.textContent = formatAwsAggregateMetric(totals.efsStorage, formatBytes);
  ui.awsTotalEgress24h.textContent = formatAwsAggregateMetric(totals.egress24h, formatBytes);
  ui.awsTotalIngress24h.textContent = formatAwsAggregateMetric(totals.ingress24h, formatBytes);
  ui.awsTotalTransactions24h.textContent = formatAwsAggregateMetric(totals.transactions24h, formatWholeNumber);
  ui.awsTotalEgress30d.textContent = formatAwsAggregateMetric(totals.egress30d, formatBytes);
  ui.awsTotalIngress30d.textContent = formatAwsAggregateMetric(totals.ingress30d, formatBytes);
  ui.awsTotalTransactions30d.textContent = formatAwsAggregateMetric(totals.transactions30d, formatWholeNumber);
  ui.awsEstimatedCost24h.textContent = formatCurrency(totals.costs.totalEstimatedCost24h, totals.pricing.currency);
  ui.awsEstimatedCost30d.textContent = formatCurrency(totals.costs.totalEstimatedCost30d, totals.pricing.currency);

  ui.awsTotalsCoverage.textContent = `${state.awsAccounts.length} account(s) in cache. Coverage: storage ${totals.storage.accountCountWithMetric}/${totals.accountCount}, objects ${totals.objects.accountCountWithMetric}/${totals.accountCount}, egress24 ${totals.egress24h.accountCountWithMetric}/${totals.accountCount}, ingress24 ${totals.ingress24h.accountCountWithMetric}/${totals.accountCount}, tx24 ${totals.transactions24h.accountCountWithMetric}/${totals.accountCount}, efs ${totals.efsCount.accountCountWithMetric}/${totals.accountCount}, security ${totals.securityScanBuckets.accountCountWithMetric}/${totals.accountCount}.`;

  const deepDefault = Boolean(state.config?.aws?.defaultDeepScan);
  const requestMetricsDefault = Boolean(state.config?.aws?.defaultRequestMetrics);
  const securityDefault = Boolean(state.config?.aws?.defaultSecurityScan);
  ui.awsNotes.textContent = `Default sync mode: ${deepDefault ? 'deep scan' : 'low-cost CloudWatch + bucket list'}. Request metrics default: ${
    requestMetricsDefault ? 'enabled' : 'disabled'
  }. Security scan default: ${securityDefault ? 'enabled' : 'disabled'}. Security coverage: scanned buckets ${formatWholeNumber(
    totals.securityScanBuckets.total
  )}, security error buckets ${formatWholeNumber(totals.securityErrorBuckets.total)}. Pricing assumptions (${totals.pricing.regionLabel}): S3 ${formatCurrency(
    totals.pricing.s3StorageStandardGbMonth,
    totals.pricing.currency
  )}/GB-month, EFS ${formatCurrency(totals.pricing.efsStandardGbMonth, totals.pricing.currency)}/GB-month, egress ${formatCurrency(
    totals.pricing.s3EgressPerGb,
    totals.pricing.currency
  )}/GB after ${totals.pricing.s3EgressFreeGb.toLocaleString()} GB free, requests ${formatCurrency(
    totals.pricing.s3RequestUnitPrice,
    totals.pricing.currency
  )}/${totals.pricing.s3RequestUnitSize.toLocaleString()} (${totals.pricing.s3RequestRateLabel}) from ${totals.pricing.source} as of ${
    totals.pricing.asOfDate
  }.`;

  renderUnifiedStats();
}

function getAwsAccountSortValue(account, sortKey, pricing = getAwsPricingAssumptions()) {
  const derived = computeAwsAccountDerivedMetrics(account, pricing);
  switch (sortKey) {
    case 'account':
      return account.display_name || account.account_id || '';
    case 'region':
      return account.region || '';
    case 'buckets':
      return Number(account.bucket_count || 0);
    case 'efsCount':
      return Number(account.efs_count || 0);
    case 'totalUsage':
      return Number(derived.storageBytes || 0);
    case 'totalObjects':
      return Number(account.total_object_count || 0);
    case 'egress24h':
      return account.total_egress_bytes_24h === null || account.total_egress_bytes_24h === undefined
        ? null
        : Number(account.total_egress_bytes_24h);
    case 'ingress24h':
      return account.total_ingress_bytes_24h === null || account.total_ingress_bytes_24h === undefined
        ? null
        : Number(account.total_ingress_bytes_24h);
    case 'txns24h':
      return account.total_transactions_24h === null || account.total_transactions_24h === undefined
        ? null
        : Number(account.total_transactions_24h);
    case 'estCost24h':
      return Number(derived.costs.totalEstimatedCost24h || 0);
    case 'securityCoverage': {
      const bucketCount = Number(account.bucket_count || 0);
      const scanned = Number(account.security_scan_bucket_count || 0);
      if (!bucketCount) {
        return null;
      }
      return scanned / bucketCount;
    }
    case 'lastSync': {
      const timestamps = [
        toTimestampOrNull(account.last_sync_at),
        toTimestampOrNull(account.last_bucket_sync_at),
        toTimestampOrNull(account.last_security_scan_at),
        toTimestampOrNull(account.last_efs_sync_at)
      ].filter((value) => value !== null);
      return timestamps.length ? Math.max(...timestamps) : null;
    }
    case 'error':
      return account.last_error || '';
    default:
      return account.display_name || account.account_id || '';
  }
}

function getSortedAwsAccounts(accounts) {
  const sortKey = state.awsSort?.key || 'account';
  const sortDirection = state.awsSort?.direction === 'desc' ? 'desc' : 'asc';
  const multiplier = sortDirection === 'desc' ? -1 : 1;
  const pricing = getAwsPricingAssumptions();

  return [...accounts].sort((leftAccount, rightAccount) => {
    const leftValue = getAwsAccountSortValue(leftAccount, sortKey, pricing);
    const rightValue = getAwsAccountSortValue(rightAccount, sortKey, pricing);
    const primary = compareInventorySortValues(leftValue, rightValue);
    if (primary !== 0) {
      return primary * multiplier;
    }

    const leftName = getAwsAccountSortValue(leftAccount, 'account', pricing);
    const rightName = getAwsAccountSortValue(rightAccount, 'account', pricing);
    return compareInventorySortValues(leftName, rightName);
  });
}

function renderAwsSortHeaderState() {
  if (!ui.awsAccountsTableHead) {
    return;
  }
  const sortButtons = ui.awsAccountsTableHead.querySelectorAll('.sort-header-btn[data-aws-sort-key]');
  const activeKey = state.awsSort?.key || 'account';
  const activeDirection = state.awsSort?.direction === 'desc' ? 'desc' : 'asc';

  for (const button of sortButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }
    const sortKey = button.getAttribute('data-aws-sort-key') || '';
    const sortLabel = button.getAttribute('data-aws-sort-label') || sortKey;
    const isActive = sortKey === activeKey;
    const indicator = button.querySelector('.sort-indicator');
    const th = button.closest('th');

    button.classList.toggle('active', isActive);
    if (indicator) {
      indicator.textContent = isActive ? (activeDirection === 'asc' ? '↑' : '↓') : '↕';
    }
    if (th) {
      th.setAttribute('aria-sort', isActive ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none');
    }

    const nextDirectionLabel = isActive && activeDirection === 'asc' ? 'descending' : 'ascending';
    button.setAttribute('aria-label', `${sortLabel}. Click to sort ${nextDirectionLabel}.`);
  }
}

function renderAwsAccounts() {
  if (!ui.awsAccountsBody) {
    return;
  }

  const configured = Boolean(state.config?.aws?.configured);
  const configError = state.config?.aws?.configError || '';
  if (ui.awsConfigInfo) {
    if (configError) {
      ui.awsConfigInfo.textContent = `Config error: ${configError}`;
    } else if (configured) {
      const count = Number(state.config?.aws?.accountCount || state.awsAccounts.length || 0);
      ui.awsConfigInfo.textContent = `${count} account(s) configured`;
    } else {
      ui.awsConfigInfo.textContent = 'No AWS account configured';
    }
  }

  syncAwsButtonsDisabledState();
  renderAwsTotals();
  renderAwsSortHeaderState();
  ui.awsAccountsBody.innerHTML = '';

  if (!configured) {
    ui.awsAccountsBody.innerHTML = `<tr><td colspan=\"14\" class=\"muted\">${escapeHtml(
      configError || 'Configure AWS_ACCOUNTS_JSON (or AWS_DEFAULT_* vars) on the server to enable AWS sync.'
    )}</td></tr>`;
    renderAwsSecurityAccounts();
    return;
  }

  const pricing = getAwsPricingAssumptions();
  const accountsWithDerived = state.awsAccounts.map((account) => ({
    ...account,
    _derived: computeAwsAccountDerivedMetrics(account, pricing)
  }));
  const query = normalizeSearch(ui.awsSearchInput?.value || '');
  const filteredAccounts = query
    ? accountsWithDerived.filter((account) => {
        const derived = account._derived || {};
        return [
          account.display_name,
          account.account_id,
          account.bucket_names_csv,
          account.efs_names_csv,
          account.region,
          account.cloudwatch_region,
          account.s3_endpoint,
          formatWholeNumberOrDash(account.efs_count),
          formatBytesOrDash(account.total_efs_size_bytes),
          formatBytesOrDash(derived.storageBytes),
          formatBytesOrDash(account.total_usage_bytes),
          formatWholeNumberOrDash(account.total_object_count),
          formatBytesOrDash(account.total_egress_bytes_24h),
          formatBytesOrDash(account.total_ingress_bytes_24h),
          formatWholeNumberOrDash(account.total_transactions_24h),
          formatBytesOrDash(account.total_egress_bytes_30d),
          formatBytesOrDash(account.total_ingress_bytes_30d),
          formatWholeNumberOrDash(account.total_transactions_30d),
          formatCurrency(derived?.costs?.totalEstimatedCost24h || 0, pricing.currency),
          account.last_error
        ].some((field) => containsSearch(field, query));
      })
    : accountsWithDerived;

  if (!filteredAccounts.length) {
    ui.awsAccountsBody.innerHTML = '<tr><td colspan=\"14\" class=\"muted\">No AWS rows match this search.</td></tr>';
    renderAwsSecurityAccounts();
    return;
  }

  const sortedAccounts = getSortedAwsAccounts(filteredAccounts);

  for (const account of sortedAccounts) {
    const accountId = account.account_id;
    const isExpanded = state.expandedAwsAccountIds.has(accountId);
    const accountSyncing = state.awsSyncingAccountIds.has(accountId);
    const accountDeepSyncing = state.awsDeepSyncingAccountIds.has(accountId);
    const syncDisabled =
      state.awsSyncAllActive ||
      state.awsDeepSyncAllActive ||
      accountSyncing ||
      accountDeepSyncing ||
      state.exportCsvActive;
    const deepDisabled = syncDisabled;
    const exportDisabled = syncDisabled;
    const derived = account._derived || computeAwsAccountDerivedMetrics(account, pricing);
    const lastSyncTimestamps = [
      toTimestampOrNull(account.last_sync_at),
      toTimestampOrNull(account.last_bucket_sync_at),
      toTimestampOrNull(account.last_security_scan_at),
      toTimestampOrNull(account.last_efs_sync_at)
    ].filter((value) => value !== null);
    const lastSyncAt = lastSyncTimestamps.length ? new Date(Math.max(...lastSyncTimestamps)).toISOString() : null;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class=\"row-toggle\" data-action=\"toggle-aws-buckets\" data-account-id=\"${accountId}\" title=\"${
      isExpanded ? 'Collapse account details' : 'Expand account details'
    }\">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(account.display_name || account.account_id || '-')}</td>
      <td>${escapeHtml(account.region || '-')}</td>
      <td>${escapeHtml(String(account.bucket_count ?? 0))}</td>
      <td>${escapeHtml(formatWholeNumberOrDash(account.efs_count))}</td>
      <td>${escapeHtml(formatBytesOrDash(derived.storageBytes))}</td>
      <td>${escapeHtml(formatWholeNumberOrDash(account.total_object_count))}</td>
      <td class="metric-cell">${escapeHtml(formatBytesOrDash(account.total_egress_bytes_24h))}</td>
      <td class="metric-cell">${escapeHtml(formatBytesOrDash(account.total_ingress_bytes_24h))}</td>
      <td class="metric-cell">${escapeHtml(formatWholeNumberOrDash(account.total_transactions_24h))}</td>
      <td class="metric-cell">${escapeHtml(formatCurrency(derived.costs.totalEstimatedCost24h, pricing.currency))}</td>
      <td>${escapeHtml(toLocalDate(lastSyncAt))}</td>
      <td class=\"${account.last_error ? 'error' : ''}\">${escapeHtml(account.last_error || '-')}</td>
      <td>
        <div class=\"actions\">
          <button data-action=\"sync-aws-account\" data-account-id=\"${accountId}\" ${syncDisabled ? 'disabled' : ''}>Sync now</button>
          <button data-action=\"deep-sync-aws-account\" data-account-id=\"${accountId}\" ${deepDisabled ? 'disabled' : ''}>Deep scan</button>
          <button data-action=\"export-aws-account\" data-account-id=\"${accountId}\" ${exportDisabled ? 'disabled' : ''}>Export CSV</button>
        </div>
      </td>
    `;
    ui.awsAccountsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      detailRow.innerHTML = `<td colspan=\"14\">${renderAwsAccountDetailMarkup(accountId)}</td>`;
      ui.awsAccountsBody.appendChild(detailRow);
    }
  }

  renderAwsSecurityAccounts();
}

function renderAwsSecurityAccounts() {
  if (!ui.awsSecurityAccountsBody) {
    return;
  }

  const configured = Boolean(state.config?.aws?.configured);
  const configError = state.config?.aws?.configError || '';
  ui.awsSecurityAccountsBody.innerHTML = '';

  if (!configured) {
    ui.awsSecurityAccountsBody.innerHTML = `<tr><td colspan=\"10\" class=\"muted\">${escapeHtml(
      configError || 'Configure AWS_ACCOUNTS_JSON (or AWS_DEFAULT_* vars) on the server to enable AWS security posture scans.'
    )}</td></tr>`;
    return;
  }

  const query = normalizeSearch(ui.awsSecuritySearchInput?.value || '');
  const filteredAccounts = query
    ? state.awsAccounts.filter((account) => {
        const scanned = Number(account.security_scan_bucket_count || 0);
        const bucketCount = Number(account.bucket_count || 0);
        const securityErrors = Number(account.security_error_bucket_count || 0);
        const bucketNamesFromCache = Array.isArray(state.awsBucketsByAccount[account.account_id])
          ? state.awsBucketsByAccount[account.account_id].map((bucket) => bucket.bucket_name).join(' ')
          : '';
        return [
          account.display_name,
          account.account_id,
          account.region,
          account.bucket_names_csv,
          bucketNamesFromCache,
          String(bucketCount),
          String(scanned),
          String(securityErrors),
          bucketCount ? `${Math.round((scanned / Math.max(1, bucketCount)) * 100)}%` : '0%',
          account.last_security_scan_at,
          account.last_error
        ].some((field) => containsSearch(field, query));
      })
    : state.awsAccounts;

  if (!filteredAccounts.length) {
    ui.awsSecurityAccountsBody.innerHTML = '<tr><td colspan=\"10\" class=\"muted\">No AWS security rows match this search.</td></tr>';
    return;
  }

  for (const account of filteredAccounts) {
    const accountId = account.account_id;
    const isExpanded = state.expandedAwsSecurityAccountIds.has(accountId);
    const bucketCount = Math.max(0, Number(account.bucket_count || 0));
    const scanned = Math.max(0, Number(account.security_scan_bucket_count || 0));
    const securityErrors = Math.max(0, Number(account.security_error_bucket_count || 0));
    const coverage = bucketCount ? `${Math.round((scanned / bucketCount) * 100)}%` : '-';
    const accountSyncing = state.awsSyncingAccountIds.has(accountId);
    const accountDeepSyncing = state.awsDeepSyncingAccountIds.has(accountId);
    const syncDisabled =
      state.awsSyncAllActive ||
      state.awsDeepSyncAllActive ||
      accountSyncing ||
      accountDeepSyncing ||
      state.exportCsvActive;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class=\"row-toggle\" data-action=\"toggle-aws-security-details\" data-account-id=\"${accountId}\" title=\"${
      isExpanded ? 'Collapse security details' : 'Expand security details'
    }\">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(account.display_name || account.account_id || '-')}</td>
      <td>${escapeHtml(account.region || '-')}</td>
      <td>${escapeHtml(formatWholeNumber(bucketCount))}</td>
      <td>${escapeHtml(formatWholeNumber(scanned))}</td>
      <td>${escapeHtml(coverage)}</td>
      <td>${escapeHtml(formatWholeNumber(securityErrors))}</td>
      <td>${escapeHtml(toLocalDate(account.last_security_scan_at))}</td>
      <td class=\"${account.last_error ? 'error' : ''}\">${escapeHtml(account.last_error || '-')}</td>
      <td>
        <div class=\"actions\">
          <button data-action=\"security-sync-aws-account\" data-account-id=\"${accountId}\" ${syncDisabled ? 'disabled' : ''}>Pull security</button>
        </div>
      </td>
    `;
    ui.awsSecurityAccountsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      detailRow.innerHTML = `<td colspan=\"10\">${renderAwsBucketSecurityDetailMarkup(accountId)}</td>`;
      ui.awsSecurityAccountsBody.appendChild(detailRow);
    }
  }
}

async function toggleAwsSecurityDetails(accountId) {
  if (state.expandedAwsSecurityAccountIds.has(accountId)) {
    state.expandedAwsSecurityAccountIds.delete(accountId);
    renderAwsSecurityAccounts();
    return;
  }

  state.expandedAwsSecurityAccountIds.add(accountId);
  renderAwsSecurityAccounts();
  try {
    await loadAwsBucketsForAccount(accountId, false);
  } catch (error) {
    log(`Failed to load AWS security details for ${accountId}: ${error.message}`, true);
  }
}

function renderWasabiBucketDetailMarkup(accountId) {
  const isLoading = Boolean(state.wasabiLoadingBucketsByAccount[accountId]);
  const loadError = state.wasabiBucketLoadErrorsByAccount[accountId];
  const buckets = state.wasabiBucketsByAccount[accountId];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading bucket details from cache...</div>';
  }
  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load buckets: ${escapeHtml(loadError)}</div>`;
  }
  if (!Array.isArray(buckets) || !buckets.length) {
    return '<div class="detail-wrap detail-muted">No buckets cached for this account.</div>';
  }

  const rows = buckets
    .map((bucket) => {
      return `
        <tr>
          <td>${escapeHtml(bucket.bucket_name || '-')}</td>
          <td>${escapeHtml(formatBytesOrDash(bucket.usage_bytes))}</td>
          <td>${escapeHtml(formatWholeNumberOrDash(bucket.object_count))}</td>
          <td>${escapeHtml(toLocalDate(bucket.last_sync_at))}</td>
          <td class="${bucket.last_error ? 'error' : ''}">${escapeHtml(bucket.last_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Used capacity</th>
              <th>Objects</th>
              <th>Last sync</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderWasabiTotals() {
  if (
    !ui.wasabiTotalStorage ||
    !ui.wasabiTotalObjects ||
    !ui.wasabiEstimatedCost24h ||
    !ui.wasabiEstimatedCost30d ||
    !ui.wasabiTotalsCoverage ||
    !ui.wasabiPricingAssumptions
  ) {
    return;
  }

  const totals = computeWasabiProviderStats(state.wasabiAccounts, getWasabiPricingAssumptions());
  const pricing = totals.pricing;

  ui.wasabiTotalStorage.textContent = formatBytes(totals.storageBytes);
  ui.wasabiTotalObjects.textContent = formatWholeNumber(totals.objectCount);
  ui.wasabiEstimatedCost24h.textContent = formatCurrency(totals.estimated24h, pricing.currency);
  ui.wasabiEstimatedCost30d.textContent = formatCurrency(totals.estimated30d, pricing.currency);
  ui.wasabiTotalsCoverage.textContent = `${state.wasabiAccounts.length} account(s), ${totals.bucketCount.toLocaleString()} bucket(s) in cache.`;
  ui.wasabiPricingAssumptions.textContent = `Estimate assumptions: ${formatCurrency(
    pricing.storagePricePerTbMonth,
    pricing.currency
  )}/TB-month from ${pricing.source} as of ${pricing.asOfDate}; ${pricing.daysInMonth}-day month; minimum billable ${pricing.minimumBillableTb} TB/account/month.`;

  renderUnifiedStats();
}

function getWasabiAccountSortValue(account, sortKey, pricing) {
  switch (sortKey) {
    case 'account':
      return account.display_name || account.account_id || '';
    case 'region':
      return account.region || '';
    case 'buckets':
      return Number(account.bucket_count || 0);
    case 'totalUsage':
      return Number(account.total_usage_bytes || 0);
    case 'totalObjects':
      return Number(account.total_object_count || 0);
    case 'estimated24h':
      return estimateWasabiStorageCost(account.total_usage_bytes, pricing).estimated24h;
    case 'estimated30d':
      return estimateWasabiStorageCost(account.total_usage_bytes, pricing).estimated30d;
    case 'lastSync':
      return toTimestampOrNull(account.last_sync_at || account.last_bucket_sync_at);
    case 'error':
      return account.last_error || '';
    default:
      return account.display_name || account.account_id || '';
  }
}

function getSortedWasabiAccounts(accounts, pricing) {
  const sortKey = state.wasabiSort?.key || 'account';
  const sortDirection = state.wasabiSort?.direction === 'desc' ? 'desc' : 'asc';
  const multiplier = sortDirection === 'desc' ? -1 : 1;

  return [...accounts].sort((leftAccount, rightAccount) => {
    const leftValue = getWasabiAccountSortValue(leftAccount, sortKey, pricing);
    const rightValue = getWasabiAccountSortValue(rightAccount, sortKey, pricing);
    const primary = compareInventorySortValues(leftValue, rightValue);
    if (primary !== 0) {
      return primary * multiplier;
    }

    const leftName = getWasabiAccountSortValue(leftAccount, 'account', pricing);
    const rightName = getWasabiAccountSortValue(rightAccount, 'account', pricing);
    return compareInventorySortValues(leftName, rightName);
  });
}

function renderWasabiSortHeaderState() {
  if (!ui.wasabiAccountsTableHead) {
    return;
  }
  const sortButtons = ui.wasabiAccountsTableHead.querySelectorAll('.sort-header-btn[data-wasabi-sort-key]');
  const activeKey = state.wasabiSort?.key || 'account';
  const activeDirection = state.wasabiSort?.direction === 'desc' ? 'desc' : 'asc';

  for (const button of sortButtons) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }
    const sortKey = button.getAttribute('data-wasabi-sort-key') || '';
    const sortLabel = button.getAttribute('data-wasabi-sort-label') || sortKey;
    const isActive = sortKey === activeKey;
    const indicator = button.querySelector('.sort-indicator');
    const th = button.closest('th');

    button.classList.toggle('active', isActive);
    if (indicator) {
      indicator.textContent = isActive ? (activeDirection === 'asc' ? '↑' : '↓') : '↕';
    }
    if (th) {
      th.setAttribute('aria-sort', isActive ? (activeDirection === 'asc' ? 'ascending' : 'descending') : 'none');
    }

    const nextDirectionLabel = isActive && activeDirection === 'asc' ? 'descending' : 'ascending';
    button.setAttribute('aria-label', `${sortLabel}. Click to sort ${nextDirectionLabel}.`);
  }
}

function renderWasabiAccounts() {
  if (!ui.wasabiAccountsBody) {
    return;
  }

  const configured = Boolean(state.config?.wasabi?.configured);
  const configError = state.config?.wasabi?.configError || '';
  if (ui.wasabiConfigInfo) {
    if (configError) {
      ui.wasabiConfigInfo.textContent = `Config error: ${configError}`;
    } else if (configured) {
      const count = Number(state.config?.wasabi?.accountCount || state.wasabiAccounts.length || 0);
      ui.wasabiConfigInfo.textContent = `${count} account(s) configured`;
    } else {
      ui.wasabiConfigInfo.textContent = 'No Wasabi account configured';
    }
  }

  syncWasabiButtonsDisabledState();
  renderWasabiTotals();
  renderWasabiSortHeaderState();
  ui.wasabiAccountsBody.innerHTML = '';

  if (!configured) {
    ui.wasabiAccountsBody.innerHTML = `<tr><td colspan=\"11\" class=\"muted\">${escapeHtml(
      configError || 'Configure WASABI_ACCOUNTS_JSON (or WASABI_ACCESS_KEY/WASABI_SECRET_KEY) on the server to enable Wasabi sync.'
    )}</td></tr>`;
    return;
  }

  const pricing = getWasabiPricingAssumptions();
  const query = normalizeSearch(ui.wasabiSearchInput?.value || '');
  const filteredAccounts = query
    ? state.wasabiAccounts.filter((account) => {
        const estimate = estimateWasabiStorageCost(account.total_usage_bytes, pricing);
        return [
          account.display_name,
          account.bucket_names_csv,
          account.region,
          account.s3_endpoint,
          account.stats_endpoint,
          formatBytesOrDash(account.total_usage_bytes),
          formatWholeNumberOrDash(account.total_object_count),
          formatCurrency(estimate.estimated24h, pricing.currency),
          formatCurrency(estimate.estimated30d, pricing.currency),
          account.last_error
        ].some((field) => containsSearch(field, query));
      })
    : state.wasabiAccounts;

  if (!filteredAccounts.length) {
    ui.wasabiAccountsBody.innerHTML = '<tr><td colspan=\"11\" class=\"muted\">No Wasabi rows match this search.</td></tr>';
    return;
  }

  const sortedAccounts = getSortedWasabiAccounts(filteredAccounts, pricing);

  for (const account of sortedAccounts) {
    const accountId = account.account_id;
    const isExpanded = state.expandedWasabiAccountIds.has(accountId);
    const accountSyncing = state.wasabiSyncingAccountIds.has(accountId);
    const syncDisabled = state.wasabiSyncAllActive || accountSyncing || state.exportCsvActive;
    const exportDisabled = state.wasabiSyncAllActive || accountSyncing || state.exportCsvActive;
    const estimate = estimateWasabiStorageCost(account.total_usage_bytes, pricing);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class=\"row-toggle\" data-action=\"toggle-wasabi-buckets\" data-account-id=\"${accountId}\" title=\"${
      isExpanded ? 'Collapse bucket details' : 'Expand bucket details'
    }\">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(account.display_name || account.account_id || '-')}</td>
      <td>${escapeHtml(account.region || '-')}</td>
      <td>${escapeHtml(String(account.bucket_count ?? 0))}</td>
      <td>${escapeHtml(formatBytesOrDash(account.total_usage_bytes))}</td>
      <td>${escapeHtml(formatWholeNumberOrDash(account.total_object_count))}</td>
      <td class="metric-cell">${escapeHtml(formatCurrency(estimate.estimated24h, pricing.currency))}</td>
      <td class="metric-cell">${escapeHtml(formatCurrency(estimate.estimated30d, pricing.currency))}</td>
      <td>${escapeHtml(toLocalDate(account.last_sync_at || account.last_bucket_sync_at))}</td>
      <td class=\"${account.last_error ? 'error' : ''}\">${escapeHtml(account.last_error || '-')}</td>
      <td>
        <div class=\"actions\">
          <button data-action=\"sync-wasabi-account\" data-account-id=\"${accountId}\" ${syncDisabled ? 'disabled' : ''}>Sync now</button>
          <button data-action=\"export-wasabi-account\" data-account-id=\"${accountId}\" ${exportDisabled ? 'disabled' : ''}>Export CSV</button>
        </div>
      </td>
    `;
    ui.wasabiAccountsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      detailRow.innerHTML = `<td colspan=\"11\">${renderWasabiBucketDetailMarkup(accountId)}</td>`;
      ui.wasabiAccountsBody.appendChild(detailRow);
    }
  }
}

function pruneVsaxGroupScopedState() {
  const liveNames = new Set(state.vsaxGroups.map((group) => String(group.group_name || '').trim()));

  for (const groupName of Object.keys(state.vsaxDisksByGroup)) {
    if (!liveNames.has(groupName)) {
      delete state.vsaxDisksByGroup[groupName];
    }
  }
  for (const groupName of Object.keys(state.vsaxDiskLoadErrorsByGroup)) {
    if (!liveNames.has(groupName)) {
      delete state.vsaxDiskLoadErrorsByGroup[groupName];
    }
  }
  for (const groupName of Object.keys(state.vsaxLoadingDisksByGroup)) {
    if (!liveNames.has(groupName)) {
      delete state.vsaxLoadingDisksByGroup[groupName];
    }
  }
  for (const groupName of Array.from(state.expandedVsaxGroupNames)) {
    if (!liveNames.has(groupName)) {
      state.expandedVsaxGroupNames.delete(groupName);
    }
  }
  for (const groupName of Array.from(state.vsaxSyncingGroupNames)) {
    if (!liveNames.has(groupName)) {
      state.vsaxSyncingGroupNames.delete(groupName);
    }
  }
}

function renderVsaxDiskDetailMarkup(groupName) {
  const isLoading = Boolean(state.vsaxLoadingDisksByGroup[groupName]);
  const loadError = state.vsaxDiskLoadErrorsByGroup[groupName];
  const disks = state.vsaxDisksByGroup[groupName];

  if (isLoading) {
    return '<div class="detail-wrap detail-muted">Loading VSAx disk rows from cache...</div>';
  }
  if (loadError) {
    return `<div class="detail-wrap detail-error">Failed to load VSAx disk rows: ${escapeHtml(loadError)}</div>`;
  }
  if (!Array.isArray(disks) || !disks.length) {
    return '<div class="detail-wrap detail-muted">No disk rows cached for this group.</div>';
  }

  const rows = disks
    .map((disk) => {
      const totalBytes = Number(disk.total_bytes || 0);
      const usedBytes = Number(disk.used_bytes || 0);
      const freeBytes = Number(disk.free_bytes || 0);
      const freePercentage = Number(disk.free_percentage);
      const usedPercent =
        Number.isFinite(totalBytes) && totalBytes > 0
          ? `${((Math.max(0, usedBytes) / totalBytes) * 100).toFixed(1)}%`
          : Number.isFinite(freePercentage)
            ? `${(100 - freePercentage).toFixed(1)}%`
            : '-';

      return `
        <tr>
          <td>${escapeHtml(disk.device_name || disk.device_id || '-')}</td>
          <td>${escapeHtml(disk.disk_name || '-')}</td>
          <td>${escapeHtml(formatBytesOrDash(totalBytes))}</td>
          <td>${escapeHtml(formatBytesOrDash(usedBytes))}</td>
          <td>${escapeHtml(formatBytesOrDash(freeBytes))}</td>
          <td>${escapeHtml(usedPercent)}</td>
          <td>${escapeHtml(disk.is_system === null || disk.is_system === undefined ? '-' : Number(disk.is_system) === 1 ? 'Yes' : 'No')}</td>
          <td>${escapeHtml(toLocalDate(disk.last_sync_at))}</td>
          <td class="${disk.last_error ? 'error' : ''}">${escapeHtml(disk.last_error || '-')}</td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="detail-wrap">
      <div class="inline-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Disk</th>
              <th>Allocated</th>
              <th>Used</th>
              <th>Free</th>
              <th>Used %</th>
              <th>System</th>
              <th>Last sync</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderVsaxTotals() {
  if (
    !ui.vsaxTotalAllocated ||
    !ui.vsaxTotalUsed ||
    !ui.vsaxEstimatedCost24h ||
    !ui.vsaxEstimatedCost30d ||
    !ui.vsaxTotalsCoverage ||
    !ui.vsaxPricingAssumptions
  ) {
    return;
  }

  const totals = computeVsaxProviderStats(state.vsaxGroups, getVsaxPricingAssumptions());
  const pricing = totals.pricing;
  const availableCount = state.vsaxAvailableGroups.length;
  const selectedCount = state.vsaxSelectedGroupNames.length;

  ui.vsaxTotalAllocated.textContent = formatBytes(totals.allocatedBytes);
  ui.vsaxTotalUsed.textContent = formatBytes(totals.usedBytes);
  ui.vsaxEstimatedCost24h.textContent = formatCurrency(totals.estimated24h, pricing.currency);
  ui.vsaxEstimatedCost30d.textContent = formatCurrency(totals.estimated30d, pricing.currency);
  ui.vsaxTotalsCoverage.textContent = `${selectedCount}/${availableCount} selected group(s), ${totals.deviceCount.toLocaleString()} device(s), ${totals.diskCount.toLocaleString()} disk row(s) in cache.`;
  ui.vsaxPricingAssumptions.textContent = `Estimate assumptions: ${formatCurrency(
    pricing.storagePricePerTbMonth,
    pricing.currency
  )}/TB-month from ${pricing.source} as of ${pricing.asOfDate}; ${pricing.daysInMonth}-day month.`;

  renderUnifiedStats();
}

function renderVsaxGroups() {
  if (!ui.vsaxGroupsBody) {
    return;
  }

  const configured = Boolean(state.config?.vsax?.configured);
  const configError = state.config?.vsax?.configError || '';
  if (ui.vsaxConfigInfo) {
    if (configError) {
      ui.vsaxConfigInfo.textContent = `Config error: ${configError}`;
    } else if (configured) {
      const availableCount = state.vsaxAvailableGroups.length;
      const selectedCount = state.vsaxSelectedGroupNames.length;
      const mode = state.config?.vsax?.config?.groupFilterDefined ? 'env filter' : 'auto-discovered';
      ui.vsaxConfigInfo.textContent = `${selectedCount}/${availableCount} group(s) selected (${mode})`;
    } else {
      ui.vsaxConfigInfo.textContent = 'VSAx not configured';
    }
  }

  renderVsaxGroupSelection();
  syncVsaxButtonsDisabledState();
  renderVsaxTotals();
  ui.vsaxGroupsBody.innerHTML = '';

  if (!configured) {
    ui.vsaxGroupsBody.innerHTML = `<tr><td colspan=\"10\" class=\"muted\">${escapeHtml(
      configError || 'Configure VSAX_BASE_URL, VSAX_API_TOKEN_ID, and VSAX_API_TOKEN_SECRET on the server to enable VSAx sync.'
    )}</td></tr>`;
    return;
  }

  const query = normalizeSearch(ui.vsaxSearchInput?.value || '');
  const filteredGroups = query
    ? state.vsaxGroups.filter((group) => {
        return [
          group.group_name,
          group.device_names_csv,
          formatWholeNumber(group.device_count),
          formatWholeNumber(group.disk_count),
          formatBytes(group.total_allocated_bytes),
          formatBytes(group.total_used_bytes),
          group.last_error
        ].some((field) => containsSearch(field, query));
      })
    : state.vsaxGroups;

  if (!filteredGroups.length) {
    const noSelection = !query && state.vsaxSelectedGroupNames.length === 0;
    ui.vsaxGroupsBody.innerHTML = `<tr><td colspan=\"10\" class=\"muted\">${
      noSelection ? 'No VSAx groups selected. Pick groups above and save selection.' : 'No VSAx rows match this search.'
    }</td></tr>`;
    return;
  }

  for (const group of filteredGroups) {
    const groupName = String(group.group_name || '').trim();
    const isExpanded = state.expandedVsaxGroupNames.has(groupName);
    const syncing = state.vsaxSyncingGroupNames.has(groupName);
    const syncDisabled = state.vsaxSyncAllActive || syncing || state.exportCsvActive;
    const allocatedBytes = Number(group.total_allocated_bytes || 0);
    const usedBytes = Number(group.total_used_bytes || 0);
    const usedPercent = allocatedBytes > 0 ? `${((Math.max(0, usedBytes) / allocatedBytes) * 100).toFixed(1)}%` : '-';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><button class=\"row-toggle\" data-action=\"toggle-vsax-disks\" data-group-name=\"${escapeHtml(groupName)}\" title=\"${
      isExpanded ? 'Collapse disk details' : 'Expand disk details'
    }\">${isExpanded ? '-' : '+'}</button></td>
      <td>${escapeHtml(groupName || '-')}</td>
      <td>${escapeHtml(formatWholeNumber(group.device_count))}</td>
      <td>${escapeHtml(formatWholeNumber(group.disk_count))}</td>
      <td>${escapeHtml(formatBytesOrDash(allocatedBytes))}</td>
      <td>${escapeHtml(formatBytesOrDash(usedBytes))}</td>
      <td>${escapeHtml(usedPercent)}</td>
      <td>${escapeHtml(toLocalDate(group.last_sync_at || group.last_disk_sync_at))}</td>
      <td class=\"${group.last_error ? 'error' : ''}\">${escapeHtml(group.last_error || '-')}</td>
      <td>
        <div class=\"actions\">
          <button data-action=\"sync-vsax-group\" data-group-name=\"${escapeHtml(groupName)}\" ${syncDisabled ? 'disabled' : ''}>Sync now</button>
        </div>
      </td>
    `;
    ui.vsaxGroupsBody.appendChild(row);

    if (isExpanded) {
      const detailRow = document.createElement('tr');
      detailRow.className = 'detail-row';
      detailRow.innerHTML = `<td colspan=\"10\">${renderVsaxDiskDetailMarkup(groupName)}</td>`;
      ui.vsaxGroupsBody.appendChild(detailRow);
    }
  }
}

async function refreshVsaxGroupsFromCache({ forceCatalogRefresh = false } = {}) {
  const query = forceCatalogRefresh ? '?refreshCatalog=true' : '';
  const payload = await api(`/api/vsax/groups${query}`);
  const availableGroupsRaw = Array.isArray(payload.availableGroups) ? payload.availableGroups : [];
  const availableGroups = availableGroupsRaw
    .map((row) =>
      typeof row === 'string'
        ? {
            group_name: row,
            is_selected: 1
          }
        : row
    )
    .filter((row) => row && String(row.group_name || '').trim());
  const selectedGroupNames = Array.isArray(payload.selectedGroupNames)
    ? payload.selectedGroupNames.map((name) => String(name || '').trim()).filter(Boolean)
    : availableGroups
        .filter((row) => Number(row.is_selected) === 1)
        .map((row) => String(row.group_name || '').trim())
        .filter(Boolean);

  if (state.config) {
    state.config.vsax = {
      configured: Boolean(payload.configured),
      configError: payload.configError || null,
      groupCount: availableGroups.length,
      syncIntervalHours: payload.syncIntervalHours || state.config.vsax?.syncIntervalHours || 24,
      cacheTtlHours: payload.cacheTtlHours || state.config.vsax?.cacheTtlHours || 24,
      groups: payload.configuredGroups || state.config.vsax?.groups || [],
      config: payload.config || state.config.vsax?.config || null,
      pricingAssumptions: payload.pricingAssumptions || state.config.vsax?.pricingAssumptions || null
    };
  }
  state.vsaxAvailableGroups = availableGroups;
  state.vsaxSelectedGroupNames = selectedGroupNames;
  state.vsaxGroups = payload.groups || [];
  pruneVsaxGroupScopedState();
  renderVsaxGroups();
}

async function saveVsaxGroupSelection() {
  const groupNames = selectedVsaxGroupNames();
  const payload = await api('/api/vsax/groups/select', {
    method: 'POST',
    body: {
      groupNames
    }
  });

  const availableGroupsRaw = Array.isArray(payload.availableGroups) ? payload.availableGroups : [];
  state.vsaxAvailableGroups = availableGroupsRaw
    .map((row) =>
      typeof row === 'string'
        ? {
            group_name: row,
            is_selected: 1
          }
        : row
    )
    .filter((row) => row && String(row.group_name || '').trim());
  state.vsaxSelectedGroupNames = Array.isArray(payload.selectedGroupNames)
    ? payload.selectedGroupNames.map((name) => String(name || '').trim()).filter(Boolean)
    : groupNames;
  state.vsaxGroups = Array.isArray(payload.groups) ? payload.groups : [];
  pruneVsaxGroupScopedState();
  renderVsaxGroups();
  log(`Saved ${state.vsaxSelectedGroupNames.length} selected VSAx group(s).`);
}

async function loadVsaxDisksForGroup(groupName, force = false) {
  const normalized = String(groupName || '').trim();
  if (!normalized) {
    return [];
  }
  if (!force && Array.isArray(state.vsaxDisksByGroup[normalized])) {
    return state.vsaxDisksByGroup[normalized];
  }
  if (state.vsaxLoadingDisksByGroup[normalized]) {
    return state.vsaxDisksByGroup[normalized] || [];
  }

  state.vsaxLoadingDisksByGroup[normalized] = true;
  delete state.vsaxDiskLoadErrorsByGroup[normalized];
  renderVsaxGroups();

  try {
    const payload = await api(`/api/vsax/disks?groupName=${encodeURIComponent(normalized)}`);
    state.vsaxDisksByGroup[normalized] = payload.disks || [];
    return state.vsaxDisksByGroup[normalized];
  } catch (error) {
    state.vsaxDiskLoadErrorsByGroup[normalized] = error.message || String(error);
    throw error;
  } finally {
    state.vsaxLoadingDisksByGroup[normalized] = false;
    renderVsaxGroups();
  }
}

async function toggleVsaxDiskDetails(groupName) {
  const normalized = String(groupName || '').trim();
  if (!normalized) {
    return;
  }

  if (state.expandedVsaxGroupNames.has(normalized)) {
    state.expandedVsaxGroupNames.delete(normalized);
    renderVsaxGroups();
    return;
  }

  state.expandedVsaxGroupNames.add(normalized);
  renderVsaxGroups();
  try {
    await loadVsaxDisksForGroup(normalized, false);
  } catch (error) {
    log(`Failed to load VSAx disk rows for ${normalized}: ${error.message}`, true);
  }
}

async function syncVsaxGroupsUi(groupNames = [], force = true) {
  const explicitNames = Array.isArray(groupNames)
    ? groupNames.map((name) => String(name || '').trim()).filter(Boolean)
    : [];
  const selectedNamesFromUi = selectedVsaxGroupNames();
  const selectedNames = selectedNamesFromUi.length
    ? selectedNamesFromUi
    : Array.isArray(state.vsaxSelectedGroupNames)
      ? state.vsaxSelectedGroupNames
      : [];
  const names = explicitNames.length ? explicitNames : selectedNames;
  if (!names.length) {
    throw new Error('No VSAx group selected.');
  }
  const isSingle = names.length === 1;

  if (isSingle) {
    state.vsaxSyncingGroupNames.add(names[0]);
  } else {
    state.vsaxSyncAllActive = true;
  }
  renderVsaxGroups();

  try {
    const payload = await api('/api/vsax/sync', {
      method: 'POST',
      body: {
        groupNames: names,
        force
      }
    });

    if (state.config) {
      state.config.vsax = {
        ...(state.config.vsax || {}),
        configured: true,
        configError: null,
        groupCount: Array.isArray(payload.availableGroups)
          ? payload.availableGroups.length
          : state.config.vsax?.groupCount || 0,
        pricingAssumptions: payload.pricingAssumptions || state.config.vsax?.pricingAssumptions || null
      };
    }

    const availableGroupsRaw = Array.isArray(payload.availableGroups) ? payload.availableGroups : [];
    state.vsaxAvailableGroups = availableGroupsRaw
      .map((row) =>
        typeof row === 'string'
          ? {
              group_name: row,
              is_selected: 1
            }
          : row
      )
      .filter((row) => row && String(row.group_name || '').trim());
    state.vsaxSelectedGroupNames = Array.isArray(payload.selectedGroups)
      ? payload.selectedGroups.map((name) => String(name || '').trim()).filter(Boolean)
      : names;
    state.vsaxGroups = payload.groups || [];
    pruneVsaxGroupScopedState();
    if (isSingle) {
      await loadVsaxDisksForGroup(names[0], true);
    } else {
      state.vsaxDisksByGroup = {};
      state.vsaxDiskLoadErrorsByGroup = {};
      state.vsaxLoadingDisksByGroup = {};
      state.expandedVsaxGroupNames.clear();
    }
    renderVsaxGroups();

    const summary = payload.summary || {};
    log(
      `VSAx sync finished: groups=${summary.groupCount || 0}, scanned=${summary.scannedGroups || 0}, skipped=${summary.skippedGroups || 0}, failed=${summary.failedGroups || 0}, devices=${summary.deviceCount || 0}, disks=${summary.diskCount || 0}.`,
      Number(summary.failedGroups || 0) > 0
    );
    return payload;
  } finally {
    if (isSingle) {
      state.vsaxSyncingGroupNames.delete(names[0]);
    } else {
      state.vsaxSyncAllActive = false;
    }
    renderVsaxGroups();
  }
}

function renderList(values, emptyText = 'None') {
  if (!Array.isArray(values) || !values.length) {
    return `<div class="security-empty">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <ul class="security-list">
      ${values.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}
    </ul>
  `;
}

function renderIpRuleList(values, emptyText = 'None') {
  const normalizedValues = normalizeIpRuleValues(values);
  if (!normalizedValues.length) {
    return `<div class="security-empty">${escapeHtml(emptyText)}</div>`;
  }

  const rows = normalizedValues
    .map((value) => {
      const ipAddress = normalizeIpRuleValue(value);
      const alias = resolveIpAlias(ipAddress);
      return `
        <li class="ip-rule-entry">
          <span>${escapeHtml(ipAddress)}</span>
          ${alias ? `<span class="ip-alias-pill">${escapeHtml(alias)}</span>` : ''}
        </li>
      `;
    })
    .join('');

  return `<ul class="security-list">${rows}</ul>`;
}

async function initConnection() {
  const config = await api('/api/config');
  state.config = config;
  syncAwsButtonsDisabledState();
  renderAwsAccounts();
  syncWasabiButtonsDisabledState();
  renderWasabiAccounts();
  syncVsaxButtonsDisabledState();
  renderVsaxGroups();

  if (!config.configured) {
    const missing = Array.isArray(config.missing) ? config.missing.join(', ') : 'Missing environment settings.';
    throw new Error(`Service principal auth is not configured: ${missing}`);
  }

  ui.userInfo.textContent = `Service principal ${config.azureClientId || ''}`;
  ui.refreshSubsBtn.disabled = false;

  if (config.proxy?.enabled) {
    log(`Proxy enabled for Azure egress via ${config.proxy.proxy}.`);
  } else if (config.proxy?.error) {
    log(`Proxy configuration error: ${config.proxy.error}`, true);
  } else {
    log('Proxy disabled. Azure calls use default network egress.');
  }

  if (config.throttling) {
    log(
      `Throttle active: Azure API concurrency=${config.throttling.azureApiMaxConcurrency}, minInterval=${config.throttling.azureApiMinIntervalMs}ms, accountWorkers=${config.throttling.accountSyncConcurrency}, containerWorkers=${config.throttling.containerSyncConcurrency}, securityCacheTtl=${config.throttling.securityCacheTtlMinutes}m, metricsCacheTtl=${config.throttling.metricsCacheTtlMinutes}m; AWS API concurrency=${config.throttling.awsApiMaxConcurrency}, minInterval=${config.throttling.awsApiMinIntervalMs}ms, accountWorkers=${config.throttling.awsAccountSyncConcurrency}, bucketWorkers=${config.throttling.awsBucketSyncConcurrency}.`
    );
  }

  if (config.aws?.configured) {
    log(
      `AWS configured: ${config.aws.accountCount || 0} account(s), refresh interval=${config.aws.syncIntervalHours || 24}h, cacheTtl=${config.aws.cacheTtlHours || 24}h, default mode=${config.aws.defaultDeepScan ? 'deep' : 'low-cost'}, default security scan=${config.aws.defaultSecurityScan ? 'enabled' : 'disabled'}.`
    );
    const awsPricing = getAwsPricingAssumptions();
    log(
      `AWS pricing: S3 ${formatCurrency(awsPricing.s3StorageStandardGbMonth, awsPricing.currency)}/GB-month, EFS ${formatCurrency(
        awsPricing.efsStandardGbMonth,
        awsPricing.currency
      )}/GB-month, egress ${formatCurrency(awsPricing.s3EgressPerGb, awsPricing.currency)}/GB, request ${formatCurrency(
        awsPricing.s3RequestUnitPrice,
        awsPricing.currency
      )}/${awsPricing.s3RequestUnitSize.toLocaleString()} from ${awsPricing.source} (as of ${awsPricing.asOfDate}).`
    );
  } else if (config.aws?.configError) {
    log(`AWS config error: ${config.aws.configError}`, true);
  } else {
    log('AWS not configured yet. Add AWS account settings to enable that tab.');
  }

  if (config.wasabi?.configured) {
    log(
      `Wasabi configured: ${config.wasabi.accountCount || 0} account(s), refresh interval=${config.wasabi.syncIntervalHours || 24}h, cacheTtl=${config.wasabi.cacheTtlHours || 24}h.`
    );
    const wasabiPricing = getWasabiPricingAssumptions();
    log(
      `Wasabi pricing: ${formatCurrency(wasabiPricing.storagePricePerTbMonth, wasabiPricing.currency)}/TB-month from ${wasabiPricing.source} (as of ${wasabiPricing.asOfDate}).`
    );
  } else if (config.wasabi?.configError) {
    log(`Wasabi config error: ${config.wasabi.configError}`, true);
  } else {
    log('Wasabi not configured yet. Add WASABI account settings to enable that tab.');
  }

  if (config.vsax?.configured) {
    const groups = Array.isArray(config.vsax.groups) ? config.vsax.groups : [];
    const groupFilterDefined = Boolean(config.vsax?.config?.groupFilterDefined);
    log(
      `VSAx configured: ${groups.length} env-scoped group(s), refresh interval=${config.vsax.syncIntervalHours || 24}h, cacheTtl=${config.vsax.cacheTtlHours || 24}h, mode=${
        groupFilterDefined ? 'env-filtered' : 'auto-discover'
      }, groups=${groups.join(', ') || 'all groups from API'}.`
    );
    const vsaxPricing = getVsaxPricingAssumptions();
    log(
      `VSAx pricing: ${formatCurrency(vsaxPricing.storagePricePerTbMonth, vsaxPricing.currency)}/TB-month from ${vsaxPricing.source} (as of ${vsaxPricing.asOfDate}).`
    );
  } else if (config.vsax?.configError) {
    log(`VSAx config error: ${config.vsax.configError}`, true);
  } else {
    log('VSAx not configured yet. Add VSAx settings to enable that tab.');
  }
}

async function loadIpAliasesFromServer() {
  const payload = await api('/api/ip-aliases');
  ingestIpAliases(payload.aliases || []);
  renderSecurityAccounts();
}

async function importIpAliasesFromInput() {
  const rawText = ui.ipAliasInput?.value || '';
  const parsed = parseIpAliasImportText(rawText);

  if (!parsed.rows.length) {
    throw new Error('Enter at least one valid line in the format "IP, Server name".');
  }

  const payload = await api('/api/ip-aliases/import', {
    method: 'POST',
    body: {
      rows: parsed.rows
    }
  });

  ingestIpAliases(payload.aliases || []);
  renderSecurityAccounts();

  if (parsed.invalid.length) {
    setIpAliasStatus(
      `Imported ${payload.imported || parsed.rows.length} row(s). Skipped ${parsed.invalid.length} invalid line(s).`,
      false
    );
  } else {
    setIpAliasStatus(`Imported ${payload.imported || parsed.rows.length} row(s).`, false);
  }
}

async function loadSubscriptionsFromAzure() {
  const data = await api('/api/subscriptions/sync', {
    method: 'POST'
  });

  state.subscriptions = data.subscriptions || [];
  renderSubscriptions();
  log(`Loaded ${state.subscriptions.length} subscriptions from Azure.`);
}

async function saveSubscriptionSelection() {
  const ids = selectedSubscriptionIds();
  await api('/api/subscriptions/select', {
    method: 'POST',
    body: { subscriptionIds: ids }
  });
  log(`Saved ${ids.length} selected subscription(s).`);
}

async function syncStorageAccounts() {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to load Azure storage accounts.');
  }

  await saveSubscriptionSelection();

  const ids = selectedSubscriptionIds();
  const payload = await api('/api/storage-accounts/sync', {
    method: 'POST',
    body: {
      subscriptionIds: ids
    }
  });

  state.storageAccounts = payload.storageAccounts || [];
  pruneAccountScopedState();
  ensureProgressEntries();
  renderAccounts();
  renderSecurityAccounts();
  void preloadSecurityForScopedAccounts(false);
  log(`Loaded ${state.storageAccounts.length} storage accounts across ${ids.length} subscription(s).`);
}

async function refreshStorageAccountsFromCache() {
  const payload = await api('/api/storage-accounts');
  state.storageAccounts = payload.storageAccounts || [];
  pruneAccountScopedState();
  ensureProgressEntries();
  renderAccounts();
  renderSecurityAccounts();
  void preloadSecurityForScopedAccounts(false);
}

async function refreshAwsAccountsFromCache() {
  const payload = await api('/api/aws/accounts');
  if (state.config) {
    state.config.aws = {
      configured: Boolean(payload.configured),
      configError: payload.configError || null,
      accountCount: Array.isArray(payload.accounts) ? payload.accounts.length : 0,
      syncIntervalHours: payload.syncIntervalHours || state.config.aws?.syncIntervalHours || 24,
      cacheTtlHours: payload.cacheTtlHours || state.config.aws?.cacheTtlHours || 24,
      defaultDeepScan:
        payload.defaultDeepScan === undefined ? Boolean(state.config.aws?.defaultDeepScan) : Boolean(payload.defaultDeepScan),
      defaultRequestMetrics:
        payload.defaultRequestMetrics === undefined
          ? Boolean(state.config.aws?.defaultRequestMetrics)
          : Boolean(payload.defaultRequestMetrics),
      defaultSecurityScan:
        payload.defaultSecurityScan === undefined
          ? Boolean(state.config.aws?.defaultSecurityScan)
          : Boolean(payload.defaultSecurityScan),
      pricingAssumptions: payload.pricingAssumptions || state.config.aws?.pricingAssumptions || null
    };
  }

  state.awsAccounts = payload.accounts || [];
  pruneAwsAccountScopedState();
  renderAwsAccounts();
}

async function loadAwsBucketsForAccount(accountId, force = false) {
  if (!force && Array.isArray(state.awsBucketsByAccount[accountId])) {
    return state.awsBucketsByAccount[accountId];
  }
  if (state.awsLoadingBucketsByAccount[accountId]) {
    return state.awsBucketsByAccount[accountId] || [];
  }

  state.awsLoadingBucketsByAccount[accountId] = true;
  delete state.awsBucketLoadErrorsByAccount[accountId];
  renderAwsAccounts();

  try {
    const payload = await api(`/api/aws/buckets?accountId=${encodeURIComponent(accountId)}`);
    state.awsBucketsByAccount[accountId] = payload.buckets || [];
    return state.awsBucketsByAccount[accountId];
  } catch (error) {
    state.awsBucketLoadErrorsByAccount[accountId] = error.message || String(error);
    throw error;
  } finally {
    state.awsLoadingBucketsByAccount[accountId] = false;
    renderAwsAccounts();
  }
}

async function loadAwsEfsForAccount(accountId, force = false) {
  if (!force && Array.isArray(state.awsEfsByAccount[accountId])) {
    return state.awsEfsByAccount[accountId];
  }
  if (state.awsLoadingEfsByAccount[accountId]) {
    return state.awsEfsByAccount[accountId] || [];
  }

  state.awsLoadingEfsByAccount[accountId] = true;
  delete state.awsEfsLoadErrorsByAccount[accountId];
  renderAwsAccounts();

  try {
    const payload = await api(`/api/aws/efs?accountId=${encodeURIComponent(accountId)}`);
    state.awsEfsByAccount[accountId] = payload.fileSystems || [];
    return state.awsEfsByAccount[accountId];
  } catch (error) {
    state.awsEfsLoadErrorsByAccount[accountId] = error.message || String(error);
    throw error;
  } finally {
    state.awsLoadingEfsByAccount[accountId] = false;
    renderAwsAccounts();
  }
}

async function toggleAwsBucketDetails(accountId) {
  if (state.expandedAwsAccountIds.has(accountId)) {
    state.expandedAwsAccountIds.delete(accountId);
    renderAwsAccounts();
    return;
  }

  state.expandedAwsAccountIds.add(accountId);
  renderAwsAccounts();
  try {
    await Promise.all([loadAwsBucketsForAccount(accountId, false), loadAwsEfsForAccount(accountId, false)]);
  } catch (error) {
    log(`Failed to load AWS account details for ${accountId}: ${error.message}`, true);
  }
}

async function syncAwsAccountsUi(accountIds = [], options = {}) {
  const ids = Array.isArray(accountIds) ? accountIds.filter(Boolean) : [];
  const isSingle = ids.length === 1;
  const deepScan = Boolean(options.deepScan);
  const force = options.force === undefined ? true : Boolean(options.force);
  const includeRequestMetrics = Boolean(options.includeRequestMetrics);
  const includeSecurity = Boolean(options.includeSecurity);

  if (isSingle) {
    if (deepScan) {
      state.awsDeepSyncingAccountIds.add(ids[0]);
    } else {
      state.awsSyncingAccountIds.add(ids[0]);
    }
  } else if (deepScan) {
    state.awsDeepSyncAllActive = true;
  } else {
    state.awsSyncAllActive = true;
  }
  renderAwsAccounts();

  try {
    const payload = await api('/api/aws/sync', {
      method: 'POST',
      body: {
        accountIds: ids,
        force,
        deepScan,
        includeRequestMetrics,
        includeSecurity
      }
    });

    if (state.config) {
      state.config.aws = {
        ...(state.config.aws || {}),
        configured: Array.isArray(payload.accounts) ? payload.accounts.length > 0 : Boolean(state.config.aws?.configured),
        accountCount: Array.isArray(payload.accounts) ? payload.accounts.length : state.config.aws?.accountCount || 0,
        pricingAssumptions: payload.pricingAssumptions || state.config.aws?.pricingAssumptions || null
      };
    }

    state.awsAccounts = payload.accounts || [];
    pruneAwsAccountScopedState();
    if (isSingle) {
      await Promise.all([loadAwsBucketsForAccount(ids[0], true), loadAwsEfsForAccount(ids[0], true)]);
    } else {
      state.awsBucketsByAccount = {};
      state.awsEfsByAccount = {};
      state.awsBucketLoadErrorsByAccount = {};
      state.awsEfsLoadErrorsByAccount = {};
      state.awsLoadingBucketsByAccount = {};
      state.awsLoadingEfsByAccount = {};
      state.expandedAwsAccountIds.clear();
    }
    renderAwsAccounts();

    const summary = payload.summary || {};
    log(
      `AWS sync finished (${deepScan ? 'deep' : 'low-cost'}${includeSecurity ? '+security' : ''}): accounts=${summary.accountCount || 0}, scanned=${summary.scannedAccounts || 0}, skipped=${summary.skippedAccounts || 0}, failed=${summary.failedAccounts || 0}, bucketErrors=${summary.bucketErrors || 0}, securityErrors=${summary.securityErrorBuckets || 0}, efsErrors=${summary.efsErrors || 0}, requestMetricBuckets=${summary.requestMetricBuckets || 0}, securityScanned=${summary.securityScanBuckets || 0}, efsCount=${summary.efsCount || 0}.`,
      Number(summary.failedAccounts || 0) > 0 ||
        Number(summary.bucketErrors || 0) > 0 ||
        Number(summary.securityErrorBuckets || 0) > 0 ||
        Number(summary.efsErrors || 0) > 0
    );
    return payload;
  } finally {
    if (isSingle) {
      state.awsSyncingAccountIds.delete(ids[0]);
      state.awsDeepSyncingAccountIds.delete(ids[0]);
    } else {
      state.awsSyncAllActive = false;
      state.awsDeepSyncAllActive = false;
    }
    renderAwsAccounts();
  }
}

async function refreshWasabiAccountsFromCache() {
  const payload = await api('/api/wasabi/accounts');
  if (state.config && state.config.wasabi) {
    state.config.wasabi.configured = Boolean(payload.configured);
    state.config.wasabi.configError = payload.configError || null;
    state.config.wasabi.accountCount = Array.isArray(payload.accounts) ? payload.accounts.length : 0;
    if (payload.pricingAssumptions) {
      state.config.wasabi.pricingAssumptions = payload.pricingAssumptions;
    }
    if (payload.pricingSync) {
      state.config.wasabi.pricingSync = payload.pricingSync;
    }
  }
  state.wasabiAccounts = payload.accounts || [];
  renderWasabiAccounts();
}

async function loadWasabiBucketsForAccount(accountId, force = false) {
  if (!force && Array.isArray(state.wasabiBucketsByAccount[accountId])) {
    return state.wasabiBucketsByAccount[accountId];
  }
  if (state.wasabiLoadingBucketsByAccount[accountId]) {
    return state.wasabiBucketsByAccount[accountId] || [];
  }

  state.wasabiLoadingBucketsByAccount[accountId] = true;
  delete state.wasabiBucketLoadErrorsByAccount[accountId];
  renderWasabiAccounts();

  try {
    const payload = await api(`/api/wasabi/buckets?accountId=${encodeURIComponent(accountId)}`);
    state.wasabiBucketsByAccount[accountId] = payload.buckets || [];
    return state.wasabiBucketsByAccount[accountId];
  } catch (error) {
    state.wasabiBucketLoadErrorsByAccount[accountId] = error.message || String(error);
    throw error;
  } finally {
    state.wasabiLoadingBucketsByAccount[accountId] = false;
    renderWasabiAccounts();
  }
}

async function toggleWasabiBucketDetails(accountId) {
  if (state.expandedWasabiAccountIds.has(accountId)) {
    state.expandedWasabiAccountIds.delete(accountId);
    renderWasabiAccounts();
    return;
  }

  state.expandedWasabiAccountIds.add(accountId);
  renderWasabiAccounts();
  try {
    await loadWasabiBucketsForAccount(accountId, false);
  } catch (error) {
    log(`Failed to load Wasabi buckets for ${accountId}: ${error.message}`, true);
  }
}

async function syncWasabiAccounts(accountIds = [], force = true) {
  const ids = Array.isArray(accountIds) ? accountIds.filter(Boolean) : [];
  const isSingle = ids.length === 1;

  if (isSingle) {
    state.wasabiSyncingAccountIds.add(ids[0]);
  } else {
    state.wasabiSyncAllActive = true;
  }
  renderWasabiAccounts();

  try {
    const payload = await api('/api/wasabi/sync', {
      method: 'POST',
      body: {
        accountIds: ids,
        force
      }
    });

    if (state.config && state.config.wasabi) {
      if (payload.pricingAssumptions) {
        state.config.wasabi.pricingAssumptions = payload.pricingAssumptions;
      }
      if (payload.pricingSync) {
        state.config.wasabi.pricingSync = payload.pricingSync;
      }
      state.config.wasabi.accountCount = Array.isArray(payload.accounts) ? payload.accounts.length : state.config.wasabi.accountCount;
      state.config.wasabi.configured = state.config.wasabi.accountCount > 0;
    }

    state.wasabiAccounts = payload.accounts || [];
    if (isSingle) {
      await loadWasabiBucketsForAccount(ids[0], true);
    } else {
      state.wasabiBucketsByAccount = {};
      state.wasabiBucketLoadErrorsByAccount = {};
      state.wasabiLoadingBucketsByAccount = {};
      state.expandedWasabiAccountIds.clear();
    }
    renderWasabiAccounts();

    const summary = payload.summary || {};
    log(
      `Wasabi sync finished: accounts=${summary.accountCount || 0}, scanned=${summary.scannedAccounts || 0}, skipped=${summary.skippedAccounts || 0}, failed=${summary.failedAccounts || 0}, bucketErrors=${summary.bucketErrors || 0}.`,
      Number(summary.failedAccounts || 0) > 0 || Number(summary.bucketErrors || 0) > 0
    );
    return payload;
  } finally {
    if (isSingle) {
      state.wasabiSyncingAccountIds.delete(ids[0]);
    } else {
      state.wasabiSyncAllActive = false;
    }
    renderWasabiAccounts();
  }
}

function applyPullAllJobState(job) {
  if (!job) {
    state.pullAllActive = false;
    state.pullAllJobId = '';
    syncPullButtonsDisabledState();
    renderSecurityAccounts();
    return;
  }

  state.pullAllJobId = job.id;
  state.pullAllActive = job.status === 'running';
  syncPullButtonsDisabledState();

  if (Array.isArray(job.accountStates)) {
    for (const accountState of job.accountStates) {
      setAccountProgress(accountState.accountId, {
        status: accountState.status || 'idle',
        percent: typeof accountState.percent === 'number' ? accountState.percent : 0,
        label: accountState.label || accountState.status || 'Idle'
      });
    }
  }

  renderAccounts();
  renderSecurityAccounts();
}

async function pollPullAllJob(jobId) {
  try {
    const payload = await api(`/api/jobs/pull-all/status?jobId=${encodeURIComponent(jobId)}`);
    const job = payload.job;

    if (!job) {
      stopPullAllPolling();
      state.pullAllActive = false;
      syncPullButtonsDisabledState();
      return;
    }

    applyPullAllJobState(job);

    if (job.status === 'running') {
      state.pullAllPollTimer = setTimeout(() => {
        void pollPullAllJob(job.id);
      }, 1500);
      return;
    }

    stopPullAllPolling();
    await refreshStorageAccountsFromCache();
    log(
      `Pull-all finished: processed=${job.completedAccounts || 0}/${job.totalAccounts || 0}, failed=${job.failedAccounts || 0}.`
    );
  } catch (error) {
    stopPullAllPolling();
    state.pullAllActive = false;
    syncPullButtonsDisabledState();
    log(`Pull-all status polling failed: ${error.message}`, true);
  }
}

async function startOrResumePullAllJob(force = false) {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to run Azure pull jobs.');
  }

  if (state.pullSecurityAllActive) {
    throw new Error('Pull-all security job is running. Wait for it to complete before starting container pull-all.');
  }
  if (state.pullMetricsAllActive) {
    throw new Error('Pull-all metrics job is running. Wait for it to complete before starting container pull-all.');
  }

  await saveSubscriptionSelection();

  let job = null;
  const ids = selectedSubscriptionIds();

  try {
    const payload = await api('/api/jobs/pull-all/start', {
      method: 'POST',
      body: {
        subscriptionIds: ids,
        force
      }
    });
    job = payload.job || null;
    if (job) {
      log(`Started pull-all job ${job.id}.`);
    }
  } catch (error) {
    if (error.status === 409 && error.payload?.job) {
      job = error.payload.job;
      log(`Resuming active pull-all job ${job.id}.`);
    } else {
      throw error;
    }
  }

  if (!job) {
    throw new Error('Failed to start pull-all job.');
  }

  stopPullAllPolling();
  applyPullAllJobState(job);

  if (job.status === 'running') {
    state.pullAllPollTimer = setTimeout(() => {
      void pollPullAllJob(job.id);
    }, 1000);
    return;
  }

  await refreshStorageAccountsFromCache();
}

async function pullSingleAccount(accountId, force = false, options = {}) {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to pull Azure account data.');
  }

  if (state.pullAllActive) {
    throw new Error('Pull-all job is running. Wait for it to complete before running single-account pull.');
  }
  if (state.pullMetricsAllActive) {
    throw new Error('Pull-all metrics job is running. Wait for it to complete before running single-account pull.');
  }
  if (state.pullSecurityAllActive) {
    throw new Error('Pull-all security job is running. Wait for it to complete before running size pull.');
  }

  setAccountProgress(accountId, {
    status: 'running',
    percent: 100,
    label: 'Fetching from Azure...'
  });
  renderAccounts();

  try {
    const payload = await api('/api/containers/sync-account', {
      method: 'POST',
      body: {
        accountId,
        force
      }
    });

    const account = payload.storageAccount;
    if (account) {
      const idx = state.storageAccounts.findIndex((a) => a.account_id === account.account_id);
      if (idx >= 0) {
        state.storageAccounts[idx] = account;
      }
    }

    const result = payload.result || {};
    const hasErrors = Number(result.errors || 0) > 0 || Boolean(result.metricsHadError);
    if (Array.isArray(payload.containers)) {
      state.containersByAccount[accountId] = payload.containers;
      delete state.containerLoadErrorsByAccount[accountId];
    }

    setAccountProgress(accountId, {
      status: hasErrors ? 'error' : 'done',
      percent: 100,
      label: hasErrors
        ? `Done with ${Number(result.errors || 0) + (result.metricsHadError ? 1 : 0)} error(s)`
        : `Done (${result.scanned || 0}/${result.containerCount || 0} scanned)`
    });

    renderAccounts();
    renderSecurityAccounts();

    if (!options.silentLog) {
      log(
        `Pulled ${result.accountName || accountId}: containers=${result.containerCount || 0}, scanned=${result.scanned || 0}, errors=${result.errors || 0}, metrics=${result.metricsSkipped ? 'cached' : result.metricsHadError ? 'error' : 'updated'}`
      );
    }

    return payload;
  } catch (error) {
    setAccountProgress(accountId, {
      status: 'error',
      percent: 100,
      label: `Failed: ${error.message}`
    });
    renderAccounts();
    throw error;
  }
}

async function loadContainersForAccount(accountId, force = false) {
  if (!force && Array.isArray(state.containersByAccount[accountId])) {
    return state.containersByAccount[accountId];
  }
  if (state.loadingContainersByAccount[accountId]) {
    return state.containersByAccount[accountId] || [];
  }

  state.loadingContainersByAccount[accountId] = true;
  delete state.containerLoadErrorsByAccount[accountId];
  renderAccounts();

  try {
    const payload = await api(`/api/containers?accountId=${encodeURIComponent(accountId)}`);
    state.containersByAccount[accountId] = payload.containers || [];
    return state.containersByAccount[accountId];
  } catch (error) {
    state.containerLoadErrorsByAccount[accountId] = error.message || String(error);
    throw error;
  } finally {
    state.loadingContainersByAccount[accountId] = false;
    renderAccounts();
  }
}

async function loadSecurityForAccount(accountId, force = false) {
  const hasCachedRecord = Object.prototype.hasOwnProperty.call(state.securityByAccount, accountId);
  if (!force && hasCachedRecord) {
    return state.securityByAccount[accountId];
  }
  if (state.loadingSecurityByAccount[accountId]) {
    return state.securityByAccount[accountId] || null;
  }

  state.loadingSecurityByAccount[accountId] = true;
  renderSecurityAccounts();

  try {
    const payload = await api(`/api/security?accountId=${encodeURIComponent(accountId)}`);
    state.securityByAccount[accountId] = payload.security || null;
    return state.securityByAccount[accountId];
  } finally {
    state.loadingSecurityByAccount[accountId] = false;
    renderSecurityAccounts();
  }
}

async function preloadSecurityForScopedAccounts(force = false) {
  if (state.securityPrefetchPromise) {
    await state.securityPrefetchPromise;
  }

  const scopedIds = getScopedAccounts().map((account) => account.account_id);
  const targetIds = force
    ? scopedIds
    : scopedIds.filter((accountId) => !Object.prototype.hasOwnProperty.call(state.securityByAccount, accountId));

  if (!targetIds.length) {
    return;
  }

  for (const accountId of targetIds) {
    state.loadingSecurityByAccount[accountId] = true;
  }
  renderSecurityAccounts();

  state.securityPrefetchPromise = (async () => {
    try {
      const payload = await api('/api/security/list', {
        method: 'POST',
        body: {
          accountIds: targetIds
        }
      });

      const records = Array.isArray(payload.security) ? payload.security : [];
      const recordMap = new Map(records.map((record) => [record.account_id, record]));
      for (const accountId of targetIds) {
        state.securityByAccount[accountId] = recordMap.has(accountId) ? recordMap.get(accountId) : null;
      }
    } catch (error) {
      log(`Failed to preload security rows: ${error.message}`, true);
    } finally {
      for (const accountId of targetIds) {
        delete state.loadingSecurityByAccount[accountId];
      }
      state.securityPrefetchPromise = null;
      renderSecurityAccounts();
    }
  })();

  await state.securityPrefetchPromise;
}

async function toggleContainerDetails(accountId) {
  if (state.expandedContainerAccountIds.has(accountId)) {
    state.expandedContainerAccountIds.delete(accountId);
    renderAccounts();
    return;
  }

  state.expandedContainerAccountIds.add(accountId);
  renderAccounts();

  try {
    await loadContainersForAccount(accountId, false);
  } catch (error) {
    log(`Failed to load containers for ${accountId}: ${error.message}`, true);
  }
}

async function openSecurityViewForAccount(accountId) {
  setActiveAzureView('security');
  state.expandedSecurityAccountIds.add(accountId);
  renderSecurityAccounts();

  try {
    await loadSecurityForAccount(accountId, false);
  } catch (error) {
    log(`Failed to load security profile for ${accountId}: ${error.message}`, true);
  }
}

async function toggleSecurityDetails(accountId) {
  if (state.expandedSecurityAccountIds.has(accountId)) {
    state.expandedSecurityAccountIds.delete(accountId);
    renderSecurityAccounts();
    return;
  }

  state.expandedSecurityAccountIds.add(accountId);
  renderSecurityAccounts();
  try {
    await loadSecurityForAccount(accountId, false);
  } catch (error) {
    log(`Failed to load security profile for ${accountId}: ${error.message}`, true);
  }
}

async function pullSingleAccountSecurity(accountId, force = false, options = {}) {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to pull Azure security data.');
  }

  if (state.pullAllActive) {
    throw new Error('Pull-all container size job is running. Wait for it to complete before running security pull.');
  }
  if (state.pullMetricsAllActive) {
    throw new Error('Pull-all metrics job is running. Wait for it to complete before running security pull.');
  }
  if (state.pullSecurityAllActive) {
    throw new Error('Pull-all security job is running. Wait for it to complete before running security pull.');
  }

  setAccountProgress(accountId, {
    status: 'running',
    percent: 100,
    label: 'Fetching security profile...'
  });
  renderAccounts();

  try {
    const payload = await api('/api/security/sync-account', {
      method: 'POST',
      body: {
        accountId,
        force
      }
    });

    const account = payload.storageAccount;
    if (account) {
      const idx = state.storageAccounts.findIndex((a) => a.account_id === account.account_id);
      if (idx >= 0) {
        state.storageAccounts[idx] = account;
      }
    }

    const result = payload.result || {};
    state.securityByAccount[accountId] = payload.security || null;
    setAccountProgress(accountId, {
      status: result.hadError ? 'error' : 'done',
      percent: 100,
      label: result.skipped ? 'Security cached (skipped)' : result.hadError ? 'Security pull failed' : 'Security updated'
    });
    renderAccounts();
    renderSecurityAccounts();

    if (options.showAfterPull) {
      setActiveAzureView('security');
      state.expandedSecurityAccountIds.add(accountId);
      renderSecurityAccounts();
    }

    if (!options.silentLog) {
      log(
        result.skipped
          ? `Security pull skipped for ${result.accountName || accountId} (cache still fresh).`
          : `Pulled security for ${result.accountName || accountId}${result.hadError ? ' with errors.' : '.'}`,
        Boolean(result.hadError)
      );
    }

    return payload;
  } catch (error) {
    setAccountProgress(accountId, {
      status: 'error',
      percent: 100,
      label: `Security failed: ${error.message}`
    });
    renderAccounts();
    renderSecurityAccounts();
    throw error;
  }
}

async function pullAllMetrics(force = true) {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to run Azure metrics pulls.');
  }

  if (state.pullAllActive) {
    throw new Error('Pull-all container size job is running. Wait for it to complete before pulling metrics.');
  }
  if (state.pullSecurityAllActive) {
    throw new Error('Pull-all security job is running. Wait for it to complete before pulling metrics.');
  }

  await saveSubscriptionSelection();
  const subscriptionIds = selectedSubscriptionIds();
  if (!subscriptionIds.length) {
    throw new Error('No subscription selected.');
  }

  state.pullMetricsAllActive = true;
  syncPullButtonsDisabledState();
  renderAccounts();
  renderSecurityAccounts();

  try {
    const payload = await api('/api/metrics/sync-all', {
      method: 'POST',
      body: {
        subscriptionIds,
        force
      }
    });

    state.storageAccounts = payload.storageAccounts || [];
    pruneAccountScopedState();
    ensureProgressEntries();
    renderAccounts();
    renderSecurityAccounts();
    void preloadSecurityForScopedAccounts(false);

    const summary = payload.summary || {};
    log(
      `Metrics pull-all finished: accounts=${summary.accountCount || 0}, scanned=${summary.scannedAccounts || 0}, skipped=${summary.skippedAccounts || 0}, failed=${summary.failedAccounts || 0}.`,
      Number(summary.failedAccounts || 0) > 0
    );

    return payload;
  } finally {
    state.pullMetricsAllActive = false;
    syncPullButtonsDisabledState();
    renderAccounts();
    renderSecurityAccounts();
  }
}

async function pullAllSecurity(force = false) {
  if (state.activeProvider !== 'azure') {
    throw new Error('Switch to the Azure tab to run Azure security pulls.');
  }

  if (state.pullAllActive) {
    throw new Error('Pull-all container size job is running. Wait for it to complete before pulling security.');
  }
  if (state.pullMetricsAllActive) {
    throw new Error('Pull-all metrics job is running. Wait for it to complete before pulling security.');
  }

  await saveSubscriptionSelection();
  const subscriptionIds = selectedSubscriptionIds();
  if (!subscriptionIds.length) {
    throw new Error('No subscription selected.');
  }

  state.pullSecurityAllActive = true;
  syncPullButtonsDisabledState();
  renderAccounts();
  renderSecurityAccounts();

  try {
    const payload = await api('/api/security/sync-all', {
      method: 'POST',
      body: {
        subscriptionIds,
        force
      }
    });

    state.storageAccounts = payload.storageAccounts || [];
    pruneAccountScopedState();
    ensureProgressEntries();
    renderAccounts();
    renderSecurityAccounts();
    void preloadSecurityForScopedAccounts(false);
    await preloadSecurityForScopedAccounts(true);

    const summary = payload.summary || {};
    log(
      `Security pull-all finished: accounts=${summary.accountCount || 0}, scanned=${summary.scannedAccounts || 0}, skipped=${summary.skippedAccounts || 0}, failed=${summary.failedAccounts || 0}.`,
      Number(summary.failedAccounts || 0) > 0
    );

    return payload;
  } finally {
    state.pullSecurityAllActive = false;
    syncPullButtonsDisabledState();
    renderAccounts();
    renderSecurityAccounts();
  }
}

let activityResizeSession = null;

function startActivityDrawerResize(event) {
  if (isActivityDrawerCompactViewport()) {
    return;
  }
  if (!event.isPrimary || event.button !== 0) {
    return;
  }

  event.preventDefault();
  activityResizeSession = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startWidth: getCurrentActivityDrawerWidth()
  };
  document.body.classList.add('resizing-drawer');
  ui.activityResizeHandle.setPointerCapture(event.pointerId);
}

function moveActivityDrawerResize(event) {
  if (!activityResizeSession || event.pointerId !== activityResizeSession.pointerId) {
    return;
  }

  const delta = activityResizeSession.startX - event.clientX;
  applyActivityDrawerWidth(activityResizeSession.startWidth + delta, false);
}

function stopActivityDrawerResize(event) {
  if (!activityResizeSession || event.pointerId !== activityResizeSession.pointerId) {
    return;
  }

  if (ui.activityResizeHandle.hasPointerCapture(event.pointerId)) {
    ui.activityResizeHandle.releasePointerCapture(event.pointerId);
  }

  document.body.classList.remove('resizing-drawer');
  activityResizeSession = null;
  applyActivityDrawerWidth(getCurrentActivityDrawerWidth(), true);
}

for (const tab of ui.providerTabs) {
  tab.addEventListener('click', () => {
    const provider = tab.getAttribute('data-provider') || 'azure';
    setActiveProvider(provider);
  });
}

ui.azureScopeTabs.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const scopeId = target.getAttribute('data-scope-id');
  if (!scopeId) {
    return;
  }

  state.activeAzureScope = scopeId;
  renderAzureScopeTabs();
  renderAccounts();
  renderSecurityAccounts();
  void preloadSecurityForScopedAccounts(false);
});

ui.subsList.addEventListener('change', () => {
  renderAzureScopeTabs();
  renderAccounts();
  renderSecurityAccounts();
  void preloadSecurityForScopedAccounts(false);
});

for (const tab of ui.azureContentTabs) {
  tab.addEventListener('click', () => {
    const view = tab.getAttribute('data-azure-view') || 'inventory';
    setActiveAzureView(view);
  });
}

for (const tab of ui.awsContentTabs) {
  tab.addEventListener('click', () => {
    const view = tab.getAttribute('data-aws-view') || 'inventory';
    setActiveAwsView(view);
  });
}

if (ui.themeToggleBtn) {
  ui.themeToggleBtn.addEventListener('click', (event) => {
    event.preventDefault();
    toggleThemeMode();
  });
}

if (ui.ipAliasTabBtn) {
  ui.ipAliasTabBtn.addEventListener('click', (event) => {
    event.preventDefault();
    setIpAliasPanelOpen(!state.ipAliasPanelOpen, true);
  });
}

ui.refreshSubsBtn.addEventListener('click', async () => {
  try {
    await loadSubscriptionsFromAzure();
  } catch (error) {
    log(`Failed to load subscriptions: ${error.message}`, true);
  }
});

ui.saveSubsBtn.addEventListener('click', async () => {
  try {
    await saveSubscriptionSelection();
  } catch (error) {
    log(`Failed to save subscription selection: ${error.message}`, true);
  }
});

ui.syncAccountsBtn.addEventListener('click', async () => {
  try {
    await syncStorageAccounts();
  } catch (error) {
    log(`Failed to load storage accounts: ${error.message}`, true);
  }
});

ui.pullAllBtn.addEventListener('click', async () => {
  try {
    await startOrResumePullAllJob(false);
  } catch (error) {
    log(`Pull-all failed: ${error.message}`, true);
  }
});

ui.pullAllMetricsBtn.addEventListener('click', async () => {
  try {
    await pullAllMetrics(true);
  } catch (error) {
    log(`Pull-all metrics failed: ${error.message}`, true);
  }
});

ui.pullAllSecurityBtn.addEventListener('click', async () => {
  try {
    await pullAllSecurity(false);
  } catch (error) {
    log(`Pull-all security failed: ${error.message}`, true);
  }
});

if (ui.azureExportInventoryBtn) {
  ui.azureExportInventoryBtn.addEventListener('click', async () => {
    try {
      await runCsvExport('Azure inventory CSV', exportAzureInventoryCsv, {
        button: ui.azureExportInventoryBtn,
        runningLabel: 'Exporting...'
      });
    } catch (error) {
      log(`CSV export failed: ${error.message}`, true);
    }
  });
}

if (ui.azureExportSecurityBtn) {
  ui.azureExportSecurityBtn.addEventListener('click', async () => {
    try {
      await runCsvExport('Azure security CSV', exportAzureSecurityCsv, {
        button: ui.azureExportSecurityBtn,
        runningLabel: 'Exporting...'
      });
    } catch (error) {
      log(`CSV export failed: ${error.message}`, true);
    }
  });
}

if (ui.awsLoadBtn) {
  ui.awsLoadBtn.addEventListener('click', async () => {
    try {
      await syncAwsAccountsUi([], {
        deepScan: false,
        includeRequestMetrics: false,
        includeSecurity: false,
        force: true
      });
    } catch (error) {
      log(`AWS sync failed: ${error.message}`, true);
    }
  });
}

if (ui.awsSecurityLoadBtn) {
  ui.awsSecurityLoadBtn.addEventListener('click', async () => {
    try {
      await syncAwsAccountsUi([], {
        deepScan: false,
        includeRequestMetrics: false,
        includeSecurity: true,
        force: true
      });
    } catch (error) {
      log(`AWS security sync failed: ${error.message}`, true);
    }
  });
}

if (ui.awsDeepLoadBtn) {
  ui.awsDeepLoadBtn.addEventListener('click', async () => {
    try {
      await syncAwsAccountsUi([], {
        deepScan: true,
        includeRequestMetrics: Boolean(state.config?.aws?.defaultRequestMetrics),
        includeSecurity: Boolean(state.config?.aws?.defaultSecurityScan),
        force: true
      });
    } catch (error) {
      log(`AWS deep scan failed: ${error.message}`, true);
    }
  });
}

if (ui.awsExportAllBtn) {
  ui.awsExportAllBtn.addEventListener('click', async () => {
    try {
      await runCsvExport('AWS full CSV', exportAwsAllCsv, {
        button: ui.awsExportAllBtn,
        runningLabel: 'Exporting...'
      });
    } catch (error) {
      log(`CSV export failed: ${error.message}`, true);
    }
  });
}

if (ui.wasabiLoadBtn) {
  ui.wasabiLoadBtn.addEventListener('click', async () => {
    try {
      await syncWasabiAccounts([], true);
    } catch (error) {
      log(`Wasabi sync failed: ${error.message}`, true);
    }
  });
}

if (ui.wasabiExportAllBtn) {
  ui.wasabiExportAllBtn.addEventListener('click', async () => {
    try {
      await runCsvExport('Wasabi full CSV', exportWasabiAllCsv, {
        button: ui.wasabiExportAllBtn,
        runningLabel: 'Exporting...'
      });
    } catch (error) {
      log(`CSV export failed: ${error.message}`, true);
    }
  });
}

if (ui.vsaxLoadBtn) {
  ui.vsaxLoadBtn.addEventListener('click', async () => {
    try {
      await syncVsaxGroupsUi([], true);
    } catch (error) {
      log(`VSAx sync failed: ${error.message}`, true);
    }
  });
}

if (ui.vsaxRefreshGroupsBtn) {
  ui.vsaxRefreshGroupsBtn.addEventListener('click', async () => {
    try {
      await refreshVsaxGroupsFromCache({ forceCatalogRefresh: true });
      log('Refreshed VSAx group catalog from API.');
    } catch (error) {
      log(`Failed to refresh VSAx groups: ${error.message}`, true);
    }
  });
}

if (ui.saveVsaxGroupsBtn) {
  ui.saveVsaxGroupsBtn.addEventListener('click', async () => {
    try {
      await saveVsaxGroupSelection();
    } catch (error) {
      log(`Failed to save VSAx group selection: ${error.message}`, true);
    }
  });
}

if (ui.vsaxGroupList) {
  ui.vsaxGroupList.addEventListener('change', () => {
    syncVsaxButtonsDisabledState();
  });
}

ui.accountSearchInput.addEventListener('input', () => {
  renderAccounts();
});

if (ui.accountsTableHead) {
  ui.accountsTableHead.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('.sort-header-btn[data-sort-key]');
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const sortKey = button.getAttribute('data-sort-key');
    if (!sortKey) {
      return;
    }

    if (state.accountSort.key === sortKey) {
      state.accountSort.direction = state.accountSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.accountSort.key = sortKey;
      state.accountSort.direction = 'asc';
    }

    renderAccounts();
  });
}

if (ui.wasabiAccountsTableHead) {
  ui.wasabiAccountsTableHead.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('.sort-header-btn[data-wasabi-sort-key]');
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const sortKey = button.getAttribute('data-wasabi-sort-key');
    if (!sortKey) {
      return;
    }

    if (state.wasabiSort.key === sortKey) {
      state.wasabiSort.direction = state.wasabiSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.wasabiSort.key = sortKey;
      state.wasabiSort.direction = 'asc';
    }

    renderWasabiAccounts();
  });
}

if (ui.awsAccountsTableHead) {
  ui.awsAccountsTableHead.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest('.sort-header-btn[data-aws-sort-key]');
    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const sortKey = button.getAttribute('data-aws-sort-key');
    if (!sortKey) {
      return;
    }

    if (state.awsSort.key === sortKey) {
      state.awsSort.direction = state.awsSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      state.awsSort.key = sortKey;
      state.awsSort.direction = 'asc';
    }

    renderAwsAccounts();
  });
}

ui.securitySearchInput.addEventListener('input', () => {
  renderSecurityAccounts();
});

if (ui.awsSearchInput) {
  ui.awsSearchInput.addEventListener('input', () => {
    renderAwsAccounts();
  });
}

if (ui.awsSecuritySearchInput) {
  ui.awsSecuritySearchInput.addEventListener('input', () => {
    renderAwsSecurityAccounts();
  });
}

if (ui.wasabiSearchInput) {
  ui.wasabiSearchInput.addEventListener('input', () => {
    renderWasabiAccounts();
  });
}

if (ui.vsaxSearchInput) {
  ui.vsaxSearchInput.addEventListener('input', () => {
    renderVsaxGroups();
  });
}

ui.importIpAliasBtn.addEventListener('click', async () => {
  try {
    await importIpAliasesFromInput();
  } catch (error) {
    setIpAliasStatus(error.message || String(error), true);
    log(`IP mapping import failed: ${error.message}`, true);
  }
});

ui.reloadIpAliasBtn.addEventListener('click', async () => {
  try {
    await loadIpAliasesFromServer();
  } catch (error) {
    setIpAliasStatus(error.message || String(error), true);
    log(`IP mapping reload failed: ${error.message}`, true);
  }
});

if (ui.exportIpAliasBtn) {
  ui.exportIpAliasBtn.addEventListener('click', async () => {
    try {
      await runCsvExport('IP alias CSV', exportIpAliasCsv, {
        button: ui.exportIpAliasBtn,
        runningLabel: 'Exporting...'
      });
    } catch (error) {
      log(`CSV export failed: ${error.message}`, true);
    }
  });
}

ui.activityToggleBtn.addEventListener('click', () => {
  const isOpen = ui.activityDrawer.classList.contains('open');
  setActivityDrawerOpen(!isOpen);
});

ui.activityCloseBtn.addEventListener('click', () => {
  setActivityDrawerOpen(false);
});

ui.activityShrinkBtn.addEventListener('click', () => {
  const currentWidth = getCurrentActivityDrawerWidth();
  applyActivityDrawerWidth(currentWidth - ACTIVITY_DRAWER_WIDTH_STEP, true);
});

ui.activityExpandBtn.addEventListener('click', () => {
  const currentWidth = getCurrentActivityDrawerWidth();
  applyActivityDrawerWidth(currentWidth + ACTIVITY_DRAWER_WIDTH_STEP, true);
});

ui.activityResizeHandle.addEventListener('pointerdown', startActivityDrawerResize);
ui.activityResizeHandle.addEventListener('pointermove', moveActivityDrawerResize);
ui.activityResizeHandle.addEventListener('pointerup', stopActivityDrawerResize);
ui.activityResizeHandle.addEventListener('pointercancel', stopActivityDrawerResize);

ui.activityResizeHandle.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    applyActivityDrawerWidth(getCurrentActivityDrawerWidth() + ACTIVITY_DRAWER_WIDTH_STEP, true);
    return;
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    applyActivityDrawerWidth(getCurrentActivityDrawerWidth() - ACTIVITY_DRAWER_WIDTH_STEP, true);
  }
});

window.addEventListener('resize', () => {
  applyActivityDrawerWidth(state.activityDrawerWidth || ACTIVITY_DRAWER_WIDTH_DEFAULT, false);
});

ui.accountsBody.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const accountId = target.getAttribute('data-account-id');
  const action = target.getAttribute('data-action');
  if (!accountId || !action) {
    return;
  }

  try {
    if (action === 'toggle-containers') {
      await toggleContainerDetails(accountId);
    }
    if (action === 'pull') {
      await pullSingleAccount(accountId, false);
    }
    if (action === 'pull-security') {
      await pullSingleAccountSecurity(accountId, false, { showAfterPull: true });
    }
    if (action === 'open-security') {
      await openSecurityViewForAccount(accountId);
    }
  } catch (error) {
    log(`Action failed for account ${accountId}: ${error.message}`, true);
  }
});

ui.securityAccountsBody.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const accountId = target.getAttribute('data-account-id');
  const action = target.getAttribute('data-action');
  if (!accountId || !action) {
    return;
  }

  try {
    if (action === 'toggle-security-details') {
      await toggleSecurityDetails(accountId);
    }
    if (action === 'pull-security') {
      await pullSingleAccountSecurity(accountId, false, { showAfterPull: true });
    }
  } catch (error) {
    log(`Security action failed for account ${accountId}: ${error.message}`, true);
  }
});

if (ui.wasabiAccountsBody) {
  ui.wasabiAccountsBody.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const accountId = target.getAttribute('data-account-id');
    const action = target.getAttribute('data-action');
    if (!accountId || !action) {
      return;
    }

    try {
      if (action === 'toggle-wasabi-buckets') {
        await toggleWasabiBucketDetails(accountId);
      }
      if (action === 'sync-wasabi-account') {
        await syncWasabiAccounts([accountId], true);
      }
      if (action === 'export-wasabi-account') {
        await runCsvExport(`Wasabi account ${accountId} CSV`, async () => {
          await exportWasabiAccountCsv(accountId);
        });
      }
    } catch (error) {
      log(`Wasabi action failed for account ${accountId}: ${error.message}`, true);
    }
  });
}

if (ui.awsAccountsBody) {
  ui.awsAccountsBody.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const accountId = target.getAttribute('data-account-id');
    const action = target.getAttribute('data-action');
    if (!accountId || !action) {
      return;
    }

    try {
      if (action === 'toggle-aws-buckets') {
        await toggleAwsBucketDetails(accountId);
      }
      if (action === 'sync-aws-account') {
        await syncAwsAccountsUi([accountId], {
          deepScan: false,
          includeRequestMetrics: false,
          includeSecurity: false,
          force: true
        });
      }
      if (action === 'deep-sync-aws-account') {
        await syncAwsAccountsUi([accountId], {
          deepScan: true,
          includeRequestMetrics: Boolean(state.config?.aws?.defaultRequestMetrics),
          includeSecurity: Boolean(state.config?.aws?.defaultSecurityScan),
          force: true
        });
      }
      if (action === 'export-aws-account') {
        await runCsvExport(`AWS account ${accountId} CSV`, async () => {
          await exportAwsAccountCsv(accountId);
        });
      }
    } catch (error) {
      log(`AWS action failed for account ${accountId}: ${error.message}`, true);
    }
  });
}

if (ui.awsSecurityAccountsBody) {
  ui.awsSecurityAccountsBody.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const accountId = target.getAttribute('data-account-id');
    const action = target.getAttribute('data-action');
    if (!accountId || !action) {
      return;
    }

    try {
      if (action === 'toggle-aws-security-details') {
        await toggleAwsSecurityDetails(accountId);
      }
      if (action === 'security-sync-aws-account') {
        await syncAwsAccountsUi([accountId], {
          deepScan: false,
          includeRequestMetrics: false,
          includeSecurity: true,
          force: true
        });
      }
    } catch (error) {
      log(`AWS security action failed for account ${accountId}: ${error.message}`, true);
    }
  });
}

if (ui.vsaxGroupsBody) {
  ui.vsaxGroupsBody.addEventListener('click', async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const groupName = target.getAttribute('data-group-name');
    const action = target.getAttribute('data-action');
    if (!groupName || !action) {
      return;
    }

    try {
      if (action === 'toggle-vsax-disks') {
        await toggleVsaxDiskDetails(groupName);
      }
      if (action === 'sync-vsax-group') {
        await syncVsaxGroupsUi([groupName], true);
      }
    } catch (error) {
      log(`VSAx action failed for group ${groupName}: ${error.message}`, true);
    }
  });
}

(async function main() {
  try {
    loadThemeMode();
    loadIpAliasPanelState();
    loadActivityDrawerWidth();
    loadNavigationState();
    renderProviderPanels();
    renderAzureContentViews();
    await initConnection();
    await loadIpAliasesFromServer();
    try {
      await loadSubscriptionsFromAzure();
    } catch (error) {
      log(`Live subscription sync failed, using cached list: ${error.message}`);
      const subPayload = await api('/api/subscriptions');
      state.subscriptions = subPayload.subscriptions || [];
      renderSubscriptions();
    }

    const accountsPayload = await api('/api/storage-accounts');
    state.storageAccounts = accountsPayload.storageAccounts || [];
    pruneAccountScopedState();
    ensureProgressEntries();
    renderAccounts();
    renderSecurityAccounts();

    await refreshAwsAccountsFromCache();
    await refreshWasabiAccountsFromCache();
    await refreshVsaxGroupsFromCache();

    const latestJobPayload = await api('/api/jobs/pull-all/status');
    if (latestJobPayload.job) {
      applyPullAllJobState(latestJobPayload.job);
      if (latestJobPayload.job.status === 'running') {
        log(`Resumed active pull-all job ${latestJobPayload.job.id}.`);
        stopPullAllPolling();
        state.pullAllPollTimer = setTimeout(() => {
          void pollPullAllJob(latestJobPayload.job.id);
        }, 900);
      }
    }

    log('App ready. Load subscriptions and start pulling data.');
  } catch (error) {
    log(`Initialization failed: ${error.message}`, true);
  }
})();
