
import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['NEEDER', 'VENDOR'], default: 'VENDOR' }
});

const TenderSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  situation: { type: String, required: true },
  category: { type: String, required: true },
  minBudget: { type: Number, required: true },
  maxBudget: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  closingTime: { type: Date, required: true },
  status: { type: String, enum: ['OPEN', 'CLOSED', 'EVALUATED', 'AWARDED'], default: 'OPEN' },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
  winnerBidId: { type: Schema.Types.ObjectId, ref: 'Bid', default: null },
  features: [{
    name: String,
    priority: Number // 0-10
  }]
});

const BidSchema = new Schema({
  tenderId: { type: Schema.Types.ObjectId, ref: 'Tender' },
  vendorId: { type: Schema.Types.ObjectId, ref: 'User' },
  solution: { type: String, required: true },
  fitExplanation: { type: String, required: true },
  quotation: { type: Number, required: true },
  timeline: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  evaluation: {
    totalScore: Number,
    criteria: {
      requirementMatch: Number,
      situationRelevance: Number,
      costEfficiency: Number,
      timelineFeasibility: Number,
      completeness: Number
    },
    explanation: String
  }
});

export const UserModel = model('User', UserSchema);
export const TenderModel = model('Tender', TenderSchema);
export const BidModel = model('Bid', BidSchema);
