
import React, { useState, useEffect } from 'react';
import { CATEGORIES, CURRENCIES, LANGUAGE_CURRENCY_MAP } from '../constants';
import { CurrencyCode, TenderFeature, Priority, PaymentMode, Language } from '../types';
import { cleanLigatures } from '../services/utils';

interface TenderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
  language: Language;
}

export const TenderForm: React.FC<TenderFormProps> = ({ onSubmit, onCancel, t, language }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    situation: '',
    category: CATEGORIES[0],
    currency: (LANGUAGE_CURRENCY_MAP[language] || 'USD') as CurrencyCode,
    minBudget: 0,
    maxBudget: 0,
    requiredDays: 30,
    requiredBy: '',
    paymentMode: 'AFTER_DELIVERY' as PaymentMode,
    closingDate: '',
    closingTime: ''
  });

  const [features, setFeatures] = useState<TenderFeature[]>([]);

  useEffect(() => {
    const defaultCurrency = (LANGUAGE_CURRENCY_MAP[language] || 'USD') as CurrencyCode;
    setFormData(prev => ({ ...prev, currency: defaultCurrency }));
  }, [language]);

  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeaturePriority, setNewFeaturePriority] = useState<Priority>(5);

  const addFeature = () => {
    if (newFeatureName.trim()) {
      setFeatures([
        ...features,
        { id: Math.random().toString(36).substr(2, 9), name: newFeatureName, priority: newFeaturePriority }
      ]);
      setNewFeatureName('');
      setNewFeaturePriority(5);
    }
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (features.length === 0) {
      alert("Please add at least one feature.");
      return;
    }
    const closingTimeISO = new Date(`${formData.closingDate}T${formData.closingTime}`).toISOString();
    onSubmit({
      ...formData,
      title: cleanLigatures(formData.title),
      description: cleanLigatures(formData.description),
      situation: cleanLigatures(formData.situation),
      closingTime: closingTimeISO,
      features: features.map(f => ({ ...f, name: cleanLigatures(f.name) })),
      minBudget: Number(formData.minBudget),
      maxBudget: Number(formData.maxBudget)
    });
  };



  return (
    <div className="bg-white rounded-[4rem] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden animate-slide-up max-w-4xl mx-auto relative group-form selection:bg-indigo-100 selection:text-indigo-900">
      <div className="bg-slate-900 px-6 sm:px-16 py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full -ml-24 -mb-24 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 grad-indigo rounded-[1.2rem] sm:rounded-2xl flex items-center justify-center text-white mb-6 sm:mb-8 shadow-2xl shadow-indigo-500/20">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-tight sm:leading-none mb-4 sm:mb-6 italic-custom">{t('newTender')}</h2>
          <p className="text-indigo-100/60 text-base sm:text-lg font-semibold tracking-tight max-w-2xl leading-relaxed">
            Construct your architectural procurement mandate. 
            Precision inputs ensure AI-driven vendor alignment.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-16 space-y-12 sm:space-y-20">
        <section className="space-y-12">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 grad-ocean rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] font-outfit">Core Specification</h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1 opacity-60">Primary Project Identity</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="md:col-span-2 space-y-4 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">{t('tenderTitle')}</label>
              <input required className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-slate-50/50 font-bold transition-all text-slate-900 placeholder:text-slate-300 shadow-sm" placeholder="e.g. Strategic Cloud Migration: Phase III (Global Hubs)" value={formData.title} onChange={e => setFormData(p => ({...p, title: cleanLigatures(e.target.value)}))} />
            </div>

            <div className="md:col-span-2 space-y-4 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">{t('requirements')}</label>
              <textarea required rows={5} className="w-full px-8 py-7 rounded-[2.5rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-slate-50/50 font-semibold leading-relaxed transition-all text-slate-900 placeholder:text-slate-300 shadow-sm" placeholder="Codify the technical mission and expected operational outcomes..." value={formData.description} onChange={e => setFormData(p => ({...p, description: cleanLigatures(e.target.value)}))} />
            </div>

            <div className="md:col-span-2 space-y-4 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">{t('situation')}</label>
              <textarea required rows={3} className="w-full px-8 py-7 rounded-[2.5rem] border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-slate-50/50 font-semibold leading-relaxed transition-all text-slate-900 placeholder:text-slate-300 shadow-sm" placeholder="Articulate the strategic context and procurement urgency..." value={formData.situation} onChange={e => setFormData(p => ({...p, situation: cleanLigatures(e.target.value)}))} />
            </div>

            <div className="space-y-4 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">{t('category')}</label>
              <div className="relative">
                <select className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 cursor-pointer font-bold transition-all focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 appearance-none text-slate-900 shadow-sm" value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-4 group/field">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-indigo-600 transition-colors">Investment Parameters</label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                <select className="w-full sm:w-[120px] px-6 sm:px-6 py-4 sm:py-6 rounded-xl sm:rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 font-black text-xs transition-all focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 appearance-none text-center shadow-sm" value={formData.currency} onChange={e => setFormData(p => ({...p, currency: e.target.value as CurrencyCode}))}>
                  {Object.entries(CURRENCIES).map(([code]) => <option key={code} value={code}>{code}</option>)}
                </select>
                <div className="flex-1 flex gap-3 sm:gap-4">
                   <input required type="number" placeholder="Floor" className="w-1/2 px-6 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 font-bold transition-all focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 text-slate-900 shadow-sm text-sm" value={formData.minBudget} onChange={e => setFormData(p => ({...p, minBudget: Number(e.target.value)}))} />
                   <input required type="number" placeholder="Ceiling" className="w-1/2 px-6 sm:px-8 py-4 sm:py-6 rounded-xl sm:rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 font-bold transition-all focus:ring-8 focus:ring-indigo-50 focus:border-indigo-500 text-slate-900 shadow-sm text-sm" value={formData.maxBudget} onChange={e => setFormData(p => ({...p, maxBudget: Number(e.target.value)}))} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-12 sm:pt-20 border-t border-slate-50">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 sm:mb-12">
             <div className="flex items-center space-x-4">
               <div className="w-10 h-10 grad-sky rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-100">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
               </div>
               <div className="flex flex-col">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] font-outfit">Priority Requirements</h3>
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1 opacity-60">AI Weightage Matrix (1-10)</span>
               </div>
             </div>
             <button type="button" onClick={addFeature} className="grad-sky text-white px-6 sm:px-10 py-4 sm:py-4 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-sky-100 hover:-translate-y-1 transition-all active:scale-95 border-4 border-white/20">+ Inject Parameter</button>
           </div>
           
           <div className="space-y-6 sm:space-y-8">
             <div className="flex flex-col md:flex-row gap-6 sm:gap-8 bg-slate-50/80 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-slate-100/50 shadow-inner group/add">
                <div className="flex-1 space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/add:text-sky-600 transition-colors">Parameter Designation</label>
                  <input className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-sky-50 focus:border-sky-500 outline-none bg-white font-bold transition-all shadow-sm text-sm" placeholder="e.g. Latency < 50ms..." value={newFeatureName} onChange={e => setNewFeatureName(cleanLigatures(e.target.value))} />
                </div>
                <div className="w-full md:w-48 space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/add:text-sky-600 transition-colors">Impact (1-10)</label>
                  <input type="number" min="1" max="10" className="w-full px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-sky-50 focus:border-sky-500 outline-none bg-white font-black text-center transition-all shadow-sm text-base sm:text-lg" value={newFeaturePriority} onChange={e => setNewFeaturePriority(Number(e.target.value) as Priority)} />
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {features.map(f => (
                 <div key={f.id} className="flex items-center justify-between p-8 bg-white border-2 border-slate-50 rounded-[2.2rem] shadow-premium hover:shadow-2xl hover:border-sky-100 transition-all animate-slide-up group/item relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full grad-sky opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                   <div className="flex items-center space-x-6">
                     <div className="w-12 h-12 grad-sky text-white flex items-center justify-center rounded-2xl text-sm font-black shadow-xl shadow-sky-100">{f.priority}</div>
                     <div className="flex flex-col">
                       <span className="font-extrabold text-slate-900 tracking-tight text-base font-outfit uppercase">{f.name}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Strategic Index: {f.priority}/10</span>
                     </div>
                   </div>
                   <button type="button" onClick={() => removeFeature(f.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-all bg-slate-50 rounded-2xl group-hover/item:bg-rose-50 group-hover/item:scale-110">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                 </div>
               ))}
               {features.length === 0 && (
                 <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Strategic matrix empty.<br/>Please define evaluation parameters.</p>
                 </div>
               )}
             </div>
           </div>
        </section>

        <section className="pt-20 border-t border-slate-50">
          <div className="flex items-center space-x-4 mb-12">
            <div className="w-10 h-10 grad-emerald rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] font-outfit">Protocol & Timeline</h3>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1 opacity-60">Submission Lockdown Sequence</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-4 group/field">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-emerald-600 transition-colors">Closing Date</label>
                <div className="relative">
                  <input required type="date" className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 font-bold transition-all focus:ring-8 focus:ring-emerald-50 focus:border-emerald-500 text-slate-900 appearance-none shadow-sm" value={formData.closingDate} onChange={e => setFormData(p => ({...p, closingDate: e.target.value}))} />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                </div>
             </div>
             <div className="space-y-4 group/field">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 group-focus-within/field:text-emerald-600 transition-colors">Closing Time (Zulu/UTC)</label>
                <div className="relative">
                  <input required type="time" className="w-full px-8 py-6 rounded-[1.8rem] border-2 border-slate-100 bg-slate-50/50 font-bold transition-all focus:ring-8 focus:ring-emerald-50 focus:border-emerald-500 text-slate-900 appearance-none shadow-sm" value={formData.closingTime} onChange={e => setFormData(p => ({...p, closingTime: e.target.value}))} />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>
             </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 sm:gap-8 pt-10 sm:pt-16 border-t border-slate-100">
          <button type="button" onClick={onCancel} className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-slate-400 hover:text-slate-900 font-extrabold transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-outfit">{t('cancel')}</button>
          <button type="submit" className="w-full sm:w-auto px-12 sm:px-20 py-5 sm:py-7 bg-slate-900 text-white font-black rounded-xl sm:rounded-[2rem] shadow-2xl shadow-indigo-100 hover:grad-indigo hover:-translate-y-1 transition-all text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] border-4 border-white/20 active:scale-95">{t('publishTender')}</button>
        </div>
      </form>
    </div>
  );
};

