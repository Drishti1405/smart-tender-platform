import React from 'react';
import { User, Language, ChatMessage, Bid, Tender, Notification } from '../types';

interface LayoutProps {
  user: User | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onToggleRole: () => void;
  t: (key: string) => string;
  messages: ChatMessage[];
  bids: Bid[];
  tenders: Tender[];
  notifications: Notification[];
  onNotificationClick: (n: Notification) => void;
  onMarkNotificationsRead: () => void;
  onClearNotifications: () => void;
  onHomeClick?: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  user,
  language,
  onLanguageChange,
  onLogout,
  onToggleRole,
  t,
  messages,
  bids,
  tenders,
  onHomeClick,
  notifications,
  onNotificationClick,
  onMarkNotificationsRead,
  onClearNotifications,
  children
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeNotifications = notifications || [];
  const unreadNotifications = safeNotifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'MESSAGE':
        return (
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm border border-sky-100/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
        );
      case 'EVALUATION':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
      case 'BID_SUBMITTED':
        return (
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-sm border border-violet-100/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center shadow-sm border border-slate-100/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe] selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => onHomeClick ? onHomeClick() : window.location.reload()}
          >
            <div className="w-11 h-11 grad-ocean rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-cyan-100 group-hover:rotate-6 transition-transform duration-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none font-outfit">
                STEP<span className="text-indigo-600">.</span>
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">Smart Evaluation</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* LANGUAGE */}
            <div className="hidden md:flex bg-slate-100/40 rounded-xl p-1 border border-slate-200/50 backdrop-blur-md">
              {(['EN', 'HI'] as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-4 py-2 text-[10px] font-black rounded-lg transition-all duration-300 ${
                    language === lang
                      ? 'bg-white text-indigo-600 shadow-md transform scale-[1.05]'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {user && (
              <div className="flex items-center space-x-3">
                {/* NOTIFICATIONS */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`p-2 sm:p-3 rounded-2xl transition-all duration-500 relative group/notif ${
                      isNotificationsOpen ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'text-slate-400 hover:bg-white hover:text-indigo-600 hover:shadow-lg'
                    }`}
                  >
                    <svg className="w-5 h-5 sm:w-6 h-6 group-hover/notif:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-rose-500 text-[8px] sm:text-[9px] font-black text-white ring-4 ring-white animate-pulse shadow-lg shadow-rose-200">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="fixed sm:absolute right-0 sm:right-0 left-0 sm:left-auto mt-6 sm:w-[420px] mx-4 sm:mx-0 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-slide-up origin-top-right">
                      <div className="px-8 py-7 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="font-black text-sm text-slate-900 uppercase tracking-[0.1em]">Intelligence Feed</h3>
                        {unreadNotifications > 0 && (
                          <button onClick={onMarkNotificationsRead} className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all">Clear New</button>
                        )}
                      </div>
                      
                      <div className="max-h-[500px] overflow-y-auto section-tint-indigo">
                        {safeNotifications.length > 0 ? (
                          <div className="divide-y divide-slate-50/50">
                            {safeNotifications.map(n => (
                              <button
                                key={n.id}
                                onClick={() => { onNotificationClick(n); setIsNotificationsOpen(false); }}
                                className={`w-full px-8 py-6 flex items-start space-x-5 hover:bg-white transition-all text-left relative group ${!n.isRead ? 'bg-indigo-50/20' : ''}`}
                              >
                                <div className="group-hover:scale-110 transition-transform">{getNotificationIcon(n.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm mb-1.5 line-clamp-1 ${!n.isRead ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>{n.title}</p>
                                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">{n.message}</p>
                                  <div className="flex items-center space-x-2 mt-3">
                                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                    <span className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest">{n.type.replace('_', ' ')}</span>
                                  </div>
                                </div>
                                {!n.isRead && <div className="w-3 h-3 rounded-full bg-indigo-600 mt-2 ring-8 ring-indigo-50/50"></div>}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-24 text-center px-12">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                              <svg className="w-9 h-9 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">System monitoring active.<br/>No alerts found.</p>
                          </div>
                        )}
                      </div>

                      {safeNotifications.length > 0 && (
                        <div className="p-6 bg-slate-50 border-t border-slate-100/50">
                          <button onClick={onClearNotifications} className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 hover:bg-white hover:rounded-2xl uppercase tracking-widest transition-all">Purge Notification History</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* USER PROFILE - DESKTOP */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="h-8 w-[1px] bg-slate-200/50 mx-2"></div>
                  <div className="flex items-center space-x-4 pl-2 group cursor-pointer">
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-sm font-black text-slate-900 leading-none font-outfit">{user.name}</span>
                      <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.15em] mt-2 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                        {t(user.role === 'NEEDER' ? 'Buyer' : 'Vendor')}
                      </span>
                    </div>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-[1rem] lg:rounded-[1.2rem] bg-slate-900 text-white flex items-center justify-center font-black border-4 border-slate-50 uppercase shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      {user.name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button onClick={onToggleRole} title="Switch Role" className="p-2.5 bg-white border border-slate-200/60 text-slate-500 hover:text-white hover:bg-slate-900 hover:border-slate-900 rounded-xl transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>
                    <button onClick={onLogout} title="Logout" className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all hover:shadow-inner">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                  </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SIDE DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div 
              ref={mobileMenuRef}
              className="relative w-80 h-full bg-white shadow-2xl p-8 flex flex-col animate-slide-up origin-right"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 grad-ocean rounded-xl flex items-center justify-center text-white font-black">{user?.name.charAt(0)}</div>
                  <span className="font-black text-slate-900">{user?.name}</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-8 flex-1">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operations</h4>
                  <button 
                    onClick={() => { onToggleRole(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all group"
                  >
                    <span className="font-extrabold text-slate-900">Switch Role</span>
                    <svg className="w-5 h-5 text-indigo-500 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                  </button>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Localization</h4>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50">
                    {(['EN', 'HI'] as Language[]).map(lang => (
                      <button
                        key={lang}
                        onClick={() => { onLanguageChange(lang); setIsMobileMenuOpen(false); }}
                        className={`py-3 text-[11px] font-black rounded-xl transition-all ${
                          language === lang
                            ? 'bg-white text-indigo-600 shadow-md ring-2 ring-indigo-50'
                            : 'text-slate-400'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                className="w-full py-5 bg-rose-50 text-rose-500 font-black rounded-2xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest text-xs"
              >
                Terminate Session
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 animate-fade section-tint-blue">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 grad-ocean rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-cyan-100/50">S</div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold text-base uppercase tracking-tight font-outfit">Smart Tender Evaluation Platform</span>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 opacity-60">Strategic Sourcing Infrastructure</span>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="flex space-x-8">
              <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Privacy Protocol</a>
              <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Compliance</a>
              <a href="#" className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors">Security</a>
            </div>
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.5em] text-center md:text-right opacity-40">
              Precision • Intelligence • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};