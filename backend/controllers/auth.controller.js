import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const signUp = asyncHandler(async (req, res) => {
  const { username, fullName, email, password, role } = req.body;

  if (
    [username, email, password, fullName, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all the Fields");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  let avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
    username
  )}`;

  const avatarLocalPath = req.file?.path;
  if (avatarLocalPath) {
    const cloudinaryResult = await uploadOnCloudinary(avatarLocalPath);
    if (cloudinaryResult?.url) {
      avatarUrl = cloudinaryResult.url;
    }
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    role,
    avatar: avatarUrl,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export { signUp };
