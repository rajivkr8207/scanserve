# ScanServe Production Backend
The backend is now fully integrated into your Next.js project. It uses **Mongoose** for data modeling, **JWT** for authentication, and **Razorpay** for transaction processing.
## 🏗️ Core Architecture
- **`models/`**: Strict MongoDB schemas with compound indexes for performance.
- **`services/`**: Encapsulated business logic (e.g., `orderService` handles the complex availability/COD validation).
- **`app/api/`**: Next.js Route Handlers as lightweight entry points.
- **`middleware/`**: Direct function-based auth and rate-limiting for granular control.
## 🔑 Key Features Implemented
### 1. Store Availability Logic
Located in `utils/storeAvailability.ts`, this utility checks:
- Manual **ONLINE/OFFLINE** mode.
- **Weekly schedule** (e.g., "Closed on Sundays").
- **Temporary closures** with optional expiration dates.
### 2. QR Code Ordering
When a seller creates a table (`POST /api/table`), the backend automatically:
1. Generates a unique store URL: `/store/[slug]/[tableId]`.
2. Encodes this URL into a high-resolution QR code (base64).
3. Saves the QR string to the database for immediate frontend rendering.
### 3. Payment Flow (Razorpay)
- **Initiation**: `POST /api/payment/create` generates a Razorpay Order ID.
- **Verification**: `POST /api/payment/verify` uses `crypto` to validate the HMAC-SHA256 signature before marking orders as `PAID`.
- **Webhooks**: `POST /api/payment/webhook` handles asynchronous updates if the customer closes the browser during payment.
## 🚀 Getting Started
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Setup**:
   Copy `.env.local.example` to `.env.local` and fill in your credentials:
   - `MONGODB_URI`
   - `JWT_SECRET` (Use a 64-character random string)
   - `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`
3. **Database Migration**:
   The schemas will automatically synchronize indexes on the first request to each model.
> [!IMPORTANT]
> Because this is a Next.js App Router project, your backend and frontend share the same server. Use `/api/...` for all your frontend `axios` calls (already updated in `src/lib/api.ts`).