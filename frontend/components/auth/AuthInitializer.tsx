'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '@/lib/api/authApi';
import { setCredentials, setLoading } from '@/lib/store/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      // Skip if already on login or register page
      const isAuthPage = window.location.pathname.startsWith('/login') || 
                        window.location.pathname.startsWith('/register') ||
                        window.location.pathname.startsWith('/forgot-password') ||
                        window.location.pathname.startsWith('/reset-password') ||
                        window.location.pathname.startsWith('/verify-email');
      
      if (isAuthPage) {
        dispatch(setLoading(false));
        return;
      }

      try {
        // Try to fetch current user to restore session
        const result = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap();
        if (result.data) {
          dispatch(setCredentials({
            user: result.data,
            accessToken: '', // Token is in HttpOnly cookie
          }));
        }
      } catch (error) {
        // Not logged in or session expired
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
