// server.js
import express from 'express';
import connectDB from './database/dbconnect.js'; 
import foodRouter from "./routes/foodRouter.js";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config.js'
import userRouter from './routes/userRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token'],
}));

// routes
app.use('/images', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}, express.static(path.join(__dirname, 'uploads')));



app.use("/api/food" ,foodRouter);
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
