import request from 'supertest';

import { app, registerAndLogin } from '../../../../tests/helpers/testApp';
import { sampleExpense, sampleIncome } from '../../../../tests/fixtures/transactions';

describe('Transactions, expenses & income', () => {
  it('requires authentication', async () => {
    const res = await request(app).get('/api/v1/transactions');
    expect(res.status).toBe(401);
  });

  it('creates an expense and lists it under /transactions', async () => {
    const session = await registerAndLogin();

    const created = await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send(sampleExpense);
    expect(created.status).toBe(201);
    expect(created.body.data.type).toBe('expense');
    expect(created.body.data.amount).toBe(sampleExpense.amount);

    const list = await request(app)
      .get('/api/v1/transactions')
      .set(session.authHeader);
    expect(list.status).toBe(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.meta.total).toBe(1);
  });

  it('filters transactions by type', async () => {
    const session = await registerAndLogin();
    await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send(sampleExpense);
    await request(app)
      .post('/api/v1/income')
      .set(session.authHeader)
      .send(sampleIncome);

    const incomeOnly = await request(app)
      .get('/api/v1/transactions?type=income')
      .set(session.authHeader);
    expect(incomeOnly.body.data).toHaveLength(1);
    expect(incomeOnly.body.data[0].type).toBe('income');
  });

  it('updates and deletes an expense', async () => {
    const session = await registerAndLogin();
    const created = await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send(sampleExpense);
    const id = created.body.data.id;

    const updated = await request(app)
      .patch(`/api/v1/expenses/${id}`)
      .set(session.authHeader)
      .send({ amount: 99 });
    expect(updated.status).toBe(200);
    expect(updated.body.data.amount).toBe(99);

    const removed = await request(app)
      .delete(`/api/v1/expenses/${id}`)
      .set(session.authHeader);
    expect(removed.status).toBe(200);

    const list = await request(app)
      .get('/api/v1/transactions')
      .set(session.authHeader);
    expect(list.body.data).toHaveLength(0);
  });

  it('rejects an invalid amount with 422', async () => {
    const session = await registerAndLogin();
    const res = await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send({ ...sampleExpense, amount: -5 });
    expect(res.status).toBe(422);
    expect(res.body.errorMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: 'amount' })]),
    );
  });

  it("never exposes another user's transactions", async () => {
    const alice = await registerAndLogin({ email: 'alice@test.com' });
    const bob = await registerAndLogin({ email: 'bob@test.com' });

    await request(app)
      .post('/api/v1/expenses')
      .set(alice.authHeader)
      .send(sampleExpense);

    const bobList = await request(app)
      .get('/api/v1/transactions')
      .set(bob.authHeader);
    expect(bobList.body.data).toHaveLength(0);
  });
});
