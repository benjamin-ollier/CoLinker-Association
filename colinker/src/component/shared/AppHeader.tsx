import React , { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Button, Tooltip, Badge } from 'antd';
import { DownOutlined, SettingOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AssociationSelector from '../admin/AssociationSelector';
import { getUserNotifications } from '../../service/userService';

const { Header } = Layout;

interface AppHeaderProps {
  title: string;
  logoSrc: string;
  isAdminMode: boolean;
}

const AppHeader: React.FC<AppHeaderProps & {onAdminClick: () => void}> = ({ title, logoSrc, isAdminMode, onAdminClick }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchNotifications = async () => {
      const username = localStorage.getItem('username');
      if (username && location.pathname !== '/login') {
        try {
          const newNotifications = await getUserNotifications(username);
          setNotifications(newNotifications || []);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, []);

  const hasNotification = () => notifications.length > 0

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

  const notifMenu = (
    <Menu>
      {hasNotification() ? (
        notifications.map((notification, index) => (
          <Menu.Item key={index}>{notification.message}</Menu.Item>
        ))
      ) : (
        <Menu.Item key="0">Aucune notification</Menu.Item>
      )}
    </Menu>
  )

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
        <Dropdown overlay={notifMenu} trigger={['click']} placement="bottomRight">
          <Badge dot={hasNotification()} offset={[-5, 5]}>
            <Button shape="circle" icon={<BellOutlined />} />
          </Badge>
        </Dropdown>
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
