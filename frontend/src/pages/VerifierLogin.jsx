import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Search } from 'lucide-react';

const VerifierLogin = ({ setUserRole }) => {
  const navigate = useNavigate();

  const enterAsVerifier = () => {
    setUserRole('verifier');
    navigate('/verify');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="glass rounded-3xl p-10 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-violet-500"></div>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-slate-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="text-center">
          <div className="w-20 h-20 bg-blue-500/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Verifier Login</h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            As a verifier, you can check the authenticity of any credential by entering the user's wallet address and document hash.
          </p>

          <button
            onClick={enterAsVerifier}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-blue-500 hover:bg-blue-400 transition-all rounded-xl font-bold text-lg shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            <span>Enter as Verifier</span>
          </button>

          <p className="mt-6 text-slate-600 text-xs">
            No wallet connection required — verification is a read-only blockchain query
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifierLogin;
