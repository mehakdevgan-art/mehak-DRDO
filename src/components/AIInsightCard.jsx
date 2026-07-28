import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Info, Zap } from 'lucide-react';

export default function AIInsightCard({ title, description, confidence, priority, impact, type = 'info' }) {
  const getIcon = () => {
    switch (type) {
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'danger': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'success': return <TrendingUp className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'warning': return 'border-orange-500/30';
      case 'danger': return 'border-red-500/30';
      case 'success': return 'border-green-500/30';
      default: return 'border-blue-500/30';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'warning': return 'bg-orange-500/5';
      case 'danger': return 'bg-red-500/5';
      case 'success': return 'bg-green-500/5';
      default: return 'bg-blue-500/5';
    }
  };

  return (
    <div className={`rounded-xl border ${getBorderColor()} ${getBgColor()} p-5 shadow-sm transition-all hover:shadow-md relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
        <Zap className="w-16 h-16" />
      </div>
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 flex items-center gap-1">
           <Zap className="w-3 h-3"/> {confidence}% Match
        </span>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 relative z-10 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center gap-4 text-xs mt-auto pt-3 border-t border-gray-200 dark:border-gray-700/50 relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 dark:text-gray-400">Priority:</span>
          <span className={`font-medium ${priority === 'High' ? 'text-red-500' : priority === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
            {priority}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 dark:text-gray-400">Impact:</span>
          <span className="font-medium text-gray-700 dark:text-gray-200">{impact}</span>
        </div>
      </div>
    </div>
  );
}
