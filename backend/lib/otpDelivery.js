const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function getEmailConfigError() {
  if (!process.env.BREVO_API_KEY) {
    return "Set BREVO_API_KEY to send email OTPs.";
  }

  if (!process.env.OTP_EMAIL_FROM) {
    return "Set OTP_EMAIL_FROM to send email OTPs.";
  }

  return null;
}

export async function deliverSignupEmailOtp({ email, emailOtp, name }) {
  const configError = getEmailConfigError();

  if (configError) {
    throw new Error(configError);
  }

  let response;

  try {
    response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.OTP_EMAIL_FROM,
          name: process.env.OTP_EMAIL_FROM_NAME || "TailorDiet",
        },
        to: [{ email }],
        subject: "Your TailorDiet email OTP",
        textContent: `Hi ${name}, your TailorDiet email OTP is ${emailOtp}. It expires in 10 minutes.`,
        htmlContent: `<p>Hi ${name},</p><p>Your TailorDiet email OTP is <strong>${emailOtp}</strong>.</p><p>It expires in 10 minutes.</p>`,
      }),
    });
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Email provider request failed: ${error.message}`
        : "Email provider request failed."
    );
  }

  if (!response.ok) {
    const rawPayload = await response.text().catch(() => "");
    let message = rawPayload;

    try {
      const parsedPayload = JSON.parse(rawPayload);
      message =
        parsedPayload?.message ||
        parsedPayload?.code ||
        parsedPayload?.error ||
        rawPayload;
    } catch {
      message = rawPayload;
    }

    throw new Error(message || `Brevo returned HTTP ${response.status}.`);
  }

  return true;
}
