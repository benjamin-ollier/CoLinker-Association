import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { FileAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { createDashboardAssociation, getAssociationImage, getAssociationWithId, uploadAssociationImage } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

interface IWidget {
  title: string;
}

const DashboardManagement = () => {
  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [form] = Form.useForm();
  const { setSelectedAssociationId, selectedAssociationId } = useAssociation();
  const [backgroundImage, setBackgroundImage] = useState("");
  const [fileList, setFileList] = useState([]);


  useEffect(() => {
    if (selectedAssociationId) {
      fetchAssociationDetails(selectedAssociationId);
      fetchAssociationImage(selectedAssociationId);
    }
  }, [selectedAssociationId]);

  const fetchAssociationDetails = async (assoId) => {
    try {
      const data = await getAssociationWithId(assoId);
      if (data) {
        form.setFieldsValue({
          informationTitle: data.informationTitle,
          informationDescription: data.informationDescription,
          widgetTitle: data.widgets.length > 0 ? data.widgets[0].title : "",
        });

          form.setFieldsValue({
            informationTitle: data.informationTitle,
            informationDescription: data.informationDescription,
            // Supposons que 'widgetTitle' n'est plus nécessaire ici si chaque widget a son propre titre
          });
    
          // Met à jour l'état des widgets avec des titres individuels
          setWidgets(data.widgets);      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'association:", error);
    }
  };

  const fetchAssociationImage = async (assoId) => {
    try {
      const data = await getAssociationImage(assoId);
      if (data) {
        setBackgroundImage(`https://projet-ecole-ong.s3.eu-west-3.amazonaws.com/images/${selectedAssociationId}/${data} `);
      }
    } catch(e) {
      console.error("could not get association image");
    }
  }


  const onFinish = async () => {
    if(selectedAssociationId){
      const formData = new FormData();
      
      formData.append('informationTitle', form.getFieldValue('informationTitle'));
      formData.append('informationDescription', form.getFieldValue('informationDescription'));
      
      formData.append('widgets', JSON.stringify(widgets));
      formData.append('id', selectedAssociationId);
      formData.append('widgetTitle', form.getFieldValue('widgetTitle'));

      // if (fileList.length > 0 && (fileList[0] as any).originFileObj) {
      //   console.log("toto",fileList[0]["originFileObj"])
      //   formData.append('image', fileList[0]["originFileObj"]);
      // }
    
      try {
        await createDashboardAssociation(formData);
        console.log('Modifications sauvegardées');
      } catch (error) {
        console.error('Erreur lors de l’enregistrement des modifications:', error);
      }
    }
  };
  

  const handleAddWidget = () => {
    const newWidget: IWidget = { title: `Widget ${widgets.length + 1}`};
    setWidgets([...widgets, newWidget]);
  };

  const handleRemoveWidget = (indexToRemove) => {
    setWidgets(widgets.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);


  const handleTitleChange = (index, newTitle) => {
    // Créez une nouvelle copie des widgets pour garantir une bonne mise à jour de l'état
    const updatedWidgets = [...widgets];
    // Modifiez le titre du widget spécifique
    if (updatedWidgets[index]) {
        updatedWidgets[index] = { ...updatedWidgets[index], title: newTitle };
    }
    // Mettez à jour l'état avec la nouvelle liste des widgets
    setWidgets(updatedWidgets);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0]
      if (file.size > (10 * 1024 * 1024)) { // 10MB size limitation
        message.error("Vous ne pouvez importer que des fichiers de 9 Mo maximum.");
        return
      }
      const formData = new FormData();
      formData.append('file', file);
      
      let responseStatus = await uploadAssociationImage(selectedAssociationId, formData);
      if (responseStatus === 200) {
        setBackgroundImage(`https://projet-ecole-ong.s3.eu-west-3.amazonaws.com/images/${selectedAssociationId}/${file.name}`);
      }
    } catch (error) {
      console.error('Failed to upload file', error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-5">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <h2 className="text-2xl font-bold mb-3">Image de fond</h2>
        <img className="w-32" src={backgroundImage} />
        <label className='rounded-lg mx-5 p-2 bg-white border hover:cursor-pointer hover:bg-blue'>
          <FileAddOutlined /> Importer un fichier
          <input style={{display: "none"}} type="file" onChange={handleImageUpload} />
        </label>
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-3">Widgets</h2>
          <Form.Item name="widgetTitle" label="Titre">
              <Input placeholder="entrez un titre pour les widgets que vous voulez fournir" />
          </Form.Item>
          {widgets.map((widget, index) => (
            <Card key={index} title={`Widget ${index + 1}`} style={{ marginBottom: 16 }}>
              <Form.Item label="Titre">
                <Input 
                  value={widget.title}
                  placeholder="Titre du widget" 
                  onChange={e => handleTitleChange(index, e.target.value)}
                />
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
