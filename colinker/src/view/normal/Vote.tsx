import React, { useState, useEffect } from 'react';
import { Radio, Button, Spin, Progress, Menu, message, Typography, Card } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { getVote, submitVote } from '../../service/voteService';

const { Title, Paragraph, Text } = Typography;

interface IVote {
  _id: string;
  associationId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  question: string;
  optionStepOne: IOption[];
  optionStepTwo: IOption[];
  doubleStep: boolean;
  currentStep: number;
  quorum: number;
  completed: boolean;
}

interface IOption {
  _id: string;
  texte: string;
  votants: string[];
  checked: boolean;
  winningOptionStepOne:boolean;
  winningOptionStepTwo:boolean;
}

const Vote = () => {
  const [vote, setVote] = useState<IVote | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchVoteData = async () => {
      setLoading(true);
      try {
        if (id) {
          const response = await getVote(id);
          const checkedOption = (response.currentStep === 1 ? response.optionStepOne : response.optionStepTwo)
                                 .find(option => option.checked);
          setSelectedOption(checkedOption ? checkedOption._id : null);
          setVote(response);
        }
      } catch (error) {
        message.error('Error fetching vote data');
      } finally {
        setLoading(false);
      }
    };

    fetchVoteData();
  }, [id]);

  const onChange = (e: RadioChangeEvent) => {
    setSelectedOption(e.target.value);
  };

  const onSubmitVote = async () => {
    if (!selectedOption) {
      message.warning('Please select an option before voting.');
      return;
    }

    setLoading(true);
    try {
      if(id){
        const response = await submitVote(id, selectedOption);
        if (response.status >= 200 && response.status < 300){
          message.success('Vote enregistré avec succès');
          const updatedVote = await getVote(id);
          const checkedOption = (updatedVote.currentStep === 1 ? updatedVote.optionStepOne : updatedVote.optionStepTwo)
                                 .find(option => option.checked);
          setSelectedOption(checkedOption ? checkedOption._id : null);
          setVote(updatedVote);
        } else if (response.status === 409) {
          message.error('Vous avez déjà voté pour cette option');
        } else {
          message.error('Error');
        }
      }
    } catch (error) {
      message.error('Error d\'enregistrement du vote. Vous avez déjà peut etre voté');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (e: any) => {
    if (vote && id) {
      const newStep = parseInt(e.key);
      setVote({
        ...vote,
        currentStep: newStep,
      });
      const checkedOption = (newStep === 1 ? vote.optionStepOne : vote.optionStepTwo)
                             .find(option => option.checked);
      setSelectedOption(checkedOption ? checkedOption._id : null);
    }
  };

  return (
    <div className="flex items-center justify-center my-4 mb-4">
      <Spin spinning={loading}>
        {vote && (
          <>
            <Title level={2}>Vote : {vote.title}</Title>
          
            {vote.doubleStep && (
              <Menu onClick={handleMenuClick} selectedKeys={[`${vote.currentStep}`]} mode="horizontal">
                <Menu.Item key="1">Tour 1</Menu.Item>
                <Menu.Item key="2">Tour 2</Menu.Item>
              </Menu>
            )}
            <Card style={{ width: 550 }}>
              <div>
                <Paragraph>{vote.description}</Paragraph>
                <Text strong>Date de début: {moment(vote.startDate).format('DD/MM/YYYY HH:mm')}</Text><br />
                <Text strong>Date de fin: {moment(vote.endDate).format('DD/MM/YYYY HH:mm')}</Text>
                  <Title level={4}>Question: {vote.question}</Title>
                  <div className="flex items-center justify-center">
                  <Radio.Group onChange={onChange} value={selectedOption}>
                    {(vote.currentStep === 1 ? vote.optionStepOne : vote.optionStepTwo).map(option => (
                      <div key={option._id}>
                        <Radio key={option._id} value={option._id}>{option.texte}</Radio>
                        <Progress percent={((option.votants.length / vote.quorum) * 100)} />
                      </div>
                    ))}
                  </Radio.Group>
                  </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button type="primary" onClick={onSubmitVote} disabled={loading}>Submit Vote</Button>
              </div>
            </Card>
          </>
        )}
      </Spin>
    </div>
  );
};

export default Vote;
