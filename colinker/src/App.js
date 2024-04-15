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
import AuthPage from "./view/AuthPage.tsx";
import Setting from "./view/Setting.tsx";
import UserManagement from "./view/admin/UserManagement.tsx";
import {
  AssociationProvider,
  useAssociation,
} from "./context/AssociationContext";

const { Header, Sider, Content } = Layout;

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const changeAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  function assoIsSelected() {
    return <h1>Bienvenue !</h1>;
  }

  return (
    <AssociationProvider>
      <Router>
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
                <Route path="/Home" element={<HomePage />} />
                <Route path="/MyAssociation" element={<MyAssociation />} />
                <Route path="/Votes" element={<VoteList />} />
                <Route path="/Vote/:id" element={<Vote />} />
                <Route path="/ag" element={<Ag />} />
              </Routes>
              <AssociationContent isAdminMode={isAdminMode}/>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </AssociationProvider>
  );
}

function AssociationContent({ isAdminMode }) {
  const { selectedAssociationId } = useAssociation();

  if (isAdminMode && !selectedAssociationId) {
    return <h1 className="strong mt-5 ms-5">Veuillez sélectionner une association !</h1>;
  }

  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<Ag />} />
      <Route path="/admin/userManagement" element={<UserManagement />} />
      <Route path="/admin/ag" element={<Ag />} />
      <Route path="/admin/ag/:id" element={<AgForm />} />
      <Route path="/admin/vote" element={<Ag />} />
    </Routes>
  );
}

export default App;
