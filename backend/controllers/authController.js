import crypto from "crypto";
import { deliverSignupEmailOtp } from "../lib/otpDelivery.js";
import SignupVerification from "../models/SignupVerification.js";
import User from "../models/User.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_MOBILE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/;
const OTP_PATTERN = /^\d{6}$/;
const OTP_TTL_MS = 10 * 60 * 1000;

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber || null,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
    goal: user.goal,
    dietStyle: user.dietStyle,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
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

async function findExistingUser({ email, mobileNumber }) {
  return User.findOne({
    $or: [{ email }, { mobileNumber }],
  });
}

function buildPendingVerificationPayload(body, email, mobileNumber) {
  return {
    verificationId: crypto.randomUUID(),
    name: body.name.trim(),
    email,
    mobileNumber,
    dateOfBirth: new Date(body.dateOfBirth),
    passwordHash: hashPassword(body.password),
    goal: body.goal.trim(),
    dietStyle: body.dietStyle.trim(),
    emailOtp: createOtpCode(),
    expiresAt: new Date(Date.now() + OTP_TTL_MS),
  };
}

export async function requestSignupOtp(req, res) {
  const error = validateSignupPayload(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const email = normalizeEmail(req.body.email);
  const mobileNumber = normalizeMobileNumber(req.body.mobileNumber);
  const existingUser = await findExistingUser({ email, mobileNumber });

  if (existingUser) {
    return res.status(409).json({
      message:
        existingUser.email === email
          ? "An account with this email already exists."
          : "An account with this mobile number already exists.",
    });
  }

  await SignupVerification.deleteMany({
    $or: [
      { expiresAt: { $lte: new Date() } },
      { email },
      { mobileNumber },
    ],
  });

  const verification = buildPendingVerificationPayload(req.body, email, mobileNumber);

  try {
    await SignupVerification.create(verification);
  } catch (persistenceError) {
    return res.status(500).json({
      message:
        persistenceError instanceof Error
          ? `Failed to save verification session: ${persistenceError.message}`
          : "Failed to save verification session.",
    });
  }

  try {
    await deliverSignupEmailOtp({
      email,
      emailOtp: verification.emailOtp,
      name: verification.name,
    });
  } catch (deliveryError) {
    await SignupVerification.deleteOne({ verificationId: verification.verificationId }).catch(() => null);

    return res.status(502).json({
      message:
        deliveryError instanceof Error
          ? `Failed to deliver email OTP: ${deliveryError.message}`
          : "Failed to deliver email OTP.",
    });
  }

  return res.status(201).json({
    message: "Email OTP sent successfully.",
    verification: {
      verificationId: verification.verificationId,
      email: verification.email,
      expiresAt: verification.expiresAt.toISOString(),
    },
  });
}

export async function verifySignupOtp(req, res) {
  const error = validateOtpVerificationPayload(req.body);

  if (error) {
    return res.status(400).json({ message: error });
  }

  const verification = await SignupVerification.findOne({
    verificationId: req.body.verificationId,
  });

  if (!verification) {
    return res.status(404).json({ message: "Verification session not found. Request OTP again." });
  }

  if (verification.expiresAt.getTime() <= Date.now()) {
    await SignupVerification.deleteOne({ _id: verification._id });
    return res.status(410).json({ message: "OTP expired. Request a new verification code." });
  }

  if (verification.emailOtp !== String(req.body.emailOtp).trim()) {
    return res.status(400).json({ message: "Incorrect email OTP." });
  }

  const existingUser = await findExistingUser({
    email: verification.email,
    mobileNumber: verification.mobileNumber,
  });

  if (existingUser) {
    return res.status(409).json({
      message:
        existingUser.email === verification.email
          ? "An account with this email already exists."
          : "An account with this mobile number already exists.",
    });
  }

  const token = createSessionToken();
  const user = await User.create({
    name: verification.name,
    email: verification.email,
    mobileNumber: verification.mobileNumber,
    dateOfBirth: verification.dateOfBirth,
    passwordHash: verification.passwordHash,
    goal: verification.goal,
    dietStyle: verification.dietStyle,
    sessionToken: token,
  });

  await SignupVerification.deleteOne({ _id: verification._id });

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

  const identity = resolveLoginIdentity(req.body);
  const user = await User.findOne(
    identity.type === "email"
      ? { email: identity.value }
      : { mobileNumber: identity.value }
  );

  if (!user || !verifyPassword(req.body.password, user.passwordHash)) {
    return res.status(401).json({ message: "Invalid login credentials." });
  }

  user.sessionToken = createSessionToken();
  await user.save();

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

  const user = await User.findOne({ sessionToken: token });

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

  await User.updateOne({ sessionToken: token }, { $set: { sessionToken: null } });

  return res.status(204).send();
}
