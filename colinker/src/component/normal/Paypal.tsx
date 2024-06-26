import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createDonation } from "../../service/donationService";

const Paypal = ({ donationType, onPaymentSuccess }) => {
  const [amount, setAmount] = useState(10);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: Number(amount)
        }
      }]
    });
  };

  const onApprove = async(data, actions) => {
    return actions.order.capture().then(async (details) => {
      const resp= await createDonation(details.purchase_units[0].amount.value,donationType)
      onPaymentSuccess();
    });
  };

  return (
    <div className="min-h-[300px] max-w-[400px] mx-auto mt-5">
      <h1>Faire une donation</h1>
      <label htmlFor="amount">Montant: </label>
      <input
        type="number"
        name="amount"
        id="amount"
        value={amount}
        onChange={handleAmountChange}
        min="1"
        step="1"
      />
      <PayPalScriptProvider options={{ clientId: "ARPqW928ZAbruMwiI7UTy9granfNLRbao8Hdsmg2ZIDtn0W2VZHEO8tcrQQRhCwqRbOPIAuHImpp8lGw" }}>
        <PayPalButtons
          key={amount}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
