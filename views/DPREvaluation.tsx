
import React, { useState } from 'react';
import {
  FileText, ShieldCheck, AlertTriangle, CheckCircle2,
  Search, HardDrive, Map, Database, Activity,
  ChevronRight, ArrowLeft, Info, FileSearch,
  AlertCircle, BarChart, ShieldAlert, BadgeCheck,
  ClipboardList, Scale, Clock
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
  const t = TRANSLATIONS;

  // Poll for status when ID changes
  React.useEffect(() => {
    if (!id) {
      setLifecycleStatus('NOT_STARTED');
      setEvaluationData(null);
      setIsProcessing(false);
      return;
    }

    let pollInterval: NodeJS.Timeout;
    setIsProcessing(true);
    // Reset state for new ID
    setEvaluationData(null);
    setLifecycleStatus('NOT_STARTED');

    const checkStatus = async () => {
      try {
        const statusData = await apiService.pollStatus(id); // id is jobId here

        const currentLifecycle = statusData.lifecycleStatus || 'NOT_STARTED';
        setLifecycleStatus(currentLifecycle);

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
        } else if (currentLifecycle === 'IN_PROGRESS') {
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
      flag: sec?.summary || sec?.reason || sec?.qualityAssessment?.weaknesses?.[0] || sec?.gaps?.[0] || null
    };
  };

  const structureItems = [
    { label: 'Executive Summary', ...transformSection('EXECUTIVE_SUMMARY') },
    { label: 'Technical Specs', ...transformSection('TECHNICAL_SPECS') },
    { label: 'Financials', ...transformSection('FINANCIALS') },
    { label: 'Risks', ...transformSection('RISKS') },
    { label: 'Timeline', ...transformSection('TIMELINE') },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Official Case Scrutiny</p>
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">{t.evaluation[lang]} <span className="text-gov-text-muted font-light">Unit</span></h2>
            <div className="px-3 py-1 rounded-lg bg-gov-surface border border-gov-border flex items-center space-x-2">
              <span className="text-[9px] font-black text-gov-text-muted uppercase">{id ? `JOB-${id.substring(0, 8)}` : 'NO-JOB'}</span>
            </div>
            {lifecycleStatus === 'IN_PROGRESS' && <span className="text-gov-warning animate-pulse text-xs font-bold uppercase tracking-widest flex items-center"><Activity className="mr-2" size={12} /> Unit Analysis Active...</span>}
            {lifecycleStatus === 'NOT_STARTED' && id && <span className="text-gov-primary opacity-50 text-xs font-bold uppercase tracking-widest">Awaiting Queue...</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {/* Summary Card */}
          <div className="p-6 rounded-2xl bg-gov-card border border-gov-border/30 text-center">
            <h4 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-2">Overall Score</h4>
            {lifecycleStatus === 'COMPLETED' ? (
              <>
                <div className="text-4xl font-black text-white mb-2">{finalScore}/100</div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${evaluationData?.overallScore?.riskLevel === 'HIGH' ? 'bg-gov-danger text-white' : 'bg-gov-success text-white'}`}>
                  RISK: {evaluationData?.overallScore?.riskLevel || 'UNKNOWN'}
                </span>
                {evaluationData?.overallScore?.extractionConfidence && (
                  <span className={`ml-2 px-2 py-1 rounded text-[10px] font-bold ${evaluationData?.overallScore?.extractionConfidence === 'HIGH' ? 'bg-gov-success text-white' : 'bg-gov-warning text-white'}`}>
                    TRUST: {evaluationData?.overallScore?.extractionConfidence}
                  </span>
                )}
              </>
            ) : lifecycleStatus === 'IN_PROGRESS' ? (
              <div className="py-4 space-y-2">
                <div className="h-8 bg-gov-surface animate-pulse rounded-lg w-2/3 mx-auto"></div>
                <div className="h-4 bg-gov-surface animate-pulse rounded-lg w-1/2 mx-auto"></div>
              </div>
            ) : (
              <div className="py-4 text-gov-text-muted text-[10px] font-bold uppercase">Pending Analysis</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8 text-left">
          <div className="p-10 rounded-[2.5rem] bg-gov-card border border-gov-border/30 min-h-[500px] shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-10 border-b border-gov-border/20 pb-8">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gov-primary/10 text-gov-primary flex items-center justify-center">
                  <BadgeCheck size={20} />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">
                  {lifecycleStatus === 'COMPLETED' ? 'Analysis Results' : lifecycleStatus === 'IN_PROGRESS' ? 'Analysis In Progress' : 'System Ready'}
                </h4>
              </div>
            </div>

            <div className="space-y-4">
              {structureItems.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gov-surface border border-gov-border/30 hover:border-gov-primary/20 transition-all flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {lifecycleStatus === 'COMPLETED' ? (
                        item.score >= 60 ? <CheckCircle2 size={16} className="text-gov-success" /> : item.presence === 'ABSENT' ? <AlertCircle size={16} className="text-gov-text-muted opacity-50" /> : <AlertTriangle size={16} className="text-gov-warning" />
                      ) : lifecycleStatus === 'IN_PROGRESS' ? (
                        <Activity size={16} className="text-gov-primary animate-spin" />
                      ) : (
                        <Clock size={16} className="text-gov-text-muted" />
                      )}
                      <span className="text-[11px] font-black text-white uppercase tracking-widest">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {lifecycleStatus === 'NOT_STARTED' ? (
                        <span className="text-[10px] text-gov-text-muted uppercase tracking-tighter font-bold">Awaiting AI evaluation</span>
                      ) : lifecycleStatus === 'IN_PROGRESS' ? (
                        <span className="text-[10px] text-gov-primary animate-pulse font-black uppercase tracking-widest">Analyzing...</span>
                      ) : (
                        // COMPLETED state
                        ['ABSENT', 'MISSING', 'NOT EXPLICITLY DOCUMENTED'].includes(item.presence.toUpperCase()) ? (
                          <span className="text-[10px] text-gov-text-muted italic">Not explicitly documented</span>
                        ) : (
                          <>
                            <div className="w-24 h-1.5 bg-gov-background rounded-full overflow-hidden">
                              <div className={`h-full ${item.score >= 60 ? 'bg-gov-success' : item.score < 50 ? 'bg-gov-danger' : 'bg-gov-warning'}`} style={{ width: `${item.score}%` }}></div>
                            </div>
                            <span className="text-xs font-mono">{item.score}</span>
                          </>
                        )
                      )}
                    </div>
                  </div>
                  {lifecycleStatus === 'COMPLETED' && item.flag && (
                    <div className="px-4 py-2 bg-black/20 rounded-lg">
                      <p className="text-sm text-gov-text-secondary leading-relaxed font-medium">{item.flag}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {lifecycleStatus === 'COMPLETED' && evaluationData?.summary && (
              <div className="mt-6 p-4 bg-gov-primary/5 rounded-xl border border-gov-primary/20">
                <h5 className="text-[10px] font-black text-gov-primary uppercase mb-2">Executive Summary</h5>
                <p className="text-sm text-gov-text-secondary leading-relaxed font-medium">{evaluationData.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPREvaluation;
