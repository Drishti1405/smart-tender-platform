
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout } from './components/Layout';
import { TenderForm } from './components/TenderForm';
import { BidForm } from './components/BidForm';
import { EvaluationReport } from './components/EvaluationReport';
import { ChatWindow } from './components/ChatWindow';
import { AuthForm } from './components/AuthForm';
import { useMockData } from './hooks/useMockData';
import { CATEGORIES, CURRENCIES, LANGUAGE_CURRENCY_MAP } from './constants';
import { evaluateBid } from './services/gemini';
import { Tender, Bid, CurrencyCode, Language } from './types';


export default function App() {
  const {
    tenders, bids, messages, notifications, currentUser, registeredUsers, language,
    setLanguage, t, setCurrentUser, registerUser, loginUser, toggleUserRole,
    addTender, addBid, updateTenderStatus, updateBidEvaluation, addMessage, markMessagesAsRead, markBidsAsSeen,
    markNotificationAsRead, markAllNotificationsAsRead, clearNotifications
  } = useMockData();

  const [view, setView] = useState<'DASHBOARD' | 'CREATE_TENDER' | 'BID_SUBMISSION' | 'EVALUATION' | 'CHAT'>('DASHBOARD');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'LIVE' | 'FINISHED'>('LIVE');

  // Strict Tender Auto-Closer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expiredTenders = (tenders || []).filter(t =>
        t.status === 'OPEN' && t.closingTime && new Date(t.closingTime) <= now
      );

      expiredTenders.forEach(t => {
        updateTenderStatus(t.id, 'CLOSED');
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [tenders, updateTenderStatus]);

  useEffect(() => {
    if (view === 'CHAT' && selectedTender && currentUser) {
      markMessagesAsRead(selectedTender.id, currentUser.id);
    }
    if (view === 'EVALUATION' && selectedTender && currentUser?.role === 'NEEDER') {
      markBidsAsSeen(selectedTender.id);
    }
  }, [view, selectedTender, (messages || []).length, (bids || []).length, currentUser, markMessagesAsRead, markBidsAsSeen]);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('DASHBOARD');
  }, [setCurrentUser]);

  const handleNotificationClick = useCallback((n: any) => {
    markNotificationAsRead(n.id);
    if (n.link) {
      if (n.link.tenderId) {
        const tender = tenders.find(t => t.id === n.link.tenderId);
        if (tender) setSelectedTender(tender);
      }
      if (n.link.view) {
        setView(n.link.view);
      }
    }
  }, [tenders, markNotificationAsRead]);

  const startEvaluation = async (tender: Tender) => {
    setIsEvaluating(true);
    const tenderBids = (bids || []).filter(b => b.tenderId === tender.id);
    
    try {
      const evaluationResults = await Promise.all(tenderBids.map(async (bid) => {
        if (!bid.evaluation) {
          const result = await evaluateBid(tender, bid);
          updateBidEvaluation(bid.id, result);
          return { bidId: bid.id, score: result.totalScore };
        }
        return { bidId: bid.id, score: bid.evaluation.totalScore };
      }));
      
      if (evaluationResults.length > 0) {
        const bestBid = evaluationResults.reduce((max, obj) => obj.score > max.score ? obj : max);
        updateTenderStatus(tender.id, 'AWARDED', bestBid.bidId);
        setSelectedTender(prev => prev ? { ...prev, status: 'AWARDED', winnerBidId: bestBid.bidId } : null);
      } else {
        updateTenderStatus(tender.id, 'EVALUATED');
        setSelectedTender(prev => prev ? { ...prev, status: 'EVALUATED' } : null);
      }
    } catch (error) {
      console.error("Evaluation batch failed", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatCurrency = useCallback((amount: number, code: CurrencyCode) => {
    const symbol = CURRENCIES[code]?.symbol || '$';
    return `${symbol}${amount.toLocaleString()}`;
  }, []);

  const filteredTenders = useMemo(() => {
    return (tenders || []).filter(t => currentUser?.role === 'VENDOR' || t.creatorId === currentUser?.id);
  }, [tenders, currentUser]);

  const liveTenders = useMemo(() => filteredTenders.filter(t => t.status === 'OPEN'), [filteredTenders]);
  const finishedTenders = useMemo(() => filteredTenders.filter(t => t.status !== 'OPEN'), [filteredTenders]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-up">
          <AuthForm
            onSignIn={(email, pass) => loginUser(email, pass)}
            onSignUp={(name, email, pass, role) => registerUser({ name, email, password: pass, role })}
          />
        </div>
      </div>
    );
  }

  const renderTenderCard = (tender: Tender) => {
    const tenderBids = (bids || []).filter(b => b.tenderId === tender.id);
    const userBid = tenderBids.find(b => b.vendorId === currentUser.id);
    const isExpired = tender.closingTime ? new Date(tender.closingTime) <= new Date() : false;
    const bidCount = tenderBids.length;
    const tenderUnreadMessages = (messages || []).filter(m => m.tenderId === tender.id && m.senderId !== currentUser.id && !m.isRead).length;

    const getCategoryColor = (cat: string) => {
      if (cat.includes('Tech') || cat.includes('Software')) return 'sky';
      if (cat.includes('Infrastructure') || cat.includes('Construction')) return 'indigo';
      if (cat.includes('Service') || cat.includes('Consulting')) return 'emerald';
      if (cat.includes('Supply') || cat.includes('Goods')) return 'amber';
      return 'indigo';
    };

    const color = getCategoryColor(tender.category);

    return (
      <div key={tender.id} className={`card-premium h-full flex flex-col group hover:border-${color}-200 shadow-premium shadow-hover animate-slide-up overflow-hidden relative`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-50/50 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
        
        <div className="p-8 flex-1 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transform group-hover:translate-x-1 transition-transform badge-${tender.status === 'OPEN' ? 'emerald' : tender.status === 'AWARDED' ? 'indigo' : 'sky'}`}>
              {tender.status}
            </span>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1.5 bg-${color}-50 text-${color}-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-${color}-100 shadow-sm`}>{tender.category}</span>
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(bidCount, 3))].map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-${color}-100 flex items-center justify-center text-[8px] font-black text-${color}-600 shadow-sm`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  {bidCount > 3 && (
                    <div className={`w-6 h-6 rounded-full border-2 border-white bg-${color}-500 flex items-center justify-center text-[8px] font-black text-white shadow-sm`}>
                      +{bidCount - 3}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tight">{bidCount} Proposals</span>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-slate-700 transition-colors leading-tight line-clamp-2 italic-custom">
            {tender.title}
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className={`bg-${color}-50/30 rounded-2xl p-4 border border-${color}-100/50 group-hover:border-${color}-200/50 transition-colors`}>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Budget</span>
              <span className={`text-sm font-black text-${color}-700`}>
                {formatCurrency(tender.minBudget, tender.currency)} - {formatCurrency(tender.maxBudget, tender.currency)}
              </span>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 group-hover:bg-white transition-colors">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Time Remaining</span>
              <span className={`text-sm font-black ${isExpired ? 'text-rose-500' : 'text-slate-800'}`}>
                {isExpired ? 'DEADLINE REACHED' : new Date(tender.closingTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className={`px-8 py-6 bg-${color}-50/20 border-t border-${color}-100/50 mt-auto backdrop-blur-sm group-hover:bg-${color}-50/40 transition-colors`}>
          {currentUser.role === 'NEEDER' ? (
            <div className="flex flex-col space-y-3">
              {!isExpired && tender.status === 'OPEN' ? (
                <div className="w-full py-4 text-center bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                   Awaiting Submission Window
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setSelectedTender(tender);
                      if (tender.status === 'CLOSED') startEvaluation(tender);
                      setView('EVALUATION');
                    }}
                    className={`flex-1 grad-${color === 'emerald' ? 'emerald' : color === 'sky' ? 'sky' : 'indigo'} text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-${color}-100 flex items-center justify-center space-x-2 hover:scale-[1.02] transition-transform`}
                  >
                    {isEvaluating ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span>{tender.status === 'AWARDED' ? 'View Report' : 'Run AI Evaluation'}</span>
                      </>
                    )}
                  </button>
                  {tender.status === 'AWARDED' && (
                    <button
                      onClick={() => { setSelectedTender(tender); setView('CHAT'); }}
                      className="bg-white border border-slate-200 text-slate-700 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm relative group/chat"
                    >
                      Chat
                      {tenderUnreadMessages > 0 && (
                        <span className="absolute -top-2 -right-2 bg-rose-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[9px] ring-4 ring-white animate-bounce shadow-lg shadow-rose-200">
                          {tenderUnreadMessages}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full">
              {tender.status !== 'OPEN' ? (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => { setSelectedTender(tender); setView('EVALUATION'); }}
                    className={`w-full py-4 grad-${color === 'sky' ? 'sky' : color === 'amber' ? 'sunset' : 'indigo'} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-${color}-100`}
                  >
                    {t('viewResults')}
                  </button>
                  {tender.status === 'AWARDED' && userBid?.id === tender.winnerBidId && (
                    <button
                      onClick={() => { setSelectedTender(tender); setView('CHAT'); }}
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
                    >
                      {t('openSecureChat')}
                    </button>
                  )}
                </div>
              ) : (
                userBid ? (
                  <div className="flex items-center justify-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-inner">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Proposal Successfully Submitted
                    </span>
                  </div>
                ) : (
                  <button
                    disabled={isExpired}
                    onClick={() => { setSelectedTender(tender); setView('BID_SUBMISSION'); }}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isExpired
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : `grad-${color === 'emerald' ? 'emerald' : color === 'sky' ? 'sky' : 'indigo'} text-white shadow-xl shadow-${color}-100 hover:scale-[1.02]`
                    }`}
                  >
                    {isExpired ? 'Submission Closed' : 'Participate in Tender'}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <Layout
      user={currentUser}
      language={language}
      onLanguageChange={setLanguage}
      onLogout={handleLogout}
      onToggleRole={toggleUserRole}
      t={t}
      messages={messages || []}
      bids={bids || []}
      tenders={tenders || []}
      notifications={notifications || []}
      onNotificationClick={handleNotificationClick}
      onMarkNotificationsRead={markAllNotificationsAsRead}
      onClearNotifications={clearNotifications}
      onHomeClick={() => setView('DASHBOARD')}
    >
      {view === 'DASHBOARD' && (
        <div className="space-y-10 sm:space-y-16 animate-fade">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] sm:leading-[0.9] flex flex-col">
                <span className="text-indigo-600 text-xs sm:text-lg uppercase tracking-[0.3em] font-extrabold mb-2 sm:mb-3">{currentUser.role === 'NEEDER' ? 'Executive Dashboard' : 'Merchant Portal'}</span>
                {currentUser.role === 'NEEDER' ? 'Strategic Procurement' : 'Vendor Marketplace'}
              </h1>
              <p className="text-slate-400 mt-4 sm:mt-6 font-semibold text-base sm:text-xl max-w-xl leading-relaxed">
                Empowering decisions with 
                <span className="text-slate-900 border-b-2 sm:border-b-4 border-indigo-200 mx-1 sm:mx-2 whitespace-nowrap">Precision AI Analysis</span> 
                of enterprise tender proposals.
              </p>
            </div>
            {currentUser.role === 'NEEDER' && (
              <button
                onClick={() => setView('CREATE_TENDER')}
                className="btn-primary w-full lg:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-2xl relative z-10 hover:scale-105"
              >
                + Issue New Tender
              </button>
            )}
          </div>

          <div className="flex flex-col space-y-8 sm:space-y-10">
            <div className="flex items-center space-x-6 sm:space-x-12 border-b border-slate-100 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('LIVE')}
                className={`pb-4 sm:pb-5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === 'LIVE' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Active Openings 
                <span className="ml-2 sm:ml-3 px-2 py-0.5 bg-slate-100 rounded-md text-[9px] sm:text-[10px] text-slate-500 font-black">{liveTenders.length}</span>
                {activeTab === 'LIVE' && <div className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(99,102,241,0.4)]"></div>}
              </button>
              <button
                onClick={() => setActiveTab('FINISHED')}
                className={`pb-4 sm:pb-5 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === 'FINISHED' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Closed & Awarded
                <span className="ml-2 sm:ml-3 px-2 py-0.5 bg-slate-100 rounded-md text-[9px] sm:text-[10px] text-slate-500 font-black">{finishedTenders.length}</span>
                {activeTab === 'FINISHED' && <div className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 bg-indigo-600 rounded-t-full shadow-[0_-4px_12px_rgba(99,102,241,0.4)]"></div>}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(activeTab === 'LIVE' ? liveTenders : finishedTenders).length > 0 ? (
                (activeTab === 'LIVE' ? liveTenders : finishedTenders).map(renderTenderCard)
              ) : (
                <div className="col-span-full py-40 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 shadow-inner">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No entries found for this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {view === 'CREATE_TENDER' && (
        <TenderForm
          t={t}
          language={language}
          onCancel={() => setView('DASHBOARD')}
          onSubmit={(data) => {
            addTender({ ...data, creatorId: currentUser.id });
            setView('DASHBOARD');
          }}
        />
      )}

      {view === 'BID_SUBMISSION' && selectedTender && (
        <BidForm
          tender={selectedTender}
          t={t}
          onCancel={() => setView('DASHBOARD')}
          onSubmit={(data) => {
            addBid({
              ...data,
              tenderId: selectedTender.id,
              vendorId: currentUser.id,
              vendorName: currentUser.name
            });
            setView('DASHBOARD');
          }}
        />
      )}

      {view === 'EVALUATION' && selectedTender && (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <button onClick={() => setView('DASHBOARD')} className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center">
              &larr; Return to Dashboard
            </button>
            <div className="text-right">
              <h2 className="text-3xl font-black text-slate-900">{selectedTender.title}</h2>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 inline-block ${currentUser.role === 'NEEDER' ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'
                }`}>
                {currentUser.role === 'NEEDER' ? 'Owner Analysis View' : 'Public Transparency View'}
              </span>
            </div>
          </div>

          {isEvaluating ? (
            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-100 animate-pulse">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">AI is calculating scores...</h3>
              <p className="text-slate-500 font-medium mt-3">Evaluating all proposals and determining the best fit.</p>
            </div>
          ) : (
            <EvaluationReport
              tender={selectedTender}
              bids={(bids || []).filter(b => b.tenderId === selectedTender.id)}
              isAwarded={selectedTender.status === 'AWARDED'}
              onSelectWinner={(bidId) => {
                if (currentUser.role === 'NEEDER') {
                  updateTenderStatus(selectedTender.id, 'AWARDED', bidId);
                  setSelectedTender(prev => prev ? { ...prev, status: 'AWARDED', winnerBidId: bidId } : null);
                }
              }}
              t={t}
              viewerRole={currentUser.role}
            />
          )}
        </div>
      )}

      {view === 'CHAT' && selectedTender && (
        <div className="max-w-2xl mx-auto space-y-6">
          <button onClick={() => setView('DASHBOARD')} className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center">
            &larr; Dashboard
          </button>
          <ChatWindow
            tenderId={selectedTender.id}
            currentUser={currentUser}
            messages={messages || []}
            otherPartyName={currentUser.role === 'NEEDER'
              ? (bids || []).find(b => b.id === selectedTender.winnerBidId)?.vendorName || 'Vendor'
              : (registeredUsers || []).find(u => u.id === selectedTender.creatorId)?.name || 'Buyer'
            }
            onSendMessage={(text) => addMessage(selectedTender.id, currentUser.id, text)}
          />
        </div>
      )}
    </Layout>
  );
}
