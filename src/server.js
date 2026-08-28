// import app from "./app.js";

// const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start — DB connection error:', err.message);
    process.exit(1);
  }
}

start();