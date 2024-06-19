import React, { useEffect, useState } from 'react';
import { Button, List, message } from 'antd';
import { FileAddOutlined, DownloadOutlined, FileTwoTone, FolderTwoTone, DeleteTwoTone, DownOutlined, UpOutlined, FolderAddOutlined } from '@ant-design/icons';
import { getAssociationFiles, downloadAssociationFile, deleteAssociationFile, uploadAssociationFile, createAssociationDirectory } from '../../service/associationService';
import { useAssociation } from '../../context/AssociationContext';

const Files: React.FC = () => {
    const [files, setFiles] = useState([]);
    const [folderName, setFolderName] = useState("");
    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
    const { selectedAssociationId } = useAssociation();

    const fetchData = async () => {
      try {
        const data = await getAssociationFiles(selectedAssociationId);
        const formattedData = formatFiles(data);
        setFiles(formattedData);
      } catch (error) {
        console.error('Failed to fetch association files', error);
      }
    }

    const formatFiles = (fileList) => {
        const fileTree = [];

        fileList.forEach((filePath: string) => {
            const parts: string[] = filePath.split('/');
            
            let currentLevel: any = fileTree;

            parts.forEach((part, index) => {
                const existingPath = currentLevel.find((item: any) => item.name === part);

                if (existingPath) {
                    currentLevel = existingPath.children;
                } else {
                    if (!part) return
                    const newPart = {
                        name: part,
                        path: filePath,
                        type: index === parts.length - 1 ? 'file' : 'folder',
                        children: []
                    };
                    currentLevel.push(newPart);
                    currentLevel = newPart.children;
                }
            });
        });

        return fileTree;
    }

    useEffect(() => {
      if (selectedAssociationId) {
        fetchData();
      }
    }, [selectedAssociationId]);

    const handleDownload = (filepath: string) => {
      try {
        downloadAssociationFile(selectedAssociationId, filepath.replace("/", ":"));
      } catch (error) {
        console.error('Failed to download file', error);
      }
    }

    const handleDelete = async (filepath: string) => {
      try {
        await deleteAssociationFile(selectedAssociationId, filepath.replace("/", ":"));
        fetchData();
      } catch(error) {
        console.error('Failed to delete file : ', error)
      }
    }

    const handleUpload = async (e, folderName?: string) => {
      e.preventDefault();
      try {
        const file = e.target.files[0]
        if (file.size > (9 * 1024 * 1024)) { // 9MB size limitation
          message.error("Vous ne pouvez importer que des fichiers de 9 Mo maximum.");
          return
        }
        const formData = new FormData();
        formData.append('file', file);
        
        let responseStatus;
        if (folderName) {
          folderName = folderName.replace("/", ":")
          responseStatus = await uploadAssociationFile(selectedAssociationId, formData, folderName);
        } else {
          responseStatus = await uploadAssociationFile(selectedAssociationId, formData);
        }

        if (responseStatus === 200) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to upload file', error);
      }
    }

    const handleMakeDirectory = async (e) => {
      e.preventDefault();
      try {
        const responseStatus = await createAssociationDirectory(selectedAssociationId, folderName);
        if (responseStatus === 200) {
          fetchData();
        }
      } catch (error) {
        console.error('Failed to make dir', error);
      }
    }

    const toggleFolder = (folderName: string) => {
      if (expandedFolders.includes(folderName)) {
        setExpandedFolders(expandedFolders.filter(folder => folder !== folderName));
      } else {
        setExpandedFolders([...expandedFolders, folderName]);
      }
    };

    const renderFileTree = (fileTree) => {
      return fileTree.map(item => {
        if (item.type === 'file') {
          return (
            <List.Item
              className='flex hover:bg-blue'
              key={item}
              actions={[
                <Button type="text" title="Télécharger" onClick={() => handleDownload(item.path)}>
                  <span className='flex'>
                    <DownloadOutlined className="text-xl" />
                  </span>
                </Button>,
                <Button type="text" title="Supprimer" onClick={() => handleDelete(item.path)}>
                  <span className='flex'>
                    <DeleteTwoTone className="text-xl" twoToneColor="#FA5252" />
                  </span>
                </Button>
              ]}
            >
              <FileTwoTone className='mr-3' /> {item.name}
            </List.Item>
          );
        } else {
          return (
            <div key={item.name}>
              <List.Item
                className='flex hover:bg-blue'
                actions={[
                  <Button type="text" className="p-0">
                    <label className="px-4 hover:cursor-pointer">
                      <FileAddOutlined />
                      <input 
                        className="hidden" 
                        type="file" 
                        onChange={(e) => handleUpload(e, item.path)}
                      />
                    </label>
                  </Button>,
                  <Button type="text" onClick={() => toggleFolder(item.name)}>
                    {expandedFolders.includes(item.name) ? <UpOutlined /> : <DownOutlined />}
                  </Button>,
                  <Button type="text" title="Supprimer" onClick={() => handleDelete(item.path)}>
                    <span className='flex'>
                      <DeleteTwoTone className="text-xl" twoToneColor="#FA5252" />
                    </span>
                  </Button>
                ]}
              >
                <FolderTwoTone className='mr-3' /> {item.name}
              </List.Item>
              {expandedFolders.includes(item.name) && (
                <List className="pl-3">
                  {renderFileTree(item.children)}
                </List>
              )}
            </div>
          );
        }
      });
    };

    return (
      <div>
        <h1 className="text-3xl font-bold mb-5 ms-3 mt-2">Gestion des fichiers</h1>
        <label className='rounded-lg mx-5 p-2 bg-white border hover:cursor-pointer hover:bg-blue'>
          <FileAddOutlined /> Importer un fichier
          <input className="hidden" type="file" onChange={handleUpload} />
        </label>
        <label>
          <button 
            className="rounded-l-lg p-2 bg-white border hover:cursor-pointer hover:bg-blue" 
            onClick={handleMakeDirectory}
          >
            <FolderAddOutlined />
          </button>
          <input 
            type="text" 
            className="p-2 border rounded-r" 
            placeholder="Créer un dossier" 
            onChange={(e) => setFolderName(e.target.value)}
          />
        </label>
        <div className="container mx-auto px-4 mt-10">
          <List
            className='bg-white'
            header={<div className='font-bold'>Fichiers de l'association</div>}
            bordered
          >
            {renderFileTree(files)}
          </List>
        </div>
      </div>
    )
}

export default Files;