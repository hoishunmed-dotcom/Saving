import React, { useEffect, useState } from 'react';
import { FinancialSummary, Transaction, Goal } from '../types';
import { getShinChanAdvice } from '../services/geminiService';
import { MessageCircle, Sparkles } from 'lucide-react';

interface Props {
  summary: FinancialSummary;
  latestTransaction: Transaction | null;
  goals: Goal[];
  lastUpdate: number; // Used to trigger refresh
}

export const ShinChanAdvisor: React.FC<Props> = ({ summary, latestTransaction, goals, lastUpdate }) => {
  const [advice, setAdvice] = useState<string>("嘿嘿，讓我看看你的錢包...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      const message = await getShinChanAdvice(summary, latestTransaction, goals);
      setAdvice(message);
      setLoading(false);
    };

    // Debounce slightly to avoid excessive calls
    const timer = setTimeout(() => {
        fetchAdvice();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastUpdate]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
      {/* Shin-chan Avatar Placeholder - Using CSS art style representation or placeholder */}
      <div className="flex-shrink-0 relative">
        <div className="w-24 h-24 bg-red-500 rounded-full border-4 border-black overflow-hidden relative shadow-[4px_4px_0_0_#000]">
           <img 
             src="https://picsum.photos/200/200?random=shinchan" 
             alt="Shin-chan" 
             className="w-full h-full object-cover"
           />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black rounded-full p-1">
            <Sparkles size={16} />
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="flex-grow relative bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0_0_#000]">
        {/* Triangle tail for speech bubble */}
        <div className="absolute top-6 -left-4 w-0 h-0 
            border-t-[10px] border-t-transparent
            border-r-[16px] border-r-black
            border-b-[10px] border-b-transparent">
        </div>
        <div className="absolute top-6 -left-[10px] w-0 h-0 
            border-t-[7px] border-t-transparent
            border-r-[13px] border-r-white
            border-b-[7px] border-b-transparent">
        </div>

        <div className="flex items-center gap-2 mb-2">
            <span className="font-black text-red-500 text-lg">野原新之助</span>
            {loading && <span className="text-xs text-gray-400 animate-pulse">思考中...</span>}
        </div>
        <p className="text-lg font-bold text-gray-800 leading-relaxed">
          {advice}
        </p>
      </div>
    </div>
  );
};
