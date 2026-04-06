import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, "..", "data");
const usersFilePath = path.join(dataDirectory, "users.json");

async function ensureUsersFile() {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(usersFilePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeFile(usersFilePath, "[]", "utf8");
      return;
    }

    throw error;
  }
}

export async function readUsers() {
  await ensureUsersFile();
  const raw = await readFile(usersFilePath, "utf8");

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

export async function writeUsers(users) {
  await ensureUsersFile();
  await writeFile(usersFilePath, `${JSON.stringify(users, null, 2)}\n`, "utf8");
}
