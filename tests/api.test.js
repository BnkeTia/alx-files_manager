import request from 'supertest';
import app from '../server'; // Adjust the import according to your project structure
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

beforeAll(async () => {
  // Setup database or any other global setup
  await dbClient.client.connect();
  await redisClient.client.connect();
});

afterAll(async () => {
  // Cleanup database or any other global cleanup
  await dbClient.client.close();
  await redisClient.client.quit();
});

describe('API Endpoints', () => {
  it('GET /status should return the status of Redis and MongoDB', async () => {
    const res = await request(app).get('/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('redis');
    expect(res.body).toHaveProperty('db');
  });

  it('GET /stats should return the number of users and files', async () => {
    const res = await request(app).get('/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('files');
  });

  it('POST /users should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
  });

  it('GET /connect should sign-in the user', async () => {
    const res = await request(app)
      .get('/connect')
      .auth('test@example.com', 'password');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /disconnect should sign-out the user', async () => {
    const tokenRes = await request(app)
      .get('/connect')
      .auth('test@example.com', 'password');
    const token = tokenRes.body.token;

    const res = await request(app)
      .get('/disconnect')
      .set('X-Token', token);
    expect(res.statusCode).toEqual(204);
  });

  it('GET /users/me should retrieve the user based on the token', async () => {
    const tokenRes = await request(app)
      .get('/connect')
      .auth('test@example.com', 'password');
    const token = tokenRes.body.token;

    const res = await request(app)
      .get('/users/me')
      .set('X-Token', token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
  });

  // Add tests for other endpoints like POST /files, GET /files/:id, etc.
});
