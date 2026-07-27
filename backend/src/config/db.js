import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  const MONGO_URI = process.env.DATABASE_URL;

  if (!MONGO_URI) {
    console.error('MongoDB connection error: DATABASE_URL environment variable is missing.');
    process.exit(1);
  }

  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`MongoDB connection error. Retries left: ${retries - 1}`, err.message);
      retries -= 1;
      await new Promise(res => setTimeout(res, 5000));
    }
  }

  console.error('MongoDB connection failed after maximum retries. Exiting...');
  process.exit(1);
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB disconnected on app termination');
  process.exit(0);
});

export default connectDB;
