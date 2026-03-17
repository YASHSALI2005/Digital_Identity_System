import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import VerifierLogin from './pages/VerifierLogin';
import Dashboard from './pages/Dashboard';
import Verifier from './pages/Verifier';

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [userRole, setUserRole] = useState(""); // 'student' or 'verifier'

  const handleLogout = () => {
    setWalletAddress("");
    setUserRole("");
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark text-slate-100 selection:bg-primary selection:text-white pb-20">
        <Navbar 
          walletAddress={walletAddress} 
          userRole={userRole} 
          onLogout={handleLogout} 
        />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={
              userRole ? <Navigate to={userRole === 'student' ? '/dashboard' : '/verify'} /> : <Home />
            } />
            <Route path="/student-login" element={
              <StudentLogin setWalletAddress={setWalletAddress} setUserRole={setUserRole} />
            } />
            <Route path="/verifier-login" element={
              <VerifierLogin setUserRole={setUserRole} />
            } />
            <Route path="/dashboard" element={
              userRole === 'student' && walletAddress 
                ? <Dashboard walletAddress={walletAddress} /> 
                : <Navigate to="/student-login" />
            } />
            <Route path="/verify" element={
              userRole === 'verifier' 
                ? <Verifier /> 
                : <Navigate to="/verifier-login" />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
