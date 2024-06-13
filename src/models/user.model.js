import redisCli from "../../redis/redis.client.js";

const usersKey = "users";

export const addUser = async (user) =>
{
	const usersJSON = await redisCli.get(usersKey);
	const users = await JSON.parse(usersJSON);

	if (!users)
	{
		await redisCli.set(usersKey, `{ "data": [${JSON.stringify(user)}] }`);
		return;
	}

	users.data.push(user);
	await redisCli.set(usersKey, JSON.stringify(users));
};

export const removeUser = async (socketId) =>
{
	const usersJSON = await redisCli.get(usersKey);
	const users = await JSON.parse(usersJSON);
	const index = users.data.findIndex((user) => user.socketId === socketId);

	if (index !== -1)
	{
		users.data.splice(index, 1)[0];
	}

	await redisCli.set(usersKey, JSON.stringify(users));
};

export const getUser = async () =>
{
	const usersJSON = await redisCli.get(usersKey);
	const users = await JSON.parse(usersJSON);

	return users.data;
};