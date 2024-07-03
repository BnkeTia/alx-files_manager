import dbClient from '../utils/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await dbClient.client.connect(uri);
});

afterAll(async () => {
  await dbClient.client.close();
  await mongoServer.stop();
});

describe('DB Client', () => {
  it('should return true if MongoDB is alive', () => {
    expect(dbClient.isAlive()).toBe(true);
  });

  it('should return the number of users', async () => {
    const nbUsers = await dbClient.nbUsers();
    expect(nbUsers).toBe(0);
  });

  it('should return the number of files', async () => {
    const nbFiles = await dbClient.nbFiles();
    expect(nbFiles).toBe(0);
  });
});
