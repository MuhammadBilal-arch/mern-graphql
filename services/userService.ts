import User, { IUser } from "../models/user";
import {
  CreateUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../graphql/user/user.types";
import mongoose from "mongoose";
import stripe from "../config/stripe";
import { comparePasswords, hashPassword } from "../config/auth";
import { generateToken } from "../config/auth";

export interface AuthResponse {
  token: string;
  user: Partial<IUser>;
}

export const registerUser = async (
  input: CreateUserInput
): Promise<AuthResponse> => {
  const { name, email, password } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists");
  }

  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    throw new Error("A customer with this email already exists in Stripe");
  }

  const customer = await stripe.customers.create({
    name,
    email,
  });

  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    stripeCustomerId: customer.id,
  });

  const savedUser = await newUser.save();

  const token = generateToken({ _id: savedUser._id });

  const userObject = savedUser.toObject();
  console.log(userObject, "userObject");
  const { password: _, __v: __, _id, ...userWithoutSensitiveData } = userObject;

  return {
    token,
    user: {
      id: _id.toString(),
      ...userWithoutSensitiveData,
    },
  };
};

export const loginUser = async (
  input: LoginUserInput
): Promise<AuthResponse> => {
  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid Credentials.");
  }

  if (!user.password) {
    throw new Error("User account is missing password");
  }
  console.log(user.password, "user.password", password);
  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    throw new Error("Invalid Credentials.");
  }

  const token = generateToken({ _id: user._id });

  const userObject = user.toObject();
  const { password: _, __v: __, _id, ...userWithoutSensitiveData } = userObject;

  return {
    token,
    user: {
      id: _id.toString(),
      ...userWithoutSensitiveData,
    },
  };
};

export const createUser = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists in the database.");
  }
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    throw new Error("A customer with this email already exists in Stripe.");
  }

  const customer = await stripe.customers.create({
    name,
    email,
  });
  const stripeCustomerId = customer.id;

  const newUser = new User({ name, email, password, stripeCustomerId });
  return await newUser.save();
};

export const createUserFromInput = async (
  input: CreateUserInput
): Promise<IUser> => {
  const newUser = new User(input);
  return await newUser.save();
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findById(userId).select("-password -__v");
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find().select("-password -__v");
};

export const deleteUserById = async (userId: string): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return await User.findByIdAndDelete(userId);
};

export const updateUserById = async (
  userId: string,
  input: UpdateUserInput
): Promise<IUser | null> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  ).select("-password -__v");

  return updatedUser;
};

const userService = {
  loginUser,
  registerUser,
  createUser,
  createUserFromInput,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
};

export default userService;
