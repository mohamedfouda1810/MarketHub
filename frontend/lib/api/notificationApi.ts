import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<PaginatedData<any>>, any>({
      query: (params) => ({ url: '/notifications', params }),
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    markRead: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllRead: builder.mutation<ApiResponse<{}>, void>({
      query: () => ({ url: '/notifications/read-all', method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} = notificationApi;
