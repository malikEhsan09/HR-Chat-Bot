import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import superAdminRoutes from "./routes/superAdmin.route.js";
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoute.js";
// import authRoutes from "./routes/authRoutes.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
connectDB();
const app = express();

// cors policy
// option
const corsOptions = {
  origin: "http://localhost:5173/",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors("*"));

// middlewares
app.use(express.json());
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
