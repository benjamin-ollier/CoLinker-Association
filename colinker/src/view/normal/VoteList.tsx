import React from 'react';
import { Table, Button, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const VoteList = () => {
  const navigate = useNavigate();

  const dataSource = [
    {
      key: '1',
      status: 'Actif',
      type: 'Publique',
      startDate: '2023-01-01',
      endDate: '2023-01-07',
      votes: 120,
    },
    {
      key: '2',
      status: 'Terminé',
      type: 'Privé',
      startDate: '2023-02-01',
      endDate: '2023-02-07',
      votes: 85,
    },
  ];

  const columns = [
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = status === 'Actif' ? 'green' : 'volcano';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date de début',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Votes',
      dataIndex: 'votes',
      key: 'votes',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_:any, record:any) => (
        <Button onClick={() => handleAction(record.key)}>voter</Button>
      ),
    },
  ];

  const handleAction = (key:any) => {
    navigate(`/vote/${key}`);
  };

  return <Table className='mx-14 mt-8' dataSource={dataSource} columns={columns} />;
};

export default VoteList;
