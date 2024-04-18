import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Divider } from 'antd';
import { PlusOutlined, LeftOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getAGById, createAG, updateAG } from '../../service/agService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AgForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isNew) {
      fetchAgDetails();
    }
  }, [id]);
    
  const fetchAgDetails = async () => {
    try {
      const data = await getAGById(`${id}`);
      form.setFieldsValue({
        title: data.title,
        description: data.description,
        type: data.type,
        dateStart: moment(data.dateStart),
        dateEnd: moment(data.dateEnd),
        location: data.location,
        detailAgenda: data.detailAgenda.join('\n'),      
      });
      if (data.votes) {
        form.setFieldsValue({
          votes: data.votes.map(vote => ({
            titre: vote.titre,
            description: vote.description,
            options: vote.options.map(option => ({
              texte: option.texte
            }))
          }))
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'AG:", error);
    }
  };

  const handleSaveData = async (values) => {
    const dataToSubmit = {
      ...values,
      dateStart: values.dateStart ? values.dateStart.toISOString() : null,
      dateEnd: values.dateEnd ? values.dateEnd.toISOString() : null,
    };
    
    if (isNew) {
      const res=await createAG(dataToSubmit);
      if(res.success) {
        navigate(`/admin/ag`);
      }
    } else {
      const res=await updateAG(dataToSubmit, id || '');
      if(res.status == '200' || res.status == '201') {
        navigate(`/admin/ag`);
      }
    }
  };

  const back = () => {
    navigate(`/admin/ag`);
  }


  return (
    <div>
      <div className="flex justify-start mt-2 ms-2">
      <Button type="primary" ghost onClick={back} icon={<LeftOutlined />}>Retour</Button>
      </div>

    <Divider>Information de l'assemblée générale</Divider>

    <Form form={form} layout="vertical" onFinish={handleSaveData} className="p-10">    
      <Form.Item name="title" label="Titre" className="mb-4">
        <Input placeholder="Titre" />
      </Form.Item>

      <Form.Item name="description" label="Descriptif" className="mb-4">
        <Input.TextArea rows={4} placeholder="Descriptif" />
      </Form.Item>

      <Form.Item name="type" label="Type" className="mb-4">
        <Select placeholder="Sélectionnez un type">
          <Option value="Ordinaire">Ordinaire</Option>
          <Option value="Extraordinaire">Extraordinaire</Option>
        </Select>
      </Form.Item>

      <Form.Item name="dateStart" label="Date et heure d'ouverture" className="mb-4">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="dateEnd" label="Date et heure de fermeture" className="mb-4">
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item name="location" label="Lieu" className="mb-4">
        <Input placeholder="Lieu" />
      </Form.Item>

      <Form.Item name="detailAgenda" label="Ordre du jour" className="mb-4">
        <Input.TextArea rows={4} placeholder="Ordre du jour" />
      </Form.Item>

      <Divider>Votes</Divider>

      <Form.List name="votes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(field => (
              <div key={field.key} className="vote-block">
                <h3>Vote #{field.name + 1}</h3>
                <Form.Item
                  name={[field.name, 'titre']}
                  label="Titre du vote"
                  rules={[{ required: true, message: 'Veuillez saisir le titre du vote!' }]}
                >
                  <Input placeholder="Titre du vote" />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'description']}
                  label="Description"
                  rules={[{ required: true, message: 'Veuillez saisir la description!' }]}
                >
                  <Input.TextArea rows={2} placeholder="Description du vote" />
                </Form.Item>
                {/* <Form.Item
                  name={[field.name, 'dateDebut']}
                  label="Date de début"
                  rules={[{ required: true, message: 'Veuillez sélectionner la date de début!' }]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name={[field.name, 'dateFin']}
                  label="Date de fin"
                  rules={[{ required: true, message: 'Veuillez sélectionner la date de fin!' }]}
                >
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
                </Form.Item> */}
                <Form.List name={[field.name, 'options']}>
                  {(optionFields, { add: addOption, remove: removeOption }) => (
                    <>
                      {optionFields.map(optionField => (
                        <Form.Item
                          key={optionField.key}
                          name={[optionField.name, 'texte']}
                          label="Texte de l'option"
                          rules={[{ required: true, message: 'Veuillez saisir le texte de l’option!' }]}
                        >
                          <Input placeholder="Texte de l'option" />
                        </Form.Item>
                      ))}
                      <Button type="dashed" onClick={() => addOption()} icon={<PlusOutlined />}>
                        Ajouter une option
                      </Button>
                    </>
                  )}
                </Form.List>
                <Button type="dashed" onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
                  Supprimer le vote
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Ajouter un vote
            </Button>
          </>
        )}
      </Form.List>

      <div className="flex justify-end">
        <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>{isNew ? 'Créer' : 'Mettre à jour'}</Button>
      </div>
    </Form>
    </div>
  );
};

export default AgForm;
