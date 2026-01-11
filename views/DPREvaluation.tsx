
import React, { useState, useEffect } from 'react';
import {
  FileText, ShieldCheck, AlertTriangle, CheckCircle2,
  Search, HardDrive, Map, Database, Activity,
  ChevronRight, ArrowLeft, Info, FileSearch,
  AlertCircle, BarChart, ShieldAlert, BadgeCheck,
  ClipboardList, Scale, Clock, TrendingUp, Target,
  Award, Shield, Cpu, Zap, CheckSquare, XSquare,
  PieChart, LineChart, Gauge, AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';

interface DPREvaluationProps {
  id: string | null;
  lang: Language;
}

const DPREvaluation: React.FC<DPREvaluationProps> = ({ id, lang }) => {
  const [activeSection, setActiveSection] = useState('structure');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lifecycleStatus, setLifecycleStatus] = useState<string>('NOT_STARTED');
  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const t = TRANSLATIONS;

  // Poll for status when ID changes
  React.useEffect(() => {
    if (!id) {
      setLifecycleStatus('NOT_STARTED');
      setEvaluationData(null);
      setIsProcessing(false);
      setProgress(0);
      return;
    }

    let pollInterval: NodeJS.Timeout;
    setIsProcessing(true);
    // Reset state for new ID
    setEvaluationData(null);
    setLifecycleStatus('NOT_STARTED');
    setProgress(0);

    const checkStatus = async () => {
      try {
        const statusData = await apiService.pollStatus(id);

        const currentLifecycle = statusData.lifecycleStatus || 'NOT_STARTED';
        setLifecycleStatus(currentLifecycle);

        // Update progress based on lifecycle status
        let newProgress = 0;
        switch (currentLifecycle) {
          case 'NOT_STARTED': newProgress = 0; break;
          case 'QUEUED': newProgress = 20; break;
          case 'EXTRACTING': newProgress = 40; break;
          case 'ANALYZING': newProgress = 60; break;
          case 'COMPLETED': newProgress = 100; break;
          case 'FAILED': newProgress = 100; break;
          default: newProgress = 30;
        }
        setProgress(newProgress);

        if (currentLifecycle === 'COMPLETED' && statusData.result) {
          const parsedResult = typeof statusData.result === 'string'
            ? JSON.parse(statusData.result)
            : statusData.result;

          setEvaluationData(parsedResult);
          setIsProcessing(false);
          clearInterval(pollInterval);
        } else if (currentLifecycle === 'FAILED') {
          setIsProcessing(false);
          clearInterval(pollInterval);
          alert('Analysis Failed: ' + (statusData.error || 'Unknown error'));
        } else if (currentLifecycle === 'IN_PROGRESS' || currentLifecycle === 'ANALYZING' || currentLifecycle === 'EXTRACTING') {
          setIsProcessing(true);
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    // Initial check
    checkStatus();
    // Poll every 3 seconds
    pollInterval = setInterval(checkStatus, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [id]);

  // Derived state for UI
  const finalScore = evaluationData?.overallScore?.score || 0;
  const riskLevel = evaluationData?.overallScore?.riskLevel || 'UNKNOWN';
  const extractionConfidence = evaluationData?.overallScore?.extractionConfidence || 'UNKNOWN';

  // Transform backend sections to UI format
  const transformSection = (name: string) => {
    const sections = evaluationData?.documentAnalysis?.sections || [];
    const sec = sections.find((s: any) => s.section === name);

    // Support both legacy (presence/gaps) and new (status/reason/summary) fields
    const presenceValue = sec?.presence || sec?.status || 'ABSENT';
    const isPresent = !['ABSENT', 'MISSING', 'NOT EXPLICITLY DOCUMENTED'].includes(presenceValue.toUpperCase());

    return {
      score: sec?.score || 0,
      presence: presenceValue,
      status: isPresent ? 'Analyzed' : 'Pending',
      flag: sec?.summary || sec?.reason || sec?.qualityAssessment?.weaknesses?.[0] || sec?.gaps?.[0] || null,
      details: sec?.details || sec?.qualityAssessment || null
    };
  };

  const structureItems = [
    { label: 'Executive Summary', ...transformSection('EXECUTIVE_SUMMARY'), icon: FileText },
    { label: 'Technical Specs', ...transformSection('TECHNICAL_SPECS'), icon: Cpu },
    { label: 'Financials', ...transformSection('FINANCIALS'), icon: BarChart },
    { label: 'Risks', ...transformSection('RISKS'), icon: AlertTriangle },
    { label: 'Timeline', ...transformSection('TIMELINE'), icon: Clock },
  ];

  // Risk assessment data
  const riskFactors = evaluationData?.riskAssessment?.riskFactors || [];
  const complianceObservations = evaluationData?.riskAssessment?.complianceObservations || [];

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${progress}%`,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  // Score color utility
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-gov-success';
    if (score >= 50) return 'text-gov-warning';
    return 'text-gov-danger';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-gov-success/10';
    if (score >= 50) return 'bg-gov-warning/10';
    return 'bg-gov-danger/10';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-gov-success';
      case 'MEDIUM': return 'text-gov-warning';
      case 'HIGH': return 'text-gov-danger';
      default: return 'text-gov-text-muted';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'HIGH': return 'text-gov-success';
      case 'MEDIUM': return 'text-gov-warning';
      case 'LOW': return 'text-gov-danger';
      default: return 'text-gov-text-muted';
    }
  };

  // Section Progress Indicator
  const SectionProgress = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest">
          Processing Progress
        </span>
        <span className="text-xs font-bold text-white">{progress}%</span>
      </div>
      <div className="h-2 bg-gov-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full"
          style={{ background: 'linear-gradient(90deg, var(--gov-primary), var(--gov-primary-light))' }}
          variants={progressVariants}
          initial="hidden"
          animate="visible"
        />
      </div>
      <div className="flex items-center gap-2 text-[9px] font-bold text-gov-text-muted">
        <Activity size={12} className="animate-pulse" />
        <span>
          {lifecycleStatus === 'NOT_STARTED' && 'Awaiting Queue'}
          {lifecycleStatus === 'QUEUED' && 'Queued for Processing'}
          {lifecycleStatus === 'EXTRACTING' && 'Extracting Text'}
          {lifecycleStatus === 'ANALYZING' && 'AI Analysis in Progress'}
          {lifecycleStatus === 'COMPLETED' && 'Analysis Complete'}
          {lifecycleStatus === 'FAILED' && 'Analysis Failed'}
        </span>
      </div>
    </div>
  );

  return (
    <motion.div
      className="space-y-8 animate-in fade-in duration-500"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start gap-6"
        variants={itemVariants}
      >
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">
            Official Case Scrutiny
          </p>
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-black text-gov-primary tracking-tighter uppercase font-display">
              {t.evaluation[lang]} <span className="text-gov-text-muted font-light">Unit</span>
            </h2>
            <div className="px-3 py-1 rounded-lg bg-gov-surface border border-gov-border flex items-center space-x-2">
              <span className="text-[9px] font-black text-gov-text-muted uppercase">
                {id ? `JOB-${id.substring(0, 8)}` : 'NO-JOB'}
              </span>
            </div>
          </div>
        </div>

        {id && (
          <motion.button
            className="px-4 py-2 rounded-xl bg-gov-surface border border-gov-border text-gov-text-muted hover:text-white hover:bg-gov-surface/70 transition-all flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </motion.button>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Summary & Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overall Score Card */}
          <motion.div
            className="p-6 rounded-2xl bg-gov-card border border-gov-border/30 text-center"
            variants={itemVariants}
          >
            <h4 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-3">
              Overall Score
            </h4>

            {lifecycleStatus === 'COMPLETED' ? (
              <motion.div
                className="space-y-3"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="text-5xl font-black text-white tracking-tighter">
                  {finalScore}<span className="text-2xl text-gov-text-muted">/100</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${getScoreBg(finalScore)} ${getScoreColor(finalScore)} border border-current`}>
                    RISK: {riskLevel}
                  </span>
                  {extractionConfidence && (
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${extractionConfidence === 'HIGH' ? 'bg-gov-success/10 text-gov-success' : extractionConfidence === 'MEDIUM' ? 'bg-gov-warning/10 text-gov-warning' : 'bg-gov-danger/10 text-gov-danger'} border border-current`}>
                      TRUST: {extractionConfidence}
                    </span>
                  )}
                </div>

                {/* Score Visualization */}
                <div className="pt-3 border-t border-gov-border/20">
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-bold">
                    <div>
                      <div className="text-gov-success">{evaluationData?.overallScore?.complianceScore || 0}%</div>
                      <div className="text-gov-text-muted uppercase">Compliance</div>
                    </div>
                    <div>
                      <div className="text-gov-warning">{evaluationData?.overallScore?.completenessScore || 0}%</div>
                      <div className="text-gov-text-muted uppercase">Complete</div>
                    </div>
                    <div>
                      <div className="text-gov-primary">{evaluationData?.overallScore?.qualityScore || 0}%</div>
                      <div className="text-gov-text-muted uppercase">Quality</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : lifecycleStatus === 'IN_PROGRESS' || lifecycleStatus === 'ANALYZING' || lifecycleStatus === 'EXTRACTING' ? (
              <div className="py-8 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <ShieldCheck size={48} className="text-gov-primary mx-auto" />
                </motion.div>
                <div className="text-sm font-bold text-gov-text-muted">Analysis in Progress</div>
                <SectionProgress />
              </div>
            ) : lifecycleStatus === 'FAILED' ? (
              <div className="py-8 space-y-3">
                <AlertOctagon size={48} className="text-gov-danger mx-auto" />
                <div className="text-sm font-bold text-gov-danger">Analysis Failed</div>
                <p className="text-xs text-gov-text-muted">Please check the job status or try again.</p>
              </div>
            ) : (
              <div className="py-8 space-y-3">
                <FileSearch size={48} className="text-gov-text-muted mx-auto opacity-50" />
                <div className="text-sm font-bold text-gov-text-muted">Awaiting Analysis</div>
                <p className="text-xs text-gov-text-muted">Upload a DPR to begin evaluation</p>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          {lifecycleStatus === 'COMPLETED' && evaluationData && (
            <motion.div
              className="p-4 rounded-2xl bg-gov-surface/30 border border-gov-border/20 space-y-3"
              variants={itemVariants}
            >
              <h5 className="text-[9px] font-black text-gov-text-muted uppercase tracking-widest">
                Quick Stats
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gov-card rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-white">
                    {evaluationData?.documentAnalysis?.sections?.length || 0}
                  </div>
                  <div className="text-[8px] font-bold text-gov-text-muted uppercase">Sections</div>
                </div>
                <div className="bg-gov-card rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-white">
                    {evaluationData?.riskAssessment?.riskFactors?.length || 0}
                  </div>
                  <div className="text-[8px] font-bold text-gov-text-muted uppercase">Risks</div>
                </div>
                <div className="bg-gov-card rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-white">
                    {evaluationData?.riskAssessment?.complianceObservations?.length || 0}
                  </div>
                  <div className="text-[8px] font-bold text-gov-text-muted uppercase">Issues</div>
                </div>
                <div className="bg-gov-card rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-white">
                    {evaluationData?.documentAnalysis?.wordCount || 0}
                  </div>
                  <div className="text-[8px] font-bold text-gov-text-muted uppercase">Words</div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Content - Detailed Analysis */}
        <div className="lg:col-span-3 space-y-6">
          {/* Navigation Tabs */}
          {lifecycleStatus === 'COMPLETED' && (
            <motion.div
              className="p-2 rounded-2xl bg-gov-surface/30 border border-gov-border/20 flex gap-2"
              variants={itemVariants}
            >
              {[
                { id: 'structure', label: 'Structure', icon: FileText },
                { id: 'insights', label: 'AI Insights', icon: Cpu }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === tab.id
                      ? 'bg-gov-primary text-white shadow-glow'
                      : 'text-gov-text-muted hover:bg-gov-surface/50'
                    }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Content Area */}
          <motion.div
            className="p-8 rounded-[2.5rem] bg-gov-card border border-gov-border/30 min-h-[500px] relative overflow-hidden"
            variants={itemVariants}
          >
            <AnimatePresence mode="wait">
              {lifecycleStatus === 'COMPLETED' && evaluationData ? (
                <>
                  {/* Structure Analysis */}
                  {activeSection === 'structure' && (
                    <motion.div
                      key="structure"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6 border-b border-gov-border/20 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gov-primary/10 text-gov-primary flex items-center justify-center">
                            <FileText size={20} />
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">
                            Document Structure Analysis
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-gov-text-muted">
                          {structureItems.filter(s => s.presence !== 'ABSENT').length}/{structureItems.length} Sections Present
                        </span>
                      </div>

                      <div className="space-y-3">
                        {structureItems.map((item, i) => (
                          <motion.div
                            key={i}
                            className="p-5 rounded-2xl bg-gov-surface border border-gov-border/30 hover:border-gov-primary/20 transition-all"
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.score >= 60 ? 'bg-gov-success/10 text-gov-success' :
                                    item.presence === 'ABSENT' ? 'bg-gov-surface text-gov-text-muted' :
                                      'bg-gov-warning/10 text-gov-warning'
                                  }`}>
                                  {item.score >= 60 ? <CheckSquare size={16} /> :
                                    item.presence === 'ABSENT' ? <XSquare size={16} /> :
                                      <AlertTriangle size={16} />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                                      {item.label}
                                    </span>
                                    {item.presence === 'ABSENT' && (
                                      <span className="text-[8px] font-bold text-gov-text-muted px-2 py-0.5 rounded bg-gov-surface border border-gov-border">
                                        Not Found
                                      </span>
                                    )}
                                  </div>
                                  {item.flag && (
                                    <p className="text-[10px] text-gov-text-secondary leading-relaxed max-w-lg">
                                      {item.flag}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {item.presence !== 'ABSENT' && (
                                <div className="flex flex-col items-end gap-2">
                                  <div className="text-right">
                                    <div className={`text-lg font-black ${getScoreColor(item.score)}`}>
                                      {item.score}%
                                    </div>
                                  </div>
                                  <div className="w-20 h-1.5 bg-gov-background rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${getScoreColor(item.score).replace('text-', 'bg-')}`}
                                      style={{ width: `${item.score}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Detailed breakdown */}
                            {item.details && (
                              <div className="mt-3 pt-3 border-t border-gov-border/10 grid grid-cols-2 gap-3 text-[9px]">
                                {Object.entries(item.details).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gov-text-muted uppercase">{key}:</span>
                                    <span className="font-bold text-white">
                                      {typeof value === 'object' ? JSON.stringify(value) : value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Risk Analysis */}
                  {activeSection === 'risks' && (
                    <motion.div
                      key="risks"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6 border-b border-gov-border/20 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gov-danger/10 text-gov-danger flex items-center justify-center">
                            <AlertTriangle size={20} />
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">
                            Risk Assessment
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-gov-text-muted">
                          {riskFactors.length} Factors Identified
                        </span>
                      </div>

                      {riskFactors.length > 0 ? (
                        <div className="space-y-3">
                          {riskFactors.map((factor: any, i: number) => (
                            <motion.div
                              key={i}
                              className="p-5 rounded-2xl bg-gov-surface border border-gov-border/30"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${factor.level === 'HIGH' ? 'bg-gov-danger/10 text-gov-danger' :
                                    factor.level === 'MEDIUM' ? 'bg-gov-warning/10 text-gov-warning' :
                                      'bg-gov-success/10 text-gov-success'
                                  }`}>
                                  <ShieldAlert size={16} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                                      {factor.category}
                                    </span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${factor.level === 'HIGH' ? 'text-gov-danger border-gov-danger/30 bg-gov-danger/10' :
                                        factor.level === 'MEDIUM' ? 'text-gov-warning border-gov-warning/30 bg-gov-warning/10' :
                                          'text-gov-success border-gov-success/30 bg-gov-success/10'
                                      }`}>
                                      {factor.level} RISK
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gov-text-secondary leading-relaxed">
                                    {factor.description}
                                  </p>
                                  {factor.impact && (
                                    <div className="mt-2 text-[9px] text-gov-text-muted">
                                      <span className="font-bold">Impact:</span> {factor.impact}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Shield size={48} className="text-gov-success mx-auto mb-3 opacity-50" />
                          <p className="text-sm font-bold text-gov-success">No High-Risk Factors Identified</p>
                          <p className="text-xs text-gov-text-muted mt-1">This document shows good risk management</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Compliance */}
                  {activeSection === 'compliance' && (
                    <motion.div
                      key="compliance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6 border-b border-gov-border/20 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gov-success/10 text-gov-success flex items-center justify-center">
                            <ShieldCheck size={20} />
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">
                            Compliance Check
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-gov-text-muted">
                          {complianceObservations.length} Issues Found
                        </span>
                      </div>

                      {complianceObservations.length > 0 ? (
                        <div className="space-y-3">
                          {complianceObservations.map((obs: any, i: number) => (
                            <motion.div
                              key={i}
                              className="p-5 rounded-2xl bg-gov-surface border border-gov-border/30"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gov-warning/10 text-gov-warning flex items-center justify-center">
                                  <AlertCircle size={16} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                                      {obs.section}
                                    </span>
                                    <span className="text-[9px] font-bold text-gov-warning">
                                      {obs.severity || 'MODERATE'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-gov-text-secondary leading-relaxed mb-2">
                                    {obs.observation}
                                  </p>
                                  {obs.recommendation && (
                                    <div className="bg-gov-card/50 rounded-lg p-2 text-[9px]">
                                      <span className="font-bold text-gov-success">Recommendation:</span> {obs.recommendation}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BadgeCheck size={48} className="text-gov-success mx-auto mb-3" />
                          <p className="text-sm font-bold text-gov-success">Full Compliance Achieved</p>
                          <p className="text-xs text-gov-text-muted mt-1">No compliance issues detected</p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* AI Insights */}
                  {activeSection === 'insights' && (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between mb-6 border-b border-gov-border/20 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gov-primary/10 text-gov-primary flex items-center justify-center">
                            <Cpu size={20} />
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-widest">
                            AI Generated Insights
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-gov-text-muted">
                          Powered by Advanced ML
                        </span>
                      </div>

                      {evaluationData?.summary && (
                        <motion.div
                          className="p-6 rounded-2xl bg-gradient-to-br from-gov-primary/10 via-gov-surface to-gov-surface border border-gov-primary/20"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Zap size={14} className="text-gov-primary" />
                            <span className="text-[10px] font-black text-gov-primary uppercase tracking-widest">
                              Executive Summary
                            </span>
                          </div>
                          <p className="text-sm text-gov-text-secondary leading-relaxed font-medium">
                            {evaluationData.summary}
                          </p>
                        </motion.div>
                      )}

                      {evaluationData?.recommendations && (
                        <motion.div
                          className="p-6 rounded-2xl bg-gov-surface border border-gov-border/30"
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Target size={14} className="text-gov-success" />
                            <span className="text-[10px] font-black text-gov-success uppercase tracking-widest">
                              Recommendations
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {evaluationData.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex items-start gap-2 text-[10px] text-gov-text-secondary">
                                <CheckCircle2 size={12} className="text-gov-success mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto">
                      <FileSearch className="text-gov-text-muted" size={40} />
                    </div>
                    {isProcessing && (
                      <motion.div
                        className="absolute inset-0 border-2 border-gov-primary rounded-2xl"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">
                    {isProcessing ? 'Analysis in Progress' : 'Ready for Evaluation'}
                  </h4>
                  <p className="text-sm text-gov-text-muted max-w-md">
                    {isProcessing
                      ? 'Our AI is analyzing your DPR document. This may take a few moments. Please wait while we process the content.'
                      : 'Upload a DPR document to begin the AI-powered evaluation and scrutiny process.'}
                  </p>
                  {isProcessing && <SectionProgress />}
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DPREvaluation;
