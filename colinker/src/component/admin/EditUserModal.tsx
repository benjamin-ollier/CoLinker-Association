import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Switch } from 'antd';
import { editUserInAssociation } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const EditUserModal = ({ visible, onClose, user,role, fetchData }) => {
  const { selectedAssociationId } = useAssociation();
  const [formRole, setFormRole] = useState(role);

  const roles = ['Président', 'Créateur', 'Vice-Président', 'Secrétaire', 'Trésorier', 
      'Membre du Conseil d\'Administration', 'Responsable des Communications', 
      'Bénévole', 'Membre Actif', 'Membre Bienfaiteur', 'Responsable des Événements', 
      'Coordinateur des Bénévoles', 'Responsable des Partenariats'];

  useEffect(() => {
    setFormRole(role);
  }, [role]);

  const handleEditUser = async (values) => {
    const response = await editUserInAssociation(selectedAssociationId, user._id, values);
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
        key={user._id}
        initialValues={{ ...user }}
        onFinish={handleEditUser}
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
          <Select value={formRole} onChange={value => setFormRole(value)}>
          {roles.map((roleOption) => (
              <Option key={roleOption} value={roleOption}>
                {roleOption}
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
