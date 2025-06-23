import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import connectToDB from "./config/connectToDB.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(` Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.error(" Failed to connect to database:", error);
  });
