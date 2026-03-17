import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Search, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';
import contractData from '../Identity.json';

const Verifier = () => {
  const [address, setAddress] = useState("");
  const [hash, setHash] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!address || !hash) return;
    
    setIsVerifying(true);
    setVerificationStatus(null);
    
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to verify credentials!");
        setIsVerifying(false);
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractData.address, contractData.abi, provider);
      
      const isValid = await contract.verifyCertificate(address, hash);
      setVerificationStatus(isValid ? 'valid' : 'invalid');
    } catch (err) {
      console.error("Verification failed:", err);
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in mt-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Verify Credential</h1>
        <p className="text-slate-400 text-lg">Check the authenticity of a user's digital certificate on the blockchain.</p>
      </div>

      <div className="glass rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-blue-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">User Wallet Address</label>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..." 
              className="w-full bg-secondary/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder-slate-500 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Document Hash (SHA-256)</label>
            <input 
              type="text" 
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="0x..." 
              className="w-full bg-secondary/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder-slate-500 font-mono"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isVerifying || !address || !hash}
            className="w-full flex items-center justify-center bg-primary hover:bg-teal-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)]"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Checking Blockchain Record...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Verify Authenticity
              </>
            )}
          </button>
        </form>

        {verificationStatus === 'valid' && (
          <div className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start animate-fade-in text-emerald-400">
            <ShieldCheck className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Verification Successful</h3>
              <p className="text-emerald-400/80 text-sm">The document hash exists on the blockchain and was issued by a verified authority for this user address.</p>
            </div>
          </div>
        )}

        {verificationStatus === 'invalid' && (
          <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start animate-fade-in text-rose-400">
            <ShieldAlert className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Verification Failed</h3>
              <p className="text-rose-400/80 text-sm">No matching record found on the blockchain. The document may be forged or modified.</p>
            </div>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start animate-fade-in text-amber-400">
            <ShieldAlert className="w-8 h-8 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1">Verification Error</h3>
              <p className="text-amber-400/80 text-sm">Could not connect to the blockchain. Please ensure MetaMask is connected to the correct network (localhost:8545).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verifier;
