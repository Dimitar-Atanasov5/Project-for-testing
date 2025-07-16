import dotenv from 'dotenv';
import { connectDB } from './DB/config/connectDB.js';
import app from './app.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});