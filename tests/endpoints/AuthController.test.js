import request from 'supertest';
import { expect } from 'chai';
import app from '../../server';
import dbClient from '../../utils/db';

describe('AuthController', () => {
  before(async () => {
    await dbClient.db.collection('users').deleteMany({});
    await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: '12345' });
  });

  it('GET /connect should sign-in the user and return a token', async () => {
    const res = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('test@example.com:12345').toString('base64'));

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('token');
  });

  it('GET /disconnect should sign-out the user', async () => {
    const loginRes = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('test@example.com:12345').toString('base64'));

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/disconnect')
      .set('X-Token', token);

    expect(res.status).to.equal(204);
  });
});
