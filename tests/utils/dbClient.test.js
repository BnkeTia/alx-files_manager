import { expect } from 'chai';
import dbClient from '../../utils/db';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('DBClient', () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.DB_HOST = mongoUri.split(':')[2].split('/')[0];
    process.env.DB_PORT = mongoUri.split(':')[3];
    process.env.DB_DATABASE = mongoUri.split('/')[3];
    dbClient.connect();
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should be alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('should count users', async () => {
    const count = await dbClient.nbUsers();
    expect(count).to.be.a('number');
  });

  it('should count files', async () => {
    const count = await dbClient.nbFiles();
    expect(count).to.be.a('number');
  });
});
