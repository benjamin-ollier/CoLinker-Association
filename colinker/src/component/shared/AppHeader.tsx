// src/components/AppHeader.tsx
import React , { useState} from 'react';
import { Layout, Menu, Dropdown, Button } from 'antd';
import { DownOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AssociationSelector from '../admin/AssociationSelector';

const { Header } = Layout;

interface AppHeaderProps {
  title: string;
  logoSrc: string;
  isAdminMode: boolean;
}

const AppHeader: React.FC<AppHeaderProps & {onAdminClick: () => void}> = ({ title, logoSrc, isAdminMode, onAdminClick }) => {
  const navigate = useNavigate();
  const handleAdminClick = () => {
    onAdminClick();
  };
  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '0 24px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
  };

  const logoImageStyle = {
    height: '50px',
    width: 'auto',
    marginRight: '10px',
  };

  const handleSettingsClick = () => {
    navigate('/Réglage');
  };


  const menu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={handleSettingsClick}>
        Réglages
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} style={{ color: 'red' }} onClick={onLogout}>
        Déconnexion
      </Menu.Item>
    </Menu>
  );

  const displayTitle = isAdminMode ? `Admin - ${title}` : title;
  
  return (
    <Header style={{ ...headerStyle, justifyContent: 'space-between' }}>
      <div style={logoStyle}>
        <img src={logoSrc} alt="Logo" style={logoImageStyle} />
        {displayTitle}
      </div>
      <div className="flex items-center space-x-4">
        {isAdminMode && <AssociationSelector />}
        <Button type="primary" onClick={handleAdminClick}>Administration</Button>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="link" className="flex items-center space-x-1">
            <span>Mon Compte</span>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
