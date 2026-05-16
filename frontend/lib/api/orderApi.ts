import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export interface OrderDto {
  id: string;
  orderNumber: string;
}

export interface OrderSummaryDto {
  orderNumber: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  vendorStoreName: string;
  createdAt: string;
  trackingNumber?: string;
}

export interface OrderDetailDto {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  createdAt: string;
}

export interface TrackingDto {
  orderNumber: string;
  trackingNumber: string;
  carrierName: string;
  status: string;
  trackingEvents: any[];
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation<ApiResponse<OrderDto[]>, any>({
      query: (data) => ({ url: '/orders/checkout', method: 'POST', body: data }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getMyOrders: builder.query<ApiResponse<PaginatedData<OrderSummaryDto>>, any>({
      query: (params) => ({ url: '/orders/my', params }),
      providesTags: ['Order'],
    }),
    getOrderDetail: builder.query<ApiResponse<OrderDetailDto>, string>({
      query: (orderNumber) => `/orders/my/${orderNumber}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation<ApiResponse<void>, { id: string; reason: string }>({
      query: ({ id, reason }) => ({ url: `/orders/my/${id}/cancel`, method: 'PUT', body: { orderId: id, reason } }),
      invalidatesTags: (result, error, arg) => ['Order', { type: 'Order', id: arg.id }],
    }),
    getVendorOrders: builder.query<ApiResponse<PaginatedData<OrderSummaryDto>>, any>({
      query: (params) => ({ url: '/orders/vendor', params }),
      providesTags: ['Order'],
    }),
    confirmOrder: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/orders/vendor/${id}/confirm`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
    }),
    shipOrder: builder.mutation<ApiResponse<void>, { id: string; trackingNumber: string; carrierName?: string }>({
      query: ({ id, trackingNumber, carrierName }) => ({ url: `/orders/vendor/${id}/ship`, method: 'PUT', body: { orderId: id, trackingNumber, carrierName } }),
      invalidatesTags: (result, error, arg) => ['Order', { type: 'Order', id: arg.id }],
    }),
    deliverOrder: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/orders/vendor/${id}/deliver`, method: 'PUT' }),
      invalidatesTags: (result, error, id) => ['Order', { type: 'Order', id }],
    }),
    trackOrder: builder.query<ApiResponse<TrackingDto>, string>({
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
