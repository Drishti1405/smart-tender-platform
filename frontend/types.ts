
export type UserRole = 'NEEDER' | 'VENDOR';
export type Language = 'EN' | 'ES' | 'FR' | 'HI';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';
export type Priority = number; // Scale 0-10
export type PaymentMode = 'PRE_DELIVERY' | 'AFTER_DELIVERY';

export interface TenderFeature {
  id: string;
  name: string;
  priority: Priority;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  situation: string;
  category: string;
  minBudget: number;
  maxBudget: number;
  currency: CurrencyCode;
  requiredDays: number;
  requiredBy: string;
  paymentMode: PaymentMode;
  features: TenderFeature[];
  closingTime: string;
  publishedAt: string;
  status: 'OPEN' | 'CLOSED' | 'EVALUATED' | 'AWARDED';
  creatorId: string;
  winnerBidId?: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  solution: string;
  fitExplanation: string;
  quotation: number;
  currency: CurrencyCode;
  timeline: string;
  paymentMode: PaymentMode;
  submittedAt: string;
  isSeenByNeeder: boolean;
  evaluation?: BidEvaluation;
}

export interface FeatureScore {
  featureId: string;
  name: string;
  score: number; // 0-10
}

export interface BidEvaluation {
  totalScore: number;
  criteria: {
    requirementMatch: number;
    situationRelevance: number;
    costEfficiency: number;
    timelineFeasibility: number;
    completeness: number;
  };
  featureScores: FeatureScore[];
  explanation: string;
  rank?: number;
}

export interface ChatMessage {
  id: string;
  tenderId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}
export type NotificationType = 'MESSAGE' | 'EVALUATION' | 'BID_SUBMITTED' | 'TENDER_CLOSED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link: { view: 'DASHBOARD' | 'CHAT' | 'EVALUATION' | 'BID_SUBMITTED'; tenderId?: string };
  timestamp: string;
  isRead: boolean;
}
