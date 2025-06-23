import express from "express";
import { signUp } from "../controllers/auth.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/signup", upload.single("avatar"), signUp);

export default router;
