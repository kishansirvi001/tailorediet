import crypto from "crypto";
import { deliverSignupEmailOtp } from "../lib/otpDelivery.js";
import { readSignupVerifications, writeSignupVerifications } from "../lib/signupVerificationStore.js";
import { readUsers, writeUsers } from "../lib/userStore.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/;
const OTP_PATTERN = /^\d{6}$/;
const OTP_TTL_MS = 10 * 60 * 1000;

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber || null,
    dateOfBirth: user.dateOfBirth || null,
    goal: user.goal,
    dietStyle: user.dietStyle,
    createdAt: user.createdAt,
  };
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function normalizeMobileNumber(mobileNumber) {
  const digits = String(mobileNumber || "").replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(email);
}

function isValidIndianMobileNumber(mobileNumber) {
  return INDIAN_MOBILE_PATTERN.test(String(mobileNumber || "").replace(/\s+/g, ""));
}

function isValidDateOfBirth(value) {
  if (!String(value || "").trim()) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date <= new Date();
}

function resolveLoginIdentity({ email, mobileNumber, identifier }) {
  const rawValue = email ?? mobileNumber ?? identifier ?? "";
  const trimmed = String(rawValue).trim();

  if (!trimmed) {
    return { type: null, value: "" };
  }

  if (trimmed.includes("@")) {
    return { type: "email", value: normalizeEmail(trimmed) };
  }

  return { type: "mobileNumber", value: normalizeMobileNumber(trimmed) };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = storedHash.split(":");
  const passwordHash = crypto.scryptSync(password, salt, 64);
  const originalBuffer = Buffer.from(originalHash, "hex");

  if (passwordHash.length !== originalBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(passwordHash, originalBuffer);
}

function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createOtpCode() {
  return String(crypto.randomInt(100000, 1000000));
}

function validateSignupPayload({ name, email, mobileNumber, dateOfBirth, password, goal, dietStyle }) {
  if (!name?.trim()) {
    return "Full name is required.";
  }

  if (!email?.trim()) {
    return "Email is required.";
  }

  if (!mobileNumber?.trim()) {
    return "Mobile number is required.";
  }

  if (!dateOfBirth?.trim()) {
    return "Date of birth is required.";
  }

  if (!isValidEmail(normalizeEmail(email))) {
    return "Enter a valid email address.";
  }

  if (!isValidIndianMobileNumber(mobileNumber)) {
    return "Enter a valid Indian mobile number.";
  }

  if (!isValidDateOfBirth(dateOfBirth)) {
    return "Enter a valid date of birth.";
  }

  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  if (!goal?.trim()) {
    return "Primary goal is required.";
  }

  if (!dietStyle?.trim()) {
    return "Diet style is required.";
  }

  return null;
}

function validateOtpVerificationPayload({ verificationId, emailOtp }) {
  if (!String(verificationId || "").trim()) {
    return "Verification session is missing.";
  }

  if (!OTP_PATTERN.test(String(emailOtp || "").trim())) {
    return "Enter a valid 6-digit email OTP.";
  }

  return null;
}

function validateLoginPayload({ email, mobileNumber, identifier, password }) {
  const identity = resolveLoginIdentity({ email, mobileNumber, identifier });

  if (!identity.value) {
    return "Email or mobile number is required.";
  }

  if (identity.type === "email" && !isValidEmail(identity.value)) {
    return "Enter a valid email address.";
  }

  if (identity.type === "mobileNumber" && !isValidIndianMobileNumber(identity.value)) {
    return "Enter a valid Indian mobile number.";
  }

  if (!password) {
    return "Password is required.";
  }

  return null;
}

function findExistingUser(users, { email, mobileNumber }) {
  return users.find(
    (user) => user.email === email || user.mobileNumber === mobileNumber
  );
}

function buildPendingVerificationPayload(body, email, mobileNumber) {
  return {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    email,
    mobileNumber,
    dateOfBirth: body.dateOfBirth,
    passwordHash: hashPassword(body.password),
    goal: body.goal.trim(),
    dietStyle: body.dietStyle.trim(),
    emailOtp: createOtpCode(),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(),
  };
}

export async function requestSignupOtp(req, res) {
  const error = validateSignupPayload(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const users = await readUsers();
  const email = normalizeEmail(req.body.email);
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  const existingUser = findExistingUser(users, { email, mobileNumber });

  if (existingUser) {
    return res.status(409).json({
      message:
        existingUser.email === email
          ? "An account with this email already exists."
          : "An account with this mobile number already exists.",
    });
  }

  const verifications = await readSignupVerifications();
  const activeVerifications = verifications.filter(
    (entry) =>
      new Date(entry.expiresAt).getTime() > Date.now() &&
      entry.email !== email &&
      entry.mobileNumber !== mobileNumber
  );

  const verification = buildPendingVerificationPayload(req.body, email, mobileNumber);

  try {
    await deliverSignupEmailOtp({
      email,
      emailOtp: verification.emailOtp,
      name: verification.name,
    });
  } catch (deliveryError) {
    return res.status(502).json({
      message:
        deliveryError instanceof Error
          ? `Failed to deliver email OTP: ${deliveryError.message}`
          : "Failed to deliver email OTP.",
    });
  }

  activeVerifications.push(verification);
  await writeSignupVerifications(activeVerifications);

  return res.status(201).json({
    message: "Email OTP sent successfully.",
    verification: {
      verificationId: verification.id,
      email: verification.email,
      expiresAt: verification.expiresAt,
    },
  });
}

export async function verifySignupOtp(req, res) {
  const error = validateOtpVerificationPayload(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const verifications = await readSignupVerifications();
  const verification = verifications.find((entry) => entry.id === req.body.verificationId);

  if (!verification) {
    return res.status(404).json({ message: "Verification session not found. Request OTP again." });
  }

  if (new Date(verification.expiresAt).getTime() <= Date.now()) {
    const remainingEntries = verifications.filter((entry) => entry.id !== verification.id);
    await writeSignupVerifications(remainingEntries);
    return res.status(410).json({ message: "OTP expired. Request a new verification code." });
  }

  if (verification.emailOtp !== String(req.body.emailOtp).trim()) {
    return res.status(400).json({ message: "Incorrect email OTP." });
  }

  const users = await readUsers();
  const existingUser = findExistingUser(users, verification);

  if (existingUser) {
    return res.status(409).json({
      message:
        existingUser.email === verification.email
          ? "An account with this email already exists."
          : "An account with this mobile number already exists.",
    });
  }

  const token = createSessionToken();
  const user = {
    id: crypto.randomUUID(),
    name: verification.name,
    email: verification.email,
    mobileNumber: verification.mobileNumber,
    dateOfBirth: verification.dateOfBirth,
    passwordHash: verification.passwordHash,
    goal: verification.goal,
    dietStyle: verification.dietStyle,
    sessionToken: token,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  const remainingEntries = verifications.filter((entry) => entry.id !== verification.id);
  await writeSignupVerifications(remainingEntries);

  return res.status(201).json({
    message: "Account created successfully.",
    token,
    user: sanitizeUser(user),
  });
}

export async function login(req, res) {
  const error = validateLoginPayload(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const users = await readUsers();
  const identity = resolveLoginIdentity(req.body);
  const user = users.find((entry) =>
    identity.type === "email"
      ? entry.email === identity.value
      : entry.mobileNumber === identity.value
  );

  if (!user || !verifyPassword(req.body.password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  user.sessionToken = createSessionToken();
  await writeUsers(users);

  return res.json({
    message: "Logged in successfully.",
    token: user.sessionToken,
    user: sanitizeUser(user),
  });
}

export async function getCurrentUser(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.sessionToken === token);

  if (!user) {
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  return res.json({ user: sanitizeUser(user) });
}

export async function logout(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(204).send();
  }

  const users = await readUsers();
  const user = users.find((entry) => entry.sessionToken === token);

  if (user) {
    user.sessionToken = null;
    await writeUsers(users);
  }

  return res.status(204).send();
}
