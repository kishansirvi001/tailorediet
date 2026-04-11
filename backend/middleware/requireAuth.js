import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token." });
  }

  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  // Development fallback: if no Mongo configured, accept any token as a dev user
  if (!mongoUri) {
    req.user = { _id: 'dev', name: 'Dev User' };
    req.authToken = token;
    return next();
  }

  const user = await User.findOne({ sessionToken: token });

  if (!user) {
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }

  req.user = user;
  req.authToken = token;
  next();
}
