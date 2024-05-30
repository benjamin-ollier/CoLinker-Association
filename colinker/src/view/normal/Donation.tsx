import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Typography, Spin, Alert, Table } from 'antd';
import Paypal from '../../component/normal/Paypal';
import TransactionTable from '../../component/normal/TransactionTable';

import axios from 'axios';

const { Title } = Typography;


const Donation: React.FC = () => {
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);


  return (
    <div style={{ maxWidth: 600, margin: '20px auto', textAlign: 'center' }}>
      <Title level={2}>Make a Donation</Title>
      <Paypal/>
      <TransactionTable />
    </div>
  );
};

export default Donation;
