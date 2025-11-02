/**
 * Maps Supabase authentication error messages to user-friendly messages.
 * @param {object|string|null} error - The error object or message from Supabase.
 * @returns {string} A user-friendly error message.
 */
export function mapAuthError(error) {
  if (!error) return 'An unknown error occurred. Please try again.';

  const message = typeof error === 'string' ? error.toLowerCase() : error.message?.toLowerCase();

  if (!message) return 'An unknown error occurred. Please try again.';

  // Common Supabase auth error mappings
  const errorMap = {
    'user already registered': 'This email is already registered. Please sign in instead.',
    'email already registered': 'This email is already registered. Please sign in instead.',
    'invalid login credentials': 'Invalid email or password. Please try again.',
    'invalid email or password': 'Invalid email or password. Please try again.',
    'email not confirmed': 'Please confirm your email before signing in.',
    'password should be at least': 'Password must be at least 6 characters long.',
    'password too short': 'Password must be at least 6 characters long.',
    'rate limit': 'Too many attempts. Please wait a moment and try again.',
    'network error': 'Network error. Please check your internet connection.',
    'fetch failed': 'Network error. Please check your internet connection.',
    'failed to fetch': 'Network error. Please check your internet connection.',
    'connection error': 'Unable to connect to the service. Please check your internet connection.',
    'connection failed': 'Unable to connect to the service. Please check your internet connection.',
    'user not found': 'No account found with this email. Please sign up first.',
    'too many requests': 'Too many login attempts. Please try again later.',
    'auth session missing': 'Session expired. Please sign in again.',
    'email needs to be verified': 'Please verify your email before signing in.'
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  // Fallback to original message or default
  return error.message || 'An unexpected error occurred. Please try again.';
}