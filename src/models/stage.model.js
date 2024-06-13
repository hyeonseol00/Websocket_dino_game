import redisCli from "../../redis/redis.client.js";

const stagesKey = "stages";

// 스테이지 초기화
export const createStage = async (uuid) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	if (!stages)
	{
		await redisCli.set(stagesKey, `{ "${uuid}": [] }`);
		return;
	}

	stages[uuid] = [];
	await redisCli.set(stagesKey, JSON.stringify(stages));
};

export const getStage = async (uuid) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	return stages[uuid];
};

export const setStage = async (uuid, id, timestamp) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	stages[uuid].push({ id, timestamp });

	await redisCli.set(stagesKey, JSON.stringify(stages));
};

export const clearStage = async (uuid) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	if (!stages)
	{
		await redisCli.set(stagesKey, `{ "${uuid}": [] }`);
		return;
	}

	stages[uuid] = [];
	await redisCli.set(stagesKey, JSON.stringify(stages));
};