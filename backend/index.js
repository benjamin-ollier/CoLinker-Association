const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('dotenv').config();

const app = express();
const PORT = process.env.BackendPORT || 8000;

connectDB();

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});