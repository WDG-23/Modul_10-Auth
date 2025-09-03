import mongoose from 'mongoose';

try {
  const client = await mongoose.connect(process.env.MONGO_URI, { dbName: 'travel-journal' });
  console.log(`Connected to --> ${client.connection.name} <-- MongoDB @ ${client.connection.host}`);
} catch (error) {
  console.log(error);
  process.exit(1);
}
