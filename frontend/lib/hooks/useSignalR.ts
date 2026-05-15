import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import toast from 'react-hot-toast';
import { api } from '../api/baseApi';

export function useSignalR() {
  const [connectionState, setConnectionState] = useState<HubConnectionState>(HubConnectionState.Disconnected);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      if (connection) {
        connection.stop();
      }
      return;
    }

    const url = `${process.env.NEXT_PUBLIC_SIGNALR_URL}/hubs/notifications`;
    
    const newConnection = new HubConnectionBuilder()
      .withUrl(url, { accessTokenFactory: () => token })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => {
        setConnectionState(newConnection.state);

        newConnection.on('ReceiveNotification', (notification: any) => {
          toast(notification.message || 'New notification', { icon: '🔔' });
          // Dispatch cache invalidation to RTK Query
          dispatch(api.util.invalidateTags(['Notification']));
        });

        newConnection.on('OrderStatusChanged', (data: any) => {
          toast.success(`Order ${data.orderNumber} status changed to ${data.status}`);
          dispatch(api.util.invalidateTags(['Order']));
        });

        newConnection.on('CartUpdated', () => {
          dispatch(api.util.invalidateTags(['Cart']));
        });
      })
      .catch(err => {
        console.error('SignalR Connection Error: ', err);
        setConnectionState(HubConnectionState.Disconnected);
      });

    newConnection.onreconnecting(() => {
      setConnectionState(HubConnectionState.Reconnecting);
    });

    newConnection.onreconnected(() => {
      setConnectionState(HubConnectionState.Connected);
    });

    newConnection.onclose(() => {
      setConnectionState(HubConnectionState.Disconnected);
    });

    return () => {
      newConnection.stop();
    };
  }, [token, dispatch]);

  return { connectionState };
}
