
import React from 'react';
import { Tender, Bid, UserRole } from '../types';
import { CURRENCIES } from '../constants';

interface EvaluationReportProps {
  tender: Tender;
  bids: Bid[];
  onSelectWinner: (bidId: string) => void;
  isAwarded: boolean;
  t: (key: string) => string;
  viewerRole?: UserRole;
}

export const EvaluationReport: React.FC<EvaluationReportProps> = ({ 
  tender, bids, onSelectWinner, isAwarded, t, viewerRole = 'VENDOR' 
}) => {
  const sortedBids = [...(bids || [])].sort((a, b) => (b.evaluation?.totalScore || 0) - (a.evaluation?.totalScore || 0));
  const symbol = CURRENCIES[tender.currency]?.symbol || '$';

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 80) return 'text-indigo-500';
    if (score >= 70) return 'text-sky-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getRankStyle = (idx: number) => {
    if (idx === 0) return 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-emerald-100';
    if (idx === 1) return 'bg-sky-50 border-sky-200 text-sky-600 shadow-sky-100';
    if (idx === 2) return 'bg-amber-50 border-amber-200 text-amber-600 shadow-amber-100';
    return 'bg-slate-50 border-slate-100 text-slate-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 9) return 'from-emerald-400 to-emerald-600 shadow-emerald-100';
    if (score >= 8) return 'from-indigo-400 to-indigo-600 shadow-indigo-100';
    if (score >= 7) return 'from-sky-400 to-sky-600 shadow-sky-100';
    if (score >= 5) return 'from-amber-400 to-amber-600 shadow-amber-100';
    return 'from-rose-400 to-rose-600 shadow-rose-100';
  };

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="bg-white rounded-[4rem] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full -ml-48 -mb-48 blur-[100px] pointer-events-none"></div>
        
        <div className="bg-slate-900 px-6 sm:px-16 py-12 sm:py-20 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8 sm:gap-10">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-indigo-500/30 to-sky-500/30 text-indigo-200 px-4 sm:px-5 py-2 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] inline-block mb-6 sm:mb-8 border border-white/10 backdrop-blur-md">
                {viewerRole === 'NEEDER' ? 'Analytical Intelligence Protocol' : 'Public Transparency Verification'}
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight sm:leading-none italic-custom mb-6 sm:mb-8">
                {viewerRole === 'NEEDER' ? t('aiReport') : t('publicLeaderboard')}
              </h2>
              <p className="text-indigo-100/60 font-semibold text-lg sm:text-xl max-w-2xl leading-relaxed">
                {viewerRole === 'NEEDER' 
                  ? `Automated strategic deep-dive across ${sortedBids.length} competing proposals.`
                  : `Verified consensus report detailing competitive quotations.`
                }
              </p>
            </div>
            <div className="flex items-center space-x-6 sm:space-x-10 p-6 sm:p-8 bg-white/5 rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 backdrop-blur-xl w-max">
               <div className="text-center">
                 <div className="text-2xl sm:text-3xl font-black text-emerald-400">{sortedBids.length}</div>
                 <div className="text-[8px] sm:text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Bids</div>
               </div>
               <div className="w-px h-8 sm:h-10 bg-white/10"></div>
               <div className="text-center">
                 <div className="text-2xl sm:text-3xl font-black text-indigo-400">AI</div>
                 <div className="text-[8px] sm:text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Active</div>
               </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none rotate-12">
             <svg className="w-[500px] h-[500px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
          </div>
        </div>

        <div className="p-0 overflow-x-auto scrollbar-thin selection:bg-indigo-100 selection:text-indigo-900">
          <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                <th className="py-6 sm:py-10 px-6 sm:px-16 whitespace-nowrap">Rank</th>
                <th className="py-6 sm:py-10 px-6 sm:px-8">Partner Entity</th>
                <th className="py-6 sm:py-10 px-6 sm:px-8">Financials</th>
                <th className="py-6 sm:py-10 px-6 sm:px-8 text-center whitespace-nowrap">AI Score</th>
                <th className="py-6 sm:py-10 px-6 sm:px-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {sortedBids.map((bid, idx) => (
                <React.Fragment key={bid.id}>
                  <tr className={`group transition-all duration-500 ${bid.id === tender.winnerBidId ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'}`}>
                    <td className="py-12 px-16 align-top">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl border-4 transition-all group-hover:scale-110 group-hover:rotate-3 duration-500 ${getRankStyle(idx)}`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="py-12 px-8 align-top max-w-sm">
                      <div className="font-black text-slate-900 text-2xl tracking-tighter mb-3 group-hover:text-indigo-600 transition-colors uppercase font-outfit">{bid.vendorName}</div>
                      <div className="text-sm text-slate-500 font-medium leading-relaxed italic-custom line-clamp-3 group-hover:line-clamp-none transition-all duration-700 bg-slate-50/50 group-hover:bg-white p-4 rounded-2xl border border-transparent group-hover:border-slate-100">
                        {bid.evaluation?.explanation || "Parsing architectural specifications and commercial transparency protocols..."}
                      </div>
                    </td>
                    <td className="py-12 px-8 align-top">
                      <div className="text-3xl font-black text-slate-900 tracking-tighter font-outfit">{symbol}{bid.quotation.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-3 tracking-[0.2em] flex items-center bg-slate-50 w-max px-3 py-1 rounded-lg border border-slate-100">
                        <span className={`w-2 h-2 rounded-full mr-2 animate-pulse ${idx === 0 ? 'bg-emerald-500' : 'bg-sky-400'}`}></span>
                        Guaranteed Quote
                      </div>
                    </td>
                    <td className="py-8 sm:py-12 px-6 sm:px-8 align-top text-center">
                      <div className="relative inline-flex items-center justify-center group/ring">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-0 group-hover/ring:opacity-20 transition-opacity bg-current ${getScoreColor(bid.evaluation?.totalScore || 0)}`}></div>
                        <svg className="w-16 h-16 sm:w-24 h-24 transform -rotate-90 group-hover/ring:scale-110 transition-transform duration-700 relative z-10">
                          <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                          <circle className={`transition-all duration-1000 ease-in-out ${getScoreColor(bid.evaluation?.totalScore || 0)}`} strokeWidth="8" strokeDasharray={`${Math.PI * 2 * 40}`} strokeDashoffset={`${Math.PI * 2 * 40 * (1 - (bid.evaluation?.totalScore || 10)/100)}`} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="48" cy="48" />
                        </svg>
                        <div className="absolute flex flex-col items-center z-10">
                          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none font-outfit">{bid.evaluation?.totalScore || "—"}</span>
                          <span className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">Score</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-12 px-16 align-top text-right">
                      {bid.id === tender.winnerBidId ? (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl shadow-emerald-200 border-4 border-emerald-50 animate-fade group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em]">Awarded</span>
                          </div>
                        </div>
                      ) : (
                        viewerRole === 'NEEDER' ? (
                          <button
                            onClick={() => onSelectWinner(bid.id)}
                            disabled={isAwarded}
                            className={`px-10 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-xl group-hover:-translate-y-1 ${
                              isAwarded 
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none' 
                              : `grad-${idx === 0 ? 'emerald' : 'indigo'} text-white border-4 border-white/20 active:scale-95 shadow-${idx === 0 ? 'emerald' : 'indigo'}-100`
                            }`}
                          >
                            Execute Award
                          </button>
                        ) : (
                          <div className="text-[11px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-6 py-4 rounded-[1.2rem] inline-block border border-slate-100">Evaluated</div>
                        )
                      )}
                    </td>
                  </tr>
                  {bid.evaluation?.featureScores && (
                    <tr className={`${bid.id === tender.winnerBidId ? 'bg-emerald-50/40' : ''}`}>
                      <td colSpan={5} className="px-6 sm:px-16 pb-12 sm:pb-16">
                        <div className="bg-white/60 backdrop-blur-2xl p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-200/60 shadow-premium relative overflow-hidden group/details hover:bg-white transition-all duration-500">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50 rounded-full -mr-24 -mt-24 opacity-40 blur-3xl group-hover/details:bg-indigo-100 transition-colors"></div>
                          <div className="flex items-center space-x-4 sm:space-x-5 mb-8 sm:mb-10">
                             <div className={`w-1.5 sm:w-2 h-5 sm:h-6 rounded-full grad-${getScoreColor(bid.evaluation.totalScore).split('-')[1]}`}></div>
                             <h4 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-extrabold">Performance Profile</h4>
                          </div>
                          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-x-8 sm:gap-x-12 gap-y-8 sm:gap-y-12">
                            {bid.evaluation.featureScores.map(fs => (
                              <div key={fs.featureId} className="flex flex-col group/score">
                                <div className="flex justify-between items-end mb-3 sm:mb-4 px-1">
                                  <span className="text-[10px] sm:text-xs font-black text-slate-800 truncate pr-3 group-hover/score:text-slate-900 transition-colors uppercase tracking-tight font-outfit">{fs.name}</span>
                                  <span className={`text-[10px] sm:text-[11px] font-black bg-white px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl shadow-sm border border-slate-100 ${getScoreColor(fs.score * 10)}`}>{fs.score}/10</span>
                                </div>
                                <div className="h-3 sm:h-4 bg-slate-200/30 rounded-full overflow-hidden shadow-inner p-0.5 sm:p-1 group-hover/score:bg-slate-200/50 transition-colors">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-[2s] cubic-bezier(0.19, 1, 0.22, 1) bg-gradient-to-r shadow-lg ${getProgressColor(fs.score)}`} 
                                    style={{ width: `${fs.score * 10}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {sortedBids.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-48 text-center section-tint-indigo">
                    <div className="w-24 h-24 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-50 rotate-12">
                      <svg className="w-12 h-12 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[11px]">Secure database locked.<br/>No quotations submitted for this period.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

