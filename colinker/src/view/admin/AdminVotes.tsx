import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getVotesByAssociationId } from '../../service/voteService';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAssociation } from '../../context/AssociationContext';

const Votes = () => {
  const navigate = useNavigate();
  const { selectedAssociationId } = useAssociation();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedAssociationId) {
      fetchData();
    }
  }, [selectedAssociationId]);

  const fetchData = async () => {
    if (selectedAssociationId) {
      try {
        const response = await getVotesByAssociationId(selectedAssociationId);
        setData(response.map((vote) => ({ ...vote, key: vote._id })));
      } catch (error) {
        console.error('Erreur lors du chargement des votes:', error);
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
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Date de début',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (dateDebut: string) => {
        return dateDebut ? format(parseISO(dateDebut), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      }
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate: string) => {
        return endDate ? format(parseISO(endDate), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      },
    },
    {
      title: 'Quorum',
      dataIndex: 'quorum',
      key: 'quorum',
    }
  ];

  const onRow = (record) => ({
    onClick: () => {
      navigate(`/admin/vote/${record._id}`);
    },
    onMouseEnter: (event) => {
      event.currentTarget.style.cursor = 'pointer';
      event.currentTarget.style.backgroundColor = '#f5f5f5';
    },
    onMouseLeave: (event) => {
      event.currentTarget.style.backgroundColor = '';
    },
  });

  const handleCreateClick = () => {
    navigate('/admin/vote/new');
  };

  return (
    <div>
      <div className='m-10'>
        <h2>Votes</h2>
      </div>
      <div className='grid place-content-end m-10'>
        <Space>
          <Input placeholder="Recherche..." prefix={<SearchOutlined />} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateClick}>
            Créer un nouveau vote
          </Button>
        </Space>
      </div>
      <Table className='mx-8' columns={columns} dataSource={data} onRow={onRow} />
    </div>
  );
};

export default Votes;
