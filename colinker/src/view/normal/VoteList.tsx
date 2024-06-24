import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVote } from '../../service/voteService';
import { Button, Input, Table, Tag, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const VoteList = () => {
  const navigate = useNavigate();
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllVote();

        const votesData = response || [];
        const mappedVotes = votesData.map((vote) => ({
          key: vote._id,
          title: vote.title,
          description: vote.description,
          startDate: vote.startDate,
          endDate: vote.endDate,
          completed: vote.completed,
          type: vote.typeDestinataire,
        }));

        setVotes(mappedVotes); // Update the state with the mapped votes
      } catch (error) {
        console.error('Failed to fetch votes:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
  }, [votes]);

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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
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
    },
    {
      title: 'Date de fin',
      dataIndex: 'endDate',
      key: 'endDate',
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
