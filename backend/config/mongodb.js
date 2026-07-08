import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js Windows SRV lookup DNS bug (querySrv ECONNREFUSED)
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set public DNS servers, falling back to system resolver:', e.message);
}

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_analytics';
    
    mongoose.set('strictQuery', true);
    
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not crash the server in local development if MongoDB is missing.
    // Instead, log the error and allow fallback mode.
  }
};

export default connectDB;
