import { createClient } from "redis";

const redisClient = createClient({ url: Bun.env.REDIS_URL || "redis://redis:6379" });
await redisClient.connect();

async function getCachedData(key: string, dbQuery: () => Promise<any>) {
  const cached = await redisClient.get(key);
  if (cached) return JSON.parse(cached);

  const data = await dbQuery();
  await redisClient.setEx(key, 3600, JSON.stringify(data)); // Cache for 1 hour
  return data;
}
