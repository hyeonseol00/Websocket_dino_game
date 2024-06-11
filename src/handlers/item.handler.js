import { getGameAssets } from "../init/assets";
import { getItem } from "../models/item.model";

export const getItemHandler = (userId, payload) =>
{
	const { items } = getGameAssets();
	let currentItems = getItem(userId);

	if (!currentItems.length)
	{
		return { status: "fail", message: "해당 사용자의 아이템 정보가 없습니다." };
	};
};