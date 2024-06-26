import React, { useEffect, useState } from 'react';
import { Button, Divider, Typography, DatePicker } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { getActivityById } from '../../service/activitiesService';
import Map from '../../component/normal/Map';

const { Title, Text } = Typography;

interface ActivityData {
  key: React.Key;
  _id: string;
  title: string;
  description: string;
  location: { lat: number, lng: number };
  status: 'approuvé' | 'en cours' | 'annoncé' | 'terminé';
  dateStart: string;
  dateEnd: string;
}

const ActivityDetails = () => {
  const navigate = useNavigate();
  const { id, name } = useParams();
  const [activity, setActivity] = useState<ActivityData>();
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);

  useEffect(() => {
      fetchActivityDetails(id);
  }, [id]);

  const fetchActivityDetails = async (activityId) => {
    try {
      const data = await getActivityById(activityId);
      setActivity(data);
      if (data.location) {
        setPosition({ lat: data.location.lat, lng: data.location.lng });
      }
    } catch (error) {
      console.error("Failed to fetch activity details:", error);
    }
  };

  if (!activity) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title level={2}>Chargement...</Title>
    </div>;
  }

  return (
    <div>
      <Button type="primary" ghost onClick={() => navigate(`/association/${name}`)} icon={<LeftOutlined />}>
        Retour
      </Button>
      <Divider>Information des activités</Divider>
      <div style={{ width: '100%' }}>
          <Title level={4}>Titre:</Title>
          <Text>{activity.title}</Text>
        </div>
        <div style={{ width: '100%' }}>
          <Title level={4}>Description:</Title>
          <Text>{activity.description}</Text>
        </div>
        <div style={{ width: '100%' }}>
          <Title level={4}>Date de début:</Title>
          <Text>{moment(activity.dateStart).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>
        <div style={{ width: '100%' }}>
          <Title level={4}>Date de fin:</Title>
          <Text>{moment(activity.dateEnd).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </div>
        <div style={{ width: '100%' }}>
          <Title level={4}>Lieu:</Title>
          <Map position={position} />
        </div>
    </div>
  );  
};

export default ActivityDetails;
