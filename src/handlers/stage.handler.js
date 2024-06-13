import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = async (userId, payload) =>
{
	const { stages } = getGameAssets();
	let currentStages = await getStage(userId);

	if (!currentStages.length)
	{
		return { status: "fail", message: "해당 사용자의 스테이지 정보가 없습니다." };
	}

	// 오름차순으로 가장 큰 스테이지의 ID를 확인 : 유저의 현재 스테이지
	currentStages.sort((a, b) => a.id - b.id);
	const currentStage = currentStages[currentStages.length - 1];

	// 클라이언트와 서버의 데이터 비교
	if (currentStage.id !== payload.currentStage)
	{
		return { status: "fail", message: "현재 스테이지 정보가 잘못되었습니다." };
	}

	// 점수 검증 (클라이언트가 보낸 점수가 스테이지를 넘을 수 있는지)
	if (stages.data[currentStage.id - 1000].score > payload.clientScore)
	{
		return { status: "fail", message: "요청한 점수로는 스테이지를 이동할 수 없습니다." };
	}

	// 점수 검증 (경과한 시간을 이용)
	const serverTime = Date.now(); // 현재 타임스탬프
	/*
	const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
	const nomalizedTime = elapsedTime / (currentStage.id - 1000);

	if (9.5 >= nomalizedTime || nomalizedTime > 10.5)
	{
		return { status: "fail", message: "경과 시간 데이터가 잘못되었습니다." };
	}
	*/

	// targetStage 검증 : 게임 에셋에 존재하는지
	if (!stages.data.some((stage) => stage.id === payload.targetStage))
	{
		return { status: "fail", message: "목표 스테이지 정보를 찾을 수 없습니다." };
	}

	setStage(userId, payload.targetStage, serverTime);

	return { status: "success", currentStage: payload.targetStage - 1000, message: `스테이지 전환 성공, 현재 ${payload.targetStage - 1000}스테이지` };
};