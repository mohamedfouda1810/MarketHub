import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { useGetNotificationsQuery, useGetUnreadCountQuery, useMarkReadMutation, useMarkAllReadMutation } from '../../lib/api/notificationApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const { data: unreadData, refetch: refetchUnread } = useGetUnreadCountQuery(undefined, { skip: !isAuthenticated });
  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery({ pageSize: 5 }, { skip: !isAuthenticated || !isOpen });
  const [markRead] = useMarkReadMutation();
  const [markAllRead] = useMarkAllReadMutation();

  const unreadCount = unreadData?.data?.count || 0;

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markRead(id);
    refetchUnread();
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    refetchUnread();
    refetchNotifications();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold ring-2 ring-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-50 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notificationsData?.data?.items?.length ? (
              <ul>
                {notificationsData.data.items.map((notif: any) => (
                  <li 
                    key={notif.id} 
                    className={`px-4 py-3 border-b hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.body}</p>
                        <p className="text-[10px] text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleDateString()}</p>
                      </div>
                      {!notif.isRead && (
                        <button 
                          onClick={(e) => handleMarkRead(notif.id, e)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-sm text-gray-500">
                No notifications yet.
              </div>
            )}
          </div>
          
          <div className="px-4 py-2 border-t bg-gray-50 text-center">
            <button className="text-sm text-gray-600 hover:text-black font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
