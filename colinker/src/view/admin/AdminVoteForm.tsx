import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Divider, Switch, InputNumber, message} from 'antd';
import { PlusOutlined, LeftOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getVoteById, createVote, updateVote, deleteVote } from '../../service/voteService';
import { getAssociationMembers } from '../../service/associationService';
import { getByAssociationID } from '../../service/agService';
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
  const [selectedOptionIdAg, setSelectedOptionIdAg] = useState();
  const [optionsAg, setOptionsAg] = useState<{ _id: string; title: string }[]>([]);

  useEffect(() => {
    if (id) {
      fetchVoteDetails(id);
    }
    if (selectedAssociationId) {
      fetchMembersForQuorum();
      fetchAgWithAssociationId(selectedAssociationId);
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

  const fetchAgWithAssociationId = async (associationId) => {
    try {
      const response = await getByAssociationID(associationId);
      setOptionsAg(response);
    } catch (error) {
      console.error('Failed to fetch AG with association ID:', error);
    }
  }

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

  const handleSelectChange = value => {
    setSelectedOptionIdAg(value);
  };

  const handleDeleteVote = async () => {
    try {
      if(id){
        await deleteVote(id);
        navigate('/admin/vote');
      }
    } catch (error) {
      message.error("Erreur lors de la suppression du vote");
    }
  }

  const handleSaveData = async (values) => {
    try {
      if (isNew) {
        await createVote(selectedAssociationId, values);
      } else {
        await updateVote(id, values);
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
      <Form.Item
          name="ag"
          label="Selectionner une assemblée générale"
          rules={[{ required: true, message: 'Please select an option!' }]}
      >
          <Select onChange={handleSelectChange} placeholder="Select an option">
              {optionsAg.map(option => (
                  <Option key={option._id} value={option._id}>{option.title}</Option>
              ))}
          </Select>
      </Form.Item>
        <Form.Item name="title" label="Titre" rules={[{ required: true }]}>
          <Input placeholder="Titre" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Description" />
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
          <Button className='mr-2' type="primary" danger onClick={handleDeleteVote} icon={<DeleteOutlined />}>
            Supprimer
          </Button>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            {isNew ? 'Créer le vote' : 'Mettre à jour le vote'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default VoteForm;
