import { getGameAssets } from "../init/assets.js";
import { getItem, setItem } from "../models/item.model.js";
import { getStage } from "../models/stage.model.js";

export const getItemHandler = (userId, payload) =>
{
	const { items, itemUnlocks } = getGameAssets();

	let currentItems = getItem(userId);
	currentItems.sort((a, b) => a.timestamp - b.timestamp);
	const lastItem = currentItems.at(-1);

	let currentStages = getStage(userId);
	currentStages.sort((a, b) => a.id - b.id);
	const currentStage = currentStages[currentStages.length - 1];

	const serverTime = Date.now();

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

	// 획득한 아이템이 해당 스테이지에 등장하는 아이템이 맞는지 검증
	if (!itemUnlocks.data[currentStage.id - 1001].item_id.includes(payload.itemId))
	{
		return { status: "fail", message: "현재 스테이지에 등장하는 아이템이 아닙니다!" };
	}

	// 아이템을 획득한 시간간격 검증
	if (lastItem)
	{
		const elapsedTime = (serverTime - lastItem.timestamp) / 1000;

		if (elapsedTime <= items.data[lastItem.id - 1].spawnTime)
		{
			return { status: "fail", message: "비정상적인 아이템 획득 속도입니다!" };
		}
	}

	setItem(userId, payload.itemId, serverTime);

	return { status: "success", message: `${payload.itemId}번 아이템 획득 성공` };
};