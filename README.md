# TailorDiet

TailorDiet uses a Vite frontend and an Express backend. Signup now requires both email OTP and Message Central mobile OTP delivery before the account is created.

## Backend OTP configuration

OTP emails support SMTP first, with Brevo API fallback for older deployments, and mobile OTPs are sent through Message Central.

Set these variables in [backend/.env](C:/Users/kisha/tailordiet/backend/.env) or in your deployment service:

```env
PORT=5000
OTP_EMAIL_FROM=your-sender@example.com
OTP_EMAIL_FROM_NAME=TailorDiet

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password-or-app-password

MESSAGE_CENTRAL_CUSTOMER_ID=your-message-central-customer-id
MESSAGE_CENTRAL_KEY=your-message-central-base64-key
MESSAGE_CENTRAL_COUNTRY_CODE=91
```

Optional legacy fallback:

```env
BREVO_API_KEY=your-brevo-api-key
```

## Install backend dependencies

Install backend packages so SMTP delivery can load `nodemailer`:

```bash
cd backend
npm install
```
