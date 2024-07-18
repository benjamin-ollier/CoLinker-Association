import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import EditUserModal from '../../component/admin/EditUserModal';
import DeleteUserModal from '../../component/admin/DeleteUserModal';
import {getMembersNotInAssociation, getAssociationMembers, addUserToAssociation} from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';
import { getUserRole } from '../../service/associationService';

const { Option } = Select;

const columns = (handleEdit,handleDelete) => [
  {
    title: 'Pseudo',
    dataIndex: 'username',
    key: 'username',
  },
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
  const [currentUserRole, setCurrentUserRole] = useState('');

  const fetchData = async () => {
    try {
      const data = await getAssociationMembers(selectedAssociationId);
      setMembers(data);
    } catch (error) {
      console.error('Failed to fetch association members', error);
    }

    try {
      const users = await getMembersNotInAssociation(selectedAssociationId);
      const options = users.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        value: user._id,
      }));
      setUserOptions(options);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  useEffect(() => {
    if (selectedAssociationId) {
      fetchData();
    }
  }, [selectedAssociationId]);

  const handleEdit = async (user) => {
    try {
      const resp = await getUserRole(selectedAssociationId, user._id);
      setCurrentUser(user);
      setIsModalVisible(true);
      openEditModal(user, resp.role);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  const openEditModal = (user, role) => {
    setCurrentUser(user);
    setCurrentUserRole(role);
    setIsModalVisible(true);
  };

  const handleDelete = (user) => {
    setCurrentUser(user);
    setIsDeleteModalVisible(true);
  }

  const handleAddUser = async () => {
    const requestBody = {
      associationId: selectedAssociationId,
      userId: selectedUser,
    };

    const response = await addUserToAssociation(requestBody);
    if (response?.status === 200 || response?.status === 201) {
      fetchData();
    }
  };

  return (
    <div>
      <EditUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        user={currentUser}
        role={currentUserRole}
        fetchData={fetchData}
      />
      <DeleteUserModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        user={currentUser}
        fetchData={fetchData}
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
            handleAddUser()
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
