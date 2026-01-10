
import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Filter, MoreVertical,
  FileText, ArrowUpRight, Download, Eye,
  CheckCircle2, AlertCircle, Clock, MapPin,
  Building2, Calendar, FileSearch, BadgeCheck,
  AlertTriangle, ShieldAlert, Upload, RefreshCw,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, UserRole, ValidationReport } from '../types';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface DPRManagementProps {
  lang: Language;
  role?: UserRole;
  onEvaluate?: (id: string) => void;
}

const DPRManagement: React.FC<DPRManagementProps> = ({ lang, role, onEvaluate }) => {
  const t = TRANSLATIONS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dprs, setDprs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDPRs = async () => {
    try {
      setIsLoading(true);
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
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await apiService.uploadDPR(file);

      if (onEvaluate && response.jobId) {
        onEvaluate(response.jobId);
      }

      alert(`Upload Successful! Processing Job ID: ${response.jobId}`);

      // Refresh the list after upload
      setTimeout(() => fetchDPRs(), 1000);
    } catch (error) {
      console.error(error);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = async (jobId: string, filename: string) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteDPR(jobId);
        fetchDPRs(); // Refresh list
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete DPR. Please try again.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-gov-success';
      case 'FAILED': return 'text-gov-danger';
      case 'ANALYZING':
      case 'EXTRACTING':
      case 'ExtractingTEXT': return 'text-gov-warning';
      default: return 'text-gov-text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <BadgeCheck size={14} className="text-gov-success" />;
      case 'FAILED': return <ShieldAlert size={14} className="text-gov-danger" />;
      case 'ANALYZING':
      case 'EXTRACTING':
      case 'ExtractingTEXT': return <Clock size={14} className="text-gov-warning animate-spin" />;
      default: return <Clock size={14} className="text-gov-text-muted" />;
    }
  };

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-1 text-left">
          <p className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Strategic Project Archive</p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">{t.dpr_management[lang]} <span className="text-gov-text-muted font-light">Repository</span></h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted" size={14} />
            <input
              type="text"
              placeholder={t.search_placeholder[lang]}
              className="bg-gov-surface/50 border border-gov-border/50 rounded-xl py-2.5 pl-12 pr-4 text-[10px] font-black text-white placeholder:text-gov-text-muted focus:outline-none focus:border-gov-primary transition-all uppercase tracking-widest w-64"
            />
          </div>
          <button
            onClick={fetchDPRs}
            className="bg-gov-surface text-gov-primary p-2.5 rounded-xl border border-gov-border hover:bg-gov-surface/70 transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="application/pdf"
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="bg-gov-primary text-white p-2.5 rounded-xl shadow-glow hover:bg-gov-primaryDeep transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? <Clock size={20} className="animate-spin" /> : <Plus size={20} />}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Clock className="text-gov-primary animate-spin mx-auto" size={40} />
            <p className="text-sm text-gov-text-muted font-medium">Loading DPRs...</p>
          </div>
        </div>
      ) : dprs.length === 0 ? (
        <div className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center">
          <div className="text-center space-y-6 p-12">
            <div className="w-20 h-20 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto">
              <Upload className="text-gov-text-muted" size={40} />
            </div>
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-white tracking-tighter uppercase font-display">No DPRs Uploaded Yet</h4>
              <p className="text-sm text-gov-text-muted font-medium max-w-md mx-auto leading-relaxed">
                Click the <span className="text-gov-primary font-bold">+</span> button above to upload your first Detailed Project Report for AI-powered evaluation and scrutiny.
              </p>
            </div>
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="mt-6 bg-gov-primary text-white px-6 py-3 rounded-xl shadow-glow hover:bg-gov-primaryDeep transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs font-black uppercase tracking-widest"
            >
              {isUploading ? 'Uploading...' : 'Upload First DPR'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl">
          <div className="px-10 py-6 border-b border-gov-border/20 flex justify-between items-center bg-gov-surface/20">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Project Master List ({dprs.length})</h4>
            <div className="flex items-center space-x-6 text-gov-text-muted">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gov-success"></div>
                <span className="text-[8px] font-black uppercase">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gov-warning"></div>
                <span className="text-[8px] font-black uppercase">Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gov-danger"></div>
                <span className="text-[8px] font-black uppercase">Failed</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gov-surface/30">
                  <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Job ID</th>
                  <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Filename</th>
                  <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Upload Date</th>
                  <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest text-center">Score</th>
                  <th className="px-10 py-4 text-[9px] font-black text-gov-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-10 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border/10">
                {dprs.map((dpr, i) => {
                  const score = getScore(dpr);
                  return (
                    <tr key={i} className="hover:bg-gov-surface/20 transition-all group">
                      <td className="px-10 py-6">
                        <span className="text-[10px] font-black text-gov-primary font-display tracking-widest">{dpr.jobId?.substring(0, 8)}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="space-y-1 text-left">
                          <p className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-gov-primary transition-colors line-clamp-1">{dpr.filename}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-left">
                        <span className="text-[10px] font-black text-gov-text-muted tracking-widest">
                          {dpr.uploadDate ? new Date(dpr.uploadDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        {score !== null ? (
                          <div className="flex flex-col items-center space-y-2">
                            <span className={`text-[10px] font-black ${score >= 70 ? 'text-gov-success' : score >= 50 ? 'text-gov-warning' : 'text-gov-danger'}`}>{score}%</span>
                            <div className="w-24 h-1 bg-gov-background rounded-full overflow-hidden">
                              <div className={`h-full ${score >= 70 ? 'bg-gov-success' : score >= 50 ? 'bg-gov-warning' : 'bg-gov-danger'}`} style={{ width: `${score}%` }}></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gov-text-muted italic">Pending</span>
                        )}
                      </td>
                      <td className="px-10 py-6 text-left">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(dpr.status)}
                          <span className={`text-[9px] font-black uppercase tracking-widest ${getStatusColor(dpr.status)}`}>{dpr.status}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end space-x-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => onEvaluate?.(dpr.jobId)} className="p-2 text-gov-text-muted hover:text-gov-primary transition-all" title="View Details"><Eye size={16} /></button>
                          <button onClick={() => handleDelete(dpr.jobId, dpr.filename)} className="p-2 text-gov-text-muted hover:text-gov-danger transition-all" title="Delete DPR"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DPRManagement;
