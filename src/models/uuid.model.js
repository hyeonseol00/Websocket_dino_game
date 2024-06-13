import redisCli from "../../redis/redis.client.js";

const uuidsKey = "uuids";

export const addUuid = async (uuid) =>
{
	const uuidsJSON = await redisCli.get(uuidsKey);
	const uuids = await JSON.parse(uuidsJSON);

	if (!uuids)
	{
		await redisCli.set(uuidsKey, `{ "data": [{ "uuid": "${uuid}", "isHighScored": false }] }`);
		return;
	}

	if (!uuids.data.find(ele => ele.uuid === uuid))
	{
		uuids.data.push({ uuid, isHighScored: false });
		await redisCli.set(uuidsKey, JSON.stringify(uuids));
	}
};

export const updateUuid = async (uuid) =>
{
	const uuidsJSON = await redisCli.get(uuidsKey);
	const uuids = await JSON.parse(uuidsJSON);
	const index = uuids.data.findIndex((ele) => ele.uuid === uuid);

	if (index !== -1)
	{
		uuids.data[index].isHighScored = true;
	}

	await redisCli.set(uuidsKey, JSON.stringify(uuids));
};

export const getUuid = async (uuid) =>
{
	const uuidsJSON = await redisCli.get(uuidsKey);
	const uuids = await JSON.parse(uuidsJSON);
	const index = uuids.data.findIndex((ele) => ele.uuid === uuid);


	return uuids.data[index];
};
