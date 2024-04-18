import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const DeleteUserModal = ({ visible, onClose, user }) => {
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
          console.log('Updated User:', values);
          onClose();
        }}
      >
        <Form.Item
          name="prenom"
          label="Prénom"
          rules={[{ required: true, message: 'Please input the first name!' }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="nom"
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
