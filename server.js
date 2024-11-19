import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import path  from "path";
import { fileURLToPath } from 'url';
// import { dirname } from 'path';


import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";




// dotenv config
dotenv.config();

// mongodb connection
connectDB();

// rest object creating
const app = express();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);

// STATIC FILES DISPLAY
// app.use(express.static(path.join(__dirname, './client/build')));

// STATIC ROUTES
// app.get('*', function(req, res){
//   res.sendFile(path.join(__dirname,'./client/build/index.html'))
// })

// port
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.DEV_MODE} mode and port http://localhost:${PORT}`
      .bgBlue.white
  );
});
