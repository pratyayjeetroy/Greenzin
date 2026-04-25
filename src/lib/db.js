import mongoose from "mongoose";

// ---------------------------------------------------------------------------
// Singleton DB connection for Next.js (avoids multiple connections in dev HMR)
// ---------------------------------------------------------------------------
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { bufferCommands: false })
      .then((mongoose) => {
        console.log(`Connected to DB: ${mongoose.connection.host}`);
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
