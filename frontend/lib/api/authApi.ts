import { api } from './baseApi';
import { ApiResponse } from '../types/api';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation<ApiResponse<{ token: string }>, any>({
      query: (data) => ({ url: '/auth/register/customer', method: 'POST', body: data }),
    }),
    registerVendor: builder.mutation<ApiResponse<{ token: string }>, any>({
      query: (data) => ({ url: '/auth/register/vendor', method: 'POST', body: data }),
    }),
    login: builder.mutation<ApiResponse<{ token: string }>, any>({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
    }),
    logout: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    forgotPassword: builder.mutation<ApiResponse<{}>, { email: string }>({
      query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation<ApiResponse<{}>, any>({
      query: (data) => ({ url: '/auth/reset-password', method: 'POST', body: data }),
    }),
    getCurrentUser: builder.query<ApiResponse<any>, void>({
      query: () => '/auth/me',
    }),
  }),
});

export const {
  useRegisterCustomerMutation,
  useRegisterVendorMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} = authApi;
