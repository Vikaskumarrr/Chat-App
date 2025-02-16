import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected sucessfully: ${connection}`)
    } catch (error) {
        console.log(`MongoDB connection error: ${error}`);
    }
};