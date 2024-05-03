import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';
import { removeUser } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const DeleteUserModal = ({ visible, onClose, user, fetchData }) => {
  const { selectedAssociationId } = useAssociation();

  const handleDeleteUser = async (user) => {
    const response = await removeUser(selectedAssociationId,user.username);
    if (response?.status === 200) {
      fetchData();
      onClose();
    }
  }

  return (
    <Modal
      title="Edit User"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      footer={null}
    >
      <Form
        initialValues={{ ...user }}
        onFinish={(values) => {
          handleDeleteUser(user);
          onClose();
        }}
      >
        <Form.Item
          name="firstName"
          label="Prénom"
          rules={[{ required: true, message: 'Please input the first name!' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Nom"
          rules={[{ required: true, message: 'Please input the last name!' }]}
        >
          <Input disabled/>
        </Form.Item>
        <Button type="primary" danger htmlType="submit">
          Supprimer
        </Button>
      </Form>
    </Modal>
  );
};

export default DeleteUserModal;
