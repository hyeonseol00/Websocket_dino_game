import { getGameAssets } from "./Assets.js";
import { getCurrentStage, setCurrentStage } from "./GaApplication.js";
import { sendEvent } from "./Socket.js";

class Score
{
	score = 0;
	HIGH_SCORE_KEY = 'highScore';

	constructor(ctx, scaleRatio)
	{
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.scaleRatio = scaleRatio;
	}

	update(deltaTime)
	{
		const assets = getGameAssets();
		const stagesData = assets.stages.data;
		const stageScorePerSecond = +stagesData[getCurrentStage() - 1].scorePerSecond;

		this.score += deltaTime * 0.001 * stageScorePerSecond;
		this.sendEventForSwapStage(stagesData);
	}

	sendEventForSwapStage(stagesData)
	{
		const currentStage = getCurrentStage();

		// currentStage는 1부터, stagesData는 0부터 즉, stagesData[currentData] == 다음 스테이지 데이터
		if (stagesData[currentStage] !== undefined)
			if (Math.floor(this.score) >= stagesData[currentStage].score)
				sendEvent(11, {
					currentStage: currentStage + 1000,
					targetStage: currentStage + 1001,
					clientScore: this.score
				});
	}

	getItem(itemId)
	{
		const assets = getGameAssets();
		const itemssData = assets.items.data;
		const itemScore = itemssData.find(item => item.id == itemId).score;

		this.score += itemScore;

		sendEvent(21, { itemId });
	}

	reset()
	{
		this.score = 0;
	}

	setHighScore()
	{
		const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
		if (this.score > highScore)
		{
			localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
		}
	}

	getScore()
	{
		return this.score;
	}

	draw()
	{
		const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
		const y = 20 * this.scaleRatio;

		const fontSize = 20 * this.scaleRatio;
		this.ctx.font = `${fontSize}px serif`;
		this.ctx.fillStyle = '#525250';

		const scoreX = this.canvas.width - 75 * this.scaleRatio;
		const highScoreX = scoreX - 125 * this.scaleRatio;

		const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
		const highScorePadded = highScore.toString().padStart(6, 0);

		this.ctx.fillText(scorePadded, scoreX, y);
		this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
	}
}

export default Score;
