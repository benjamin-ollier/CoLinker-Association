import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getAGById, createAG, updateAG } from '../../service/agService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AgForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isNew) {
      fetchAgDetails();
    }
  }, [id]);
    
  const fetchAgDetails = async () => {
    try {
      const data = await getAGById(`${id}`);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        type: data.type,
        dateStart: moment(data.dateStart),
        dateEnd: moment(data.dateEnd),
        location: data.location,
        detailAgenda: data.detailAgenda.join('\n'),      
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'AG:", error);
    }
  };

  const handleSaveData = async (values) => {
    const dataToSubmit = {
      ...values,
      dateStart: values.dateStart ? values.dateStart.toISOString() : null,
      dateEnd: values.dateEnd ? values.dateEnd.toISOString() : null,
    };
    
    if (isNew) {
      const res=await createAG(dataToSubmit);
      if(res.status == '200' || res.status == '201') {
        navigate(`/admin/ag`);
      }
    } else {
      await updateAG(dataToSubmit, id || '');
      const res=await createAG(dataToSubmit);
      if(res.status == '200' || res.status == '201') {
        navigate(`/admin/ag`);
      }
    }
  };

  return (

    <Form form={form} layout="vertical" onFinish={handleSaveData} className="p-10">
      <h1 className="mb-6">Assemblée Générale</h1>
      
      <Form.Item name="title" label="Titre" className="mb-4">
        <Input placeholder="Titre" />
      </Form.Item>

      <Form.Item name="description" label="Descriptif" className="mb-4">
        <Input.TextArea rows={4} placeholder="Descriptif" />
      </Form.Item>

      <Form.Item name="type" label="Type" className="mb-4">
        <Select placeholder="Sélectionnez un type">
          <Option value="Ordinaire">Ordinaire</Option>
          <Option value="Extraordinaire">Extraordinaire</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dateStart" label="Date et heure d'ouverture" className="mb-4">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="dateEnd" label="Date et heure de fermeture" className="mb-4">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="location" label="Lieu" className="mb-4">
        <Input placeholder="Lieu" />
      </Form.Item>

      <Form.Item name="detailAgenda" label="Ordre du jour" className="mb-4">
        <Input.TextArea rows={4} placeholder="Ordre du jour" />
      </Form.Item>

      {/* Ajoutez les autres champs comme nécessaire */}

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>{isNew ? 'Créer' : 'Mettre à jour'}</Button>
      </div>
    </Form>
  );
};

export default AgForm;
