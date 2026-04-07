# TailorDiet

TailorDiet uses a Vite frontend and an Express backend. Signup now requires both email OTP and Message Central mobile OTP delivery before the account is created.

## Backend OTP configuration

The backend reads runtime secrets from [backend/.env](C:/Users/kisha/tailordiet/backend/.env).

Use Brevo for email OTP delivery and Message Central for mobile OTP delivery. Do not keep a second backend `.env` file at the repo root.

Use [backend/.env.example](C:/Users/kisha/tailordiet/backend/.env.example) as the template, then place the real values in [backend/.env](C:/Users/kisha/tailordiet/backend/.env) for local development and in your deployment service's environment settings for production.

Required variables:

```env
PORT=5000
GEMINI_API_KEY=

OTP_EMAIL_FROM=your-sender@example.com
OTP_EMAIL_FROM_NAME=TailorDiet
BREVO_API_KEY=your-brevo-api-key

MESSAGE_CENTRAL_CUSTOMER_ID=your-message-central-customer-id
MESSAGE_CENTRAL_KEY=your-message-central-key
MESSAGE_CENTRAL_EMAIL=your-message-central-email
MESSAGE_CENTRAL_COUNTRY_CODE=91
```

Notes:
- `backend/.env.example` is documentation only.
- `backend/.env` is the only backend env file used locally.
- Render must have the same values configured in the backend service environment.

## Install backend dependencies

Install backend packages:

```bash
cd backend
npm install
```
