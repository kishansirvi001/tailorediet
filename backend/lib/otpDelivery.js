const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const REQUEST_TIMEOUT_MS = 15000;

function formatDeliveryError(error) {
  if (!(error instanceof Error)) {
    return "Unknown email delivery error.";
  }

  return error.message;
}

function getSenderConfig() {
  const senderEmail = process.env.OTP_EMAIL_FROM;
  const senderName = process.env.OTP_EMAIL_FROM_NAME || "TailorDiet";

  if (!senderEmail) {
    return null;
  }

  return {
    senderEmail,
    senderName,
  };
}

function getSmtpConfig() {
  const sender = getSenderConfig();
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
    port === 465;

  if (!sender || !host || !user || !pass) {
    return null;
  }

  return {
    ...sender,
    host,
    port,
    user,
    pass,
    secure,
  };
}

function getBrevoConfig() {
  const sender = getSenderConfig();
  const apiKey = process.env.BREVO_API_KEY;

  if (!sender || !apiKey) {
    return null;
  }

  return {
    ...sender,
    apiKey,
  };
}

async function sendBrevoEmail({
  apiKey,
  senderEmail,
  senderName,
  toEmail,
  subject,
  htmlContent,
  textContent,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
        textContent,
      }),
      signal: controller.signal,
    });

    const rawBody = await response.text();
    const payload = rawBody ? JSON.parse(rawBody) : {};

    if (!response.ok) {
      const details =
        payload?.message ||
        payload?.code ||
        `Brevo returned HTTP ${response.status}.`;
      throw new Error(details);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Brevo email delivery timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendSmtpEmail({
  host,
  port,
  secure,
  user,
  pass,
  senderEmail,
  senderName,
  toEmail,
  subject,
  htmlContent,
  textContent,
}) {
  let nodemailer;

  try {
    ({ default: nodemailer } = await import("nodemailer"));
  } catch {
    throw new Error(
      "SMTP is configured, but the 'nodemailer' package is missing. Run 'npm install' in the backend."
    );
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transport.sendMail({
    from: senderName ? `"${senderName}" <${senderEmail}>` : senderEmail,
    to: toEmail,
    subject,
    text: textContent,
    html: htmlContent,
  });
}

export async function deliverSignupOtps({ email, emailOtp, name }) {
  const smtpConfig = getSmtpConfig();
  const brevoConfig = getBrevoConfig();

  if (!smtpConfig && !brevoConfig) {
    throw new Error(
      "OTP email delivery is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, OTP_EMAIL_FROM, and optionally SMTP_SECURE."
    );
  }

  const deliveryStatus = {
    email: {
      configured: true,
      sent: false,
      provider: smtpConfig ? "smtp" : "brevo",
    },
  };

  const message = {
    toEmail: email,
    subject: "TailorDiet email verification code",
    textContent: `Hi ${name}, your TailorDiet email OTP is ${emailOtp}. It expires in 10 minutes.`,
    htmlContent: `<p>Hi ${name},</p><p>Your TailorDiet email OTP is <strong>${emailOtp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  };

  try {
    if (smtpConfig) {
      await sendSmtpEmail({
        ...smtpConfig,
        ...message,
      });
    } else {
      await sendBrevoEmail({
        ...brevoConfig,
        ...message,
      });
    }
  } catch (error) {
    console.error("OTP email delivery failed:", formatDeliveryError(error));
    throw new Error(`Email delivery failed: ${formatDeliveryError(error)}`);
  }

  deliveryStatus.email.sent = true;
  return deliveryStatus;
}
