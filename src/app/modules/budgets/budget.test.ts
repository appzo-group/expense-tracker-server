import request from 'supertest';

import { app, registerAndLogin } from '../../../../tests/helpers/testApp';

function thisMonth(day: number): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day, 12).toISOString();
}

describe('Budgets & dashboard', () => {
  it('creates a budget and reflects spending in `spent`', async () => {
    const session = await registerAndLogin();

    await request(app)
      .post('/api/v1/budgets')
      .set(session.authHeader)
      .send({
        category: 'Food',
        limit: 500,
        period: 'monthly',
        startDate: thisMonth(1),
      })
      .expect(201);

    // Spend within the current month on the same category.
    await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send({ amount: 120, category: 'Food', date: thisMonth(10) });

    const budgets = await request(app)
      .get('/api/v1/budgets')
      .set(session.authHeader);

    expect(budgets.status).toBe(200);
    expect(budgets.body.data).toHaveLength(1);
    expect(budgets.body.data[0].spent).toBe(120);
    expect(budgets.body.data[0].limit).toBe(500);
  });

  it('composes the dashboard summary', async () => {
    const session = await registerAndLogin();
    await request(app)
      .post('/api/v1/income')
      .set(session.authHeader)
      .send({ amount: 1000, category: 'Salary', date: thisMonth(1) });
    await request(app)
      .post('/api/v1/expenses')
      .set(session.authHeader)
      .send({ amount: 250, category: 'Bills', date: thisMonth(5) });

    const res = await request(app)
      .get('/api/v1/dashboard/summary')
      .set(session.authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.totalIncome).toBe(1000);
    expect(res.body.data.totalExpenses).toBe(250);
    expect(res.body.data.totalBalance).toBe(750);
    expect(res.body.data.recentTransactions).toHaveLength(2);
  });
});
