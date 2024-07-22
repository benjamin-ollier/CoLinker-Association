import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  AuditOutlined,
  FolderOutlined,
  DollarOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  UsergroupAddOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const SideMenu = ({ isAdminMode }) => {
  const navigate = useNavigate();

  const menuItems = [
    ...(isAdminMode ? [
      { label: "Dashboard", key: "/admin/dashboard", icon: <DesktopOutlined /> },
      { label: "Gestion des activités", key: "/admin/activities", icon: <CalendarOutlined /> },
      { label: "Gestion des membres", key: "/admin/userManagement", icon: <UsergroupAddOutlined /> },
      { label: "Assemblée Générale", key: "/admin/ag", icon: <AuditOutlined /> },
      { label: "Gestion des votes", key: "/admin/vote", icon: <ProfileOutlined /> },
      { label: "Gestion des fichiers", key: "/admin/files", icon: <FolderOutlined />},
      { label: "Cotisations", key: "/admin/cotisation", icon: <DollarOutlined />}
    ] : [
      { label: "Home", key: "/home", icon: <HomeOutlined /> },
      { label: "Mes Associations", key: "/myAssociation", icon: <AppstoreOutlined /> },
      { label: "Vote", key: "/votes", icon: <ProfileOutlined /> },
      { label: "Assemblée Générale", key: "/ag", icon: <AuditOutlined /> }
    ])
  ];


  return (
    <Sider width={240} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={['/home']}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default SideMenu;
