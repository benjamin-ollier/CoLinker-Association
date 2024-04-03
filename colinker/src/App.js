import logo from './logo.svg';
import SideMenu from './component/shared/SideMenu.tsx';
import AppHeader from './component/shared/AppHeader.tsx';
import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './view/HomePage.tsx';
import MyAssociation from './view/MyAssociation.tsx';
import VoteList from './view/VoteList.tsx';
import Vote from './view/Vote.tsx';


const { Header, Sider, Content } = Layout;

function App() {
  return (
    <Router>
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader title="CoLinker" logoSrc="/colinker.png" />
      <Layout>
          <SideMenu />
        <Content>
          <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/MyAssociation" element={<MyAssociation />} />
                <Route path="/Votes" element={<VoteList />} />
                <Route path="/Vote/:id" element={<Vote />} />
          </Routes>        
        </Content>
      </Layout>
    </Layout>
    </Router>
  );
}

export default App;
