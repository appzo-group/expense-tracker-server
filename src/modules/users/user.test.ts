import request from 'supertest';

import { app } from '../../../tests/helpers/testApp';

const credentials = {
  name: 'Grace Hopper',
  email: 'grace@test.com',
  password: 'password123',
};

async function registerWithData() {
  const reg = await request(app)
    .post('/api/v1/auth/register')
    .send(credentials);
  const { accessToken } = reg.body.data;
  const auth = { Authorization: `Bearer ${accessToken}` };

  await request(app)
    .post('/api/v1/expenses')
    .set(auth)
    .send({ amount: 10, category: 'Food', date: new Date().toISOString() });
  await request(app).post('/api/v1/budgets').set(auth).send({
    category: 'Food',
    limit: 100,
    period: 'monthly',
    startDate: new Date().toISOString(),
  });

  return auth;
}

describe('Delete account', () => {
  it('requires the correct password (401 on mismatch)', async () => {
    const auth = await registerWithData();

    const res = await request(app)
      .delete('/api/v1/users/profile')
      .set(auth)
      .send({ password: 'wrongpassword' });

    expect(res.status).toBe(401);

    // Data still exists after a failed attempt.
    const list = await request(app).get('/api/v1/transactions').set(auth);
    expect(list.body.data).toHaveLength(1);
  });

  it('returns 422 when password is missing', async () => {
    const auth = await registerWithData();
    const res = await request(app)
      .delete('/api/v1/users/profile')
      .set(auth)
      .send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('password');
  });

  it('deletes the account and all associated data', async () => {
    const auth = await registerWithData();

    const del = await request(app)
      .delete('/api/v1/users/profile')
      .set(auth)
      .send({ password: credentials.password });
    expect(del.status).toBe(200);

    // The user no longer exists.
    const profile = await request(app).get('/api/v1/users/profile').set(auth);
    expect(profile.status).toBe(404);

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: credentials.email, password: credentials.password });
    expect(login.status).toBe(401);
  });

  it('lets the email be reused after a soft-deleted account', async () => {
    const auth = await registerWithData();
    await request(app)
      .delete('/api/v1/users/profile')
      .set(auth)
      .send({ password: credentials.password })
      .expect(200);

    // Same email can register again (partial unique index excludes deleted).
    const reReg = await request(app)
      .post('/api/v1/auth/register')
      .send(credentials);
    expect(reReg.status).toBe(201);

    // The fresh account starts with no leftover data from the deleted one.
    const list = await request(app)
      .get('/api/v1/transactions')
      .set({ Authorization: `Bearer ${reReg.body.data.accessToken}` });
    expect(list.body.data).toHaveLength(0);
  });
});
