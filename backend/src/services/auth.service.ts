/**
 * BCN – Auth Service
 * JWT authentication with refresh tokens
 */

import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from '../utils/AppError';


interface TokenPayload {
  id: string;
  role: string;
  email: string;
}

export class AuthService {

  // ─── REGISTER ──────────────────────────────────────────────────────
  async register(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    // Check if email or username exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existing?.email === data.email) {
      throw new AppError('Email already registered', 409);
    }
    if (existing?.username === data.username) {
      throw new AppError('Username already taken', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const tokens = this.generateTokens({ id: user.id, role: user.role, email: user.email });

    // Store refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 8) },
    });

    return { user, ...tokens };
  }

  // ─── LOGIN ─────────────────────────────────────────────────────────
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        password: true,
        role: true,
        avatar: true,
        isActive: true,
        isVerified: true,
      },
    });

    if (!user) throw new AppError('Invalid credentials', 401);
    if (!user.isActive) throw new AppError('Account has been suspended', 403);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

    const tokens = this.generateTokens({ id: user.id, role: user.role, email: user.email });

    // Update refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 8),
        lastLogin: new Date(),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
  }

  // ─── REFRESH TOKEN ─────────────────────────────────────────────────
  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true, role: true, email: true,
          refreshToken: true, isActive: true,
        },
      });

      if (!user || !user.isActive || !user.refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      const isValid = await bcrypt.compare(token, user.refreshToken);
      if (!isValid) throw new AppError('Invalid refresh token', 401);

      const tokens = this.generateTokens({ id: user.id, role: user.role, email: user.email });

      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: await bcrypt.hash(tokens.refreshToken, 8) },
      });

      return tokens;
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  // ─── LOGOUT ────────────────────────────────────────────────────────
  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ─── GENERATE TOKENS ───────────────────────────────────────────────
  generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as jwt.SignOptions);

    return { accessToken, refreshToken };
  }

  // ─── VERIFY TOKEN ──────────────────────────────────────────────────
  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    } catch {
      throw new AppError('Invalid or expired token', 401);
    }
  }
}