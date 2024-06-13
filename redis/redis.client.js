import dotenv from 'dotenv';
import redis from 'redis';

dotenv.config(); // env환경변수 파일 가져오기

//* Redis 연결
const redisClient = redis.createClient({ legacyMode: true });

redisClient.on('connect', () =>
{
	console.info('Redis connected!');
});

redisClient.on('error', (err) =>
{
	console.error('Redis Client Error', err);
});

redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4; // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용

export default redisCli;