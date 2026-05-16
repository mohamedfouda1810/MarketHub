import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export interface VendorAdminDto {
  id: string;
  storeName: string;
  email: string;
  status: string;
  registeredAt: string;
  commissionRate: number;
}

export interface PlatformAnalyticsDto {
  totalRevenue: number;
  totalOrders: number;
  activeVendors: number;
  newCustomers: number;
  dailyRevenueChart: any[];
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminVendors: builder.query<ApiResponse<PaginatedData<VendorAdminDto>>, any>({
      query: (params) => ({ url: '/admin/vendors', params }),
      providesTags: ['Vendor'],
    }),
    getPlatformAnalytics: builder.query<ApiResponse<PlatformAnalyticsDto>, { dateFrom: string; dateTo: string }>({
      query: (params) => ({ url: '/admin/analytics', params }),
    }),
    approveVendor: builder.mutation<ApiResponse<void>, { vendorId: string; commissionRate: number }>({
      query: (body) => ({ url: '/admin/vendors/approve', method: 'POST', body }),
      invalidatesTags: ['Vendor'],
    }),
    suspendVendor: builder.mutation<ApiResponse<void>, { vendorId: string; reason: string }>({
      query: (body) => ({ url: '/admin/vendors/suspend', method: 'POST', body }),
      invalidatesTags: ['Vendor'],
    }),
  }),
});

export const {
  useGetAdminVendorsQuery,
  useGetPlatformAnalyticsQuery,
  useApproveVendorMutation,
  useSuspendVendorMutation,
} = adminApi;
