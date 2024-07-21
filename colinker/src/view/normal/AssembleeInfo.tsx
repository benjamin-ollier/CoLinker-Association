import React, { useState, useEffect } from 'react';
import { Button, Divider, List, Card } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getAGById} from '../../service/agService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const AssembleeInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agDetails, setAgDetails] = useState<any>();

  useEffect(() => {
      fetchAgDetails();
  }, [id]);
    
  const fetchAgDetails = async () => {
    try {
      const data = await getAGById(`${id}`);
      setAgDetails({
        title: data.title,
        description: data.description,
        type: data.type,
        dateStart: moment(data.dateStart).format("YYYY-MM-DD HH:mm:ss"),
        dateEnd: moment(data.dateEnd).format("YYYY-MM-DD HH:mm:ss"),
        location: data.location,
        detailAgenda: data.detailAgenda.join('\n'),
        votes: data.votes ? data.votes.map(vote => ({
          title: vote.title,
          question: vote.question,
        })) : []
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'AG:", error);
    }
  };

  const back = () => {
    navigate(`/ag`);
  }

  if (agDetails) {
      return (
        <div className="p-4">
            <div className="flex justify-start mt-2 mb-4">
                <Button type="primary" ghost onClick={back} icon={<LeftOutlined />}>Retour</Button>
            </div>

            <Divider>Information de l'assemblée générale</Divider>

            <Card className="mb-4">
                <p><strong>title:</strong> {agDetails.title}</p>
                <p><strong>Descriptif:</strong> {agDetails.description}</p>
                <p><strong>Type:</strong> {agDetails.type}</p>
                <p><strong>Date et heure d'ouverture:</strong> {agDetails.dateStart}</p>
                <p><strong>Date et heure de fermeture:</strong> {agDetails.dateEnd}</p>
                <p><strong>Lieu:</strong> {agDetails.location}</p>
                <p><strong>Ordre du jour:</strong> <pre className="whitespace-pre-wrap">{agDetails.detailAgenda}</pre></p>
            </Card>

            {agDetails.votes && agDetails.votes.length > 0 && (
                <>
                    <Divider>Votes</Divider>
                    <List
                        itemLayout="vertical"
                        dataSource={agDetails.votes}
                        renderItem={(vote: any, index) => (
                            <List.Item key={index}>
                                <Card title={`Vote ${index + 1}`}>
                                    <p><strong>Titre du vote:</strong> {vote.title}</p>
                                    <p><strong>Question:</strong> {vote.question}</p>
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            )}
        </div>
      );
  } else {
    return (<></>)
  }
};

export default AssembleeInfo;
