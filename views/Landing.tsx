
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Cpu, BarChart3, FileText, CheckCircle2, Lock, Radar,
  Workflow, ChevronRight, Globe, Shield, Zap, Layers, Target, Eye,
  LockIcon, ArrowDown, Activity, Database, Server, Smartphone, Monitor,
  Plus, Minus, HelpCircle, Building2, Flag, Scale, Landmark, Award,
  Network, Code2, DatabaseBackup, Terminal, FileSearch, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  }
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeWorkflow, setActiveWorkflow] = useState(0);

  const workflowSteps = [
    { title: "DPR Ingestion", desc: "Digital capture of project reports with automated metadata extraction.", icon: FileText },
    { title: "Compliance Check", desc: "Validation against MDoNER guidelines and standardized formatting rules.", icon: ShieldCheck },
    { title: "Risk Assessment", desc: "Machine learning models identify potential cost overruns and delays.", icon: Radar },
    { title: "Review Export", desc: "Generated evaluation reports for officer sanctioning and approval.", icon: CheckCircle2 },
  ];

  const caseStudies = [
    { state: "Assam", sector: "Infrastructure", impact: "Processing cut by 72%", desc: "Automated scrutiny of regional highway projects reduced manual review cycles from months to days." },
    { state: "Sikkim", sector: "Renewable Energy", impact: "Proactive Risk Detection", desc: "AI-based topographic analysis flagged structural hazards in solar installations prior to sanctioning." },
    { state: "Meghalaya", sector: "Social Welfare", impact: "100% Policy Alignment", desc: "Semantic mapping ensured all childcare DPRs complied with updated Ministry health protocols." },
  ];

  const fluidPx = "px-10 md:px-20 xl:px-28 2xl:px-36";

  return (
    <div className="bg-gov-background text-gov-text-primary flex flex-col selection:bg-gov-primary selection:text-white font-sans overflow-x-hidden w-full">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: 'radial-gradient(circle, var(--gov-primary) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-gov-primary/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-gov-accent/5 rounded-full blur-[140px]"></div>
      </div>

      {/* Persistent Nav */}
      <header className="sticky top-0 z-50 glass-panel border-b border-gov-border/50 w-full">
        <div className={`${fluidPx} py-5 flex items-center justify-between`}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-11 w-11 rounded-xl bg-gov-primary text-white flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-500">
              <FileSearch size={22} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gov-primary uppercase tracking-[0.3em]">Ministry of DoNER</p>
              <h1 className="text-lg font-black tracking-tighter text-white leading-tight uppercase font-display">Prasthav-<span className="text-gov-text-muted font-light">AI</span></h1>
            </div>
          </motion.div>

          <nav className="hidden xl:flex items-center space-x-10">
            {['about', 'process', 'impact', 'standards', 'pricing'].map((item) => (
              <motion.a
                key={item}
                href={`#${item}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-black text-gov-text-secondary hover:text-white transition-all uppercase tracking-[0.2em] relative group"
              >
                {item}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-gov-primary transition-all group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/login')}
            className="bg-white text-gov-primary px-8 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-premium hover:bg-gov-primary hover:text-white transition-all whitespace-nowrap active:scale-95"
          >
            Access Portal
          </motion.button>
        </div>
      </header>

      <main className="relative z-10 w-full">
        {/* HERO */}
        <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden pt-16 pb-24 w-full">
          <div className={`${fluidPx} w-full relative z-20`}>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex flex-col items-start text-left max-w-[85vw]"
            >
              <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-gov-surface/50 border border-gov-primary/20 backdrop-blur-md mb-10">
                <div className="w-2 h-2 rounded-full bg-gov-primary animate-pulse"></div>
                <span className="text-[10px] font-black text-gov-primary uppercase tracking-[0.4em]">Official Project Evaluation Framework</span>
              </div>

              <h2 className="text-6xl md:text-8xl xl:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-10 drop-shadow-xl">
                ACCELERATED <br />
                SCRUTINY.
              </h2>

              <p className="text-gov-text-secondary text-xl md:text-2xl font-medium leading-[1.4] mb-16 max-w-4xl opacity-80">
                Automating Detailed Project Report (DPR) evaluation for the North Eastern Region. <br />
                Enabling faster sanctions through AI-driven compliance and risk detection.
              </p>

              <div className="flex flex-col items-start space-y-10">
                <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-5 md:space-y-0 md:space-x-10">
                  <motion.button
                    whileHover={{ scale: 1.03, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="bg-gov-primary text-white px-14 py-7 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[0.3em] hover:bg-gov-primaryDeep transition-all flex items-center justify-center space-x-6 shadow-glow group"
                  >
                    <span>Login to Platform</span>
                    <ChevronRight size={20} className="group-hover:translate-x-3 transition-transform duration-400" />
                  </motion.button>

                  <div className="flex items-center space-x-6 px-8">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-gov-primary uppercase tracking-[0.3em]">SECURE_ENTRY</span>
                      <span className="text-[9px] font-bold text-gov-text-muted uppercase tracking-[0.2em]">Regional_Auth_Unit</span>
                    </div>
                    <div className="h-8 w-px bg-gov-border/50"></div>
                    <Shield className="text-gov-primary" size={24} />
                  </div>
                </div>

                <div className="flex items-center gap-8 flex-wrap">
                  <div className="flex items-center space-x-3 text-gov-primary bg-gov-primary/5 px-5 py-2.5 rounded-xl border border-gov-primary/20">
                    <CheckCircle2 size={16} />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">SIH 2024 Optimized</p>
                  </div>
                  <div className="flex items-center space-x-3 text-gov-text-muted bg-white/5 px-5 py-2.5 rounded-xl border border-white/10">
                    <Database size={16} />
                    <p className="text-[11px] font-black uppercase tracking-[0.2em]">Offline-First Arch</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="absolute top-0 right-0 w-[40vw] h-full pointer-events-none overflow-hidden opacity-20">
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=2070" className="w-full h-full object-cover grayscale" alt="Collaboration" />
          </div>
        </section>

        {/* STATS */}
        <section className="bg-gov-surface/30 border-y border-gov-border/50 py-24 relative overflow-hidden w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerVariants}
            className={`${fluidPx} flex flex-wrap justify-between items-center gap-16`}
          >
            {[
              { label: 'Avg Evaluation Time', value: '45m', icon: Clock },
              { label: 'Evaluation Speedup', value: '15x', icon: Zap },
              { label: 'Guidelines Verified', value: '200+', icon: ShieldCheck },
              { label: 'Fiscal Accuracy', value: '98%', icon: BarChart3 },
            ].map((stat, i) => (
              <motion.div key={i} variants={revealVariants} className="flex items-center space-x-8 group">
                <div className="w-16 h-16 rounded-2xl bg-gov-surface border border-gov-border flex items-center justify-center text-gov-primary group-hover:bg-gov-primary group-hover:text-white transition-all">
                  <stat.icon size={24} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-4xl md:text-5xl font-black text-gov-primary tracking-tighter leading-none mb-1">{stat.value}</span>
                  <span className="text-[10px] font-black text-gov-text-muted uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* PROBLEM & MISSION */}
        <section id="about" className="py-48 bg-gov-background relative overflow-hidden w-full">
          <div className={`${fluidPx} w-full`}>
            <div className="flex flex-col lg:flex-row items-center gap-32">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={revealVariants}
                className="flex-1 space-y-12"
              >
                <div className="inline-block p-6 rounded-2xl bg-gov-primary/10 border border-gov-primary/20 text-gov-primary">
                  <Flag size={40} />
                </div>
                <div className="space-y-6 text-left">
                  <p className="text-[14px] font-black text-gov-primary uppercase tracking-[0.5em]">The Objective</p>
                  <h3 className="text-6xl md:text-7xl xl:text-8xl font-black text-gov-primary tracking-tighter leading-[0.9] uppercase font-display">Practical <br /> Efficiency.</h3>
                </div>
                <p className="text-gov-text-secondary text-xl font-medium leading-relaxed max-w-3xl opacity-80">
                  Prasthav-AI solves the challenge of manual DPR review by providing a semi-automated validation layer that ensures every submission follows MDoNER standards while identifying hidden risks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
                  <div className="space-y-4 group">
                    <h5 className="text-md font-black text-gov-primary uppercase tracking-widest flex items-center group-hover:text-gov-primaryDeep transition-colors">
                      <Scale className="mr-5 text-gov-primary" size={20} />
                      Unbiased Review
                    </h5>
                    <p className="text-sm text-gov-text-secondary leading-relaxed font-medium">Ensuring fairness across all 8 regional states.</p>
                  </div>
                  <div className="space-y-4 group">
                    <h5 className="text-md font-black text-gov-primary uppercase tracking-widest flex items-center group-hover:text-gov-primaryDeep transition-colors">
                      <Activity className="mr-5 text-gov-primary" size={20} />
                      Real-time Analytics
                    </h5>
                    <p className="text-sm text-gov-text-secondary leading-relaxed font-medium">Instant feedback for submitted project drafts.</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="flex-1 relative w-full"
              >
                <div className="relative glass-panel rounded-[3.5rem] p-5 border-gov-border/30 w-full overflow-hidden backdrop-blur-2xl">
                  <div className="bg-gov-surface/40 backdrop-blur-xl rounded-[2.5rem] p-16 border border-gov-border/30 overflow-hidden relative group min-h-[500px] flex flex-col justify-center">
                    <div className="relative z-10 space-y-12">
                      <h4 className="text-[12px] font-black text-gov-accent uppercase tracking-[0.5em] mb-12 flex items-center justify-center">
                        <Globe size={20} className="mr-4" />
                        Regional Coverage
                      </h4>
                      <div className="grid grid-cols-2 gap-10">
                        {[
                          { name: "Arunachal", load: 85 },
                          { name: "Assam", load: 94 },
                          { name: "Manipur", load: 72 },
                          { name: "Meghalaya", load: 80 },
                        ].map((s, i) => (
                          <div key={i} className="bg-gov-background/50 p-6 rounded-2xl border border-gov-border/30 text-center">
                            <p className="text-[10px] font-black text-gov-text-muted uppercase tracking-widest mb-2">{s.name}</p>
                            <p className="text-2xl font-black text-gov-primary">{s.load}%</p>
                            <p className="text-[8px] font-bold text-gov-primary uppercase tracking-widest mt-1">Uptime</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center pt-8">
                        <div className="flex items-center space-x-3 text-gov-success bg-gov-success/10 px-6 py-2 rounded-full border border-gov-success/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-gov-success animate-ping"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Grid synchronized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="py-48 bg-gov-surface/10 border-y border-gov-border/50 relative overflow-hidden w-full">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={revealVariants} className={`${fluidPx} w-full text-center mb-32`}>
            <p className="text-[14px] font-black text-gov-primary uppercase tracking-[0.5em] mb-6">Automated Workflow</p>
            <h3 className="text-6xl md:text-8xl font-black text-gov-primary tracking-tighter uppercase leading-[0.85] mb-8 font-display">Evaluation <br /> Pipeline.</h3>
          </motion.div>

          <div className={`${fluidPx} w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10`}>
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-gov-card/60 backdrop-blur-xl border border-gov-border/40 text-left hover:border-gov-primary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gov-surface flex items-center justify-center text-gov-primary mb-10 group-hover:bg-gov-primary group-hover:text-white transition-all">
                  <step.icon size={24} />
                </div>
                <h4 className="text-xl font-black text-gov-primary uppercase tracking-widest mb-4 leading-none">{step.title}</h4>
                <p className="text-sm text-gov-text-secondary leading-relaxed font-medium opacity-80">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* IMPACT */}
        <section id="impact" className="py-48 bg-gov-background relative w-full">
          <div className={`${fluidPx} w-full`}>
            <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-16">
              <div className="space-y-6 text-left">
                <p className="text-[14px] font-black text-gov-accent uppercase tracking-[0.5em]">Field Proven</p>
                <h3 className="text-6xl md:text-8xl font-black text-gov-primary tracking-tighter leading-[0.9] uppercase font-display">Impact <br /> Metrics.</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {caseStudies.map((cs, i) => (
                <motion.div key={i} variants={revealVariants} className="group p-12 rounded-[3.5rem] bg-gov-card/60 backdrop-blur-xl border border-gov-border/40 hover:border-gov-primary/50 transition-all duration-700 relative flex flex-col justify-between min-h-[450px]">
                  <div className="space-y-8 relative z-10 text-left">
                    <div className="px-5 py-2 rounded-full bg-gov-surface border border-gov-border/30 text-[10px] font-black text-gov-primary uppercase tracking-[0.2em] w-fit">{cs.state}</div>
                    <h4 className="text-3xl font-black text-gov-primary tracking-tighter uppercase leading-tight font-display">{cs.sector}</h4>
                    <p className="text-[11px] font-black text-gov-primary uppercase tracking-[0.3em]">{cs.impact}</p>
                    <p className="text-sm text-gov-text-secondary leading-relaxed font-medium opacity-90">{cs.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-48 bg-gov-background relative overflow-hidden w-full">
          <div className={`${fluidPx} w-full text-center`}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="p-24 md:p-36 rounded-[5rem] bg-gradient-to-br from-gov-card via-gov-surface to-gov-background border border-gov-primary/20 relative group overflow-hidden w-full text-center">
              <div className="relative z-10 w-full space-y-12">
                <div className="w-20 h-20 bg-gov-primary/10 rounded-[2rem] flex items-center justify-center text-gov-primary mx-auto">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-7xl md:text-9xl font-black text-gov-primary tracking-tighter uppercase leading-[0.8] font-display">Official <br /> Access.</h3>
                <p className="text-2xl md:text-3xl font-bold text-gov-text-secondary uppercase italic opacity-60">Authorized MDoNER personnel only.</p>
                <button onClick={() => navigate('/login')} className="bg-gov-primary hover:bg-gov-primaryDeep text-white px-24 py-9 rounded-[3rem] text-sm font-black uppercase tracking-[0.5em] shadow-glow transition-all active:scale-95">
                  Connect to Portal
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gov-border/50 py-32 bg-gov-surface/20 relative overflow-hidden w-full">
        <div className={`${fluidPx} w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 text-left`}>
          <div className="space-y-12">
            <div className="flex items-center space-x-5">
              <div className="h-14 w-14 rounded-xl bg-gov-primary flex items-center justify-center text-white"><FileSearch size={28} /></div>
              <h4 className="text-2xl font-black text-gov-primary tracking-tighter uppercase leading-[0.95] font-display">MDoNER <br />Prasthav-AI</h4>
            </div>
          </div>
          {['Platform', 'Governance', 'Contact'].map((title, i) => (
            <div key={i} className="space-y-10">
              <h5 className="text-[12px] font-black text-gov-primary uppercase tracking-[0.5em]">{title}</h5>
              <ul className="space-y-6">
                {['Directives', 'Standards', 'Support', 'Privacy'].map((link, j) => (
                  <li key={j}><a href="#" className="text-[10px] font-black text-gov-text-muted hover:text-gov-primary transition-all uppercase tracking-[0.3em] block">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={`${fluidPx} w-full mt-32 pt-16 border-t border-gov-border/20 flex flex-col md:flex-row justify-between items-center gap-10`}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Ashoka_Chakra.svg/1200px-Ashoka_Chakra.svg.png" className="h-12 opacity-30 grayscale contrast-200" alt="India Symbol" />
          <p className="text-[10px] font-black text-gov-primary tracking-[0.5em] uppercase leading-none opacity-50">SIH 2024 · MINISTRY OF DoNER · PRISTINE_SOLUTION_V1</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
