import { getGameAssets } from "../init/assets.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) =>
{
	// stages[0] === 첫 번째 스테이지
	const { stages } = getGameAssets();

	clearStage(uuid);

	setStage(uuid, stages.data[0].id, payload.timestamp);
	console.log("스테이지: ", getStage(uuid));

	return { status: "success" };
};

export const gameEnd = () =>
{
	// 클라이언트는 종료 시 시간과 점수를 전달
	const { timestamp: gameEndTime, score } = payload;
	const stages = getStage(uuid);

	if (stages.length)
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

		const stageDuration = (stageEndTime - stage.timestamp) / 1000;
		totalScore += stageDuration; // 1초당 1점
	});

	// 점수와 타임스탬프 검증
	if (Math.abs(score - totalScore) > 5)
	{
		return { status: "fail", message: "점수가 검증되지 않았습니다" };
	}

	// DB에 저장한다면 이 부분에서 저장

	return { status: "success", message: "게임 종료", score };
};