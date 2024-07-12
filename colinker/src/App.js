import logo from "./logo.svg";
import React, { useState, useEffect } from 'react';
import SideMenu from "./component/shared/SideMenu.tsx";
import AppHeader from "./component/shared/AppHeader.tsx";
import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./view/normal/HomePage.tsx";
import MyAssociation from "./view/normal/MyAssociation.tsx";
import VoteList from "./view/normal/VoteList.tsx";
import Vote from "./view/normal/Vote.tsx";
import Ag from "./view/admin/Ag.tsx";
import Files from "./view/admin/Files.tsx";
import AgForm from "./view/admin/AgForm";
import AssociationPage from "./view/normal/Association";
import AuthPage from "./view/AuthPage.tsx";
import Setting from "./view/Setting.tsx";
import UserManagement from "./view/admin/UserManagement.tsx";
import DashboardManagement from './view/admin/DashboardManagement';
import Donation from "./view/normal/Donation";
import {
  AssociationProvider,
} from "./context/AssociationContext";
import Activities from "./view/admin/Activities";
import ActivitiesForm from "./view/admin/ActivitiesForm";
import AdminVoteForm from "./view/admin/AdminVoteForm";
import AdminVotes from "./view/admin/AdminVotes";
import { useAssociation } from './context/AssociationContext';
import NotSelectedAssociation from "./component/admin/notSelectedAssociation";
import Cotisation from "./view/admin/Cotisation";
import ActivityDetails from "./view/normal/ActivityDetails";
import { useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

function MainContent({ isAdminMode }) {
  const { selectedAssociationId } = useAssociation();

  // General routes for all users
  const generalRoutes = [
    <Route key="home" path="/home" element={<HomePage />} />,
    <Route key="myAssociation" path="/myAssociation" element={<MyAssociation />} />,
    <Route key="association" path="/association/:name" element={<AssociationPage />} />,
    <Route key="donation" path="/donation/:name" element={<Donation />} />,
    <Route key="votes" path="/votes" element={<VoteList />} />,
    <Route key="vote" path="/vote/:id" element={<Vote />} />,
    <Route key="setting" path="/Réglage" element={<Setting />} />,
    <Route key="activityDetails" path="/activityDetails/:name/:id" element={<ActivityDetails />} />
  ];

  const adminRoutes = [

  ]

  if (!selectedAssociationId) {
    if (isAdminMode) {
      // Admin mode is true but no association is selected
      return (
        <Routes>
          {generalRoutes}
          <Route path="*" element={<NotSelectedAssociation />} />
        </Routes>
      );
    } else {
      // Return general public routes if no association is selected and not in admin mode
      return <Routes>{generalRoutes}</Routes>;
    }
  }

  // Routes when an association is selected, includes general and admin routes if in admin mode
  return (
    <Routes>
      {generalRoutes}
      {isAdminMode && (
        <>
          <Route path="/admin/dashboard" element={<DashboardManagement />} />
          <Route path="/admin/userManagement" element={<UserManagement />} />
          <Route path="/admin/ag" element={<Ag />} />
          <Route path="/admin/ag/:id" element={<AgForm />} />
          <Route path="/admin/vote" element={<AdminVotes />} />
          <Route path="/admin/vote/:id" element={<AdminVoteForm />} />
          <Route path="/admin/activities" element={<Activities />} />
          <Route path="/admin/activity/:id" element={<ActivitiesForm />} />
          <Route path="/admin/files" element={<Files />} />
          <Route path="/admin/cotisation" element={<Cotisation />} />
        </>
      )}
    </Routes>
  );
}



function App() {
  const location = useLocation();
  const [isAdminMode, setIsAdminMode] = useState(false);

  const changeAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    localStorage.setItem('isAdminMode', JSON.stringify(isAdminMode));

  };

  useEffect(() => {
    if (location.pathname === '/Home') {
      setIsAdminMode(false);
    }
  }, [location]);


  useEffect(() => {
    localStorage.setItem('isAdminMode', JSON.stringify(isAdminMode));
  }, [isAdminMode]);

  return (
    <AssociationProvider>
      <Content>
       <Routes>
        <Route path="/login" element={<AuthPage />} />
       </Routes>
      </Content>

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
            <MainContent isAdminMode={isAdminMode} />
            </Content>
          </Layout>
        </Layout>
    </AssociationProvider>
  );
}

export default App;
