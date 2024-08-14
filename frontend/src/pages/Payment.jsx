import React, { useState } from 'react';
import axios from 'axios';

/**
 * PaymentComponent is a React component for handling M-Pesa STK Push payments.
 * It allows users to enter payment details and submit the form to initiate a payment.
 */
const PaymentComponent = () => {
  // State hooks for managing form input values and response messages
  const [amount, setAmount] = useState(''); // Stores the payment amount
  const [phoneNumber, setPhoneNumber] = useState(''); // Stores the user's phone number
  const [mpesaPin, setMpesaPin] = useState(''); // Stores the user's M-Pesa PIN (for demonstration purposes)
  const [paymentStatus, setPaymentStatus] = useState(null); // Stores the status of the payment initiation
  const [error, setError] = useState(null); // Stores error messages if the payment initiation fails

  /**
   * handlePayment is triggered when the form is submitted.
   * It validates the input fields, sends a POST request to the backend to initiate the payment,
   * and updates the payment status or error message based on the server's response.
   * 
   * @param {Event} e - The form submission event
   */
  const handlePayment = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Input validation
    if (!amount || !phoneNumber || !mpesaPin) {
      setError('All fields are required');
      return;
    }

    try {
      // Sends a POST request to the Flask backend to initiate the payment
      const response = await axios.post('http://127.0.0.1:5000/payments', {
        amount: parseFloat(amount), // Convert amount to a number
        phone_number: phoneNumber // User's phone number
      });

      // Update payment status based on the response from the backend
      setPaymentStatus('Payment initiated. Please authorize the payment on your MPesa app.');
    } catch (err) {
      // Set error message if the request fails
      setError('Payment initiation failed. Please try again.');
    }
  };

  return (
    <div>
      <h1>MPesa Payment</h1>
      <form onSubmit={handlePayment}>
        {/* Input field for payment amount */}
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)} // Update amount state on change
              required
            />
          </label>
        </div>
        {/* Input field for phone number */}
        <div>
          <label>
            Phone Number:
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)} // Update phone number state on change
              required
            />
          </label>
        </div>
        {/* Input field for M-Pesa PIN (for demonstration purposes) */}
        <div>
          <label>
            MPesa PIN:
            <input
              type="password"
              value={mpesaPin}
              onChange={(e) => setMpesaPin(e.target.value)} // Update MPesa PIN state on change
              required
            />
          </label>
        </div>
        {/* Submit button to initiate the payment */}
        <button type="submit">Pay</button>
      </form>
      {/* Display payment status if available */}
      {paymentStatus && <p>{paymentStatus}</p>}
      {/* Display error message if an error occurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PaymentComponent;