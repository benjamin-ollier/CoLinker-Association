import React, { useState } from 'react';
import {
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Layout } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;


const SideMenu = ({isAdminMode}) => {
  let navigation = [
    { label: "Home", key: "/Home" },
    { label: "Mes Associations", key: "/MyAssociation" },
    { label: "Vote", key: "/Votes" },
    { label: "Assemblée Générale", key: "/Assemblée Générale" },

  ];

  if (isAdminMode) {
    console.log("admin ",isAdminMode);
    navigation = [
      { label: "Dashboard", key: "/admin/dashboard" },
      { label: "Gestion des membres", key: "/admin/userManagement" },
      { label: "Assemblée Générale", key: "/admin/ag" },
      { label: "Gestion des votes", key: "/admin/vote" },
    ];
  }

  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };


  return (
    <Sider width={240} style={{ background: '#fff' }}>
      <div style={{ width: 240 }}>
      <Menu              
        mode="inline"
        defaultSelectedKeys={["/"]}
        items={navigation}
        onClick={handleMenuClick}
      />
      </div>
    </Sider>
  );
};

export default SideMenu;