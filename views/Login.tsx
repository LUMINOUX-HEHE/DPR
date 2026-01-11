
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Lock, ChevronRight, User as UserIcon,
  Eye, EyeOff, Shield, Zap, Cpu, Scan,
  Database, Fingerprint, Key, Globe, Terminal, Loader2,
  ShieldAlert, CheckCircle2, Activity
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
  const [formData, setFormData] = useState({ id: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState({ id: false, password: false });

  useEffect(() => {
    if (isAuthenticating) {
      const steps = [
        { text: "Establishing secure connection...", icon: Activity },
        { text: "Validating credentials...", icon: ShieldCheck },
        { text: "Synchronizing local database...", icon: Database },
        { text: "Access granted.", icon: CheckCircle2 }
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
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 900);
      return () => clearInterval(interval);
    }
  }, [isAuthenticating, onLogin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setIsAuthenticating(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const steps = [
    { text: "Establishing secure connection...", icon: Activity },
    { text: "Validating credentials...", icon: ShieldCheck },
    { text: "Synchronizing local database...", icon: Database },
    { text: "Access granted.", icon: CheckCircle2 }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gov-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] animate-pulse-glow" style={{ background: 'radial-gradient(circle at center, var(--gov-success-glow), var(--gov-success), transparent)' }}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle at center, var(--gov-success-glow), var(--gov-success), transparent)' }}></div>
        <div className="absolute inset-0 data-stream-bg opacity-20"></div>
      </div>

      {/* Security Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-20"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gov-card/80 backdrop-blur-md border border-gov-border/30">
          <ShieldAlert size={14} className="text-gov-success" />
          <span className="text-[8px] font-black text-gov-text-secondary uppercase tracking-widest">Secure Portal</span>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-panel rounded-[2.5rem] p-10 md:p-12 border-gov-border/30 shadow-2xl overflow-hidden relative">

          {/* Authentication Overlay */}
          <AnimatePresence mode="wait">
            {isAuthenticating && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                className="absolute inset-0 bg-gov-background/95 z-50 flex flex-col items-center justify-center p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-8"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gov-success/10 flex items-center justify-center">
                      {React.createElement(steps[authStep].icon, {
                        size: 36,
                        className: "text-gov-success animate-pulse"
                      })}
                    </div>
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--gov-success-glow)"
                        strokeWidth="2"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="226"
                        strokeDashoffset={226 - (226 * (authStep + 1)) / steps.length}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--gov-success)" />
                          <stop offset="100%" stopColor="var(--gov-success-glow)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-black text-gov-success uppercase tracking-widest mb-3"
                >
                  Official Authentication
                </motion.h3>

                <motion.p
                  key={authStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-[10px] font-bold text-gov-text-secondary uppercase tracking-[0.4em] mb-6 min-h-[1.5rem]"
                >
                  {steps[authStep].text}
                </motion.p>

                <div className="w-full max-w-[200px] h-1.5 bg-gov-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: 'linear-gradient(90deg, var(--gov-success), var(--gov-success-glow))' }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${((authStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Login Content */}
          <motion.div variants={itemVariants} className="text-center space-y-6 mb-8">
            <motion.div
              className="inline-flex h-16 w-16 items-center justify-center rounded-2xl text-gov-background shadow-glow mb-3"
              style={{ background: 'linear-gradient(135deg, var(--gov-primary), var(--gov-primary-dark))' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShieldCheck size={32} />
            </motion.div>

            <div className="space-y-1">
              <p className="text-[8px] font-black text-gov-success uppercase tracking-[0.6em] leading-none">
                Government of India
              </p>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-display">
                Prasthav-<span className="text-gov-success font-light">AI</span>
              </h2>
              <p className="text-[9px] font-bold text-gov-text-secondary uppercase tracking-[0.3em] mt-2">
                AI-Powered DPR Evaluation System
              </p>
            </div>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            className="space-y-5"
            variants={itemVariants}
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gov-danger/10 border border-gov-danger/30">
                    <ShieldAlert size={14} className="text-gov-danger" />
                    <span className="text-[10px] font-bold text-gov-danger">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ID Input */}
            <motion.div
              className="space-y-2 text-left"
              whileHover={{ scale: 1.01 }}
            >
              <label className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.3em] ml-1 font-display flex items-center gap-2">
                <UserIcon size={12} className="text-gov-success" />
                Authorized ID
              </label>
              <div className={`relative group transition-all duration-300 ${isFocused.id ? 'ring-2 ring-gov-success-glow rounded-xl' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFocused.id ? 'opacity-20' : ''}`} style={{ background: 'linear-gradient(90deg, transparent, var(--gov-success-glow), transparent)' }}></div>
                <input
                  type="text"
                  required
                  placeholder="NIC_OFFICIAL_001"
                  value={formData.id}
                  onChange={(e) => handleInputChange('id', e.target.value)}
                  onFocus={() => setIsFocused(prev => ({ ...prev, id: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, id: false }))}
                  className="w-full bg-gov-card/80 border-2 border-gov-border/50 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gov-text-muted/50 focus:outline-none focus:border-gov-success transition-all font-medium uppercase tracking-widest font-display relative z-10"
                />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted group-focus-within:text-gov-success transition-colors z-10" size={18} />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="space-y-2 text-left"
              whileHover={{ scale: 1.01 }}
            >
              <label className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.3em] ml-1 font-display flex items-center gap-2">
                <Lock size={12} className="text-gov-success" />
                Security Code
              </label>
              <div className={`relative group transition-all duration-300 ${isFocused.password ? 'ring-2 ring-gov-success-glow rounded-xl' : ''}`}>
                <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isFocused.password ? 'opacity-20' : ''}`} style={{ background: 'linear-gradient(90deg, transparent, var(--gov-success-glow), transparent)' }}></div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setIsFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setIsFocused(prev => ({ ...prev, password: false }))}
                  className="w-full bg-gov-card/80 border-2 border-gov-border/50 rounded-xl py-4 pl-12 pr-12 text-sm text-white placeholder:text-gov-text-muted/50 focus:outline-none focus:border-gov-success transition-all font-medium relative z-10"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted group-focus-within:text-gov-success transition-colors z-10" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gov-text-muted hover:text-gov-success transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-gov-success rounded"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Options */}
            <motion.div
              className="flex items-center justify-between px-1 pb-2"
              variants={itemVariants}
            >
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="hidden" />
                <div className="h-4 w-4 rounded-md border border-gov-border flex items-center justify-center group-hover:border-gov-success transition-all bg-gov-card">
                  <div className="h-2 w-2 rounded-sm bg-gov-success opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </div>
                <span className="text-[8px] font-black text-gov-text-muted uppercase tracking-widest group-hover:text-gov-text-secondary transition-colors font-display">
                  Remember Device
                </span>
              </label>

              <button
                type="button"
                className="text-[8px] font-black text-gov-success uppercase tracking-widest hover:text-gov-success/80 transition-colors font-display relative group"
              >
                Reset Key
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gov-success transition-all group-hover:w-full"></span>
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] shadow-glow relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-gov-background rounded-xl"
              style={{ background: 'linear-gradient(90deg, var(--gov-primary), var(--gov-primary-dark))' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Login to Portal</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ChevronRight size={16} />
                </motion.span>
              </span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, var(--gov-primary-dark), var(--gov-primary))' }}></div>
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div
            className="mt-8 pt-6 border-t border-gov-border/20 flex justify-center"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gov-surface/50 border border-gov-border/20">
              <div className="w-1.5 h-1.5 rounded-full bg-gov-primary animate-pulse"></div>
              <p className="text-[7px] font-black text-gov-text-muted uppercase tracking-[0.3em]">
                Official Use Only · Protected by NIC Assets
              </p>
            </div>
          </motion.div>

          {/* Quick Access Links */}
          <motion.div
            className="mt-4 flex justify-center gap-4"
            variants={itemVariants}
          >
            <button className="text-[7px] font-bold text-gov-text-muted hover:text-gov-success transition-colors uppercase tracking-widest flex items-center gap-1">
              <Key size={10} />
              Help
            </button>
            <div className="w-px h-3 bg-gov-border"></div>
            <button className="text-[7px] font-bold text-gov-text-muted hover:text-gov-success transition-colors uppercase tracking-widest flex items-center gap-1">
              <Shield size={10} />
              Security
            </button>
            <div className="w-px h-3 bg-gov-border"></div>
            <button className="text-[7px] font-bold text-gov-text-muted hover:text-gov-success transition-colors uppercase tracking-widest flex items-center gap-1">
              <Globe size={10} />
              Status
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
