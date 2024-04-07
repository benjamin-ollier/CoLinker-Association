import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllAG } from '../../service/agService';
import { format, parseISO } from 'date-fns';
import { formatISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface AssembleeGeneraleData {
  key: React.Key;
  _id: string;
  titre: string;
  lieu: string;
  status: 'approuvé' | 'en cours' | 'annoncé';
  dateDebut: string;
  dateFin: string;
}

const Ag: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<AssembleeGeneraleData[]>([]);
  useEffect(() => {
    const fetchAGs = async () => {
      try {
        const response = await getAllAG();
        setData(response.map((ag: any) => ({ ...ag, key: ag._id })));
      } catch (error) {
        console.error('Erreur lors du chargement des AGs:', error);
      }
    };

    fetchAGs();
  }, []);
  const columns = [
    {
      title: 'Titre',
      dataIndex: 'titre',
      key: 'titre',
    },
    {
      title: 'Lieu',
      dataIndex: 'lieu',
      key: 'lieu',
    },
    {
      title: 'Date d’ouverture',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      render: (dateDebut: string) => {
        return dateDebut ? format(parseISO(dateDebut), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      }
    },
    {
      title: 'Date de fermeture',
      dataIndex: 'dateFin',
      key: 'dateFin',
      render: (dateFin: string) => {
        return dateFin ? formatISO(parseISO(dateFin), { representation: 'date' }) : 'Date invalide';
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
            {status.toUpperCase()}
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
        navigate(`/ag/${record._id}`);
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

  return (
    <div>
      <div className='m-10'>
        <h2>Assemblée Générale</h2>
      </div>
      <div className='grid place-content-end m-10'>
        <Space>
          <Input placeholder="Recherche..." prefix={<SearchOutlined />} />
          <Button type="primary" icon={<PlusOutlined />}>
            Créer
          </Button>
        </Space>
      </div>
      <Table className='mx-8' columns={columns} dataSource={data} onRow={onRow}/>
    </div>
  );
};

export default Ag;
