
import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Filter, MoreVertical,
  FileText, ArrowUpRight, Download, Eye,
  CheckCircle2, AlertCircle, Clock, MapPin,
  Building2, Calendar, FileSearch, BadgeCheck,
  AlertTriangle, ShieldAlert, Upload, RefreshCw,
  Trash2, CheckSquare, Square, ShieldCheck,
  ChevronDown, ChevronUp, Filter as FilterIcon,
  DownloadCloud, Share2, Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, UserRole, ValidationReport } from '../types';
import { TRANSLATIONS } from '../constants';
import { apiService } from '../services/apiService';
import { useRef } from 'react';

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
  const [selectedDprs, setSelectedDprs] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

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

      // Show success toast (would be implemented with a toast component)
      console.log(`Upload Successful! Processing Job ID: ${response.jobId}`);

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

  const handleBulkDelete = async () => {
    if (selectedDprs.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedDprs.size} DPR(s)? This action cannot be undone.`)) {
      try {
        await Promise.all(Array.from(selectedDprs).map(id => apiService.deleteDPR(id)));
        setSelectedDprs(new Set());
        fetchDPRs();
      } catch (error) {
        console.error('Bulk delete failed:', error);
        alert('Failed to delete selected DPRs. Please try again.');
      }
    }
  };

  const handleBulkExport = () => {
    if (selectedDprs.size === 0) return;

    // Export selected DPRs as JSON
    const selectedData = dprs.filter(dpr => selectedDprs.has(dpr.jobId));
    const dataStr = JSON.stringify(selectedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dpr-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelectAll = () => {
    if (selectedDprs.size === dprs.length) {
      setSelectedDprs(new Set());
    } else {
      setSelectedDprs(new Set(dprs.map(dpr => dpr.jobId)));
    }
  };

  const toggleSelect = (jobId: string) => {
    const newSelected = new Set(selectedDprs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedDprs(newSelected);
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

  // Filter and sort DPRs
  const filteredDprs = dprs.filter(dpr => {
    const matchesSearch = searchQuery === '' ||
      dpr.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dpr.jobId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'ALL' || dpr.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const sortedDprs = [...filteredDprs].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (sortConfig.key === 'uploadDate') {
      const aDate = new Date(aVal || 0).getTime();
      const bDate = new Date(bVal || 0).getTime();
      return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
    }

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortConfig.direction === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="space-y-6 animate-in fade-in duration-500"
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
            Strategic Project Archive
          </p>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-display">
            {t.dpr_management[lang]} <span className="text-gov-text-muted font-light">Repository</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            onClick={fetchDPRs}
            className="bg-gov-surface text-gov-primary p-2.5 rounded-xl border border-gov-border hover:bg-gov-surface/70 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh"
          >
            <RefreshCw size={20} />
          </motion.button>

          <motion.button
            onClick={triggerFileInput}
            disabled={isUploading}
            className="bg-gov-primary text-white px-4 py-2.5 rounded-xl shadow-glow hover:bg-gov-primaryDeep transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isUploading ? (
              <>
                <Clock size={18} className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Upload DPR</span>
              </>
            )}
          </motion.button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="application/pdf"
            className="hidden"
          />
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedDprs.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gov-card border border-gov-border/30 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">
                  {selectedDprs.size} selected
                </span>
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleBulkExport}
                    className="px-3 py-1.5 rounded-lg bg-gov-surface border border-gov-border text-gov-text-muted hover:text-white hover:bg-gov-surface/70 transition-all text-xs font-bold flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <DownloadCloud size={14} />
                    Export
                  </motion.button>
                  <motion.button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 rounded-lg bg-gov-danger/10 border border-gov-danger/30 text-gov-danger hover:bg-gov-danger/20 transition-all text-xs font-bold flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </motion.button>
                </div>
              </div>
              <motion.button
                onClick={() => setSelectedDprs(new Set())}
                className="text-xs font-bold text-gov-text-muted hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Clear Selection
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <motion.div
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-text-muted" size={16} />
            <input
              type="text"
              placeholder={t.search_placeholder[lang]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gov-card/80 border border-gov-border/50 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-gov-text-muted focus:outline-none focus:border-gov-primary transition-all"
            />
          </div>

          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${showFilters
                ? 'bg-gov-primary text-white border-gov-primary'
                : 'bg-gov-surface text-gov-text-muted border-gov-border hover:bg-gov-surface/70'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FilterIcon size={16} />
            Filters
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gov-text-muted uppercase">
            Sort by:
          </span>
          <div className="flex gap-2">
            {[
              { key: 'uploadDate', label: 'Date' },
              { key: 'filename', label: 'Name' },
              { key: 'status', label: 'Status' }
            ].map((item) => (
              <motion.button
                key={item.key}
                onClick={() => handleSort(item.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${sortConfig.key === item.key
                    ? 'bg-gov-primary text-white'
                    : 'bg-gov-surface text-gov-text-muted hover:bg-gov-surface/70'
                  }`}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
                {sortConfig.key === item.key && (
                  <ChevronDown size={12} className={sortConfig.direction === 'desc' ? 'rotate-180' : ''} />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gov-card border border-gov-border/30 rounded-2xl p-6">
              <h4 className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-4">
                Filter by Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'COMPLETED', 'ANALYZING', 'EXTRACTING', 'FAILED'].map((status) => (
                  <motion.button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === status
                        ? 'bg-gov-primary text-white'
                        : 'bg-gov-surface text-gov-text-muted hover:bg-gov-surface/70'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Legend */}
      <motion.div
        className="flex items-center gap-6 text-xs font-bold text-gov-text-muted px-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gov-success"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gov-warning"></div>
          <span>Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gov-danger"></div>
          <span>Failed</span>
        </div>
        <div className="ml-auto text-[9px]">
          {sortedDprs.length} of {dprs.length} records
        </div>
      </motion.div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ShieldCheck className="text-gov-primary mx-auto" size={40} />
              </motion.div>
              <p className="text-sm text-gov-text-muted font-medium">Loading DPRs...</p>
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
        ) : sortedDprs.length === 0 ? (
          <motion.div
            key="empty"
            className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl min-h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="text-center space-y-6 p-12">
              <motion.div
                className="w-20 h-20 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center mx-auto"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Upload className="text-gov-text-muted" size={40} />
              </motion.div>
              <div className="space-y-3">
                <h4 className="text-2xl font-black text-white tracking-tighter uppercase font-display">
                  {searchQuery || filterStatus !== 'ALL' ? 'No Results Found' : 'No DPRs Uploaded Yet'}
                </h4>
                <p className="text-sm text-gov-text-muted font-medium max-w-md mx-auto leading-relaxed">
                  {searchQuery || filterStatus !== 'ALL'
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Click the upload button above to submit your first Detailed Project Report for AI-powered evaluation.'}
                </p>
              </div>
              {(searchQuery || filterStatus !== 'ALL') && (
                <motion.button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('ALL');
                  }}
                  className="mt-4 bg-gov-primary text-white px-6 py-3 rounded-xl shadow-glow hover:bg-gov-primaryDeep transition-all text-xs font-black uppercase tracking-widest"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            className="bg-gov-card rounded-[2.5rem] border border-gov-border/30 overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Table Header */}
            <div className="px-10 py-6 border-b border-gov-border/20 flex justify-between items-center bg-gov-surface/20">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={toggleSelectAll}
                  className={`p-2 rounded-lg border transition-all ${selectedDprs.size === sortedDprs.length && sortedDprs.length > 0
                      ? 'bg-gov-primary border-gov-primary text-white'
                      : 'bg-gov-surface border-gov-border text-gov-text-muted hover:bg-gov-surface/70'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedDprs.size === sortedDprs.length && sortedDprs.length > 0 ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </motion.button>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  Project Master List ({sortedDprs.length})
                </h4>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-modern">
                <thead>
                  <tr className="bg-gov-surface/30">
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest w-16">
                      Select
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest cursor-pointer hover:text-gov-primary transition-colors" onClick={() => handleSort('jobId')}>
                      Job ID {sortConfig.key === 'jobId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest cursor-pointer hover:text-gov-primary transition-colors" onClick={() => handleSort('filename')}>
                      Filename {sortConfig.key === 'filename' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest cursor-pointer hover:text-gov-primary transition-colors" onClick={() => handleSort('uploadDate')}>
                      Upload Date {sortConfig.key === 'uploadDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest text-center">
                      Score
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest cursor-pointer hover:text-gov-primary transition-colors" onClick={() => handleSort('status')}>
                      Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-10 py-5 text-[9px] font-black text-gov-text-muted uppercase tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border/10">
                  {sortedDprs.map((dpr, i) => {
                    const score = getScore(dpr);
                    const isSelected = selectedDprs.has(dpr.jobId);

                    return (
                      <motion.tr
                        key={dpr.jobId || i}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.03 }}
                        className={`hover:bg-gov-surface/20 transition-all group ${isSelected ? 'bg-gov-primary/5' : ''}`}
                      >
                        <td className="px-10 py-6">
                          <motion.button
                            onClick={() => toggleSelect(dpr.jobId)}
                            className={`p-2 rounded-lg border transition-all ${isSelected
                                ? 'bg-gov-primary border-gov-primary text-white'
                                : 'bg-gov-surface border-gov-border text-gov-text-muted hover:bg-gov-surface/70'
                              }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {isSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                          </motion.button>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[10px] font-black text-gov-primary font-display tracking-widest">
                            {dpr.jobId?.substring(0, 8)}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className="space-y-1 text-left max-w-[250px]">
                            <p className="text-[11px] font-black text-white uppercase tracking-widest group-hover:text-gov-primaryDeep transition-colors line-clamp-1">
                              {dpr.filename}
                            </p>
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
                              <span className={`text-[10px] font-black ${score >= 70 ? 'text-gov-success' : score >= 50 ? 'text-gov-warning' : 'text-gov-danger'}`}>
                                {score}%
                              </span>
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
                            <span className={`text-[9px] font-black uppercase tracking-widest ${getStatusColor(dpr.status)}`}>
                              {dpr.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                            <motion.button
                              onClick={() => onEvaluate?.(dpr.jobId)}
                              className="p-2 text-gov-text-muted hover:text-gov-primary transition-all rounded-lg hover:bg-gov-surface/50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(dpr.jobId, dpr.filename)}
                              className="p-2 text-gov-text-muted hover:text-gov-danger transition-all rounded-lg hover:bg-gov-surface/50"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete DPR"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="px-10 py-6 border-t border-gov-border/20 bg-gov-surface/20 flex justify-between items-center text-xs font-bold text-gov-text-muted">
              <div>
                Showing {sortedDprs.length} of {dprs.length} records
              </div>
              <div className="flex items-center gap-4">
                {sortedDprs.length > 0 && (
                  <>
                    <span className="text-[9px] uppercase">
                      {selectedDprs.size} selected
                    </span>
                    {selectedDprs.size > 0 && (
                      <div className="flex gap-2">
                        <motion.button
                          onClick={handleBulkExport}
                          className="px-3 py-1.5 rounded-lg bg-gov-surface border border-gov-border text-gov-text-muted hover:text-white hover:bg-gov-surface/70 transition-all text-[9px] font-bold flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Download size={12} />
                          Export
                        </motion.button>
                        <motion.button
                          onClick={handleBulkDelete}
                          className="px-3 py-1.5 rounded-lg bg-gov-danger/10 border border-gov-danger/30 text-gov-danger hover:bg-gov-danger/20 transition-all text-[9px] font-bold flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Trash2 size={12} />
                          Delete
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DPRManagement;
