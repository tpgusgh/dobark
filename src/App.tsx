import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SnailRaceGame from './components/SnailRaceGame';
import InquiryBoard from './components/InquiryBoard';

function App() {
  const { isLoggedIn } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (!isLoggedIn) {
    return <AuthForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'game':
        return <SnailRaceGame />;
      case 'inquiries':
        return <InquiryBoard />;
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;