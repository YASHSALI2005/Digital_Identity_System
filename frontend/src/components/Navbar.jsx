import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Wallet, LogOut, GraduationCap } from 'lucide-react';

const Navbar = ({ walletAddress, userRole, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const formatAddress = (addr) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/20 rounded-xl">
          <ShieldCheck className="text-primary w-7 h-7" />
        </div>
        <Link to="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          SovereignID
        </Link>

        {/* Role-specific navigation */}
        {userRole === 'student' && (
          <div className="ml-8 hidden md:flex space-x-6">
            <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          </div>
        )}
        {userRole === 'verifier' && (
          <div className="ml-8 hidden md:flex space-x-6">
            <Link to="/verify" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Verify Credentials</Link>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Role Badge */}
        {userRole && (
          <div className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
            userRole === 'student' 
              ? 'bg-primary/10 text-primary border-primary/20' 
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            {userRole === 'student' ? <GraduationCap className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span className="capitalize">{userRole}</span>
          </div>
        )}

        {/* Wallet Address (student only) */}
        {walletAddress && userRole === 'student' && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-secondary/50 rounded-full border border-premiumBorder">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-sm font-medium">{formatAddress(walletAddress)}</span>
          </div>
        )}

        {/* Logout Button */}
        {userRole && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-secondary/50 rounded-full transition-all text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
