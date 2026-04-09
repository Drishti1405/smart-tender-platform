
# Smart Tender Evaluation Platform (STEP)

## 1. Setup Instructions

### Frontend (Live Demo)
- Open the provided `index.html` in a modern browser.
- Ensure the `API_KEY` environment variable is available for Gemini AI evaluation.

### Backend (Production Deployment)
1. Install Node.js & MongoDB.
2. Run `npm init -y` and `npm install express mongoose jsonwebtoken bcryptjs cors`.
3. Create `server.js` using the provided code.
4. Set environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `API_KEY`.
5. Run `node server.js`.

## 2. Business Rules
- **Tender Creation**: Needers define weighted requirements (0-10 priority).
- **Submission Window**: Vendors submit exactly one bid. Late bids are blocked by the `closingTime` logic.
- **Fairness**: Bids remain hidden from the Needer until the deadline expires.
- **AI Scoring**: Every bid is scored on a 0-100 scale using weighted criteria:
  - Match (30%)
  - Relevance (25%)
  - Cost (20%)
  - Feasibility (15%)
  - Professionalism (10%)
- **Awarding**: Once awarded, a secure chat is initiated for final contract negotiation.
