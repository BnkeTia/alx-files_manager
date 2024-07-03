import request from 'supertest';
import { expect } from 'chai';
import app from '../../server';
import dbClient from '../../utils/db';

describe('UsersController', () => {
  before(async () => {
    await dbClient.db.collection('users').deleteMany({});
  });

  it('POST /users should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: '12345' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('email');
    expect(res.body).to.have.property('id');
  });

  it('GET /users/me should retrieve the user based on token', async () => {
    const loginRes = await request(app)
      .get('/connect')
      .set('Authorization', 'Basic ' + Buffer.from('test@example.com:12345').toString('base64'));

    const token = loginRes.body.token;

    const res = await request(app)
      .get('/users/me')
      .set('X-Token', token);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('email');
    expect(res.body).to.have.property('id');
  });
});
