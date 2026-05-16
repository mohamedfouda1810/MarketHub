import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export interface VendorStoreDto {
  id: string;
  storeName: string;
  storeSlug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  storeEmail: string;
  storePhone: string;
  totalProducts: number;
  averageRating: number;
}

export interface DashboardDto {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
  salesChartData: any[];
}

export interface EarningsDto {
  totalEarnings: number;
  pendingClearance: number;
  availableForWithdrawal: number;
  transactions: any[];
}

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<ApiResponse<PaginatedData<VendorStoreDto>>, any>({
      query: (params) => ({ url: '/vendors', params }),
      providesTags: ['Vendor'],
    }),
    getStoreBySlug: builder.query<ApiResponse<VendorStoreDto>, string>({
      query: (slug) => `/vendors/${slug}`,
      providesTags: (result, error, id) => [{ type: 'Vendor', id }],
    }),
    getStoreCategories: builder.query<ApiResponse<any[]>, string>({
      query: (slug) => `/vendors/${slug}/categories`,
    }),
    getStoreProducts: builder.query<ApiResponse<PaginatedData<any>>, { slug: string; params?: any }>({
      query: ({ slug, params }) => ({ url: `/vendors/${slug}/products`, params }),
    }),
    getStoreDashboard: builder.query<ApiResponse<DashboardDto>, void>({
      query: () => '/vendors/me/dashboard',
      providesTags: ['Vendor'],
    }),
    getStoreEarnings: builder.query<ApiResponse<EarningsDto>, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/vendors/me/earnings', params }),
    }),
    updateVendorProfile: builder.mutation<ApiResponse<void>, FormData>({
      query: (data) => ({ url: '/vendors/me/profile', method: 'PUT', body: data }),
      invalidatesTags: ['Vendor'],
    }),
    requestWithdrawal: builder.mutation<ApiResponse<void>, any>({
      query: (data) => ({ url: '/vendors/me/withdrawal', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreBySlugQuery,
  useGetStoreCategoriesQuery,
  useGetStoreProductsQuery,
  useGetStoreDashboardQuery,
  useGetStoreEarningsQuery,
  useUpdateVendorProfileMutation,
  useRequestWithdrawalMutation,
} = vendorApi;
