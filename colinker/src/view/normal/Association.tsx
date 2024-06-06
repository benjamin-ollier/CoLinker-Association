import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Typography, Image, message } from 'antd';
import { HeartOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { getAssociationWithName } from '../../service/associationService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface Association {
  name: string;
  description: string;
  siret?: string;
  imageURL: string;
}

const AssociationPage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [association, setAssociation] = useState<Association | null>(null);

  useEffect(() => {
    fetchAssociation();
  }, [name]);

  const handleDonationNavigation = () => {
    if (association) {
      navigate(`/donation/${association.name}`);
    }
  };

  const fetchAssociation = async () => {
    if (name) {
      try {
        const data = await getAssociationWithName(name);
        setAssociation(data[0]);
      } catch (error) {
        message.error('Failed to fetch associations: ');
      }
    }
  };

  if (!association) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title level={2}>Chargement...</Title>
    </div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Title level={2}>{association.name}</Title>
      <Image
        width={200}
        src={association.imageURL}
        placeholder={
          <Image preview={false} src="https://via.placeholder.com/200" style={{ width: 200 }} />
        }
      />
      <div className='bg-[#9fc8f7] p-1'>
        <Row justify="center" gutter={16} className='mx-2'>
          <Col>
            <Button type="default" icon={<DollarCircleOutlined />} size="large" onClick={handleDonationNavigation}>
              Faire un Don
            </Button>
          </Col>
          <Col>
            <Button type="default" icon={<HeartOutlined />} size="large">
              Suivre
            </Button>
          </Col>
          <Col>
            <Button type="default" size="large">
              Votes
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AssociationPage;
