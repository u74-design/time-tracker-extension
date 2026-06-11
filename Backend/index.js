import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import timeRoutes from "./routes/time.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix 1 — explicit CORS for extensions
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Time Tracker API is running 🚀" });
});

// Fix 2 — actually connect the routes!
app.use("/api", timeRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(" MongoDB connection failed", err.message);
    process.exit(1);
  });