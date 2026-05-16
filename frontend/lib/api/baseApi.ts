import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { RootState } from '../store';
import { logout, setCredentials } from '../store/authSlice';

// ✅ FIX: Proper Promise-based mutex with a real waitForUnlock method.
// The old code used `mutex.waitForUnlock?.()` but the method didn't exist,
// causing the optional chain to silently return undefined — breaking concurrent 401 retry protection.
class SimpleMutex {
  private _locked = false;
  private _queue: Array<() => void> = [];

  async acquire(): Promise<() => void> {
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

  release(): void {
    this._locked = false;
    const next = this._queue.shift();
    if (next) next();
  }

  isLocked(): boolean {
    return this._locked;
  }

  // ✅ FIX: Proper waitForUnlock — resolves when mutex is free without acquiring it
  waitForUnlock(): Promise<void> {
    if (!this._locked) return Promise.resolve();
    return new Promise<void>(resolve => {
      const originalRelease = this.release.bind(this);
      this.release = () => {
        originalRelease();
        this.release = originalRelease;
        resolve();
      };
    });
  }
}

const mutex = new SimpleMutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api/v1',
  credentials: 'include',
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
  // Wait if a refresh is already in progress
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          { url: '/auth/refresh-token', method: 'POST' },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { data } = refreshResult.data as any;
          api.dispatch(setCredentials({
            accessToken: data.accessToken,
            user: (api.getState() as RootState).auth.user ?? undefined,
          }));
          // Retry the original request with new token
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      // Another request is already refreshing — wait for it then retry
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'Cart', 'Review', 'Vendor', 'Notification', 'Coupon', 'User'],
  endpoints: () => ({}),
});
