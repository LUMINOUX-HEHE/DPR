
import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';
import {
  ShieldCheck, AlertCircle, Clock, TrendingUp, CheckCircle2,
  FileText, Activity, Zap, Layers, Cpu, Radar, Database, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Minus, Award, Target, TrendingDown, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';

interface DashboardProps {
  lang: Language;
  role?: UserRole;
  onSelectDPR?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ lang, role, onSelectDPR }) => {
  console.log('Dashboard rendering with props:', { lang, role, onSelectDPR });
  const t = TRANSLATIONS;
  const [dprs, setDprs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchDPRs = async () => {
    try {
      console.log('Fetching DPRs from API...');
      setConnectionError(null);
      const data = await apiService.getAllDPRs();
      console.log('DPRs received:', data);
      setDprs(data);
      setConnectionError(null);
    } catch (error) {
      console.error('Failed to fetch DPRs:', error);
      // Don't re-throw to prevent ErrorBoundary from triggering
      // Instead, set empty state and show error message in UI
      setDprs([]);
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDPRs().catch(err => {
      console.error('Dashboard useEffect error:', err);
    });
    const interval = setInterval(() => {
      fetchDPRs().catch(err => {
        console.error('Dashboard interval error:', err);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics with trend analysis
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
  const mediumRiskCount = scores.filter(s => s >= 50 && s < 70).length;
  const riskRate = totalDPRs > 0 ? Math.round((highRiskCount / totalDPRs) * 100) : 0;

  // Calculate trends (mock data for demo)
  const trendData = [
    { name: 'Mon', value: 45, change: 5 },
    { name: 'Tue', value: 52, change: 7 },
    { name: 'Wed', value: 48, change: -4 },
    { name: 'Thu', value: 65, change: 17 },
    { name: 'Fri', value: 72, change: 7 },
    { name: 'Sat', value: 68, change: -4 },
    { name: 'Sun', value: 75, change: 7 }
  ];

  // Risk distribution data
  const riskData = [
    { name: 'High', value: highRiskCount, color: 'var(--gov-danger)' },
    { name: 'Medium', value: mediumRiskCount, color: 'var(--gov-warning)' },
    { name: 'Low', value: compliantCount, color: 'var(--gov-success)' }
  ];

  // Score distribution
  const scoreDistribution = scores.length > 0 ? [
    { range: '0-49', count: scores.filter(s => s < 50).length },
    { range: '50-69', count: scores.filter(s => s >= 50 && s < 70).length },
    { range: '70-89', count: scores.filter(s => s >= 70 && s < 90).length },
    { range: '90-100', count: scores.filter(s => s >= 90).length }
  ] : [];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gov-card border border-gov-border/30 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-black text-gov-text-secondary uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-white">{payload[0].value}{payload[0].name === 'Score' ? '%' : ''}</p>
        </div>
      );
    }
    return null;
  };

  // Stat Card Component
  const StatCard = ({ label, value, status, color, bg, delay = 0, trend, icon: Icon }: any) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className="p-6 rounded-2xl bg-gov-card border border-gov-border/30 relative overflow-hidden group hover:border-gov-primary/30 transition-all text-left cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[9px] font-black text-gov-text-muted uppercase tracking-[0.2em]">{label}</p>
        {Icon && <Icon size={14} className={`${color.replace('text-', 'text-')} opacity-60`} />}
      </div>

      <div className="flex items-baseline space-x-3 mb-2">
        <h3 className="text-3xl font-black text-white tracking-tighter">{value}</h3>
        {status && (
          <span className={`text-[8px] font-black px-2 py-0.5 rounded ${bg} ${color} border border-current opacity-70`}>
            {status}
          </span>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center space-x-1 text-[10px] font-bold">
          {trend > 0 ? (
            <ArrowUpRight size={12} className="text-gov-success" />
          ) : trend < 0 ? (
            <ArrowDownRight size={12} className="text-gov-danger" />
          ) : (
            <Minus size={12} className="text-gov-text-muted" />
          )}
          <span className={trend > 0 ? 'text-gov-success' : trend < 0 ? 'text-gov-danger' : 'text-gov-text-muted'}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-4 h-1 w-full bg-gov-background rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color.replace('text-', 'bg-')} opacity-40`}
          initial={{ width: 0 }}
          animate={{ width: totalDPRs > 0 ? '60%' : '0%' }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gov-primary/0 via-gov-primary/5 to-gov-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-8 animate-in fade-in duration-500"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">
            Official Oversight Dashboard
          </p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">
            {t.dashboard[lang]} <span className="text-gov-text-muted font-light">Summary</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <motion.div
            className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${connectionError ? 'bg-gov-danger/10 border-gov-danger text-gov-danger' : 'bg-gov-surface border-gov-border text-gov-text-muted'}`}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${connectionError ? 'bg-gov-danger' : 'bg-gov-success'} animate-pulse`}></div>
            {connectionError ? 'Connection Error' : 'System Online'}
          </motion.div>

          <motion.button
            onClick={() => {
              setRefreshKey(prev => prev + 1);
              fetchDPRs();
            }}
            className="px-4 py-2 rounded-xl bg-gov-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-gov-primary-dark transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Activity size={14} className="animate-spin" />
            Refresh
          </motion.button>
        </div>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gov-danger/10 border border-gov-danger/30 rounded-xl p-4 flex items-center gap-3 backdrop-blur-sm"
        >
          <AlertCircle size={16} className="text-gov-danger flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-gov-danger">Connection Issue</p>
            <p className="text-[10px] text-gov-text-muted font-medium">{connectionError}</p>
            <p className="text-[9px] text-gov-text-muted mt-1">Please ensure the backend server is running on port 8081.</p>
          </div>
          <motion.button
            onClick={fetchDPRs}
            className="px-3 py-1.5 rounded-lg bg-gov-danger text-white text-[8px] font-black uppercase tracking-widest hover:bg-gov-danger-dark transition-all"
            whileHover={{ scale: 1.05 }}
          >
            Retry
          </motion.button>
        </motion.div>
      )}

      {/* Enhanced Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <StatCard
          label="Total DPRs"
          value={totalDPRs}
          status={completedDPRs > 0 ? 'Active' : 'No Data'}
          color={totalDPRs > 0 ? 'text-gov-primary' : 'text-gov-text-muted'}
          bg={totalDPRs > 0 ? 'bg-gov-primary/5' : 'bg-gov-surface/5'}
          delay={0}
          trend={12}
          icon={FileText}
        />

        <StatCard
          label="Compliant Projects"
          value={compliantCount}
          status={compliantCount > 0 ? 'Validated' : 'None'}
          color={compliantCount > 0 ? 'text-gov-success' : 'text-gov-text-muted'}
          bg={compliantCount > 0 ? 'bg-gov-success/5' : 'bg-gov-surface/5'}
          delay={0.1}
          trend={8}
          icon={ShieldCheck}
        />

        <StatCard
          label="Average Score"
          value={avgScore > 0 ? `${avgScore}%` : 'N/A'}
          status={avgScore >= 70 ? 'Good' : avgScore >= 50 ? 'Fair' : avgScore > 0 ? 'Low' : 'No Data'}
          color={avgScore >= 70 ? 'text-gov-success' : avgScore >= 50 ? 'text-gov-warning' : avgScore > 0 ? 'text-gov-danger' : 'text-gov-text-muted'}
          bg={avgScore >= 70 ? 'bg-gov-success/5' : avgScore >= 50 ? 'bg-gov-warning/5' : avgScore > 0 ? 'bg-gov-danger/5' : 'bg-gov-surface/5'}
          delay={0.2}
          trend={avgScore > 0 ? 5 : 0}
          icon={Award}
        />

        <StatCard
          label="Risk Flag Rate"
          value={riskRate > 0 ? `${riskRate}%` : '0%'}
          status={riskRate > 20 ? 'High' : riskRate > 0 ? 'Low' : 'None'}
          color={riskRate > 20 ? 'text-gov-danger' : riskRate > 0 ? 'text-gov-warning' : 'text-gov-success'}
          bg={riskRate > 20 ? 'bg-gov-danger/5' : riskRate > 0 ? 'bg-gov-warning/5' : 'bg-gov-success/5'}
          delay={0.3}
          trend={riskRate > 0 ? -3 : 0}
          icon={AlertTriangle}
        />
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <motion.div
          className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden min-h-[400px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ShieldCheck className="text-gov-primary mx-auto" size={40} />
            </motion.div>
            <p className="text-sm text-gov-text-muted font-medium">Loading dashboard data...</p>
            <div className="w-48 h-1 bg-gov-surface rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gov-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      ) : connectionError ? (
        <motion.div
          className="p-8 rounded-[3rem] bg-gov-danger/10 border border-gov-danger/30 relative overflow-hidden min-h-[400px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center space-y-6 max-w-md">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gov-danger/20 border border-gov-danger/50 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <AlertCircle className="text-gov-danger" size={32} />
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-gov-danger tracking-tighter uppercase font-display">
                Connection Failed
              </h4>
              <p className="text-sm text-gov-text-muted font-medium">
                Unable to connect to the backend server. Please ensure the server is running on port 8081.
              </p>
              <p className="text-xs text-gov-text-muted font-medium">
                Error: {connectionError}
              </p>
            </div>
            <motion.button
              onClick={fetchDPRs}
              className="mt-4 bg-gov-danger text-white px-6 py-3 rounded-xl shadow-glow hover:bg-gov-danger-dark transition-all text-xs font-black uppercase tracking-widest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry Connection
            </motion.button>
          </div>
        </motion.div>
      ) : totalDPRs === 0 ? (
        <motion.div
          className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden min-h-[400px] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center space-y-6">
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Database className="text-gov-text-muted" size={32} />
            </motion.div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-gov-primary tracking-tighter uppercase font-display">
                No Data Available
              </h4>
              <p className="text-sm text-gov-text-muted font-medium max-w-md mx-auto">
                Dashboard analytics will appear once DPRs are uploaded and processed through the AI Evaluation Unit.
              </p>
            </div>
            <motion.button
              onClick={() => onSelectDPR?.('upload')}
              className="mt-6 bg-gov-primary text-white px-6 py-3 rounded-xl shadow-glow hover:bg-gov-primaryDeep transition-all text-xs font-black uppercase tracking-widest"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload First DPR
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Data Visualization Section */}
          <motion.div
            className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-1 text-left">
                <p className="text-[9px] font-black text-gov-primary uppercase tracking-[0.4em]">
                  Performance Analytics
                </p>
                <h4 className="text-xl font-black text-white tracking-tighter uppercase font-display">
                  Score <span className="text-gov-text-muted font-light">Distribution</span>
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-[8px] font-bold text-gov-text-muted">
                  <div className="w-2 h-2 rounded-full bg-gov-success"></div>
                  <span>70-100</span>
                </div>
                <div className="flex items-center space-x-2 text-[8px] font-bold text-gov-text-muted">
                  <div className="w-2 h-2 rounded-full bg-gov-warning"></div>
                  <span>50-69</span>
                </div>
                <div className="flex items-center space-x-2 text-[8px] font-bold text-gov-text-muted">
                  <div className="w-2 h-2 rounded-full bg-gov-danger"></div>
                  <span>0-49</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart */}
              <div className="bg-gov-card rounded-2xl p-6 border border-gov-border/20">
                <h5 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-4">
                  Score Distribution
                </h5>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="range"
                      tick={{ fill: 'var(--gov-text-muted)', fontSize: 10, fontWeight: 'bold' }}
                      axisLine={{ stroke: 'var(--gov-border)' }}
                    />
                    <YAxis
                      tick={{ fill: 'var(--gov-text-muted)', fontSize: 10, fontWeight: 'bold' }}
                      axisLine={{ stroke: 'var(--gov-border)' }}
                      width={25}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      radius={[8, 8, 0, 0]}
                      className="fill-gov-primary"
                    >
                      {scoreDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? 'var(--gov-danger)' : index === 1 ? 'var(--gov-warning)' : index === 2 ? 'var(--gov-success)' : 'var(--gov-primary)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution Pie Chart */}
              <div className="bg-gov-card rounded-2xl p-6 border border-gov-border/20">
                <h5 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-4">
                  Risk Distribution
                </h5>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {riskData.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-lg font-black text-white">{item.value}</div>
                      <div className="text-[8px] font-bold text-gov-text-muted uppercase">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Submissions */}
          <motion.div
            className="p-8 rounded-[3rem] bg-gov-surface/30 border border-gov-border/30 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between items-end mb-8">
              <div className="space-y-1 text-left">
                <p className="text-[9px] font-black text-gov-primary uppercase tracking-[0.4em]">
                  Recent Evaluations
                </p>
                <h4 className="text-xl font-black text-white tracking-tighter uppercase font-display">
                  Latest <span className="text-gov-text-muted font-light">Submissions</span>
                </h4>
              </div>
              <div className="flex items-center space-x-2 text-[8px] font-bold text-gov-text-muted">
                <span className="px-2 py-1 rounded bg-gov-surface border border-gov-border">
                  {dprs.length} Total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dprs.slice(0, 6).map((dpr, i) => {
                const score = getScore(dpr);
                const scoreColor = score !== null
                  ? score >= 70 ? 'text-gov-success' : score >= 50 ? 'text-gov-warning' : 'text-gov-danger'
                  : 'text-gov-text-muted';

                const scoreBg = score !== null
                  ? score >= 70 ? 'bg-gov-success/10' : score >= 50 ? 'bg-gov-warning/10' : 'bg-gov-danger/10'
                  : 'bg-gov-surface/5';

                return (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl bg-gov-card border border-gov-border/40 group hover:border-gov-primary/30 transition-all flex flex-col justify-between h-36 relative overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dpr.status === 'COMPLETED' && onSelectDPR?.(dpr.jobId)}
                  >
                    {/* Background accent on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gov-primary/0 via-gov-primary/5 to-gov-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1 text-left flex-1 mr-2">
                        <span className="text-[8px] font-black text-gov-text-muted uppercase tracking-widest">
                          {dpr.jobId?.substring(0, 8)}
                        </span>
                        <h5 className="text-[11px] font-black text-white uppercase leading-tight line-clamp-2 group-hover:text-gov-primary transition-colors">
                          {dpr.filename}
                        </h5>
                      </div>
                      {score !== null && (
                        <motion.div
                          className={`text-[8px] font-black px-2 py-0.5 rounded border ${scoreColor} border-current opacity-70 ${scoreBg}`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {score}%
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gov-border/10 relative z-10">
                      <div className="flex items-center gap-2">
                        {dpr.status === 'COMPLETED' && (
                          <CheckCircle2 size={12} className="text-gov-success" />
                        )}
                        {dpr.status === 'FAILED' && (
                          <AlertCircle size={12} className="text-gov-danger" />
                        )}
                        {['ANALYZING', 'EXTRACTING', 'ExtractingTEXT'].includes(dpr.status) && (
                          <Activity size={12} className="text-gov-warning animate-spin" />
                        )}
                        <span className="text-[9px] font-medium text-gov-text-muted uppercase tracking-widest">
                          {dpr.status}
                        </span>
                      </div>

                      {dpr.status === 'COMPLETED' && (
                        <motion.button
                          className="text-[9px] font-black text-gov-primary hover:text-white transition-colors flex items-center gap-1"
                          whileHover={{ x: 2 }}
                        >
                          View
                          <ArrowUpRight size={12} />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* System Health & Quick Actions */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* System Health */}
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-gov-card border border-gov-border/30">
              <h5 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                <Cpu size={14} className="text-gov-primary" />
                System Health
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Database', status: 'Stable', icon: Database, color: 'text-gov-success' },
                  { label: 'Processing', status: 'Optimized', icon: Cpu, color: 'text-gov-primary' },
                  { label: 'Network', status: '12ms', icon: Activity, color: 'text-gov-success' },
                  { label: 'Security', status: 'Active', icon: Shield, color: 'text-gov-success' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-gov-surface border border-gov-border/20 text-center hover:border-gov-primary/30 transition-all"
                    whileHover={{ scale: 1.05, y: -2 }}
                    variants={pulseVariants}
                    animate="pulse"
                  >
                    <item.icon size={18} className={`mx-auto mb-2 ${item.color}`} />
                    <div className="text-[9px] font-black text-white uppercase tracking-widest mb-1">
                      {item.label}
                    </div>
                    <div className="text-[8px] font-bold text-gov-text-muted uppercase">
                      {item.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-gov-primary/10 via-gov-surface/50 to-gov-surface border border-gov-border/30">
              <h5 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-4">
                Quick Actions
              </h5>
              <div className="space-y-3">
                <motion.button
                  onClick={() => onSelectDPR?.('upload')}
                  className="w-full py-3 rounded-xl bg-gov-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-gov-primary-dark transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Zap size={14} />
                  Upload DPR
                </motion.button>
                <motion.button
                  className="w-full py-3 rounded-xl bg-gov-surface border border-gov-border text-gov-text-muted text-[9px] font-black uppercase tracking-widest hover:bg-gov-card hover:text-white transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText size={14} />
                  View Reports
                </motion.button>
                <motion.button
                  className="w-full py-3 rounded-xl bg-gov-surface border border-gov-border text-gov-text-muted text-[9px] font-black uppercase tracking-widest hover:bg-gov-card hover:text-white transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target size={14} />
                  Analytics
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
