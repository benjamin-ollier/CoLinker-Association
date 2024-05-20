import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch } from 'antd';
import { editUserInAssociation } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const EditUserModal = ({ visible, onClose, user, fetchData }) => {
  const roles = ['Président', 'Créateur', 'Vice-Président', 'Secrétaire', 'Trésorier', 
      'Membre du Conseil d\'Administration', 'Responsable des Communications', 
      'Bénévole', 'Membre Actif', 'Membre Bienfaiteur', 'Responsable des Événements', 
      'Coordinateur des Bénévoles', 'Responsable des Partenariats'];
  const { selectedAssociationId } = useAssociation();

  const handleEditUser = async (user) => {
    const response = await editUserInAssociation(selectedAssociationId,user._id,user);
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
          handleEditUser(user);
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
