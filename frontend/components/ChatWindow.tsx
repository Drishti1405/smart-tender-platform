
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { cleanLigatures } from '../services/utils';

interface ChatWindowProps {
  tenderId: string;
  currentUser: User;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  otherPartyName: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  tenderId, currentUser, messages, onSendMessage, otherPartyName 
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const tenderMessages = messages.filter(m => m.tenderId === tenderId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tenderMessages]);



  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(cleanLigatures(inputText.trim()));
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] sm:h-[750px] bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-slide-up relative">
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 h-48 bg-indigo-50 rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24 opacity-40 blur-3xl pointer-events-none"></div>
      
      <div className="px-6 sm:px-8 py-6 sm:py-8 bg-slate-900 text-white flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-4 sm:space-x-5">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl shadow-xl shadow-indigo-900/20 group-hover:rotate-6 transition-transform">
              {otherPartyName.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-4 border-slate-900 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg tracking-tight leading-none mb-1 sm:mb-1.5">{otherPartyName}</h3>
            <div className="flex items-center space-x-2">
              <div className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">Partner</div>
              <span className="hidden sm:inline text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">ID: SEC-3921</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 opacity-50">
          <button className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 sm:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10 bg-slate-50/30 scroll-smooth selection:bg-indigo-50">
        {tenderMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-center text-slate-500 font-extrabold uppercase tracking-[0.3em] text-[8px] sm:text-[10px]">Secure Channel Active.</p>
          </div>
        )}
        {tenderMessages.map(msg => (
          <div key={msg.id} className={`flex group animate-fade ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] relative ${msg.senderId === currentUser.id ? 'order-1' : 'order-2'}`}>
              <div className={`p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-premium transition-all group-hover:shadow-hover leading-relaxed text-xs sm:text-sm font-semibold selection:bg-white/20 ${
                msg.senderId === currentUser.id 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-lg' 
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-lg'
              }`}>
                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
              </div>
              <div className={`flex items-center space-x-2 mt-2 sm:mt-3 px-2 ${msg.senderId === currentUser.id ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 sm:px-8 py-6 sm:py-8 bg-white border-t border-slate-50 relative z-10">
        <form onSubmit={handleSend} className="relative flex items-center space-x-3 sm:space-x-4">
          <div className="flex-1 bg-slate-50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100/80 p-1 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-500/50 transition-all shadow-inner">
            <textarea
              rows={1}
              placeholder="Message..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent outline-none resize-none text-xs sm:text-sm font-semibold text-slate-900 border-none placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[9px]"
              value={inputText}
              onChange={e => setInputText(cleanLigatures(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-slate-900 text-white rounded-xl sm:rounded-2xl hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 disabled:opacity-30 shadow-2xl shadow-indigo-100 transition-all group"
          >
            <svg className="w-5 h-5 sm:w-6 h-6 transform rotate-45 mr-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

