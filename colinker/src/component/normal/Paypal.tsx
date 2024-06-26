import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Paypal = () => {
  const [amount, setAmount] = useState("10");

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: amount
        }
      }]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert(`Transaction completed by ${details.payer.name.given_name}!`);
    });
  };

  return (
    <div style={{ minHeight: "300px", maxWidth: "400px", margin: "auto" }}>
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
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
