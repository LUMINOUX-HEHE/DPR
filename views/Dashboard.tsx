
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  ShieldCheck, AlertCircle, Clock, TrendingUp, CheckCircle2,
  FileText, Activity, Zap, Layers, Cpu, Radar, Database, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';

interface DashboardProps {
  lang: Language;
  role?: UserRole;
  onSelectDPR?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, role, onSelectDPR }) => {
  const t = TRANSLATIONS;
  const [dprs, setDprs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDPRs = async () => {
    try {
      const data = await apiService.getAllDPRs();
      setDprs(data);
    } catch (error) {
      console.error('Failed to fetch DPRs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDPRs();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDPRs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalDPRs = dprs.length;
  const completedDPRs = dprs.filter(d => d.status === 'COMPLETED').length;
  const processingDPRs = dprs.filter(d => ['ANALYZING', 'EXTRACTING', 'ExtractingTEXT'].includes(d.status)).length;
  const failedDPRs = dprs.filter(d => d.status === 'FAILED').length;

  const getScore = (dpr: any) => {
    if (dpr.status !== 'COMPLETED' || !dpr.analysisResult) return null;
    try {
      const result = typeof dpr.analysisResult === 'string'
        ? JSON.parse(dpr.analysisResult)
        : dpr.analysisResult;
      return result?.overallScore?.score || null;
    } catch {
      return null;
    }
  };

  const scores = dprs.map(getScore).filter(s => s !== null) as number[];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const highRiskCount = scores.filter(s => s < 50).length;
  const compliantCount = scores.filter(s => s >= 70).length;
  const riskRate = totalDPRs > 0 ? Math.round((highRiskCount / totalDPRs) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Official Oversight Dashboard</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">{t.dashboard[lang]} <span className="text-gov-text-muted font-light">Summary</span></h2>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-gov-surface border border-gov-border text-[9px] font-black text-gov-text-muted uppercase tracking-widest flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-gov-success mr-2 animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total DPRs', val: totalDPRs.toString(), status: completedDPRs > 0 ? 'Active' : 'No Data', color: totalDPRs > 0 ? 'text-gov-primary' : 'text-gov-text-muted', bg: totalDPRs > 0 ? 'bg-gov-primary/5' : 'bg-gov-surface/5' },
          { label: 'Compliant Projects', val: compliantCount.toString(), status: compliantCount > 0 ? 'Validated' : 'None', color: compliantCount > 0 ? 'text-gov-success' : 'text-gov-text-muted', bg: compliantCount > 0 ? 'bg-gov-success/5' : 'bg-gov-surface/5' },
          { label: 'Average Score', val: avgScore > 0 ? `${avgScore}%` : 'N/A', status: avgScore >= 70 ? 'Good' : avgScore >= 50 ? 'Fair' : avgScore > 0 ? 'Low' : 'No Data', color: avgScore >= 70 ? 'text-gov-success' : avgScore >= 50 ? 'text-gov-warning' : avgScore > 0 ? 'text-gov-danger' : 'text-gov-text-muted', bg: avgScore >= 70 ? 'bg-gov-success/5' : avgScore >= 50 ? 'bg-gov-warning/5' : avgScore > 0 ? 'bg-gov-danger/5' : 'bg-gov-surface/5' },
          { label: 'Risk Flag Rate', val: riskRate > 0 ? `${riskRate}%` : '0%', status: riskRate > 20 ? 'High' : riskRate > 0 ? 'Low' : 'None', color: riskRate > 20 ? 'text-gov-danger' : riskRate > 0 ? 'text-gov-warning' : 'text-gov-success', bg: riskRate > 20 ? 'bg-gov-danger/5' : riskRate > 0 ? 'bg-gov-warning/5' : 'bg-gov-success/5' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="p-6 rounded-2xl bg-gov-card border border-gov-border/30 relative overflow-hidden group hover:border-gov-primary/30 transition-all text-left"
          >
            <p className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.2em] mb-3">{stat.label}</p>
            <div className="flex items-baseline space-x-3">
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.val}</h3>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded ${stat.bg} ${stat.color} border border-current opacity-50`}>{stat.status}</span>
            </div>
            <div className="mt-4 h-1 w-full bg-gov-background rounded-full overflow-hidden">
              <div className={`h-full ${stat.color.replace('text-', 'bg-')} opacity-40`} style={{ width: totalDPRs > 0 ? '60%' : '0%' }}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Clock className="text-gov-primary animate-spin mx-auto" size={40} />
            <p className="text-sm text-gov-text-muted font-medium">Loading dashboard data...</p>
          </div>
        </div>
      ) : totalDPRs === 0 ? (
        <div className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto">
              <Database className="text-gov-text-muted" size={32} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white tracking-tighter uppercase font-display">No Data Available</h4>
              <p className="text-sm text-gov-text-muted font-medium max-w-md mx-auto">
                Dashboard analytics will appear once DPRs are uploaded and processed through the AI Evaluation Unit.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden">
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1 text-left">
              <p className="text-[9px] font-black text-gov-primary uppercase tracking-[0.4em]">Recent Evaluations</p>
              <h4 className="text-xl font-black text-white tracking-tighter uppercase font-display">Latest <span className="text-gov-text-muted font-light">Submissions</span></h4>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dprs.slice(0, 6).map((dpr, i) => {
              const score = getScore(dpr);
              return (
                <div key={i} className="p-6 rounded-2xl bg-gov-card border border-gov-border/40 group hover:border-gov-primary/30 transition-all flex flex-col justify-between h-36">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left flex-1 mr-2">
                      <span className="text-[8px] font-black text-gov-text-muted uppercase tracking-widest">{dpr.jobId?.substring(0, 8)}</span>
                      <h5 className="text-[11px] font-black text-white uppercase leading-tight line-clamp-2">{dpr.filename}</h5>
                    </div>
                    {score !== null && (
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${score >= 70 ? 'text-gov-success' : score >= 50 ? 'text-gov-warning' : 'text-gov-danger'} border-current opacity-70`}>
                        {score}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gov-border/10">
                    <span className="text-[9px] font-medium text-gov-text-muted uppercase tracking-widest">{dpr.status}</span>
                    {dpr.status === 'COMPLETED' && (
                      <button
                        onClick={() => onSelectDPR?.(dpr.jobId)}
                        className="text-[9px] font-black text-gov-primary hover:text-white transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
