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

	// 게임 에셋에 존재하는지 검증
	if (!items.data.some((item) => item.id === payload.itemId))
	{
		return { status: "fail", message: "해당하는 아이템 정보를 찾을 수 없습니다." };
	}

	// 클라이언트에서 추가된 점수가 아이템에 맞는 점수인지 검증
	if (!(items.data.find((item) => item.id == payload.itemId).score == payload.itemScore))
	{
		return { status: "fail", message: "해당 아이템에 맞는 점수가 아닙니다!" };
	}

	setItem(userId, payload.itemId);

	return { status: "success", message: `${payload.itemId}번 아이템 획득 성공` };
};