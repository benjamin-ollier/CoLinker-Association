import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVote } from '../../service/voteService';
import { Button, Input, Table, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { format, parseISO } from 'date-fns';
import { useParams } from 'react-router-dom';

const VoteList = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState([]);
  const { associationName } = useParams<{ associationName?: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        console.log(associationName)
        if (associationName) {
          response = await getAllVote(associationName);
        }else{
          response = await getAllVote();
        }
        const votesData = response || [];
        const mappedVotes = votesData.map((vote) => ({
          key: vote._id,
          title: vote.title,
          description: vote.description,
          startDate: vote.startDate,
          endDate: vote.endDate,
          completed: vote.completed,
          associationName: vote.associationName,
        }));
        

        setVotes(mappedVotes);
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      }
    };
    fetchData();
  }, [associationName]);

  const columns = [
    {
      title: 'Statut',
      dataIndex: 'completed',
      key: 'completed',
      render: completed => {
        let color = completed ? 'green' : 'volcano';
        return <Tag color={color}>{completed ? 'Completed' : 'Incomplete'}</Tag>;
      },
    },
    {
      title: 'Association',
      dataIndex: 'associationName',
      key: 'associationName',
    },
    {
      title: 'Titre',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date de début',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (dateStart: string) => {
        return dateStart ? format(parseISO(dateStart), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      }
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate: string) => {
        return endDate ? format(parseISO(endDate), 'dd/MM/yyyy HH:mm') : 'Date invalide';
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => navigate(`/vote/${record.key}`)}>Voter</Button>
      ),
    },
  ];

  return (
    <div>
    <Table className='mx-14 mt-8' dataSource={votes} columns={columns} />
  </div>
  );
};

export default VoteList;
