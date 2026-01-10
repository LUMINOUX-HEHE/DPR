
import React from 'react';
import {
  Users, Shield, Key, History,
  Settings, Lock, Globe, Server,
  AlertTriangle, Database, Activity,
  Download, Eye, Trash2, Edit3, UserPlus,
  ShieldAlert, Fingerprint, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AdminPanelProps {
  lang: Language;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang }) => {
  const t = TRANSLATIONS;

  const logs = [
    { user: 'NIC_OFFICER_3', action: 'DPR_VERIFICATION', target: 'DPR-402', time: '10m ago', status: 'Success' },
    { user: 'SYS_ADMIN', action: 'ROLE_UPDATE', target: 'NIC_OFFICER_7', time: '2h ago', status: 'Warning' },
    { user: 'NIC_OFFICER_2', action: 'BATCH_EXPORT', target: 'ASSAM_PROJECTS', time: '5h ago', status: 'Success' },
    { user: 'SECURITY_SRV', action: 'AUDIT_GEN', target: 'MONTHLY_FISCAL', time: '1d ago', status: 'Success' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Administrative Control Center</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">{t.admin_panel[lang]} <span className="text-gov-text-muted font-light">Management</span></h2>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-3 px-6 py-2.5 rounded-xl bg-gov-primary text-white text-[10px] font-black uppercase tracking-widest shadow-glow">
            <UserPlus size={16} />
            <span>Authorize Personnel</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-xl">
            <div className="px-10 py-6 border-b border-gov-border/20 flex justify-between items-center bg-gov-surface/20">
              <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Active Authorized Personnel</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gov-surface/30">
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Official ID</th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Department</th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Access Level</th>
                    <th className="px-10 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border/10">
                  {[
                    { id: 'NIC_OFF_082', dept: 'NIC Assam HQ', role: 'Evaluator' },
                    { id: 'AS_GOV_SECR', dept: 'PWD Assam', role: 'Submitter' },
                    { id: 'MDONER_RE_01', dept: 'Evaluation Unit', role: 'Admin' },
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-gov-surface/20 transition-all group">
                      <td className="px-10 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-lg bg-gov-primary/10 text-gov-primary flex items-center justify-center font-black text-[10px]">{p.id.substring(0, 2)}</div>
                          <span className="text-[10px] font-black text-white tracking-widest uppercase">{p.id}</span>
                        </div>
                      </td>
                      <td className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">{p.dept}</td>
                      <td className="px-10 py-5">
                        <span className="text-[8px] font-black px-2 py-0.5 rounded bg-gov-surface border border-gov-border text-gov-primary uppercase">{p.role}</span>
                      </td>
                      <td className="px-10 py-5 text-right">
                        <div className="flex items-center justify-end space-x-4">
                          <button className="text-gov-text-muted hover:text-white transition-all"><Edit3 size={14} /></button>
                          <button className="text-gov-danger/50 hover:text-gov-danger transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-gov-surface/30 border border-gov-border/30 space-y-8">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">System Architecture Health</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gov-success animate-pulse"></div>
                <span className="text-[9px] font-black text-gov-success uppercase tracking-widest">Operational</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Database Sync', status: 'Stable', icon: Database },
                { label: 'Local Processing', status: 'Optimized', icon: Cpu },
                { label: 'Network Latency', status: '12ms', icon: Activity },
                { label: 'Security layer', status: 'Active', icon: Shield },
              ].map((s, i) => (
                <div key={i} className="p-5 rounded-2xl bg-gov-card border border-gov-border/20 flex items-center space-x-5">
                  <div className="p-3 rounded-xl bg-gov-surface text-gov-primary"><s.icon size={18} /></div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{s.label}</p>
                    <p className="text-[8px] font-bold text-gov-text-muted uppercase tracking-widest">{s.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-gov-card border border-gov-border/30 space-y-8 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center">
              <History size={16} className="mr-3 text-gov-primary" />
              Audit Logs
            </h4>
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="p-4 rounded-xl bg-gov-surface/50 border border-gov-border/30 hover:bg-gov-surface transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-gov-primary uppercase tracking-widest">{log.user}</span>
                    <span className="text-[8px] font-medium text-gov-text-muted">{log.time}</span>
                  </div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-2">{log.action}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black text-gov-text-muted uppercase">Target: {log.target}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${log.status === 'Success' ? 'text-gov-success' : 'text-gov-warning'}`}>{log.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-xl border border-gov-border text-gov-text-muted hover:text-white text-[9px] font-black uppercase tracking-[0.3em] transition-all">Download Audit Archive</button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gov-danger/5 border border-gov-danger/20 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gov-danger/10 text-gov-danger flex items-center justify-center shadow-glow-danger"><ShieldAlert size={18} /></div>
              <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Protocol Override</h5>
            </div>
            <p className="text-[9px] text-gov-text-secondary font-medium leading-relaxed uppercase italic opacity-70 tracking-widest text-left">
              "Direct interventions and record purging require secondary supervisor key authorization."
            </p>
            <button className="w-full py-3 rounded-lg bg-gov-danger text-white text-[9px] font-black uppercase tracking-widest shadow-glow-danger">Initiate Override</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
