import { getGameAssets } from "../init/assets.js";
import { clearItem, getItem } from "../models/item.model.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";
import { updateHighScore } from "./score.handler.js";

export const gameStart = async (uuid, payload) =>
{
	// stages[0] === 첫 번째 스테이지
	const { stages } = getGameAssets();

	await clearStage(uuid);
	await clearItem(uuid);

	await setStage(uuid, stages.data[0].id, payload.timestamp);
	console.log("스테이지: ", await getStage(uuid));

	return { status: "success", message: "게임이 정상적으로 실행되었습니다." };
};

export const gameEnd = async (uuid, payload) =>
{
	// 클라이언트는 종료 시 시간과 점수를 전달
	const { timestamp: gameEndTime, score } = payload;
	const stages = await getStage(uuid);
	const items = await getItem(uuid);
	const assets = getGameAssets();

	if (!stages.length)
	{
		return { status: "fail", message: "사용자의 스테이지 정보를 찾지 못했습니다." };
	}

	let totalScore = 0;

	stages.forEach((stage, index) =>
	{
		let stageEndTime;
		if (index === stages.length - 1)
		{
			stageEndTime = gameEndTime;
		}
		else
		{
			stageEndTime = stages[index + 1].timestamp;
		}

		const scorePerSecond = assets.stages.data[index].scorePerSecond;
		const stageDuration = (stageEndTime - stage.timestamp) / 1000 * scorePerSecond;
		totalScore += stageDuration;
	});

	items.forEach((item) =>
	{
		totalScore += assets.items.data[item.id - 1].score;
	});

	// 점수와 타임스탬프 검증
	if (Math.abs(score - totalScore) > 5)
	{
		return { status: "fail", message: "점수가 검증되지 않았습니다" };
	}

	// DB에 저장한다면 이 부분에서 저장
	const broadcast = await updateHighScore(uuid, payload);
	let message;

	if (broadcast !== null)
		message = broadcast;
	else
		message = { status: "success", message: "게임 종료", score: Math.floor(score) };

	return message;
};