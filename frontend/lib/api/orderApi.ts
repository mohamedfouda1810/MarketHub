import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<ApiResponse<{ orderId: string }>, any>({
      query: (data) => ({ url: '/orders/checkout', method: 'POST', body: data }),
      invalidatesTags: ['Order', 'Cart'], // Checking out clears cart and creates orders
    }),
    getMyOrders: builder.query<ApiResponse<PaginatedData<any>>, any>({
      query: (params) => ({ url: '/orders/my', params }),
      providesTags: ['Order'],
    }),
    getOrderDetail: builder.query<ApiResponse<any>, string>({
      query: (orderNumber) => `/orders/my/${orderNumber}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation<ApiResponse<{}>, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/orders/my/${id}/cancel`, method: 'PUT', body: { reason } }),
      invalidatesTags: (result, error, arg) => ['Order', { type: 'Order', id: arg.id }],
    }),
    getVendorOrders: builder.query<ApiResponse<PaginatedData<any>>, any>({
      query: (params) => ({ url: '/orders/vendor', params }),
      providesTags: ['Order'],
    }),
    confirmOrder: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/orders/vendor/${id}/confirm`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
    }),
    shipOrder: builder.mutation<ApiResponse<{}>, { id: string; trackingNumber: string }>({
      query: ({ id, trackingNumber }) => ({ url: `/orders/vendor/${id}/ship`, method: 'PUT', body: { trackingNumber } }),
      invalidatesTags: (result, error, arg) => ['Order', { type: 'Order', id: arg.id }],
    }),
    deliverOrder: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/orders/vendor/${id}/deliver`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
    }),
    trackOrder: builder.query<ApiResponse<any>, string>({
      query: (orderNumber) => `/orders/track/${orderNumber}`,
      providesTags: (result, error, id) => [{ type: 'Order', id: `Track-${id}` }],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetMyOrdersQuery,
  useGetOrderDetailQuery,
  useCancelOrderMutation,
  useGetVendorOrdersQuery,
  useConfirmOrderMutation,
  useShipOrderMutation,
  useDeliverOrderMutation,
  useTrackOrderQuery,
} = orderApi;
