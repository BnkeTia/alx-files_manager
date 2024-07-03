import redisClient from '../utils/redis';

describe('Redis Client', () => {
  it('should return true if Redis is alive', () => {
    expect(redisClient.isAlive()).toBe(true);
  });

  it('should set and get a key', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    const value = await redisClient.get('test_key');
    expect(value).toBe('test_value');
  });

  it('should delete a key', async () => {
    await redisClient.set('test_key', 'test_value', 10);
    await redisClient.del('test_key');
    const value = await redisClient.get('test_key');
    expect(value).toBeNull();
  });
});
