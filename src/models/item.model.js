import redisCli from "../../redis/redis.client.js";

const itemsKey = "items";

// 아이템 초기화
export const createItem = async (uuid) =>
{
	const itemsJSON = await redisCli.get(itemsKey);
	const items = await JSON.parse(itemsJSON);

	if (!items)
	{
		await redisCli.set(itemsKey, `{ "${uuid}": [] }`);
		return;
	}

	items[uuid] = [];
	await redisCli.set(itemsKey, JSON.stringify(items));
};

export const getItem = async (uuid) =>
{
	const itemsJSON = await redisCli.get(itemsKey);
	const items = await JSON.parse(itemsJSON);

	return items[uuid];
};

export const setItem = async (uuid, id, timestamp) =>
{
	const itemsJSON = await redisCli.get(itemsKey);
	const items = await JSON.parse(itemsJSON);

	items[uuid].push({ id, timestamp });

	await redisCli.set(itemsKey, JSON.stringify(items));
};

export const clearItem = async (uuid) =>
{
	const itemsJSON = await redisCli.get(itemsKey);
	const items = await JSON.parse(itemsJSON);

	if (!items)
	{
		await redisCli.set(itemsKey, `{ "${uuid}": [] }`);
		return;
	}

	items[uuid] = [];
	await redisCli.set(itemsKey, JSON.stringify(items));
};