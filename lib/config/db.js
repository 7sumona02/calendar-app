import mongoose from 'mongoose';

export const connectDB =  async () => {
await mongoose.connect('mongodb+srv://sumona23548:Furuba97@cluster0.vd3mnhp.mongodb.net/calendar-task');
    console.log('MongoDB connected');
}