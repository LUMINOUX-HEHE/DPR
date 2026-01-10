
import React from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center space-x-3 text-amber-800">
        <div className="bg-amber-100 p-2 rounded-full">
          <WifiOff size={20} />
        </div>
        <div>
          <p className="font-bold text-sm uppercase tracking-wide">Work Mode: Offline</p>
          <p className="text-xs text-amber-700">Changes will be saved locally and synced once connection is restored.</p>
        </div>
      </div>
      <button 
        className="flex items-center space-x-2 bg-white border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-colors"
        onClick={() => window.location.reload()}
      >
        <RefreshCcw size={16} />
        <span>Try Sync Now</span>
      </button>
    </div>
  );
};

export default OfflineBanner;
