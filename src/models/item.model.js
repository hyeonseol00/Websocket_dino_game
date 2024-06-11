const items = {};

// 아이템 초기화
export const createItem = (uuid) =>
{
	items[uuid] = [];
};

export const getItem = (uuid) =>
{
	return items[uuid];
};

export const setItem = (uuid, id, timestamp) =>
{
	return items[uuid].push({ id, timestamp });
};

export const clearItem = (uuid) =>
{
	items[uuid] = [];
};