import React, { useState } from 'react';
import { Form, Input, Button, Card, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { putDashboardAssociation } from '../../service/associationService';

interface IWidget {
  name: string;
  image: string;
  title: string;
  place: string;
}

const DashboardManagement = () => {
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [form] = Form.useForm();


  const onFinish = (values) => {
    putDashboardAssociation(values);
  };

  const handleAddWidget = () => {
    const newWidget: IWidget = { name: `Widget ${widgets.length + 1}`, image: '', title: '', place: '' };
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (indexToRemove) => {
    setWidgets(widgets.filter((_, index) => index !== indexToRemove));
  };

  const uploadProps = {
    beforeUpload: file => {
      const reader = new FileReader();
      reader.onload = e => {
        console.log('Image URL:', e?.target?.result);
      };
      reader.readAsDataURL(file);
      return false;
    },
    multiple: false,
  };

  return (
    <div className="container mx-auto px-4 py-5">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h2 className="text-2xl font-bold mb-3">Image de fond</h2>
        <Form.Item name="image" label="">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Cliquer pour télécharger</Button>
          </Upload>
        </Form.Item>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Widgets</h2>
          {widgets.map((widget, index) => (
            <Card key={index} title={`Widget ${index + 1}`} style={{ marginBottom: 16 }}>
              <Form.Item label="Image du Widget">
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Cliquer pour télécharger</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="Titre">
                <Input placeholder="Titre du widget" />
              </Form.Item>
              <Form.Item label="Lieu">
                <Input placeholder="Lieu" />
              </Form.Item>
              <Button type="dashed" onClick={() => handleRemoveWidget(index)} icon={<DeleteOutlined />}>
                Supprimer
              </Button>
            </Card>
          ))}
          <Button type="dashed" onClick={handleAddWidget}>Ajouter un Widget</Button>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Informations</h2>
            <Form.Item name="informationTitle" label="Titre">
              <Input placeholder="Entrez un titre" />
            </Form.Item>
            <Form.Item name="informationDescription" label="Description">
              <Input.TextArea rows={4} placeholder="Entrez une description" />
            </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sauvegarder les modifications
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DashboardManagement;
