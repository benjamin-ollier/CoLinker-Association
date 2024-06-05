import logo from "./logo.svg";
import React, { useState } from "react";
import SideMenu from "./component/shared/SideMenu.tsx";
import AppHeader from "./component/shared/AppHeader.tsx";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./view/normal/HomePage.tsx";
import MyAssociation from "./view/normal/MyAssociation.tsx";
import VoteList from "./view/normal/VoteList.tsx";
import Vote from "./view/normal/Vote.tsx";
import Ag from "./view/admin/Ag.tsx";
import AgForm from "./view/admin/AgForm";
import AssociationPage from "./view/normal/Association";
import AuthPage from "./view/AuthPage.tsx";
import Setting from "./view/Setting.tsx";
import UserManagement from "./view/admin/UserManagement.tsx";
import DashboardManagement from './view/admin/DashboardManagement';
import Donation from "./view/normal/Donation";
import {
  AssociationProvider,
  useAssociation,
} from "./context/AssociationContext";
import Activities from "./view/admin/Activities";
import ActivitiesForm from "./view/admin/ActivitiesForm";
import AdminVoteForm from "./view/admin/AdminVoteForm";
import AdminVotes from "./view/admin/AdminVotes";


const { Header, Sider, Content } = Layout;

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const changeAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };



  return (
    <AssociationProvider>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
        </Routes>
        <Layout style={{ minHeight: "100vh" }}>
          <AppHeader
            title="CoLinker"
            logoSrc="/colinker.png"
            isAdminMode={isAdminMode}
            onAdminClick={changeAdminMode}
          />
          <Layout>
            <SideMenu isAdminMode={isAdminMode} />
            <Content>
              <Routes>
                {/* shared */}
                <Route path="/Réglage" element={<Setting />} />
                {/* Normal */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/myAssociation" element={<MyAssociation />} />
                <Route path="/association/:name" element={<AssociationPage />} />
                <Route path="/donation/:name" element={<Donation />} />
                <Route path="/votes" element={<VoteList />} />
                <Route path="/vote/:id" element={<Vote />} />
                <Route path="/ag" element={<AssociationPage />} />
                {/* Admin */}
                <Route path="/admin/dashboard" element={<DashboardManagement />} />
                <Route path="/admin/userManagement" element={<UserManagement />} />
                <Route path="/admin/ag" element={<Ag />} />
                <Route path="/admin/ag/:id" element={<AgForm />} />
                <Route path="/admin/vote" element={<AdminVotes />} />
                <Route path="/admin/vote/:id" element={<AdminVoteForm />} />
                <Route path="/admin/activities" element={<Activities />} />
                <Route path="/admin/activity/:id" element={<ActivitiesForm />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
    </AssociationProvider>
  );
}

export default App;
