
import React from 'react';
import {
  LayoutDashboard, FileText, PieChart,
  ShieldCheck, Users, Settings, LogOut,
  BarChart3, Activity, Zap, Database,
  ChevronRight, Lock, Key, ClipboardCheck, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole, Language } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  lang: Language;
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, lang, role }) => {
  const menuItems = [
    {
      cat: 'Executive', items: [
        { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
        { name: 'Impact Analytics', id: 'analytics', icon: BarChart3 },
      ]
    },
    {
      cat: 'Evaluation', items: [
        { name: 'DPR Repository', id: 'dpr-management', icon: FileText },
        { name: 'AI Validation', id: 'evaluation', icon: ShieldCheck },
        { name: 'MDoNER Rules', id: 'guidelines', icon: ClipboardCheck },
      ]
    },
    {
      cat: 'System', items: [
        { name: 'Personnel', id: 'admin', icon: Users, adminOnly: true },
        { name: 'Settings', id: 'settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-72 bg-gov-background border-r border-gov-border/50 h-screen sticky top-0 flex flex-col p-6 z-50">
      <div className="flex-1 space-y-10">
        <div className="px-5 py-6 rounded-2xl bg-gov-surface border border-gov-border/30 relative overflow-hidden text-left">
          <div className="flex items-center space-x-3 mb-3 text-gov-primary">
            <Shield size={16} />
            <span className="text-[9px] font-black uppercase tracking-widest">Official Scrutiny</span>
          </div>
          <p className="text-[8px] font-bold text-gov-text-muted uppercase tracking-widest leading-relaxed">
            SIH-2024 Evaluation Hub <br />
            MDoNER Regional Instance
          </p>
        </div>

        <nav className="space-y-8">
          {menuItems.map((cat, i) => (
            <div key={i} className="space-y-4">
              <h5 className="px-5 text-[9px] font-black text-gov-primary uppercase tracking-[0.3em] opacity-80">{cat.cat}</h5>
              <div className="space-y-1">
                {cat.items.map((item) => {
                  if (item.adminOnly && role !== UserRole.ADMIN) return null;

                  const isActive = currentView === item.id;
                  const isLocked = item.id === 'guidelines' || item.id === 'settings';

                  return (
                    <button
                      key={item.id}
                      onClick={() => !isLocked && setView(item.id)}
                      className={`flex items-center space-x-4 px-5 py-3.5 w-full rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group ${isActive
                        ? 'bg-gov-primary text-white shadow-soft scale-[1.02]'
                        : 'text-gov-text-secondary hover:text-white hover:bg-gov-surface/50'
                        }`}
                    >
                      <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                      <span>{item.name}</span>
                      {isLocked && <Lock size={12} className="ml-auto opacity-30" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-gov-border/30 space-y-4 text-left">
        <div className="px-5 py-3 rounded-xl bg-gov-surface/30 border border-gov-border/20">
          <div className="flex items-center justify-between text-[8px] font-black text-gov-text-muted uppercase tracking-widest">
            <span>System Status</span>
            <span className="text-gov-success">Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
