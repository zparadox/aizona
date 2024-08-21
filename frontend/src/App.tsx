import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeContextProvider, useThemeContext } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateAgent from './pages/CreateAgent';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Box, Container } from '@mui/material';

const AppContent: React.FC = () => {
  const { theme } = useThemeContext();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} key="home" />
          <Route path="/create-agent" element={<CreateAgent />} key="create-agent" />
          <Route path="/explore" element={<Explore />} key="explore" />
          <Route path="/profile" element={<Profile />} key="profile" />
          <Route path="*" element={<NotFound />} key="not-found" />
        </Routes>
      </Container>
      <Footer />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <AppContent />
    </ThemeContextProvider>
  );
};

export default App;