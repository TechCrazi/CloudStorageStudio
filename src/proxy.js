const { ProxyAgent, setGlobalDispatcher } = require('undici');

function maskProxyUrl(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = new URL(raw);
    const user = parsed.username ? '***' : '';
    const pass = parsed.password ? ':***' : '';
    const auth = user || pass ? `${user}${pass}@` : '';
    return `${parsed.protocol}//${auth}${parsed.host}`;
  } catch (_error) {
    return 'invalid-proxy-url';
  }
}

function configureProxyFromEnv() {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '';
  if (!proxyUrl) {
    return {
      enabled: false,
      proxy: null,
      error: null
    };
  }

  try {
    const agent = new ProxyAgent(proxyUrl);
    setGlobalDispatcher(agent);

    return {
      enabled: true,
      proxy: maskProxyUrl(proxyUrl),
      error: null
    };
  } catch (error) {
    return {
      enabled: false,
      proxy: maskProxyUrl(proxyUrl),
      error: error.message || String(error)
    };
  }
}

module.exports = {
  configureProxyFromEnv
};
