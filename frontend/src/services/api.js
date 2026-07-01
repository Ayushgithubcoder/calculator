const API_BASE = import.meta.env.VITE_API_URL || '/api/calculator';

class ApiError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    const error = payload.error || {};
    throw new ApiError(
      error.message || 'Request failed',
      error.code || 'REQUEST_FAILED',
      error.details
    );
  }

  return payload.data;
}

export function evaluateExpression(expression) {
  return request('/evaluate', {
    method: 'POST',
    body: JSON.stringify({ expression }),
  });
}

export function checkHealth() {
  return request('/health');
}
