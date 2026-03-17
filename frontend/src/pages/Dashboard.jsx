import React, { useState, useEffect, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle, Wallet, Loader2, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';
import contractData from '../Identity.json';

const Dashboard = ({ walletAddress }) => {
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [certHash, setCertHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [loadingCreds, setLoadingCreds] = useState(false);
  const [txHash, setTxHash] = useState("");

  // SHA256 hashing natively
  const generateHash = async (fileBuffer) => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getContract = async (needSigner = false) => {
    if (!window.ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signerOrProvider = needSigner ? await provider.getSigner() : provider;
    return new ethers.Contract(contractData.address, contractData.abi, signerOrProvider);
  };

  // Load credentials from blockchain
  const loadCredentials = useCallback(async () => {
    if (!walletAddress) {
      setCredentials([]);
      return;
    }
    setLoadingCreds(true);
    try {
      const contract = await getContract(false);
      const certs = await contract.getCertificates(walletAddress);
      const formatted = certs.map((cert) => ({
        hash: cert.hash,
        name: cert.name,
        issuer: cert.issuer,
        timestamp: Number(cert.timestamp),
      }));
      setCredentials(formatted);
    } catch (err) {
      console.error("Failed to load credentials:", err);
    } finally {
      setLoadingCreds(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const buffer = await selectedFile.arrayBuffer();
      const hash = await generateHash(buffer);
      setCertHash(hash);
    }
  };

  const submitToBlockchain = async (e) => {
    e.preventDefault();
    if (!walletAddress) return alert("Please connect wallet first!");
    if (!certHash) return alert("Please select a file!");

    setIsUploading(true);
    setTxHash("");
    try {
      const contract = await getContract(true);
      const tx = await contract.addCertificate(certHash, docName);
      setTxHash(tx.hash);
      await tx.wait();
      // Reload credentials after successful registration
      await loadCredentials();
      setFile(null);
      setDocName('');
      setCertHash('');
    } catch (err) {
      console.error("Blockchain transaction failed:", err);
      alert("Transaction failed: " + (err.reason || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Your Digital Identity</h1>
        <p className="text-slate-400 text-lg">Securely manage and issue your verifiable credentials on-chain.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Card */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          <h2 className="text-2xl font-bold mb-6 flex items-center"><UploadCloud className="mr-3 text-primary" /> Issue Credential</h2>
          
          <form onSubmit={submitToBlockchain} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Credential Name</label>
              <input 
                type="text" 
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="e.g. B.Tech Computer Science" 
                className="w-full bg-secondary/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-white placeholder-slate-500"
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Document</label>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-sm py-8"
                  style={{ top: '24px' }}
                  required
                />
                <FileText className="mx-auto h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm text-slate-300">{file ? file.name : "Click or drag file to upload"}</p>
              </div>
            </div>

            {certHash && (
              <div className="bg-dark/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Generated SHA-256 Hash:</p>
                <p className="text-xs font-mono text-emerald-400 truncate">{certHash}</p>
              </div>
            )}

            {txHash && (
              <div className="bg-dark/50 p-4 rounded-xl border border-blue-500/30">
                <p className="text-xs text-slate-400 mb-1">Transaction Hash:</p>
                <p className="text-xs font-mono text-blue-400 truncate flex items-center">
                  {txHash}
                  <ExternalLink className="w-3 h-3 ml-2 flex-shrink-0" />
                </p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isUploading || !certHash}
              className="w-full bg-primary hover:bg-teal-400 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(20,184,166,0.39)] hover:shadow-[0_6px_20px_rgba(20,184,166,0.23)] flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering on Blockchain...
                </>
              ) : 'Register Credential'}
            </button>
          </form>
        </div>

        {/* Credentials List */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><CheckCircle className="mr-3 text-emerald-400" /> Active Credentials</h2>
          {!walletAddress ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
               <Wallet className="w-8 h-8 mb-3 opacity-50" />
               <p>Connect wallet to view credentials</p>
            </div>
          ) : loadingCreds ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 mb-3 animate-spin" />
              <p>Loading from blockchain...</p>
            </div>
          ) : credentials.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
              <FileText className="w-8 h-8 mb-3 opacity-50" />
              <p>No credentials registered yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {credentials.map((cert, index) => (
                <div key={index} className="p-4 bg-secondary/40 rounded-xl border border-premiumBorder hover:bg-secondary/60 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-white">{cert.name}</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">Verified</span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 truncate">{cert.hash}</p>
                  <div className="mt-3 flex justify-between text-xs text-slate-500">
                    <span>Issuer: {formatAddress(cert.issuer)}</span>
                    <span>{formatDate(cert.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
