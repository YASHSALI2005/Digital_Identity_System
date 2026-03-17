import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Blockchain-Powered Identity
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
            SovereignID
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          A decentralized platform for issuing and verifying tamper-proof digital credentials on the blockchain.
        </p>
      </div>

      {/* Login Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl px-4">
        {/* Student Login Card */}
        <button
          onClick={() => navigate('/student-login')}
          className="glass rounded-3xl p-8 text-left group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/30"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/25 transition-colors">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Student Login</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Connect your MetaMask wallet to upload documents and register your credentials on the blockchain.
            </p>
            <div className="flex items-center text-primary font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Connect Wallet & Enter
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </button>

        {/* Verifier Login Card */}
        <button
          onClick={() => navigate('/verifier-login')}
          className="glass rounded-3xl p-8 text-left group relative overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-500/30"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-500/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/25 transition-colors">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Verifier Login</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Verify the authenticity of any credential by checking its hash against the blockchain record.
            </p>
            <div className="flex items-center text-blue-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start Verifying
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </button>
      </div>

      {/* Footer Note */}
      <p className="mt-12 text-slate-600 text-xs text-center">
        Powered by Ethereum • Hardhat • Solidity
      </p>
    </div>
  );
};

export default Home;
