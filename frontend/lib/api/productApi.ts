import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';
import { ProductDto } from '../types';

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<PaginatedData<ProductDto>>, Record<string, any>>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
      transformResponse: (response: ApiResponse<PaginatedData<ProductDto>>, meta) => {
        if (meta?.response?.headers.has('X-Pagination')) {
            const paginationStr = meta.response.headers.get('X-Pagination');
            if (paginationStr) {
                const pagination = JSON.parse(paginationStr);
                return { ...response, data: { ...response.data, ...pagination } } as ApiResponse<PaginatedData<ProductDto>>;
            }
        }
        return response;
      }
    }),
    getFeaturedProducts: builder.query<ApiResponse<ProductDto[]>, void>({
      query: () => '/products/featured',
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<ApiResponse<ProductDto>, { vendorSlug: string; slug: string }>({
      query: ({ vendorSlug, slug }) => `/products/${vendorSlug}/${slug}`,
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg.slug }],
    }),
    getVendorProducts: builder.query<ApiResponse<PaginatedData<ProductDto>>, any>({
      query: (params) => ({ url: '/products/me', params }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<ApiResponse<string>, FormData>({
      query: (data) => ({ url: '/products', method: 'POST', body: data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ApiResponse<void>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, arg) => ['Product', { type: 'Product', id: arg.id }],
    }),
    publishProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/products/${id}/publish`, method: 'PUT' }),
      invalidatesTags: ['Product'],
    }),
    archiveProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/products/${id}/archive`, method: 'PUT' }),
      invalidatesTags: ['Product'],
    }),
    adjustStock: builder.mutation<ApiResponse<void>, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/products/${id}/stock`, method: 'PUT', body: { quantity } }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImages: builder.mutation<ApiResponse<any>, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/products/${id}/images`, method: 'POST', body: data }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }],
    }),
    deleteProductImage: builder.mutation<ApiResponse<void>, { productId: string; imageId: string }>({
      query: ({ productId, imageId }) => ({ url: `/products/${productId}/images/${imageId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.productId }],
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
