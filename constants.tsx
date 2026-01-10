
import { TranslationStrings, DPR, ProjectStatus, RiskLevel } from './types';

export const TRANSLATIONS: TranslationStrings = {
  dashboard: { EN: 'Executive Dashboard', HI: 'कार्यकारी डैशबोर्ड', AS: 'কাৰ্যবাহী ড্যাশবৰ্ড' },
  dpr_management: { EN: 'DPR Repository', HI: 'डीपीआर भंडार', AS: 'ডিপিআৰ ভঁৰাল' },
  evaluation: { EN: 'AI Evaluation', HI: 'एआई मूल्यांकन', AS: 'এআই মূল্যায়ন' },
  analytics: { EN: 'Insight Engine', HI: 'इनसाइट इंजन', AS: 'ইনচাইট ইঞ্জিন' },
  admin_panel: { EN: 'System Admin', HI: 'सिस्टम एडमिन', AS: 'চিষ্টেম এডমিন' },
  logout: { EN: 'Secure Logout', HI: 'सुरक्षित लॉगआउट', AS: 'সুৰক্ষিত লগআউট' },
  total_dprs: { EN: 'Total Submissions', HI: 'कुल सबमिशन', AS: 'মুঠ দাখিল' },
  under_review: { EN: 'Under Scrutiny', HI: 'जांच के अधीन', AS: 'পৰীক্ষাধীন' },
  approved: { EN: 'Cleared Projects', HI: 'मंजूर परियोजनाएं', AS: 'অনুমোদিত প্ৰকল্প' },
  high_risk: { EN: 'High Risk Alert', HI: 'उच्च जोखिम अलर्ट', AS: 'উচ্চ বিপদাশঙ্কাৰ সতৰ্কবাণী' },
  upload_new: { EN: 'New DPR Submission', HI: 'नया डीपीआर सबमिशन', AS: 'নতুন ডিপিআৰ দাখিল' },
  search_placeholder: { EN: 'Search records by ID or Name...', HI: 'आईডি বা নাম সে খোঁজেন...', AS: 'আইডি বা নামৰ দ্বাৰা সন্ধান কৰক...' },
  status_pending: { EN: 'Pending', HI: 'लंबित', AS: 'বিচাৰাধীন' },
  risk_low: { EN: 'Low', HI: 'कम', AS: 'নিম্ন' },
  risk_medium: { EN: 'Medium', HI: 'मध्यम', AS: 'মধ্যম' },
  risk_high: { EN: 'High', HI: 'उच्च', AS: 'উচ্চ' },
};


export const CHART_COLORS = {
  primary: '#312e81',   // Deep Indigo (AI Primary)
  secondary: '#059669', // Muted Emerald (Success)
  tertiary: '#d97706',  // Muted Amber (Warning)
  danger: '#be123c',    // Muted Rose (Risk)
  neutral: '#64748b'    // Slate
};
