import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getDonations } from '../../service/donationService';
import Paypal from '../../component/normal/Paypal';

interface Contribution {
  amount: number;
  date: string;
  type: string;
}

interface DonorContribution {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  donations: Contribution[];
}


const Cotisation = () => {
  const [data, setData] = useState<DonorContribution[]>([]);

  const fetchData = async () => {
    const contributions = await getDonations("cotisation");
    setData(contributions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' }
  ];

  const expandedRowRender = (record: DonorContribution) => {
    const subColumns = [
      { title: 'Amount', dataIndex: 'amount', key: 'amount' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
      { title: 'Date', dataIndex: 'date', key: 'date', render: (date: string) => new Date(date).toLocaleDateString() }
    ];

    return <Table columns={subColumns} dataSource={record.donations} pagination={false} />;
  };

  const handlePaymentSuccess = (details) => {
    fetchData()
  };

  return (
    <div>
      <h1 className="font-bold text-center m-auto">Cotisations</h1>
      <Paypal donationType="cotisation" onPaymentSuccess={handlePaymentSuccess} />
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
        rowKey="_id"
      />
    </div>
  );
};

export default Cotisation;
