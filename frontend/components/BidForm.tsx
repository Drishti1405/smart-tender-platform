
import React, { useState } from 'react';
import { Tender, PaymentMode } from '../types';
import { CURRENCIES } from '../constants';
import { cleanLigatures } from '../services/utils';

interface BidFormProps {
  tender: Tender;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export const BidForm: React.FC<BidFormProps> = ({ tender, onSubmit, onCancel, t }) => {
  const [formData, setFormData] = useState({
    solution: '',
    fitExplanation: '',
    quotation: tender.minBudget,
    timeline: '',
    paymentMode: tender.paymentMode
  });



  const symbol = CURRENCIES[tender.currency]?.symbol || '$';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      solution: cleanLigatures(formData.solution), 
      fitExplanation: cleanLigatures(formData.fitExplanation), 
      currency: tender.currency 
    });
  };

  return (
    <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] border border-slate-100 animate-slide-up max-w-4xl mx-auto relative overflow-hidden group-form selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse"></div>
      
      <div className="bg-slate-900 px-6 sm:px-16 py-10 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 grad-ocean opacity-10"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 grad-ocean rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-2xl shadow-cyan-500/20">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-tight sm:leading-none mb-3 uppercase font-outfit">{t('submitBid')}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-3 text-slate-400 font-bold text-xs sm:text-sm">
              <span className="uppercase tracking-[0.2em] opacity-60">Objective</span>
              <span className="hidden sm:block w-1 h-1 bg-slate-700 rounded-full"></span>
              <span className="text-sky-400 bg-sky-400/10 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest border border-sky-400/20 w-max">{tender.title}</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Currency</span>
            <div className="text-xl sm:text-2xl font-black text-white font-outfit">{tender.currency} <span className="text-slate-600">({symbol})</span></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-16 space-y-10 sm:space-y-12 relative z-10">
        <div className="space-y-4 group/field">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within/field:text-indigo-600 transition-colors">
            {t('solution')}
          </label>
          <textarea
            required
            rows={5}
            className="w-full px-8 py-7 rounded-[2.5rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 bg-slate-50/50 leading-relaxed font-semibold text-slate-900 shadow-sm"
            placeholder="Engineer your proposed technical solution and deployment architecture..."
            value={formData.solution}
            onChange={e => setFormData(p => ({...p, solution: cleanLigatures(e.target.value)}))}
          />
        </div>

        <div className="space-y-4 group/field">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within/field:text-indigo-600 transition-colors">
            {t('fit')}
          </label>
          <textarea
            required
            rows={3}
            className="w-full px-8 py-7 rounded-[2.5rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 bg-slate-50/50 leading-relaxed font-semibold text-slate-900 shadow-sm"
            placeholder="Articulate the strategic alignment and performance advantages of your proposal..."
            value={formData.fitExplanation}
            onChange={e => setFormData(p => ({...p, fitExplanation: cleanLigatures(e.target.value)}))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within/field:text-indigo-600 transition-colors">
              Financial Proposal Value
            </label>
            <div className="relative">
              <input
                required
                type="number"
                className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-slate-50/50 font-black text-slate-900 shadow-sm text-lg"
                value={formData.quotation}
                onChange={e => setFormData(p => ({...p, quotation: Number(e.target.value)}))}
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-indigo-500 font-black text-xl font-outfit">{symbol}</div>
            </div>
          </div>
          <div className="space-y-4 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 group-focus-within/field:text-indigo-600 transition-colors">
              Operational {t('timeline')}
            </label>
            <div className="relative">
              <input
                required
                className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-slate-50/50 font-black text-slate-900 shadow-sm text-lg"
                placeholder="e.g. 45 Business Days"
                value={formData.timeline}
                onChange={e => setFormData(p => ({...p, timeline: e.target.value}))}
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">{t('paymentMode')}</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setFormData(p => ({...p, paymentMode: 'PRE_DELIVERY'}))}
              className={`py-6 rounded-[2rem] border-4 font-black text-[11px] transition-all uppercase tracking-[0.2em] relative overflow-hidden ${
                formData.paymentMode === 'PRE_DELIVERY' 
                  ? 'grad-indigo border-white text-white shadow-2xl shadow-indigo-200 scale-[1.02]' 
                  : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'
              }`}
            >
              {t('preDelivery')}
            </button>
            <button
              type="button"
              onClick={() => setFormData(p => ({...p, paymentMode: 'AFTER_DELIVERY'}))}
              className={`py-6 rounded-[2rem] border-4 font-black text-[11px] transition-all uppercase tracking-[0.2em] relative overflow-hidden ${
                formData.paymentMode === 'AFTER_DELIVERY' 
                  ? 'grad-emerald border-white text-white shadow-2xl shadow-emerald-200 scale-[1.02]' 
                  : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'
              }`}
            >
              {t('afterDelivery')}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:gap-8 pt-10 sm:pt-16 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-10 py-5 text-slate-400 hover:text-slate-900 font-extrabold transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-outfit"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-12 sm:px-20 py-5 sm:py-7 bg-slate-900 text-white font-black rounded-xl sm:rounded-[2rem] shadow-2xl shadow-indigo-100 hover:grad-indigo hover:-translate-y-1 transition-all active:scale-95 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] border-4 border-white/20"
          >
            {t('submitFinalBid')}
          </button>
        </div>
      </form>
    </div>
  );
};

