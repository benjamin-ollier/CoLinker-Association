// components/TransactionTable.js
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { getDonations } from '../../service/donationService';

const DonationTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            setLoading(true);
            try {
                const donations = await getDonations("donation"); 
                setData(donations);
            } catch (error) {
                console.error('Failed to fetch donations', error);
            }
            setLoading(false);
        };

        fetchDonations();
    }, []);

    const columns = [
      { 
          title: 'Donneur', 
          dataIndex: ['donor', 'email'],
          key: 'donor.email'
      },
      { 
          title: 'Amount', 
          dataIndex: 'amount', 
          key: 'amount' 
      },
      { 
          title: 'Date', 
          dataIndex: 'date', 
          key: 'date', 
          render: text => new Date(text).toLocaleDateString() 
      },
      { 
          title: 'Type', 
          dataIndex: 'type', 
          key: 'type' 
      }
  ];
  

    return <Table dataSource={data} columns={columns} rowKey="_id" loading={loading} />;
};

export default DonationTable;
