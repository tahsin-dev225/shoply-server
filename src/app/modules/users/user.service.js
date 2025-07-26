import mongoose from "mongoose";
import catchAsync from "../../helper/catchAsync.js";
import User from "./userSchema.js";

const addUser = catchAsync(async (req, res) => {
  try {
    const { name, email } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(existing);
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }
    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const makeAdminById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: "admin" },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User promoted to admin",
    user: updatedUser,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  try {
    const result = await User.find();

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const getUserWithEmail = catchAsync(async (req, res) => {
  try {
    const { email } = req.params;
    const result = await User.findOne({ email });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

const getPaginatedUsers = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 7;
  const skip = (page - 1) * limit;

  const search = req.query.search;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalCount = await User.countDocuments(filter);

  res.status(200).json({
    users,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  });
});

export const userService = {
  addUser,
  getUserWithEmail,
  getAllUsers,
  makeAdminById,
  deleteUser,
  updateUser,
  getPaginatedUsers,
};
