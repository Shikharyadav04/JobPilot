import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import User from "../models/user.model";

const protectRoute = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError(400, "Unauthorized : No Token Provided");
  }

  const decodeToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!decodeToken) {
    throw new ApiError(400, "Unauthorized : Invalid Token");
  }

  const user = await User.findById(decodeToken.userId).select("-password");

  if (!user) {
    throw new ApiError(400, "Unauthorized : User Not Found");
  }

  req.user = user;
  next();
});
