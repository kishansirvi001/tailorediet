import nodemailer from "nodemailer";

let cachedTransporter = null;

function getEmailTransporter() {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.OTP_EMAIL_FROM
  ) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return cachedTransporter;
}

export async function deliverSignupOtps({ email, emailOtp, name }) {
  const emailTransporter = getEmailTransporter();

  if (!emailTransporter) {
    throw new Error("SMTP is not configured for OTP email delivery.");
  }

  const deliveryStatus = {
    email: {
      configured: true,
      sent: false,
    },
  };

  await emailTransporter.sendMail({
    from: process.env.OTP_EMAIL_FROM,
    to: email,
    subject: "TailorDiet email verification code",
    text: `Hi ${name}, your TailorDiet email OTP is ${emailOtp}. It expires in 10 minutes.`,
    html: `<p>Hi ${name},</p><p>Your TailorDiet email OTP is <strong>${emailOtp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
  deliveryStatus.email.sent = true;

  return deliveryStatus;
}
