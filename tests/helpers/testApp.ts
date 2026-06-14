import { Application } from 'express';
import request from 'supertest';

import app from '../../src/app';

export { app } ;

export interface TestSession {
  accessToken: string;
  refreshToken: string;
  userId: string;
  authHeader: { Authorization: string };
}

/** Registers a user and returns tokens + a ready-to-use auth header. */
export async function registerAndLogin(
  overrides: Partial<{ name: string; email: string; password: string }> = {},
): Promise<TestSession> {
  const payload = {
    name: overrides.name ?? 'Test User',
    email: overrides.email ?? `user_${Date.now()}_${Math.random()}@test.com`,
    password: overrides.password ?? 'password123',
  };

  const res = await request(app as Application).post('/api/v1/auth/register').send(payload);
  const { user, accessToken, refreshToken } = res.body.data;

  return {
    accessToken,
    refreshToken,
    userId: user.id,
    authHeader: { Authorization: `Bearer ${accessToken}` },
  };
}
