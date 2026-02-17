function parseErrorMessage(rawText) {
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.error_description) {
      return String(parsed.error_description);
    }
    if (parsed.error) {
      return String(parsed.error);
    }
  } catch (_error) {
    // Ignore parse error and fallback to plain text.
  }
  return String(rawText || '').trim();
}

function createTokenProvider({ tenantId, clientId, clientSecret }) {
  const missing = [];

  if (!tenantId || tenantId === 'common') {
    missing.push('AZURE_TENANT_ID (must be a specific tenant ID, not "common")');
  }
  if (!clientId) {
    missing.push('AZURE_CLIENT_ID');
  }
  if (!clientSecret) {
    missing.push('AZURE_CLIENT_SECRET');
  }

  const isConfigured = missing.length === 0;
  const cache = new Map();

  async function getToken(scope) {
    if (!isConfigured) {
      throw new Error(`Service principal auth is not configured: ${missing.join(', ')}`);
    }

    const cached = cache.get(scope);
    if (cached && cached.expiresAtMs > Date.now() + 2 * 60 * 1000) {
      return cached.accessToken;
    }

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope
    });

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Failed to acquire token for ${scope}: ${parseErrorMessage(text)}`);
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (_error) {
      throw new Error(`Token endpoint returned invalid JSON for ${scope}`);
    }

    if (!payload.access_token) {
      throw new Error(`Token endpoint response missing access_token for ${scope}`);
    }

    const expiresInSec = Number.parseInt(payload.expires_in, 10);
    const expiresAtMs = Date.now() + (Number.isFinite(expiresInSec) ? expiresInSec : 3600) * 1000;

    cache.set(scope, {
      accessToken: payload.access_token,
      expiresAtMs
    });

    return payload.access_token;
  }

  return {
    isConfigured,
    missing,
    tenantId,
    clientId,
    async getArmToken() {
      return getToken('https://management.azure.com/.default');
    },
    async getStorageToken() {
      return getToken('https://storage.azure.com/.default');
    }
  };
}

module.exports = {
  createTokenProvider
};
