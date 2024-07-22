import React, { useState, useEffect } from "react";
import { Button, Row, Col, Typography, Image, message, Card } from "antd";
import { HeartFilled, HeartOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { getAssociationWithName } from "../../service/associationService";
import { checkFollowing, followAssociation } from "../../service/userService";
import { getActivitiesByAssociationId } from "../../service/activitiesService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface Association {
  _id: any;
  name: string;
  description: string;
  siret?: string;
  image: string;
  widgets: Array<{ title: string; _id: string }>;
  informationDescription: string;
  informationTitle: string;
  widgetTitle: string;
}

interface Activities {
  _id: string;
  association: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  dateStart: Date;
  dateEnd: Date;
  status: string;
  images: string[];
}

const AssociationPage = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [association, setAssociation] = useState<Association | null>(null);
  const [activities, setActivities] = useState<Activities[]>([]);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAssociation();
    };
    fetchData();
  }, [name]);

  useEffect(() => {
    if (association) {
      checkFollowed();
    }
  }, [association]);

  const handleDonationNavigation = () => {
    if (association) {
      navigate(`/donation/${association.name}`);
    }
  };

  const fetchAssociation = async () => {
    if (name) {
      try {
        const data = await getAssociationWithName(name);
        if (data && data.length > 0) {
          setAssociation(data[0]);
          const activitiesData = await getActivitiesByAssociationId(
            data[0]._id
          );
          setActivities(activitiesData);
        }
      } catch (error) {
        message.error("Failed to fetch associations: ");
      }
    }
  };

  const handleFollow = async () => {
    const username = localStorage.getItem('username');
    if (username && association) {
      try {
        const response = await followAssociation(username, association._id);
        if (response) setFollowed(!followed);
      } catch (error) {
        message.error("Une erreur est survenue sur la fonction de Suivi")
      }
    }
  };

  const handleVotes = async () => {
    if (association) {
      navigate(`/votes/${association.name}`);
    }
  }

  const checkFollowed = async () => {
    const username = localStorage.getItem('username');
    if (username && association) {
      const response = await checkFollowing(username, association._id);
      setFollowed(response);
    }
  }

  if (!association) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Title level={2}>Chargement...</Title>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title level={2}>{association.name}</Title>
      <div
        className="w-full h-80 flex justify-center items-center overflow-hidden"
        style={{
          padding: "10px 0",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundImage: `url("https://projet-ecole-ong.s3.eu-west-3.amazonaws.com/images/${association._id}/${association.image}")`
        }}
      ></div>
      <div className="bg-[#c0dbfa] mt-2 p-1">
        <Row justify="center" gutter={16} className="mx-2">
          <Col>
            <Button
              className="border border-blue-800"
              type="default"
              icon={<DollarCircleOutlined />}
              size="large"
              onClick={handleDonationNavigation}
            >
              Faire un Don
            </Button>
          </Col>
          <Col>
            <Button onClick={handleFollow} type="default" icon={followed ? <HeartFilled /> : <HeartOutlined />} size="large">
              Suivre
            </Button>
          </Col>
          <Col>
            <Button onClick={handleVotes} type="default" size="large">
              Votes
            </Button>
          </Col>
        </Row>
      </div>
      <div className="text-left ml-4">
        <Title level={2} style={{ marginTop: "20px" }}>
          {association.widgetTitle}
        </Title>
      </div>
      <div className="mx-4">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {association.widgets.map((widget, index) => (
            <Col key={widget._id} span={8} style={{ marginBottom: 16 }}>
              <Card
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
                bordered={false}
              >
                <Title level={4} style={{ textAlign: "center" }}>
                  {widget.title}
                </Title>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <div className="text-left ml-4">
        <Title level={2} style={{ marginTop: "20px" }}>
          Nos Informations
        </Title>
      </div>
      <div className="mx-4">
        <Card>
          <p>
            <b>Titre:</b> {association.informationTitle}
          </p>
          <p>
            <b>Description:</b> {association.informationDescription}
          </p>
        </Card>
      </div>

      <div className="text-left ml-4">
        <Title level={2} style={{ marginTop: "20px" }}>
          Nos Activités
        </Title>
      </div>

      <div className="mx-4">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {activities.map((activity, index) => (
            <Col key={activity._id} span={24} style={{ marginBottom: 16 }}>
              <Card
                onClick={() =>
                  navigate(`/activityDetails/${name}/${activity._id}`)
                }
                style={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "1px",
                  cursor: "pointer",
                }}
                bordered={false}
              >
                <Title level={4} style={{ textAlign: "center" }}>
                  {activity.title}
                </Title>
                <p>{activity.description}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AssociationPage;
