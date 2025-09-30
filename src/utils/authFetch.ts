// This is a wrapper for fetch that handles 401 errors by dispatching an auth error event
export const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const response = await fetch(url, options);

  if (response.status === 401) {
    // Dispatch a custom event to notify auth error
    window.dispatchEvent(new CustomEvent('auth-error'));
    throw new Error('AUTH_ERROR_401');
  }

  return response;
};