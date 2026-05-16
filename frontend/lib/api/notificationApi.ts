import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountDto {
  count: number;
}

export const notificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<PaginatedData<NotificationDto>>, any>({
      query: (params) => ({ url: '/notifications', params }),
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<ApiResponse<UnreadCountDto>, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    markRead: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PUT' }),
      invalidatesTags: ['Notification'],
    }),
    markAllRead: builder.mutation<ApiResponse<void>, void>({
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
