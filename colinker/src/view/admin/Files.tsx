import React, { useEffect, useState } from 'react';
import { Button, List, message } from 'antd';
import { UploadOutlined, DownloadOutlined, FileTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getAssociationFiles, downloadAssociationFile, deleteAssociationFile, uploadAssociationFile } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const Files: React.FC = () => {
    const [files, setFiles] = useState([]);
    const { selectedAssociationId } = useAssociation();

    const fetchData = async () => {
      try {
        const data = await getAssociationFiles(selectedAssociationId);
        setFiles(data);
      } catch (error) {
        console.error('Failed to fetch association files', error);
      }
    }

    useEffect(() => {
      if (selectedAssociationId) {
        fetchData();
      }
    }, [selectedAssociationId]);

    const handleDownload = (filename: string) => {
      try {
        downloadAssociationFile(selectedAssociationId, filename);
      } catch (error) {
        console.error('Failed to download file', error);
      }
    } 

    const handleDelete = async (filename: string) => {
      try {
        await deleteAssociationFile(selectedAssociationId, filename);
        setFiles(files.filter(file => file !== filename));
      } catch(error) {
        console.error('Failed to delete file : ', error)
      }
    }

    const handleUpload = async (e) => {
      e.preventDefault();
      try {
        const file = e.target.files[0]
        if (file.size > (9 * 1024 * 1024)) { // 9MB size limitation
          message.error("Vous ne pouvez importer que des fichiers de 9 Mo maximum.");
          return
        }
        const formData = new FormData();
        formData.append('file', file);

        const responseStatus = await uploadAssociationFile(selectedAssociationId, formData);
        if (responseStatus === 200) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to upload file', error);
      }
    }

    return (
      <div>
          <h1 className="text-3xl font-bold mb-5 ms-3 mt-2">Gestion des fichiers</h1>
            <label className='rounded-lg mx-5 p-2 bg-white border hover:cursor-pointer hover:bg-blue'>
              <UploadOutlined /> Importer un fichier
                <input className="hidden" type="file" onChange={handleUpload} />
            </label>
          <div className="container mx-auto px-4 mt-10">
              <List
                  className='bg-white'
                  header={<div className='font-bold'>Fichiers de l'association</div>}
                  bordered
                  dataSource={files}
                  renderItem={(file) => (
                      <List.Item
                          className='flex hover:bg-blue'
                          actions={[
                              <Button type="text" title="Télécharger" onClick={() => handleDownload(file)}>
                                  <span className='flex'>
                                      <DownloadOutlined className="text-xl" />
                                  </span>
                              </Button>
                              ,
                              <Button type="text" title="Supprimer" onClick={() => handleDelete(file)}>
                                  <span className='flex'>
                                      <DeleteTwoTone className="text-xl" twoToneColor="#FA5252" />
                                  </span>
                              </Button>
                          ]}
                      >
                          <span>
                              <FileTwoTone className='mr-3' /> {file}
                          </span>
                      </List.Item>
                  )}
              />
          </div>
      </div>
    )
}

export default Files;