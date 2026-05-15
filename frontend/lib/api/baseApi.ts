import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { logout, setCredentials } from '../store/authSlice';

// Mutex to prevent multiple simultaneous refresh attempts
import { Mutex } from 'async-mutex'; // We can use async-mutex, or build a simple promise-based one.
// Building a simple Promise-based mutex to avoid external dependency if not installed:
class SimpleMutex {
  private _locked = false;
  private _queue: Array<() => void> = [];

  async acquire() {
    if (!this._locked) {
      this._locked = true;
      return () => this.release();
    }
    return new Promise<() => void>(resolve => {
      this._queue.push(() => {
        this._locked = true;
        resolve(() => this.release());
      });
    });
  }

  release() {
    this._locked = false;
    const next = this._queue.shift();
    if (next) next();
  }

  isLocked() {
    return this._locked;
  }
}

const mutex = new SimpleMutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock?.() || Promise.resolve(); // Not strictly needed with our custom mutex, we just rely on waiting
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh-token',
            method: 'POST',
            // Cookies (including HttpOnly refresh token) will be sent automatically if we configure credentials
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { data } = refreshResult.data as any; // ApiResponse<T>
          api.dispatch(setCredentials({ 
            accessToken: data.token, 
            user: (api.getState() as RootState).auth.user 
          }));
          
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } finally {
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      const release = await mutex.acquire();
      release();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'Cart', 'Review', 'Vendor', 'Notification', 'Coupon'],
  endpoints: () => ({}),
});
