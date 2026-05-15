import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<PaginatedData<any>>, Record<string, any>>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
      transformResponse: (response: ApiResponse<any>, meta) => {
        // Backend might send pagination in headers, we'll merge it with data if needed
        // Assuming backend sends PaginatedData inside response.data based on earlier prompt
        if (meta?.response?.headers.has('X-Pagination')) {
            const paginationStr = meta.response.headers.get('X-Pagination');
            if (paginationStr) {
                const pagination = JSON.parse(paginationStr);
                // merge if the backend doesn't send it in body, but prompt says "Paginated: data has {items, totalCount...}"
                // If it's only in header, we'd inject it here. Assuming it's in body as well.
                return { ...response, data: { ...response.data, ...pagination } } as ApiResponse<PaginatedData<any>>;
            }
        }
        return response;
      }
    }),
    getFeaturedProducts: builder.query<ApiResponse<any[]>, void>({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<ApiResponse<any>, { vendorSlug: string; slug: string }>({
      query: ({ vendorSlug, slug }) => `/products/${vendorSlug}/${slug}`,
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg.slug }],
    }),
    getVendorProducts: builder.query<ApiResponse<PaginatedData<any>>, any>({
      query: (params) => ({ url: '/products/me', params }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<ApiResponse<{ id: string }>, FormData>({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ApiResponse<{}>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, arg) => ['Product', { type: 'Product', id: arg.id }],
    }),
    publishProduct: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/products/${id}/publish`, method: 'PUT' }),
      invalidatesTags: ['Product'],
    }),
    archiveProduct: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/products/${id}/archive`, method: 'PUT' }),
      invalidatesTags: ['Product'],
    }),
    adjustStock: builder.mutation<ApiResponse<{}>, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/products/${id}/stock`, method: 'PUT', body: { quantity } }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),
    deleteProduct: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImages: builder.mutation<ApiResponse<{}>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/products/${id}/images`, method: 'POST', body: data }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),
    deleteProductImage: builder.mutation<ApiResponse<{}>, string>({
      query: (imageId) => ({ url: `/products/images/${imageId}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetFeaturedProductsQuery,
  useGetProductBySlugQuery,
  useGetVendorProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  usePublishProductMutation,
  useArchiveProductMutation,
  useAdjustStockMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
} = productApi;
