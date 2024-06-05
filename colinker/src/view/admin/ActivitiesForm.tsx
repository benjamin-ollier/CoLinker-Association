import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Divider } from 'antd';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getActivityById, createActivity, updateActivity } from '../../service/activitiesService';
import { useAssociation } from '../../context/AssociationContext';
import MapComponent from '../../component/admin/MapComponent';

const ActivitiesForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [form] = Form.useForm();
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
  const { selectedAssociationId } = useAssociation();

  useEffect(() => {
    if (!isNew && id) {
      fetchActivityDetails(id);
    }
  }, [id]);

  const fetchActivityDetails = async (activityId) => {
    try {
      const data = await getActivityById(activityId);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        dateStart: moment(data.dateStart),
        dateEnd: moment(data.dateEnd),
      });
      if (data.location) {
        setPosition({ lat: data.location.lat, lng: data.location.lng });
      }
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };

  const handleLocationSelect = (location) => {
    setPosition(location);
  };

  const handleSaveData = async (values) => {
    if (position) {
      const formattedValues = {
        ...values,
        dateStart: values.dateStart.toISOString(),
        dateEnd: values.dateEnd.toISOString(),
        location: {
          lat: position.lat,
          lng: position.lng
        }
      };
      try {
        if (isNew) {
          await createActivity(selectedAssociationId, formattedValues);
        } else {
          await updateActivity(id, formattedValues);
        }
        navigate('/admin/activities');
      } catch (error) {
        console.error("Error saving activity:", error);
      }
    } else {
      console.error("Position is null, cannot save activity without a location.");
    }
  };

  return (
    <div>
      <Button type="primary" ghost onClick={() => navigate('/admin/activities')} icon={<LeftOutlined />}>
        Back
      </Button>
      <Divider>Information des activités</Divider>
      <Form form={form} layout="vertical" onFinish={handleSaveData}>
        <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>
        <Form.Item name="dateStart" label="Date de début" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="dateEnd" label="Date de fin" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Selectionner le lieu">
          <MapComponent onLocationSelect={handleLocationSelect} position={position} />
        </Form.Item>
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
          {isNew ? 'Create Activity' : 'Update Activity'}
        </Button>
      </Form>
    </div>
  );
};

export default ActivitiesForm;
