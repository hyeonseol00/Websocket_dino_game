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
		this.score += deltaTime * 0.001;

		const stagesData = getGameAssets().stages.data;
		switch (Math.floor(this.score))
		{
			case stagesData[1].score:
				if (getCurrentStage() === 1)
					sendEvent(11, { currentStage: 1001, targetStage: 1002 });
				break;
			case stagesData[2].score:
				if (getCurrentStage() === 2)
					sendEvent(11, { currentStage: 1002, targetStage: 1003 });
				break;
			case stagesData[3].score:
				if (getCurrentStage() === 3)
					sendEvent(11, { currentStage: 1003, targetStage: 1004 });
				break;
			case stagesData[4].score:
				if (getCurrentStage() === 4)
					sendEvent(11, { currentStage: 1004, targetStage: 1005 });
				break;
			case stagesData[5].score:
				if (getCurrentStage() === 5)
					sendEvent(11, { currentStage: 1005, targetStage: 1006 });
				break;
			case stagesData[6].score:
				if (getCurrentStage() === 6)
					sendEvent(11, { currentStage: 1006, targetStage: 1007 });
				break;
			case stagesData[7].score:
				if (getCurrentStage() === 7)
					sendEvent(11, { currentStage: 1007, targetStage: 1008 });
				break;
		}
	}

	getItem(itemId)
	{
		this.score += 0;
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
