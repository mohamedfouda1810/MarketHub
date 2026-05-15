import { api } from './baseApi';
import { ApiResponse } from '../types/api';

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  errors: string[];
}

export interface AuthResponseDto {
  success: boolean;
  errors: string[];
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  vendorId?: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    registerCustomer: builder.mutation<ApiResponse<AuthResponseDto>, any>({
      query: (data) => ({ url: '/auth/register/customer', method: 'POST', body: data }),
    }),
    registerVendor: builder.mutation<ApiResponse<AuthResponseDto>, any>({
      query: (data) => ({ url: '/auth/register/vendor', method: 'POST', body: data }),
    }),
    login: builder.mutation<ApiResponse<LoginResponseDto>, any>({
      query: (data) => ({ url: '/auth/login', method: 'POST', body: data }),
    }),
    logout: builder.mutation<ApiResponse<void>, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
    }),
    forgotPassword: builder.mutation<ApiResponse<AuthResponseDto>, { email: string }>({
      query: (data) => ({ url: '/auth/forgot-password', method: 'POST', body: data }),
    }),
    resetPassword: builder.mutation<ApiResponse<AuthResponseDto>, any>({
      query: (data) => ({ url: '/auth/reset-password', method: 'POST', body: data }),
    }),
    getCurrentUser: builder.query<ApiResponse<UserDto>, void>({
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
