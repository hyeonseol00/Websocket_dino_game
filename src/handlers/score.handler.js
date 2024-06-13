import { getHighScore, setHighScore } from "../models/score.model.js";
import { updateUuid } from "../models/uuid.model.js";

export const updateHighScore = async (uuid, payload) =>
{
	updateUuid(uuid);
	if (+payload.highScore >= await getHighScore())
		setHighScore(+payload.highScore);

	return { broadcast: { status: "success", message: "최고기록이 갱신되었습니다.", highScore: await getHighScore() } };
};
