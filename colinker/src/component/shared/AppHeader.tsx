// src/components/AppHeader.tsx
import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

interface AppHeaderProps {
  title: string;
  logoSrc: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, logoSrc }) => {
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
    height: '40px',
    width: 'auto',
    marginRight: '12px',
  };

  return (
    <Header style={headerStyle}>
      <div style={logoStyle}>
        <img src={logoSrc} alt="Logo" style={logoImageStyle} />
        {title}
      </div>
    </Header>
  );
};

export default AppHeader;
