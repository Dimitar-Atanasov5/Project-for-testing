import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import { connectDB } from './DB/config/connectDB.js';

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});