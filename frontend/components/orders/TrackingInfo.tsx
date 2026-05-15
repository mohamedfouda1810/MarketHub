import { useEffect, useState } from 'react';
import { useTrackOrderQuery } from '../../lib/api/orderApi';
import { useSignalR } from '../../lib/hooks/useSignalR';
import { useSelector } from 'react-redux';
import { RootState } from '../../lib/store';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const STATUS_STEPS = [
  { status: 'Pending', icon: Clock },
  { status: 'Confirmed', icon: CheckCircle },
  { status: 'Processing', icon: Package },
  { status: 'Shipped', icon: Truck },
  { status: 'Delivered', icon: CheckCircle },
];

export const TrackingInfo = ({ orderNumber }: { orderNumber: string }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Use polling if not authenticated, otherwise rely on SignalR invalidation
  const { data, isLoading } = useTrackOrderQuery(orderNumber, {
    pollingInterval: isAuthenticated ? 0 : 30000, 
  });
  
  useSignalR(); // Hook initializes SignalR connection if authenticated

  if (isLoading) return <div className="animate-pulse h-20 bg-gray-100 rounded-md"></div>;
  if (!data?.data) return <div>Order not found.</div>;

  const currentStatus = data.data.status;
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h3 className="font-semibold text-lg mb-6">Tracking Order #{orderNumber}</h3>
      
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded"></div>
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-black -translate-y-1/2 rounded"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 100)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 
                    ${isCompleted ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-gray-400'}
                    ${isCurrent ? 'ring-4 ring-gray-100' : ''}`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted ? '#000' : '#fff'
                  }}
                >
                  <Icon size={18} />
                </motion.div>
                <span className={`mt-2 text-xs font-medium ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                  {step.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {data.data.trackingInfo && (
        <div className="mt-8 p-4 bg-gray-50 rounded text-sm">
          <span className="font-semibold">Tracking Number:</span> {data.data.trackingInfo}
        </div>
      )}
    </div>
  );
};
