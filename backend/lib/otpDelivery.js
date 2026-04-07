const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const MESSAGE_CENTRAL_API_BASE_URL = "https://cpaas.messagecentral.com";
const REQUEST_TIMEOUT_MS = 15000;

function normalizeEnvValue(value) {
  const trimmed = String(value || "").trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function isProbablyBase64(value) {
  return /^[A-Za-z0-9+/=]+$/.test(value) && value.length % 4 === 0;
}

function shouldRetryMessageCentralKeyAsBase64(errorMessage, rawKey) {
  const normalizedMessage = String(errorMessage || "").toLowerCase();

  return (
    Boolean(rawKey) &&
    !isProbablyBase64(rawKey) &&
    (normalizedMessage.includes("base64") ||
      normalizedMessage.includes("illegal") ||
      normalizedMessage.includes("invalid key"))
  );
}

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

function getBrevoConfig() {
  const sender = getSenderConfig();
  const apiKey = normalizeEnvValue(process.env.BREVO_API_KEY);

  if (!sender || !apiKey) {
    return null;
  }

  return {
    ...sender,
    apiKey,
  };
}

function getMessageCentralConfig() {
  const customerId = normalizeEnvValue(process.env.MESSAGE_CENTRAL_CUSTOMER_ID);
  const key = normalizeEnvValue(process.env.MESSAGE_CENTRAL_KEY);
  const countryCode = normalizeEnvValue(process.env.MESSAGE_CENTRAL_COUNTRY_CODE || "91");
  const email = normalizeEnvValue(process.env.MESSAGE_CENTRAL_EMAIL);

  if (!customerId || !key) {
    return null;
  }

  return {
    customerId,
    key,
    countryCode,
    email: email || null,
  };
}

function validateMessageCentralConfig(config) {
  if (!config) {
    return "Message Central mobile OTP is not configured. Set MESSAGE_CENTRAL_CUSTOMER_ID and MESSAGE_CENTRAL_KEY.";
  }

  if (!config.key) {
    return "Message Central key is missing.";
  }

  if (!/^\d+$/.test(config.countryCode)) {
    return "Message Central country code must contain only digits.";
  }

  return null;
}

async function parseJsonResponse(response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Received a non-JSON response from the OTP provider.");
  }
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

async function requestMessageCentralAuthTokenWithKey({
  customerId,
  key,
  countryCode,
  email,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const params = new URLSearchParams({
    customerId,
    key,
    scope: "NEW",
    country: countryCode,
  });

  if (email) {
    params.set("email", email);
  }

  try {
    const response = await fetch(
      `${MESSAGE_CENTRAL_API_BASE_URL}/auth/v1/authentication/token?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    const payload = await parseJsonResponse(response);

    if (!response.ok || !payload?.token) {
      throw new Error(
        payload?.message ||
          payload?.error ||
          `Message Central token request failed with HTTP ${response.status}.`
      );
    }

    return payload.token;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Message Central token request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestMessageCentralAuthToken({ customerId, key, countryCode, email }) {
  try {
    return await requestMessageCentralAuthTokenWithKey({
      customerId,
      key,
      countryCode,
      email,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (!shouldRetryMessageCentralKeyAsBase64(errorMessage, key)) {
      throw error;
    }

    return requestMessageCentralAuthTokenWithKey({
      customerId,
      key: Buffer.from(String(key), "utf8").toString("base64"),
      countryCode,
      email,
    });
  }
}

async function sendMessageCentralMobileOtp({
  customerId,
  key,
  countryCode,
  mobileNumber,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const authToken = await requestMessageCentralAuthToken({
    customerId,
    key,
    countryCode,
  });
  const params = new URLSearchParams({
    countryCode,
    customerId,
    flowType: "SMS",
    mobileNumber,
    otpLength: "6",
  });

  try {
    const response = await fetch(
      `${MESSAGE_CENTRAL_API_BASE_URL}/verification/v3/send?${params.toString()}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          authToken,
        },
        signal: controller.signal,
      }
    );

    const payload = await parseJsonResponse(response);
    const verificationId = payload?.data?.verificationId;
    const responseCode = Number(payload?.responseCode ?? payload?.data?.responseCode);

    if (!response.ok || responseCode !== 200 || !verificationId) {
      throw new Error(
        payload?.data?.errorMessage ||
          payload?.message ||
          `Message Central send OTP failed with HTTP ${response.status}.`
      );
    }

    return {
      verificationId: String(verificationId),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Message Central send OTP timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function validateMessageCentralMobileOtp({
  verificationId,
  mobileOtp,
}) {
  const config = getMessageCentralConfig();
  const configError = validateMessageCentralConfig(config);

  if (configError) {
    throw new Error(configError);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const authToken = await requestMessageCentralAuthToken(config);
  const params = new URLSearchParams({
    verificationId: String(verificationId),
    code: String(mobileOtp).trim(),
  });

  try {
    const response = await fetch(
      `${MESSAGE_CENTRAL_API_BASE_URL}/verification/v3/validateOtp?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          authToken,
        },
        signal: controller.signal,
      }
    );

    const payload = await parseJsonResponse(response);
    const responseCode = Number(payload?.responseCode ?? payload?.data?.responseCode);
    const verificationStatus = payload?.data?.verificationStatus;

    if (!response.ok || responseCode !== 200 || verificationStatus !== "VERIFICATION_COMPLETED") {
      throw new Error(
        payload?.data?.errorMessage ||
          payload?.message ||
          "Mobile OTP verification failed."
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Message Central OTP verification timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverSignupOtps({ email, emailOtp, mobileNumber, name }) {
  const brevoConfig = getBrevoConfig();
  const messageCentralConfig = getMessageCentralConfig();
  const messageCentralConfigError = validateMessageCentralConfig(messageCentralConfig);

  const deliveryStatus = {
    email: {
      configured: Boolean(brevoConfig),
      sent: false,
      provider: "brevo",
    },
    mobile: {
      configured: Boolean(messageCentralConfig),
      sent: false,
      provider: "message-central",
      verificationId: null,
    },
  };
  const deliveryIssues = [];

  const message = {
    toEmail: email,
    subject: "TailorDiet email verification code",
    textContent: `Hi ${name}, your TailorDiet email OTP is ${emailOtp}. It expires in 10 minutes.`,
    htmlContent: `<p>Hi ${name},</p><p>Your TailorDiet email OTP is <strong>${emailOtp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  };

  if (!brevoConfig) {
    deliveryIssues.push(
      "Email OTP delivery is not configured. Set BREVO_API_KEY, OTP_EMAIL_FROM, and optionally OTP_EMAIL_FROM_NAME."
    );
  } else {
    try {
      await sendBrevoEmail({
        ...brevoConfig,
        ...message,
      });

      deliveryStatus.email.sent = true;
    } catch (error) {
      const message = `Email delivery failed: ${formatDeliveryError(error)}`;
      console.error("OTP email delivery failed:", formatDeliveryError(error));
      deliveryIssues.push(message);
    }
  }

  if (messageCentralConfigError) {
    deliveryIssues.push(messageCentralConfigError);
  } else {
    try {
      const mobileDelivery = await sendMessageCentralMobileOtp({
        ...messageCentralConfig,
        mobileNumber,
      });

      deliveryStatus.mobile.sent = true;
      deliveryStatus.mobile.verificationId = mobileDelivery.verificationId;
    } catch (error) {
      const message = `Mobile OTP delivery failed: ${formatDeliveryError(error)}`;
      console.error("OTP mobile delivery failed:", formatDeliveryError(error));
      deliveryIssues.push(message);
    }
  }

  if (!deliveryStatus.email.sent && !deliveryStatus.mobile.sent) {
    throw new Error(deliveryIssues.join(" "));
  }

  return {
    deliveryStatus,
    deliveryIssues,
  };
}
