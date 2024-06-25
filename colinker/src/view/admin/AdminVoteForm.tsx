import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Divider, Switch, InputNumber} from 'antd';
import { PlusOutlined, LeftOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getVoteById, createVote, updateVote } from '../../service/voteService';
import { getAssociationMembers } from '../../service/associationService';
import moment from 'moment';
import { useAssociation } from '../../context/AssociationContext';

const { Option } = Select;

const VoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const [form] = Form.useForm();
  const { selectedAssociationId } = useAssociation();
  const [members, setMembers] = useState(0);

  useEffect(() => {
    if (id) {
      fetchVoteDetails(id);
    }
    if (selectedAssociationId) {
      fetchMembersForQuorum();
    }
  }, [id]);

  const fetchMembersForQuorum = async () => {
    if (!selectedAssociationId) return;
  
    try {
      const response = await getAssociationMembers(selectedAssociationId);
      setMembers(response.length);
    } catch (error) {
      console.error('Failed to fetch members for quorum:', error);
    }
  };

  const fetchVoteDetails = async (voteId) => {
    try {
      const data = await getVoteById(voteId);
      if(data) {
        form.setFieldsValue({
          title: data.title,
          description: data.description,
          startDate: moment(data.startDate),
          endDate: moment(data.endDate),
          question: data.question,
          typeDestinataire: data.typeDestinataire,
          optionStepOne: data.optionStepOne.map(option => ({ texte: option.texte })),
          quorum: data.quorum,
          doubleStep: data.doubleStep
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du vote:", error);
    }
  };

  const handleSaveData = async (values) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
    };
    try {
      if (isNew) {
        await createVote(selectedAssociationId, formattedValues);
      } else {
        await updateVote(id, formattedValues);
      }
      navigate('/admin/vote');
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
        <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
          <Input placeholder="Titre" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
        <Form.Item name="startDate" label="Date et heure de début">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="endDate" label="Date et heure de fin">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="question" label="Question" rules={[{ required: true }]}>
          <Input placeholder="Question" />
        </Form.Item>
        <div className='flex'>
            <p>Nombre de membres de l'association: </p>
            <p className='ms-2 mb-1'>{members.toString()}</p>
        </div>
        <Form.Item
          name="quorum"
          label="Quorum (nombre de membres requis pour valider le vote)"
          rules={[{ required: true, message: "Veuillez saisir le quorum." }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="Entrez le quorum" />
        </Form.Item>
        <Form.Item name="doubleStep" label="Vote à double étape" valuePropName="checked" rules={[{ required: true }]}>
          <Switch />
        </Form.Item>
        <Divider>Options</Divider>
        <Form.List name="optionStepOne">
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
