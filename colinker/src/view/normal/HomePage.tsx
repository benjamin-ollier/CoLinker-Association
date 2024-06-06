import React, { useState, useEffect } from 'react';
import { Card, Col, Row, message, Input } from 'antd';
import { getAllAsoociation } from '../../service/associationService';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

interface Association {
  name: string;
  description: string;
  siret?: string;
}

const HomePage = () => {
  const [associations, setAssociations] = useState<Association[]>([]);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const handleSearch = async (value: string) => {
    try {
      const data = await getAllAsoociation();
      setAssociations(data);
    } catch (error) {
      message.error('Failed to fetch associations: ');
    }
  };

  const fetchAssociations = async () => {
    try {
      const data = await getAllAsoociation();
      setAssociations(data);
    } catch (error) {
      message.error('Failed to fetch associations: ');
    }
  };

  return (
    <div className="site-card-wrapper m-3">
      <div>
        <Input.Search
          placeholder="Entrez le nom de l'association"
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          className='m-1 w-300'
        />
     </div>
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
  );
};

export default HomePage;
