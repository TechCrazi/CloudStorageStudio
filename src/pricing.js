const RETAIL_PRICES_BASE_URL = 'https://prices.azure.com/api/retail/prices';
const WASABI_PRICING_FAQ_URL = 'https://wasabi.com/pricing/faq';

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

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

function quoteODataString(value) {
  return `'${String(value || '').replaceAll("'", "''")}'`;
}

function parseJsonSafe(rawText) {
  try {
    return JSON.parse(rawText);
  } catch (_error) {
    return null;
  }
}

async function fetchJsonWithRetry(url, maxRetries = 4) {
  let attempt = 0;
  while (true) {
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }

    const rawText = await response.text();
    const retryable = RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxRetries;
    if (!retryable) {
      throw new Error(`Pricing API request failed (${response.status}): ${rawText.slice(0, 400)}`);
    }

    const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
    const fallbackBackoff = Math.min(15000, 500 * 2 ** attempt + Math.floor(Math.random() * 300));
    await sleep(retryAfterMs > 0 ? retryAfterMs : fallbackBackoff);
    attempt += 1;
  }
}

async function fetchTextWithRetry(url, maxRetries = 4) {
  let attempt = 0;
  while (true) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CloudStorageStudio/1.0',
        Accept: 'text/html,application/xhtml+xml'
      }
    });
    if (response.ok) {
      return response.text();
    }

    const rawText = await response.text();
    const retryable = RETRYABLE_STATUS_CODES.has(response.status) && attempt < maxRetries;
    if (!retryable) {
      throw new Error(`Pricing page request failed (${response.status}): ${rawText.slice(0, 400)}`);
    }

    const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
    const fallbackBackoff = Math.min(15000, 500 * 2 ** attempt + Math.floor(Math.random() * 300));
    await sleep(retryAfterMs > 0 ? retryAfterMs : fallbackBackoff);
    attempt += 1;
  }
}

async function fetchRetailItems(filter, sourceUrl = RETAIL_PRICES_BASE_URL) {
  const items = [];
  let url = `${sourceUrl}?$filter=${encodeURIComponent(filter)}`;
  let pageCount = 0;

  while (url) {
    if (pageCount >= 20) {
      throw new Error('Pricing API pagination limit exceeded (20 pages).');
    }

    const payload = await fetchJsonWithRetry(url, 4);
    if (Array.isArray(payload?.Items)) {
      items.push(...payload.Items);
    }

    url = typeof payload?.NextPageLink === 'string' && payload.NextPageLink ? payload.NextPageLink : null;
    pageCount += 1;
  }

  return items;
}

function toFiniteNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeTierItems(items) {
  const normalized = [];
  const seenMinimums = new Set();

  const sorted = [...items].sort((left, right) => {
    const leftMinimum = toFiniteNumber(left?.tierMinimumUnits, 0);
    const rightMinimum = toFiniteNumber(right?.tierMinimumUnits, 0);
    return leftMinimum - rightMinimum;
  });

  for (const item of sorted) {
    const minimum = toFiniteNumber(item?.tierMinimumUnits, 0);
    const unitPrice = toFiniteNumber(item?.retailPrice, NaN);
    if (!Number.isFinite(minimum) || !Number.isFinite(unitPrice)) {
      continue;
    }
    if (seenMinimums.has(minimum)) {
      continue;
    }
    seenMinimums.add(minimum);
    normalized.push({
      minimum,
      unitPrice
    });
  }

  return normalized;
}

function buildTierPricing(items) {
  const normalized = normalizeTierItems(items);
  if (!normalized.length) {
    return [];
  }

  return normalized.map((tier, index) => {
    const next = normalized[index + 1];
    return {
      upToGb: next ? next.minimum : null,
      unitPrice: tier.unitPrice
    };
  });
}

function parseUnitSizeFromMeasure(unitOfMeasure) {
  const raw = String(unitOfMeasure || '');
  const firstPart = raw.split('/')[0].trim();
  const match = firstPart.match(/^([0-9]+(?:\.[0-9]+)?)\s*([kKmMgG]?)$/);
  if (!match) {
    return null;
  }

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  const suffix = (match[2] || '').toLowerCase();
  const multiplier =
    suffix === 'k' ? 1000 : suffix === 'm' ? 1000000 : suffix === 'g' ? 1000000000 : 1;

  return Math.round(value * multiplier);
}

function selectProductNameByCoverage(items, preferredProductName = '') {
  if (!Array.isArray(items) || !items.length) {
    return '';
  }

  if (preferredProductName) {
    const foundPreferred = items.some((item) => item?.productName === preferredProductName);
    if (foundPreferred) {
      return preferredProductName;
    }
  }

  const countsByProduct = new Map();
  for (const item of items) {
    const productName = String(item?.productName || '').trim();
    if (!productName) {
      continue;
    }
    countsByProduct.set(productName, (countsByProduct.get(productName) || 0) + 1);
  }

  return [...countsByProduct.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || '';
}

function getLatestEffectiveDate(items) {
  const timestamps = (Array.isArray(items) ? items : [])
    .map((item) => new Date(item?.effectiveStartDate || '').getTime())
    .filter((time) => Number.isFinite(time));

  if (!timestamps.length) {
    return '';
  }

  const maxTime = Math.max(...timestamps);
  return new Date(maxTime).toISOString().slice(0, 10);
}

function parseWasabiStoragePriceFromHtml(html) {
  const raw = String(html || '');
  if (!raw) {
    return null;
  }

  const objectStorageMatch = raw.match(
    /Wasabi\s+Object\s+Storage[\s\S]{0,260}?\$\s*([0-9]+(?:\.[0-9]+)?)\s*(?:TB\s*\/\s*mo|TB\/mo|TB\s*\/\s*month|TB\/month)/i
  );
  if (objectStorageMatch) {
    const parsed = Number.parseFloat(objectStorageMatch[1]);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const allMatches = [...raw.matchAll(/\$\s*([0-9]+(?:\.[0-9]+)?)\s*(?:TB\s*\/\s*mo|TB\/mo|TB\s*\/\s*month|TB\/month)/gi)];
  const prices = allMatches
    .map((match) => Number.parseFloat(match[1]))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!prices.length) {
    return null;
  }

  return Math.min(...prices);
}

async function fetchWasabiPayGoPricingAssumptions({
  sourceUrl,
  fallbackAssumptions
}) {
  const source = String(sourceUrl || WASABI_PRICING_FAQ_URL).trim() || WASABI_PRICING_FAQ_URL;
  const html = await fetchTextWithRetry(source, 4);
  const storagePricePerTbMonth = parseWasabiStoragePriceFromHtml(html);
  if (!Number.isFinite(storagePricePerTbMonth) || storagePricePerTbMonth <= 0) {
    throw new Error('Failed to parse Wasabi $/TB/month price from pricing page.');
  }

  return {
    assumptions: {
      ...fallbackAssumptions,
      currency: fallbackAssumptions.currency || 'USD',
      source,
      asOfDate: new Date().toISOString().slice(0, 10),
      storagePricePerTbMonth
    }
  };
}

async function fetchAzureHotLrsPricingAssumptions({
  armRegionName,
  storageProductName,
  storageSkuName,
  egressProductName,
  fallbackAssumptions,
  sourceUrl
}) {
  const region = String(armRegionName || 'eastus').toLowerCase();
  const storageProduct = String(storageProductName || 'General Block Blob v2');
  const storageSku = String(storageSkuName || 'Hot LRS');
  const preferredEgressProduct = String(egressProductName || 'Rtn Preference: MGN');
  const source = String(sourceUrl || RETAIL_PRICES_BASE_URL);

  const storageFilter = [
    `serviceName eq ${quoteODataString('Storage')}`,
    `armRegionName eq ${quoteODataString(region)}`,
    `productName eq ${quoteODataString(storageProduct)}`,
    `skuName eq ${quoteODataString(storageSku)}`,
    `contains(meterName,${quoteODataString('Data Stored')})`
  ].join(' and ');
  const storageItems = await fetchRetailItems(storageFilter, source);
  const storageTiers = buildTierPricing(storageItems);
  if (!storageTiers.length) {
    throw new Error(`No storage pricing tiers found for ${storageProduct} / ${storageSku} in ${region}.`);
  }

  const egressFilter = [
    `serviceName eq ${quoteODataString('Bandwidth')}`,
    `armRegionName eq ${quoteODataString(region)}`,
    `meterName eq ${quoteODataString('Standard Data Transfer Out')}`,
    `skuName eq ${quoteODataString('Standard')}`
  ].join(' and ');
  const egressItemsRaw = await fetchRetailItems(egressFilter, source);
  const egressProduct = selectProductNameByCoverage(egressItemsRaw, preferredEgressProduct);
  const egressItems = egressItemsRaw.filter((item) => item?.productName === egressProduct);
  const egressTiers = buildTierPricing(egressItems);
  if (!egressTiers.length) {
    throw new Error(`No egress pricing tiers found for Data Transfer Out in ${region}.`);
  }

  const ingressFilter = [
    `serviceName eq ${quoteODataString('Bandwidth')}`,
    `armRegionName eq ${quoteODataString(region)}`,
    `meterName eq ${quoteODataString('Standard Data Transfer In')}`,
    `skuName eq ${quoteODataString('Standard')}`,
    `productName eq ${quoteODataString(egressProduct)}`
  ].join(' and ');
  const ingressItems = await fetchRetailItems(ingressFilter, source);
  const ingressUnitPrice = toFiniteNumber(ingressItems[0]?.retailPrice, fallbackAssumptions.ingressPerGb || 0);

  const transactionFilter = [
    `serviceName eq ${quoteODataString('Storage')}`,
    `armRegionName eq ${quoteODataString(region)}`,
    `productName eq ${quoteODataString(storageProduct)}`,
    `skuName eq ${quoteODataString(storageSku)}`,
    `contains(meterName,${quoteODataString('Operations')})`
  ].join(' and ');
  const transactionItems = await fetchRetailItems(transactionFilter, source);

  const transactionItem =
    transactionItems.find((item) => item?.meterName === 'Hot Read Operations') ||
    transactionItems.find((item) => item?.meterName === 'All Other Operations') ||
    transactionItems.find((item) => String(item?.meterName || '').toLowerCase().includes('read operations')) ||
    transactionItems[0] ||
    null;

  if (!transactionItem) {
    throw new Error(`No transaction pricing item found for ${storageProduct} / ${storageSku} in ${region}.`);
  }

  const transactionUnitSize =
    parseUnitSizeFromMeasure(transactionItem.unitOfMeasure) || fallbackAssumptions.transactionUnitSize || 10000;
  const transactionUnitPrice = toFiniteNumber(
    transactionItem.retailPrice,
    fallbackAssumptions.transactionUnitPrice || 0.004
  );

  const selectedItems = [
    ...storageItems,
    ...egressItems,
    ...ingressItems,
    transactionItem
  ];
  const asOfDate = getLatestEffectiveDate(selectedItems) || fallbackAssumptions.asOfDate || '';
  const currency =
    String(storageItems[0]?.currencyCode || egressItems[0]?.currencyCode || fallbackAssumptions.currency || 'USD');
  const regionLabel = String(storageItems[0]?.location || fallbackAssumptions.regionLabel || region);

  return {
    assumptions: {
      ...fallbackAssumptions,
      currency,
      regionLabel,
      source,
      asOfDate,
      storageHotLrsGbMonthTiers: storageTiers,
      egressInternetGbTiers: egressTiers,
      ingressPerGb: ingressUnitPrice,
      transactionUnitSize,
      transactionUnitPrice,
      transactionRateLabel: transactionItem.meterName || fallbackAssumptions.transactionRateLabel
    },
    meta: {
      egressProduct,
      armRegionName: region
    }
  };
}

module.exports = {
  fetchAzureHotLrsPricingAssumptions,
  fetchWasabiPayGoPricingAssumptions
};
