import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import {getClientTransactions} from '../../service/paypalService';

const TransactionTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchTransactions = async () => {
          setLoading(true);
          try {
              const response = await getClientTransactions(); 
              setData(response.transaction_details);
          } catch (error) {
              console.error('Failed to fetch transactions', error);
          }
          setLoading(false);
      };

      fetchTransactions();
  }, []);

  const columns = [
    { title: 'Transaction ID', dataIndex: ['transaction_info', 'transaction_id'], key: 'transaction_id' },
    { title: 'Date', dataIndex: ['transaction_info', 'transaction_initiation_date'], key: 'transaction_initiation_date' },
    { title: 'Amount', dataIndex: ['transaction_info', 'transaction_amount', 'value'], key: 'transaction_amount' },
    { title: 'Status', dataIndex: ['transaction_info', 'transaction_status'], key: 'transaction_status' },
    { title: 'Ending Balance', dataIndex: ['transaction_info', 'ending_balance', 'value'], key: 'ending_balance' }
  ];

  return <Table dataSource={data} columns={columns} rowKey="transaction_id" />;
};

export default TransactionTable;
