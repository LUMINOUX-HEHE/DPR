
import React from 'react';
import {
  Bell, Search, User as UserIcon, LogOut,
  Settings, HelpCircle, Shield,
  ChevronDown, Cpu, Globe, FileSearch
} from 'lucide-react';
import { motion } from 'framer-motion';
import { User, Language } from '../types';

interface HeaderProps {
  user: User;
  lang: Language;
  setLang: (lang: Language) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, lang, setLang, onLogout }) => {
  return (
    <header className="h-20 bg-gov-surface border-b border-gov-border/50 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center space-x-10 flex-1">
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="h-10 w-10 rounded-xl bg-gov-primary text-white flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileSearch size={22} />
          </div>
          <div>
            <p className="text-[8px] font-black text-gov-primary uppercase tracking-[0.4em] leading-none mb-1">Regional_Unit_HQ</p>
            <h1 className="text-lg font-black tracking-tighter text-white leading-tight uppercase font-display">Prasthav-<span className="text-gov-text-muted font-light">AI</span></h1>
          </div>
        </div>

        <div className="relative max-w-sm w-full hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted" size={14} />
          <input
            type="text"
            placeholder="Search by DPR ID or Name..."
            className="w-full bg-gov-background/50 border border-gov-border/50 rounded-xl py-2 pl-12 pr-4 text-[10px] font-black text-white placeholder:text-gov-text-muted focus:outline-none focus:border-gov-primary transition-all uppercase tracking-widest"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden xl:flex items-center space-x-4 px-6 border-r border-gov-border/50">
          <div className="flex items-center space-x-2">
            {['EN', 'HI', 'AS'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l as Language)}
                className={`text-[9px] font-black px-3 py-1.5 rounded-lg border transition-all ${lang === l ? 'bg-gov-primary border-gov-primary text-white' : 'border-gov-border text-gov-text-muted hover:text-white'}`}
              >
                {l === 'EN' ? 'ENGLISH' : l === 'HI' ? 'हिंदी' : 'অসমীয়া'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2.5 rounded-xl bg-gov-background border border-gov-border text-gov-text-muted hover:text-white transition-all">
            <Bell size={18} />
          </button>

          <div className="flex items-center space-x-4 pl-4 group relative">
            <div className="text-right hidden sm:block leading-none">
              <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{user.id}</p>
              <p className="text-[8px] font-medium text-gov-text-muted uppercase tracking-widest">Official Access</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gov-primary p-0.5 shadow-glow group-hover:scale-105 transition-transform cursor-pointer">
              <div className="h-full w-full rounded-[8px] bg-gov-surface flex items-center justify-center text-white font-black text-xs">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="absolute -bottom-12 right-0 bg-gov-card border border-gov-border p-3 rounded-xl text-gov-danger opacity-0 group-hover:opacity-100 transition-all hover:bg-gov-danger/5 flex items-center space-x-3 whitespace-nowrap shadow-xl"
            >
              <LogOut size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
