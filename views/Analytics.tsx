
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  TrendingUp, Activity, Globe, Zap,
  Map, Shield, AlertTriangle, Cpu,
  Database, Target, ArrowUpRight, BarChart3,
  Globe2, FileSearch, GraduationCap, MapPin,
  Clock, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AnalyticsProps {
  lang: Language;
}

const Analytics: React.FC<AnalyticsProps> = ({ lang }) => {
  const t = TRANSLATIONS;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Regional Impact Evaluation</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">{t.analytics[lang]} <span className="text-gov-text-muted font-light">Unit</span></h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="px-5 py-2.5 rounded-xl bg-gov-surface border border-gov-border text-[9px] font-black text-gov-text-muted uppercase tracking-widest flex items-center">
            <MapPin size={14} className="mr-3 text-gov-primary" />
            NER Grid Node Active
          </div>
        </div>
      </div>

      <div className="p-12 rounded-[3rem] bg-gov-card border border-gov-border/30 shadow-xl overflow-hidden relative min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto">
            <BarChart3 className="text-gov-text-muted" size={40} />
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-white tracking-tighter uppercase font-display">Analytics Awaiting Data</h4>
            <p className="text-sm text-gov-text-muted font-medium max-w-lg mx-auto leading-relaxed">
              Regional analytics, state-wise distribution charts, and performance metrics will be generated once DPRs are processed through the AI Evaluation Unit.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'State Distribution', icon: MapPin },
              { label: 'Risk Analysis', icon: ShieldAlert },
              { label: 'Performance Trends', icon: TrendingUp },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-gov-surface/30 border border-gov-border/20 text-left">
                <div className="w-8 h-8 rounded-lg bg-gov-primary/5 text-gov-primary flex items-center justify-center mb-3">
                  <item.icon size={16} />
                </div>
                <p className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest">{item.label}</p>
                <p className="text-xs text-gov-text-muted/60 mt-1">Pending</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
