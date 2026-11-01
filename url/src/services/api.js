// api.js - Centralized HTTP Client with In-Memory Access Token & Auto-Refresh Interceptor
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let inMemoryAccessToken = null;
let isRefreshing = false;
let refreshSubscribers = [];
let onSessionExpiredCallback = null;

export const setAccessToken = (token) => {
  inMemoryAccessToken = token;
};

export const getAccessToken = () => inMemoryAccessToken;

export const setOnSessionExpired = (cb) => {
  onSessionExpiredCallback = cb;
};

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

/**
 * Robust fetch wrapper with automatic token injection, 401 detection,
 * concurrency queueing, and silent refresh token rotation.
 */
export const apiClient = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(options.headers || {}),
  };

  if (inMemoryAccessToken && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${inMemoryAccessToken}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include', // Automatically attaches HttpOnly jwt_refresh cookie
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If 401 Unauthorized occurs on an authenticated endpoint (not during login/refresh)
    const isAuthEndpoint = endpoint.includes('/auth/login') || endpoint.includes('/auth/refresh') || endpoint.includes('/auth/register');
    if (response.status === 401 && !options._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue pending concurrent requests while refresh token rotation executes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              options._retry = true;
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              };
              resolve(apiClient(endpoint, options));
            } else {
              reject(new Error('Session expired'));
            }
          });
        });
      }

      options._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.data?.accessToken;
          if (newAccessToken) {
            setAccessToken(newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);

            // Retry original request with newly issued access token
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return apiClient(endpoint, options);
          }
        }

        // Refresh failed (token expired, revoked, or reused)
        throw new Error('Refresh failed');
      } catch (err) {
        isRefreshing = false;
        onRefreshed(null);
        setAccessToken(null);
        if (typeof onSessionExpiredCallback === 'function') {
          onSessionExpiredCallback();
        }
        throw err;
      }
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `HTTP ${response.status} Error`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    throw err;
  }
};

export default apiClient;

