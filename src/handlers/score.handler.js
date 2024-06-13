import { getHighScore, setHighScore } from "../models/score.model.js";
import { updateUuid } from "../models/uuid.model.js";

export const updateHighScore = async (uuid, payload) =>
{
	await updateUuid(uuid);
	if (+payload.score >= await getHighScore())
		await setHighScore(Math.floor(+payload.score));
	else
		return null;

	return { status: "success", message: "게임 종료, 최고기록이 갱신되었습니다!", highScore: await getHighScore() };
};
