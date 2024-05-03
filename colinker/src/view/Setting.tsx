import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { getUserInfo } from '../service/userService'
import { postAssociation, getUserCreatorAssociation } from '../service/associationService';
import { message } from 'antd';

const Setting = () => {
  const [form] = Form.useForm();
  const [associationForm] = Form.useForm();

  useEffect(() => {
      fetchAgDetails();
  }, []);
    
  const fetchAgDetails = async () => {
    try {
      const pseudo:string| null = localStorage.getItem('username');
      if(pseudo){
      const data = await getUserInfo(pseudo);
      form.setFieldsValue({
        pseudo: data.username,
        firstname: data.firstName,
        lastname: data.lastName,
      });

      const associationData = await getUserCreatorAssociation(pseudo);
      if (associationData) {
        associationForm.setFieldsValue({
          name: associationData.name,
          siret: associationData.siret,
          description: associationData.description,
        });
      }
    }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'user:", error);
    }
  };

  const handleSaveData = async (values) => {
      // const res=await createAG(values);
      // if(res.status == '200' || res.status == '201') {
      //   navigate(`/admin/ag`);
      // }
    }

  const handleSaveAssociationData = async (values) => {
    const username = localStorage.getItem('username');

    if (!username) {
      console.error('Aucun utilisateur connecté trouvé');
      return;
    }
    const valuesWithUsername = { ...values, username };

    try {
      const res = await postAssociation(valuesWithUsername);
      if (res.status === 200 || res.status === 201) {
        localStorage.setItem('asAssociation', "true");
      } else {
        console.error('Une erreur est survenue lors de la sauvegarde de l’association');
      }
    } catch (error) {
      console.error('Erreur lors de la requête:', error);
    }
  };


  return (
    <div>
      <h1 className="text-3xl font-bold mb-5 ms-3 mt-2" >Réglages</h1>
      <div className="site-layout-content">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveData}
          className="p-10"
        >
          <Form.Item label="Informations personnelles">
            <Form.Item
              name="pseudo"
              label="Pseudo"
              className=""
            >
              <Input placeholder="Pseudo" />
            </Form.Item>

            <Form.Item
              name="firstname"
              label="Nom"
              className=""
            >
              <Input placeholder="Nom" />
            </Form.Item>

            <Form.Item
              name="lastname"
              label="Prénom"
              className=""
            >
            <Input placeholder="Prénom" />
            </Form.Item>
          </Form.Item>

          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Enregistrer
            </Button>
          </div>
        </Form>


        <Form
          form={associationForm}
          layout="vertical"
          onFinish={handleSaveAssociationData}
          className="p-10"
        >
          <Form.Item label="Modifier votre association">
            <Form.Item
              name="name"
              label="Nom de l'association"
              className=""
            >
              <Input placeholder="Nom de l'association" />
            </Form.Item>

            <Form.Item
              name="siret"
              label="SIRET"
              className=""
            >
              <Input placeholder="SIRET" />
            </Form.Item>

            <Form.Item
              name="description"
              label="description"
              className=""
            >
            <Input placeholder="description" />
            </Form.Item>
          </Form.Item>

          <div className="flex justify-end">
          <Button type="primary" htmlType="submit">
              Créer
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};


export default Setting;
