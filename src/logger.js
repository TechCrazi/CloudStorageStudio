function parseBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  const normalized = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) {
    return false;
  }
  return defaultValue;
}

const loggingConfig = {
  enableDebug: parseBoolean(process.env.LOG_ENABLE_DEBUG, false),
  enableInfo: parseBoolean(process.env.LOG_ENABLE_INFO, true),
  enableWarn: parseBoolean(process.env.LOG_ENABLE_WARN, true),
  enableError: parseBoolean(process.env.LOG_ENABLE_ERROR, true),
  includeTimestamp: parseBoolean(process.env.LOG_INCLUDE_TIMESTAMP, true),
  json: parseBoolean(process.env.LOG_JSON, false),
  httpRequests: parseBoolean(process.env.LOG_HTTP_REQUESTS, true),
  httpDebug: parseBoolean(process.env.LOG_HTTP_DEBUG, false),
  maxValueLength: Math.max(80, Number.parseInt(process.env.LOG_MAX_VALUE_LENGTH || '500', 10))
};

function isLevelEnabled(level) {
  switch (level) {
    case 'debug':
      return loggingConfig.enableDebug;
    case 'info':
      return loggingConfig.enableInfo;
    case 'warn':
      return loggingConfig.enableWarn;
    case 'error':
      return loggingConfig.enableError;
    default:
      return true;
  }
}

function safeJson(value) {
  try {
    return JSON.stringify(value);
  } catch (_error) {
    return '"[unserializable]"';
  }
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function normalizeMeta(meta) {
  if (!meta || typeof meta !== 'object') {
    return {};
  }

  if (meta instanceof Error) {
    return {
      errorName: meta.name,
      errorMessage: meta.message,
      errorStack: meta.stack
    };
  }

  return meta;
}

function metaAsPlainText(meta) {
  const values = normalizeMeta(meta);
  const entries = Object.entries(values);
  if (!entries.length) {
    return '';
  }

  const rendered = entries.map(([key, value]) => {
    if (value === undefined) {
      return null;
    }

    let normalized;
    if (value === null) {
      normalized = 'null';
    } else if (typeof value === 'string') {
      normalized = value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      normalized = String(value);
    } else {
      normalized = safeJson(value);
    }

    const compact = String(normalized).replace(/\s+/g, ' ').trim();
    return `${key}=${truncateText(compact, loggingConfig.maxValueLength)}`;
  });

  return rendered.filter(Boolean).join(' ');
}

function write(level, scope, message, meta) {
  if (!isLevelEnabled(level)) {
    return;
  }

  const safeMessage = String(message || '').trim() || '(no message)';
  const normalizedScope = String(scope || 'app');
  const normalizedMeta = normalizeMeta(meta);
  const timestamp = new Date().toISOString();

  if (loggingConfig.json) {
    const payload = {
      level,
      scope: normalizedScope,
      message: safeMessage,
      ...normalizedMeta
    };
    if (loggingConfig.includeTimestamp) {
      payload.timestamp = timestamp;
    }

    const line = safeJson(payload);
    if (level === 'warn') {
      console.warn(line);
      return;
    }
    if (level === 'error') {
      console.error(line);
      return;
    }
    console.log(line);
    return;
  }

  const prefixParts = [];
  if (loggingConfig.includeTimestamp) {
    prefixParts.push(`[${timestamp}]`);
  }
  prefixParts.push(`[${level.toUpperCase()}]`);
  prefixParts.push(`[${normalizedScope}]`);

  const metaText = metaAsPlainText(normalizedMeta);
  const line = metaText ? `${prefixParts.join(' ')} ${safeMessage} | ${metaText}` : `${prefixParts.join(' ')} ${safeMessage}`;

  if (level === 'warn') {
    console.warn(line);
    return;
  }
  if (level === 'error') {
    console.error(line);
    return;
  }
  console.log(line);
}

function createLogger(scope = 'app') {
  const resolvedScope = String(scope || 'app');
  return {
    debug(message, meta) {
      write('debug', resolvedScope, message, meta);
    },
    info(message, meta) {
      write('info', resolvedScope, message, meta);
    },
    warn(message, meta) {
      write('warn', resolvedScope, message, meta);
    },
    error(message, meta) {
      write('error', resolvedScope, message, meta);
    },
    child(childScope) {
      return createLogger(`${resolvedScope}:${String(childScope || 'child')}`);
    }
  };
}

module.exports = {
  createLogger,
  loggingConfig,
  parseBoolean
};
