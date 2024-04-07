import React from 'react';
import { Input, Select, DatePicker, Button } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AgForm: React.FC = () => {
  return (
    <div className="p-10">
      <h1 className="mb-6">Nouvelle Assemblée Générale</h1>
      
      <div className="mb-4">
        <label className="block">Titre</label>
        <Input placeholder="Titre" />
      </div>

      <div className="mb-4">
        <label className="block">Descriptif</label>
        <Input.TextArea rows={4} placeholder="Descriptif" />
      </div>

      <div className="mb-4">
        <label className="block">Type</label>
        <Select defaultValue="Ordinaire" style={{ width: '100%' }}>
          <Option value="Ordinaire">Ordinaire</Option>
          <Option value="Extraordinaire">Extraordinaire</Option>
          <Option value="Spéciale">Spéciale</Option>
        </Select>
      </div>

      <div className="mb-4">
        <label className="block">Date d'ouverture</label>
        <DatePicker style={{ width: '100%' }} />
      </div>

      <div className="mb-4">
        <label className="block">Date de fermeture</label>
        <DatePicker style={{ width: '100%' }} />
      </div>

      <div className="mb-4">
        <label className="block">Lieu</label>
        <Input placeholder="Lieu" />
      </div>

      <div className="mb-4">
        <label className="block">Ordre du jour</label>
        <Input.TextArea rows={4} placeholder="Ordre du jour" />
      </div>

      <div className="mb-4">
        <label className="block">Votes</label>
        <Select mode="tags" style={{ width: '100%' }} placeholder="Choix des votes">
          <Option value="Pour">Pour</Option>
          <Option value="Contre">Contre</Option>
          <Option value="Abstention">Abstention</Option>
        </Select>
      </div>

      <div className="mb-4">
        <label className="block">Documents</label>
        <Input type="file" />
      </div>

      <div className="flex justify-end">
        <Button className="mr-2" type="default" icon={<MinusCircleOutlined />}>Cancel</Button>
        <Button type="primary" icon={<PlusOutlined />}>Save</Button>
      </div>
    </div>
  );
};

export default AgForm;
