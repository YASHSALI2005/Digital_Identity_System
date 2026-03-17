import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Wallet, ArrowLeft, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import axios from 'axios';

const API_URL = "http://localhost:5000/api/identity";

const StudentLogin = ({ setWalletAddress, setUserRole }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue!");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const addr = accounts[0];
      setWalletAddress(addr);
      setUserRole('student');

      // Register user in backend (silently ignore if already exists)
      try {
        await axios.post(`${API_URL}/register`, {
          walletAddress: addr,
          name: `Student-${addr.substring(0, 6)}`,
          email: `${addr.substring(0, 8)}@sovereign.id`
        });
      } catch (regErr) {
        if (regErr.response?.status !== 400) {
          console.warn("Backend registration skipped:", regErr.message);
        }
      }

      navigate('/dashboard');
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass rounded-3xl p-10 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400"></div>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Student Login</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Connect your MetaMask wallet to access your dashboard, upload documents, and register credentials on the blockchain.
          </p>

          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-primary hover:bg-teal-400 transition-all rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.5)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                <span>Connect MetaMask Wallet</span>
              </>
            )}
          </button>

          <p className="mt-6 text-slate-600 text-xs">
            Make sure you're on the Hardhat Local network (Chain ID: 31337)
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
