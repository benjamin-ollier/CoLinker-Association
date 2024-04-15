import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const membresDeLAssociation = [
  {
    key: '1',
    prenom: 'Jean',
    nom: 'Dupont',
    totalDons: 1200,
    role: 'Président',
  },
  {
    key: '2',
    prenom: 'Marie',
    nom: 'Durand',
    totalDons: 800,
    role: 'Trésorier',
  },
];

const columns = [
  {
    title: 'Prénom',
    dataIndex: 'prenom',
    key: 'prenom',
  },
  {
    title: 'Nom',
    dataIndex: 'nom',
    key: 'nom',
  },
  {
    title: 'Total des Dons',
    dataIndex: 'totalDons',
    key: 'totalDons',
  },
  {
    title: 'Rôle',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button icon={<EditOutlined />} onClick={() => console.log('Edit', record.key)}>Edit</Button>
        <Button icon={<DeleteOutlined />} onClick={() => console.log('Delete', record.key)}>Delete</Button>
      </Space>
    ),
  },
];

const UserManagement = () => (
  <div>
    <h1 className="text-3xl font-bold mb-5 ms-3 mt-2" >Gestion des utilisateurs</h1>
    <div className="container mx-auto px-4 mt-10">
      <Table dataSource={membresDeLAssociation} columns={columns} />
    </div>
  </div>
);

export default UserManagement;