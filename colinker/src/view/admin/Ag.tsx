import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getByAssociationID } from '../../service/agService';
import { format, parseISO } from 'date-fns';
import { formatISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAssociation } from '../../context/AssociationContext';

interface AssembleeGeneraleData {
  key: React.Key;
  _id: string;
  title: string;
  location: string;
  status: 'approuvé' | 'en cours' | 'annoncé';
  dateStart: string;
  dateEnd: string;
}

const Ag: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAssociationId } = useAssociation();
  const [data, setData] = useState<AssembleeGeneraleData[]>([]);

  useEffect(() => {
    if (selectedAssociationId) {
      fetchData();
    }
  }, [selectedAssociationId]);


  const fetchData = async () => {
    if(selectedAssociationId){
        try {
          const response = await getByAssociationID(selectedAssociationId as string);
          setData(response.map((ag: any) => ({ ...ag, key: ag._id })));
        } catch (error) {
          console.error('Erreur lors du chargement des AGs:', error);
        }
    }
  };
  const columns = [
    {
      title: 'title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Date d’ouverture',
      dataIndex: 'dateStart',
      key: 'dateStart',
      render: (dateStart: string) => {
        return dateStart ? format(parseISO(dateStart), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      }
    },
    {
      title: 'Date de fermeture',
      dataIndex: 'dateEnd',
      key: 'dateEnd',
      render: (dateEnd: string) => {
        return dateEnd ? format(parseISO(dateEnd), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: 'approuvé' | 'en cours' | 'annoncé') => {
        let color = 'green';
        if (status === 'en cours') {
          color = 'yellow';
        } else if (status === 'annoncé') {
          color = 'blue';
        }
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
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    }
  ];

  const onRow = (record: AssembleeGeneraleData) => {
    return {
      onClick: () => {
        navigate(`/admin/ag/${record._id}`);
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
    navigate('/admin/ag/new');
  };

  return (
    <div>
      <div className='m-10'>
        <h2>Assemblée Générale</h2>
      </div>
      <div className='grid place-content-end m-10'>
        <Space>
          <Input placeholder="Recherche..." prefix={<SearchOutlined />} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
            Créer
          </Button>
        </Space>
      </div>
      <Table className='mx-8' columns={columns} dataSource={data} onRow={onRow}/>
    </div>
  );
};

export default Ag;
