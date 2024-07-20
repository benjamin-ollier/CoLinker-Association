import React, { useEffect, useState } from 'react';
import { Card, Col, Row, message } from 'antd';
import { getFollowedAssociations } from '../../service/associationService';
import { Link } from 'react-router-dom';

interface Association {
  name: string;
  description: string;
  siret?: string;
}

const MyAssociation = () => {
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    const username = localStorage.getItem("username");
    if (username) {
      try {
        const data = await getFollowedAssociations(username);
        setAssociations(data);
      } catch (e) {
        message.error('Failed to fetch associations: ');
      }
    }
  };

  return (
    <div className="site-card-wrapper m-3">
      <Row gutter={16} className="m-3">
        {associations.map((association, index) => (
          <Col key={index} span={8} style={{ marginBottom: 16 }}>
            <Link to={`/association/${association.name}`} style={{ textDecoration: 'none' }}>
              <Card title={association.name} bordered={false} hoverable>
                <p><strong>Description:</strong> {association.description}</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
};

export default MyAssociation;
