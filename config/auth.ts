import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request} from 'express';
import mongoose from 'mongoose';

const SECRET_KEY = process.env.JWT_SECRET || 'your-very-secure-secret-key';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export interface JwtPayload {
  _id: unknown | string | mongoose.Types.ObjectId;
  [key: string]: any;
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (
  password:string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET_KEY) as JwtPayload;
};

export const getTokenFromHeaders = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
};