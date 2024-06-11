import { getGameAssets } from "../init/assets.js";
import { getItem, setItem } from "../models/item.model.js";

export const getItemHandler = (userId, payload) =>
{
	const { items } = getGameAssets();
	let currentItems = getItem(userId);

	if (currentItems === undefined)
	{
		return { status: "fail", message: "해당 사용자의 아이템 정보가 없습니다." };
	};

	// targetStage 검증 : 게임 에셋에 존재하는지
	if (!items.data.some((item) => item.id === payload.itemId))
	{
		return { status: "fail", message: "해당하는 아이템 정보를 찾을 수 없습니다." };
	}

	setItem(userId, payload.itemId);

	return { status: "success", message: `${payload.itemId}번 아이템 획득 성공` };
};