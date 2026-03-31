import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

class AuthService {
  private signAccessToken(payload: { sub: string; role: string }) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
  }

  private signRefreshToken(payload: { sub: string; role: string }) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL });
  }

  async register(input: { name: string; username: string; email: string; password: string }) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: input.email }, { username: input.username }] },
      select: { id: true },
    });

    if (existing) throw new AppError('Email or username already exists', 409);

    const password = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        username: input.username,
        email: input.email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
      },
    });

    return {
      user,
      tokens: {
        accessToken: this.signAccessToken({ sub: user.id, role: user.role }),
        refreshToken: this.signRefreshToken({ sub: user.id, role: user.role }),
      },
    };
  }

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError('Invalid email or password', 401);

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid email or password', 401);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      tokens: {
        accessToken: this.signAccessToken({ sub: user.id, role: user.role }),
        refreshToken: this.signRefreshToken({ sub: user.id, role: user.role }),
      },
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) throw new AppError('Refresh token missing', 401);

    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string; role: string };
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, username: true, role: true },
    });

    if (!user) throw new AppError('User not found', 404);

    return {
      user,
      tokens: {
        accessToken: this.signAccessToken({ sub: user.id, role: user.role }),
        refreshToken: this.signRefreshToken({ sub: user.id, role: user.role }),
      },
    };
  }

  async logout(_userId: string) {
    return true;
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string; role: string };
  }
}

export const authService = new AuthService();