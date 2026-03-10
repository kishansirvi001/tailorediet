import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './userInputs.json';

// Helper to read file
const readData = () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

// Helper to write file
const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Add user input
app.post('/api/user-input', (req, res) => {
  const { name, email, goal, preferences } = req.body;
  const allData = readData();
  const newEntry = { id: Date.now(), name, email, goal, preferences, createdAt: new Date() };
  allData.push(newEntry);
  writeData(allData);
  res.json({ message: 'Saved successfully!', data: newEntry });
});

// Get all inputs (for admin)
app.get('/api/user-input', (req, res) => {
  const allData = readData();
  res.json(allData);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));