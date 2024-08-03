import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaymentCancel() {
  const navigate = useNavigate();

  useEffect(() => {
    // redirect back in history using navigate
    navigate(-3); //FIXME: Navigate back to the previous page, for some reason needs to go back 3 times not once or twice
  }, [navigate]);

  return (
    <div>
      <p>Processing your request to go back...</p>
    </div>
  );
}

export default PaymentCancel;
