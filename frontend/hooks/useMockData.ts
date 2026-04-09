
import { useState, useEffect, useCallback } from 'react';
import { Tender, Bid, ChatMessage, User, UserRole, Language, CurrencyCode, Notification, NotificationType } from '../types';
import { TRANSLATIONS } from '../constants';
import { authService } from '../services/auth';
import { cleanLigatures } from '../services/utils';

export function useMockData() {
  const [tenders, setTenders] = useState<Tender[]>(() => {
    try {
      const saved = localStorage.getItem('step_tenders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [bids, setBids] = useState<Bid[]>(() => {
    try {
      const saved = localStorage.getItem('step_bids');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('step_messages');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem('step_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('step_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('step_lang');
      return (saved as Language) || 'EN';
    } catch { return 'EN'; }
  });

  useEffect(() => localStorage.setItem('step_tenders', JSON.stringify(tenders || [])), [tenders]);
  useEffect(() => localStorage.setItem('step_bids', JSON.stringify(bids || [])), [bids]);
  useEffect(() => localStorage.setItem('step_messages', JSON.stringify(messages || [])), [messages]);
  useEffect(() => localStorage.setItem('step_notifications', JSON.stringify(notifications || [])), [notifications]);
  useEffect(() => localStorage.setItem('step_user', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('step_lang', language), [language]);

  const t = useCallback((key: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['EN'][key] || key;
  }, [language]);
  // --- LIGATURE DEEP CLEAN MIGRATION ---
  useEffect(() => {
    const cleanAll = () => {
      setTenders(prev => (prev || []).map(t => ({
        ...t,
        title: cleanLigatures(t.title),
        description: cleanLigatures(t.description),
        situation: cleanLigatures(t.situation),
        features: t.features.map(f => ({ ...f, name: cleanLigatures(f.name) }))
      })));
      setBids(prev => (prev || []).map(b => ({
        ...b,
        solution: cleanLigatures(b.solution),
        fitExplanation: cleanLigatures(b.fitExplanation)
      })));
      setMessages(prev => (prev || []).map(m => ({
        ...m,
        text: cleanLigatures(m.text)
      })));
    };
    cleanAll();
  }, []); // One-time clean on boot

  const registerUser = useCallback(async (data: Omit<User, 'id'>) => {
    const result = await authService.register(data);
    // After registration, we usually want to log them in automatically
    return loginUser(data.email, data.password);
  }, []);

  const loginUser = useCallback(async (email: string, password?: string) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem('step_token', token);
    setCurrentUser({
      ...user,
      id: user._id // Mapping MongoDB _id to id for frontend compatibility
    });
  }, []);

  const toggleUserRole = useCallback(() => {
    if (!currentUser) return;
    const newRole: UserRole = currentUser.role === 'NEEDER' ? 'VENDOR' : 'NEEDER';
    const updatedUser = { ...currentUser, role: newRole };
    setCurrentUser(updatedUser);
    // Note: In a real app, this should also update the backend
  }, [currentUser]);

  const addTender = useCallback((tender: Omit<Tender, 'id' | 'status' | 'publishedAt'>) => {
    const newTender: Tender = {
      ...tender,
      id: Math.random().toString(36).substr(2, 9),
      status: 'OPEN',
      publishedAt: new Date().toISOString()
    };
    setTenders(prev => [newTender, ...(prev || [])]);
  }, []);

  const addNotification = useCallback((userId: string, type: NotificationType, title: string, message: string, link: Notification['link']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      type,
      title,
      message,
      link,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotif, ...(prev || [])]);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => (prev || []).map(n => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const addBid = useCallback((bid: Omit<Bid, 'id' | 'submittedAt' | 'evaluation' | 'isSeenByNeeder'>) => {
    const newBid: Bid = {
      ...bid,
      id: Math.random().toString(36).substr(2, 9),
      submittedAt: new Date().toISOString(),
      isSeenByNeeder: false
    };
    setBids(prev => [...(prev || []), newBid]);

    // Notify Needer
    const tender = tenders.find(t => t.id === bid.tenderId);
    if (tender) {
      addNotification(
        tender.creatorId,
        'BID_SUBMITTED',
        'New Bid Received',
        `A new bid has been submitted for "${tender.title}" by ${bid.vendorName}.`,
        { view: 'DASHBOARD', tenderId: tender.id }
      );
    }
  }, [tenders, addNotification]);

  const updateTenderStatus = useCallback((id: string, status: Tender['status'], winnerBidId?: string) => {
    setTenders(prev => (prev || []).map(t => t.id === id ? { ...t, status, winnerBidId: winnerBidId || t.winnerBidId } : t));
  }, []);

  const updateBidEvaluation = useCallback((id: string, evalData: Bid['evaluation']) => {
    setBids(prev => (prev || []).map(b => b.id === id ? { ...b, evaluation: evalData } : b));
    
    // Notify Vendor
    const bid = bids.find(b => b.id === id);
    if (bid) {
      addNotification(
        bid.vendorId,
        'EVALUATION',
        'Bid Evaluated',
        `Your bid for "${tenders.find(t => t.id === bid.tenderId)?.title}" has been evaluated by AI.`,
        { view: 'EVALUATION', tenderId: bid.tenderId }
      );
    }
  }, [bids, tenders, addNotification]);

  const markBidsAsSeen = useCallback((tenderId: string) => {
    setBids(prev => (prev || []).map(b => b.tenderId === tenderId ? { ...b, isSeenByNeeder: true } : b));
  }, []);

  const addMessage = useCallback((tenderId: string, senderId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      tenderId,
      senderId,
      text,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setMessages(prev => [...(prev || []), newMsg]);

    // Notify Other Party
    const tender = tenders.find(t => t.id === tenderId);
    if (tender) {
      const recipientId = senderId === tender.creatorId 
        ? bids.find(b => b.tenderId === tenderId && b.id === tender.winnerBidId)?.vendorId 
        : tender.creatorId;

      if (recipientId) {
        addNotification(
          recipientId,
          'MESSAGE',
          'New Message',
          `You have a new message regarding "${tender.title}".`,
          { view: 'CHAT', tenderId }
        );
      }
    }
  }, [tenders, bids, addNotification]);

  const markMessagesAsRead = useCallback((tenderId: string, userId: string) => {
    setMessages(prev => (prev || []).map(m => 
      m.tenderId === tenderId && m.senderId !== userId ? { ...m, isRead: true } : m
    ));
  }, []);

  return {
    tenders: tenders || [], 
    bids: bids || [], 
    messages: messages || [], 
    notifications: (notifications || []).filter(n => n.userId === currentUser?.id),
    currentUser, 
    registeredUsers: [], 
    language,
    setLanguage, t, setCurrentUser, registerUser, loginUser, toggleUserRole, 
    addTender, addBid, updateTenderStatus, updateBidEvaluation, addMessage, markMessagesAsRead, markBidsAsSeen,
    markNotificationAsRead, markAllNotificationsAsRead, clearNotifications
  };
}
