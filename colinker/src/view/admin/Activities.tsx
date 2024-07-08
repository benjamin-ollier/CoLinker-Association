import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, Space, Input } from 'antd';
import { PlusOutlined, SearchOutlined ,AudioOutlined} from '@ant-design/icons';
import { getActivitiesByAssociationId } from '../../service/activitiesService';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAssociation } from '../../context/AssociationContext';
import LocationMap from '../../component/admin/LocationMap';
import type { SearchProps } from 'antd/es/input/Search';

interface ActivityData {
  key: React.Key;
  _id: string;
  title: string;
  location: { lat: number, lng: number };
  status: 'approuvé' | 'en cours' | 'annoncé' | 'terminé';
  dateStart: string;
  dateEnd: string;
}

const Activities: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAssociationId } = useAssociation();
  const [data, setData] = useState<ActivityData[]>([]);


  useEffect(() => {
    fetchData();
  }, [selectedAssociationId]); 


  const fetchData = async () => {
    if (selectedAssociationId) {
      try {
        const response = await getActivitiesByAssociationId(selectedAssociationId);
        setData(response.map((activity: any) => ({
          ...activity,
          key: activity._id,
          location: { lat: activity.location.lat, lng: activity.location.lng },
          dateStart: activity.dateStart ? format(parseISO(activity.dateStart), 'dd/MM/yyyy HH:mm') : 'Date invalide',
          dateEnd: activity.dateEnd ? format(parseISO(activity.dateEnd), 'dd/MM/yyyy HH:mm') : 'Date invalide',
        })));
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
      }
    }
  };
  

  const columns = [
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Lieu',
      dataIndex: 'location',
      key: 'location',
      render: (location) => <LocationMap location={location} />,
    },
    {
      title: 'Date d’ouverture',
      dataIndex: 'dateStart',
      key: 'dateStart',
    },
    {
      title: 'Date de fermeture',
      dataIndex: 'dateEnd',
      key: 'dateEnd',
    },
    {
      title: 'Statut',
      key: 'status',
      dataIndex: 'status',
      render: (status: 'approuvé' | 'en cours' | 'annoncé' | 'terminé') => {
        let color = {
          'approuvé': 'green',
          'en cours': 'yellow',
          'annoncé': 'blue',
          'terminé': 'red'
        }[status];
        return (
          <Tag color={color} key={status}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: 'Approuvé', value: 'approuvé' },
        { text: 'En cours', value: 'en cours' },
        { text: 'Annoncé', value: 'annoncé' },
        { text: 'Terminé', value: 'terminé' }
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    }
  ];

  const onRow = (record: ActivityData) => {
    return {
      onClick: () => {
        navigate(`/admin/activity/${record._id}`);
      },
      onMouseEnter: (event: React.MouseEvent<HTMLTableRowElement>) => {
        const target = event.currentTarget;
        target.style.cursor = 'pointer';
        target.style.backgroundColor = '#f5f5f5';
      },
      onMouseLeave: (event: React.MouseEvent<HTMLTableRowElement>) => {
        const target = event.currentTarget;
        target.style.backgroundColor = '';
      },
    };
  };

  const handleCreateClick = () => {
    navigate('/admin/activity/new');
  };

  const handleSearch = async (value: string) => {
    if (selectedAssociationId && value.trim() !== '') {
      try {
        const response = await getActivitiesByAssociationId(selectedAssociationId);
        const filteredData = response.filter((activity: ActivityData) =>
          activity.title.toLowerCase().includes(value.toLowerCase())
        );
        setData(filteredData);
      } catch (error) {
        console.error('Erreur lors du filtrage des activités:', error);
      }
    } else {
      fetchData();
    }
  };

  return (
    <div>
      <div className='m-10'>
        <h2>Activités de l'Association</h2>
      </div>
      <div className='grid place-content-end m-10'>
        <Space>
        <Input.Search
            placeholder="Recherche..."
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
            Créer une nouvelle activité
          </Button>
        </Space>
      </div>
      <Table className='mx-8' columns={columns} dataSource={data} onRow={onRow} />
    </div>
  );
};

export default Activities;
