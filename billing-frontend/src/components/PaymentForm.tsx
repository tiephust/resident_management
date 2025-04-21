import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Typography, Box } from '@mui/material';
import axios from 'axios';

interface PaymentFormProps {
  paymentIntent: {
    client_secret: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentIntent, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent: result } = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message || 'An error occurred');
      setProcessing(false);
    } else if (result?.status === 'succeeded') {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/confirm`, {
          paymentIntentId: result.id,
        });
        onSuccess();
      } catch (error) {
        setError('Failed to confirm payment on server');
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          type="submit"
          disabled={!stripe || processing}
        >
          {processing ? 'Processing...' : 'Pay'}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={processing}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default PaymentForm; 