import request from 'supertest';
import { expect } from 'chai';
import app from '../../server';  // Ensure your express app is exported from server.js

describe('AppController', () => {
  it('GET /status should return redis and db status', async () => {
    const res = await request(app).get('/status');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('redis');
    expect(res.body).to.have.property('db');
  });

  it('GET /stats should return user and file counts', async () => {
    const res = await request(app).get('/stats');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('users');
    expect(res.body).to.have.property('files');
  });
});
