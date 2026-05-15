import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

/**
 * Extracts a human-readable error message from an RTK Query error object.
 */
export function getErrorMessage(error: FetchBaseQueryError | SerializedError | undefined): string {
  if (!error) return 'An unknown error occurred';

  if ('status' in error) {
    // FetchBaseQueryError
    const data = error.data as any;
    if (data?.message) return data.message;
    if (data?.errors && Array.isArray(data.errors)) return data.errors.join(', ');
    
    switch (error.status) {
      case 400: return 'Bad Request';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 500: return 'Internal Server Error';
      default: return 'An error occurred while fetching data';
    }
  }

  // SerializedError
  return error.message || 'An unexpected error occurred';
}

/**
 * Displays an error toast with the extracted error message.
 */
export function handleError(error: FetchBaseQueryError | SerializedError | undefined) {
  const message = getErrorMessage(error);
  toast.error(message);
}
