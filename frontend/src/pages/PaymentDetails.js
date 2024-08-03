import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentDetails() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get("session_id");

    if (sessionId) {
      axios
        .get(`${API_BASE_URL}/booking/payment-details?session_id=${sessionId}`)
        .then((response) => {
          setPaymentDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error);
          setError("Failed to retrieve payment details.");
        });
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!paymentDetails) {
    return <div>Loading payment details...</div>;
  }

  return (
    <div>
      <h1>Payment Details</h1>
      <p>Status: {paymentDetails.paymentStatus}</p>
      <p>
        Amount Paid: {paymentDetails.amountPaid} {paymentDetails.currency}
      </p>
      <p>Payment ID: {paymentDetails.paymentId}</p>
      <p>Booking Created! </p>
    </div>
  );
}

export default PaymentDetails;
