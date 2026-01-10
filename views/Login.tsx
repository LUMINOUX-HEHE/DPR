
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Lock, ChevronRight, User as UserIcon,
  Eye, EyeOff, Shield, Zap, Cpu, Scan,
  Database, Fingerprint, Key, Globe, Terminal, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState(0);

  useEffect(() => {
    if (isAuthenticating) {
      const steps = [
        "Establishing secure connection...",
        "Validating credentials...",
        "Synchronizing local database...",
        "Access granted."
      ];

      const interval = setInterval(() => {
        setAuthStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              onLogin({
                id: 'NIC_ADMIN_01',
                name: 'Sahil',
                role: UserRole.ADMIN,
                department: 'NIC_HQ'
              });
            }, 600);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isAuthenticating, onLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
  };

  const steps = [
    "Establishing secure connection...",
    "Validating credentials...",
    "Synchronizing local database...",
    "Access granted."
  ];

  return (
    <div className="min-h-screen bg-gov-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gov-primary/10 rounded-full blur-[140px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel rounded-[3rem] p-12 md:p-14 border-gov-border/30 shadow-2xl overflow-hidden relative">
          <AnimatePresence>
            {isAuthenticating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gov-background/98 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-12 text-center"
              >
                <Loader2 size={48} className="text-gov-primary animate-spin mb-8" />
                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">Official Authentication</h3>
                <p className="text-[10px] font-bold text-gov-text-muted uppercase tracking-[0.4em] mb-12 animate-pulse">
                  {steps[authStep]}
                </p>
                <div className="w-48 h-1 bg-gov-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gov-primary"
                    animate={{ width: `${((authStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gov-primary text-white shadow-soft mb-2">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gov-primary uppercase tracking-[0.5em]">Government of India</p>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">Prasthav-<span className="text-gov-text-muted font-light">AI</span></h2>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.3em] ml-2 font-display">Authorized ID</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted group-focus-within:text-gov-primary transition-colors" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Official ID"
                    className="w-full bg-gov-background/50 border border-gov-border/50 rounded-xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-gov-text-muted focus:outline-none focus:border-gov-primary transition-all font-medium uppercase tracking-widest font-display"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.3em] ml-2 font-display">Security Code</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted group-focus-within:text-gov-primary transition-colors" size={16} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gov-background/50 border border-gov-border/50 rounded-xl py-3.5 pl-12 pr-12 text-xs text-white placeholder:text-gov-text-muted focus:outline-none focus:border-gov-primary transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gov-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 pb-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="h-4 w-4 rounded-md border border-gov-border flex items-center justify-center group-hover:border-gov-primary transition-all">
                  <div className="h-2 w-2 rounded-sm bg-gov-primary opacity-0 group-hover:opacity-20 transition-all"></div>
                </div>
                <span className="text-[9px] font-black text-gov-text-muted uppercase tracking-widest group-hover:text-gov-text-primary transition-colors font-display">Remember Device</span>
              </label>
              <button type="button" className="text-[9px] font-black text-gov-primary uppercase tracking-widest hover:text-white transition-colors font-display">Reset Key</button>
            </div>

            <button className="w-full bg-gov-primary hover:bg-gov-primaryDeep text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-glow transition-all flex items-center justify-center space-x-4 relative overflow-hidden group font-display">
              <span>Login to Portal</span>
              <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gov-border/20 flex justify-center opacity-30">
            <p className="text-[8px] font-black text-gov-text-muted uppercase tracking-[0.3em]">Official Use Only · Protected by NIC Assets</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
