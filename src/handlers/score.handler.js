import { getHighScore, setHighScore } from "../models/score.model.js";

export const updateHighScore = async (uuid, payload) =>
{
	setHighScore(payload.highScore);

	return { broadcast: { status: "success", message: "최고기록이 갱신되었습니다.", highScore: await getHighScore() } };
};
