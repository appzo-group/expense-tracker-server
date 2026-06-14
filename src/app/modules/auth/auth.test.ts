import request from 'supertest';

import { app } from '../../../../tests/helpers/testApp';

const credentials = {
  name: 'Ada Lovelace',
  email: 'ada@test.com',
  password: 'password123',
};

describe('Auth module', () => {
  it('registers a new user and returns a token pair', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(credentials);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('ada@test.com');
    expect(res.body.data.user).not.toHaveProperty('password');
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.refreshToken).toEqual(expect.any(String));
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);
    const res = await request(app).post('/api/v1/auth/register').send(credentials);
    expect(res.status).toBe(409);
  });

  it('returns 422 with errorMessages for invalid input', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: '', email: 'not-an-email', password: 'short' });

    expect(res.status).toBe(422);
    expect(res.body.errorMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'email' })]),
    );
    expect(res.body.errorMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'password' })]),
    );
  });

  it('logs in with valid credentials and rejects wrong passwords', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);

    const ok = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(ok.status).toBe(200);
    expect(ok.body.data.accessToken).toEqual(expect.any(String));

    const bad = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: 'wrongpassword' });
    expect(bad.status).toBe(401);
  });

  it('rotates tokens on refresh', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(credentials);
    const { refreshToken } = reg.body.data;

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toEqual(expect.any(String));
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    // The old refresh token is now revoked and cannot be reused.
    const reused = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken });
    expect(reused.status).toBe(401);
  });

  it('completes a forgot → reset password flow', async () => {
    await request(app).post('/api/v1/auth/register').send(credentials);

    const forgot = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: credentials.email });
    expect(forgot.status).toBe(200);
    const resetToken = forgot.body.data.resetToken as string;
    expect(resetToken).toEqual(expect.any(String));

    const reset = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: resetToken, password: 'newpassword123' });
    expect(reset.status).toBe(200);

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: 'newpassword123' });
    expect(login.status).toBe(200);
  });
});
