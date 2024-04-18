import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import EditUserModal from '../../component/admin/EditUserModal';
import DeleteUserModal from '../../component/admin/DeleteUserModal';
import {getMembersNotInAssociation, getAssociationMembers} from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const columns = (handleEdit,handleDelete) => [
  {
    title: 'Prénom',
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: 'Nom',
    dataIndex: 'lastName',
    key: 'lastName',
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
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>Delete</Button>
      </Space>
    ),
  },
];

interface UserOption {
  label: string;
  value: string;
}

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const { selectedAssociationId } = useAssociation();

  useEffect(() => {
    if (selectedAssociationId) {
      getAssociationMembers(selectedAssociationId).then(data => {
        setMembers(data);
      }).catch(error => {
        console.error('Failed to fetch association members', error);
      });

      getMembersNotInAssociation(selectedAssociationId).then(users => {
        const options = users.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user._id,
        }));
        setUserOptions(options);
      }).catch(error => {
        console.error('Failed to fetch users', error);
      });
    }
  }, [selectedAssociationId]);

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setIsDeleteModalVisible(true);
  }

  return (
    <div>
      <EditUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={currentUser}
      />
      <DeleteUserModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        user={currentUser}
      />
      <h1 className="text-3xl font-bold mb-5 ms-3 mt-2">Gestion des utilisateurs</h1>

      <h1 className="text-xl ms-3 mt-4">Ajouter un utilisateur</h1>
      <div className="flex items-center mb-5 mt-2">
        <Select
          showSearch
          placeholder="Rechercher un utilisateur à ajouter"
          onChange={setSelectedUser}
          className='w-full ms-3 mr-3'
        >
          {userOptions.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))}
        </Select>
        <Button
          className='mr-5'
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => {
            console.log("Ajout de l'utilisateur:", selectedUser);
          }}
          disabled={!selectedUser}
          style={{ marginLeft: 8 }}
        >
          Ajouter
        </Button>
      </div>
      <div className="container mx-auto px-4 mt-10">
        <Table dataSource={members} columns={columns(handleEdit, handleDelete)} />
      </div>
    </div>
  );
};

export default UserManagement;
