import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from './utils/db.js';
import { errorMiddleware } from "./middlewares/error.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());  
app.use(express.json());
const PORT = process.env.PORT;
const DB = process.env.MONGO_URI;

connectDB(DB);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// example — later you'll move plants data here
app.get('/api/plants', (req, res) => {
  res.json({ message: 'Plants route works!' });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);