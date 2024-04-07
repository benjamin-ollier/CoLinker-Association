import logo from './logo.svg';
import React , { useState} from 'react';
import SideMenu from './component/shared/SideMenu.tsx';
import AppHeader from './component/shared/AppHeader.tsx';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/normal/HomePage.tsx';
import MyAssociation from './view/normal/MyAssociation.tsx';
import VoteList from './view/normal/VoteList.tsx';
import Vote from './view/normal/Vote.tsx';
import Ag from './view/admin/Ag.tsx';
import AgForm from './view/admin/AgForm';
import AuthPage from './view/AuthPage.tsx';

const { Header, Sider, Content } = Layout;

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const changeAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    console.log(isAdminMode);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
      </Routes>
            <Layout style={{ minHeight: '100vh' }}>
                <AppHeader title="CoLinker" logoSrc="/colinker.png" isAdminMode={isAdminMode} onAdminClick={changeAdminMode}/>
              <Layout>
                  <SideMenu isAdminMode={isAdminMode}/>
                <Content>
                  <Routes>
                    <Route path="/Home" element={<HomePage />} />
                    <Route path="/MyAssociation" element={<MyAssociation />} />
                    <Route path="/Votes" element={<VoteList />} />
                    <Route path="/Vote/:id" element={<Vote />} />
                    <Route path="/Assemblée Générale" element={<Ag />} />
                    {/* Admin */}
                    <Route path="/admin/dashboard" element={<Ag />} />
                    <Route path="/admin/userManagement" element={<Ag />} />
                    <Route path="/admin/ag" element={<Ag />} />
                    <Route path="/admin/agForm" element={<AgForm />} />
                    <Route path="/admin/vote" element={<Ag />} />

                  </Routes>
                </Content>
              </Layout>
            </Layout>
    </Router>
  );
}


export default App;
