import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "..", "data");
const verificationFilePath = path.join(dataDirectory, "signup-verifications.json");

async function ensureVerificationFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(verificationFilePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(verificationFilePath, "[]", "utf8");
      return;
    }

    throw error;
  }
}

export async function readSignupVerifications() {
  await ensureVerificationFile();
  const raw = await readFile(verificationFilePath, "utf8");

  try {
    const entries = JSON.parse(raw);
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

export async function writeSignupVerifications(entries) {
  await ensureVerificationFile();
  await writeFile(verificationFilePath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
}
