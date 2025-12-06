/**
 * API utility functions for authenticated requests
 */

/**
 * Get the authentication token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Get the API URL from environment variables
 * @throws Error if VITE_API_URL is not defined
 */
export const getApiUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    throw new Error('VITE_API_URL is not defined in environment variables');
  }
  return apiUrl;
};

/**
 * Clear authentication tokens from localStorage
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

/**
 * Create headers for authenticated API requests
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Handle authentication errors (401) by clearing tokens
 * @param navigate - Optional navigate function to redirect to signin
 */
export const handleAuthError = (navigate?: (path: string) => void): void => {
  clearAuthTokens();
  if (navigate) {
    navigate('/signin');
  }
};

/**
 * Make an authenticated API request with automatic error handling
 * @param url - The API endpoint (relative to base API URL)
 * @param options - Fetch options (method, body, etc.)
 * @param navigate - Optional navigate function for redirecting on auth errors
 * @returns Promise with the response
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
  navigate?: (path: string) => void
): Promise<Response> => {
  const token = getToken();
  
  if (!token) {
    if (navigate) {
      navigate('/signin');
    }
    throw new Error('No authentication token found');
  }

  const apiUrl = getApiUrl();
  const fullUrl = url.startsWith('http') ? url : `${apiUrl}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    handleAuthError(navigate);
    throw new Error('Unauthorized');
  }

  return response;
};

