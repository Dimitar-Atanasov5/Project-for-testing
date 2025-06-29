import mongoose from 'mongoose';

export async function connectDB() {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect('mongodb://localhost:27017/Project-for-testing-DB');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
}