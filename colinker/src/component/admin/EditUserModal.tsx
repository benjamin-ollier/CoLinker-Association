import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch } from 'antd';

const { Option } = Select;

const EditUserModal = ({ visible, onClose, user }) => {
  const roles = ['Président', 'Trésorier', 'Secrétaire', 'Membre'];

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
        <Form.Item
          name="role"
          label="Rôle"
          rules={[{ required: true, message: 'Please select the role!' }]}
        >
          <Select defaultValue={user.role}>
            {roles.map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="isBlocked"
          label="Est bloqué"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
