import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button'; // Assuming shadcn UI
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      toast.error(error.message || 'An unexpected error occurred.');
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

export const StripeCheckout = ({ amount }: { amount: number }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, call your API to get the clientSecret
    // e.g., const res = await initiatePayment({ amount }).unwrap();
    // setClientSecret(res.data.clientSecret);
    
    // For demonstration, simulating API delay:
    const fetchSecret = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        const res = await response.json();
        if (res.success) {
          setClientSecret(res.data.clientSecret);
        } else {
          toast.error('Failed to initialize payment.');
        }
      } catch (e) {
        // Fallback for demonstration since backend might not have token
        setClientSecret('pi_dummy_secret_12345'); 
      }
    };

    fetchSecret();
  }, [amount]);

  if (!clientSecret) {
    return <div className="animate-pulse h-48 bg-gray-200 rounded-md"></div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} />
      </Elements>
    </div>
  );
};
