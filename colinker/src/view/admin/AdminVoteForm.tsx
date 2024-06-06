import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Divider } from 'antd';
import { PlusOutlined, LeftOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getVoteById, createVote, updateVote } from '../../service/votes';
import moment from 'moment';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const VoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [form] = Form.useForm();
  const { selectedAssociationId } = useAssociation();

  useEffect(() => {
    if (!isNew && id) {
      fetchVoteDetails(id);
    }
  }, [id]);

  const fetchVoteDetails = async (voteId) => {
    try {
      const data = await getVoteById(voteId);
      form.setFieldsValue({
        titre: data.titre,
        description: data.description,
        dateDebut: data.dateDebut ? moment(data.dateDebut) : null,
        dateFin: data.dateFin ? moment(data.dateFin) : null,
        question: data.question,
        typeDestinataire: data.typeDestinataire,
        options: data.options.map(option => ({ texte: option.texte }))
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du vote:", error);
    }
  };

  const handleSaveData = async (values) => {
    const formattedValues = {
      ...values,
      dateDebut: values.dateDebut ? values.dateDebut.toISOString() : null,
      dateFin: values.dateFin ? values.dateFin.toISOString() : null,
    };
    try {
      if (isNew) {
        await createVote(selectedAssociationId, formattedValues);
      } else {
        await updateVote(id, formattedValues);
      }
      navigate('/admin/votes');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du vote:", error);
    }
  };

  return (
    <div>
      <Button type="primary" ghost onClick={() => navigate('/admin/vote')} icon={<LeftOutlined />}>
        Retour
      </Button>
      <Divider>Informations sur le vote</Divider>
      <Form form={form} layout="vertical" onFinish={handleSaveData}>
        <Form.Item name="titre" label="Titre" rules={[{ required: true }]}>
          <Input placeholder="Titre" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item name="dateDebut" label="Date et heure de début">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="dateFin" label="Date et heure de fin">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="question" label="Question" rules={[{ required: true }]}>
          <Input placeholder="Question" />
        </Form.Item>
        <Form.Item name="typeDestinataire" label="Type de destinataire" rules={[{ required: true }]}>
          <Select placeholder="Sélectionnez un type">
            <Option value="Tous">Tous</Option>
            <Option value="Administrateurs">Administrateurs</Option>
            <Option value="Membres spécifiques">Membres spécifiques</Option>
          </Select>
        </Form.Item>
        <Divider>Options</Divider>
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} className="option-block">
                  <h3>Option #{index + 1}</h3>
                  <Form.Item
                    name={[field.name, 'texte']}
                    label="Texte de l'option"
                    rules={[{ required: true, message: 'Veuillez saisir le texte de l’option!' }]}
                  >
                    <Input placeholder="Texte de l'option" />
                  </Form.Item>
                  <Button type="dashed" onClick={() => remove(field.name)} icon={<MinusCircleOutlined />}>
                    Supprimer l'option
                  </Button>
                </div>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Ajouter une option
              </Button>
            </>
          )}
        </Form.List>
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            {isNew ? 'Créer le vote' : 'Mettre à jour le vote'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default VoteForm;
