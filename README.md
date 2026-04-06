# TailorDiet

TailorDiet uses a Vite frontend and an Express backend. Signup requires email OTP delivery before the account is created.

## Backend email configuration

OTP emails support SMTP first, with Brevo API fallback for older deployments.

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
