import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import connectToDb from "./utils/db.js";
import authRoute from "./routes/auth.route.js";
import usersRoute from "./routes/user.route.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/profile",
  express.static(path.join(process.cwd(), "public", "images", "profiles"))
);

app.use("/auth", authRoute);
app.use("/users", usersRoute);

app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
  connectToDb();
});
