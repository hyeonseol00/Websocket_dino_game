let currentStage;
let highScore;

function getCurrentStage()
{
	return currentStage;
}

function setCurrentStage(targetStage)
{
	currentStage = targetStage;
}

function getHighScore()
{
	return highScore;
}

function setHighScore(score)
{
	highScore = score;
}

export { getCurrentStage, setCurrentStage, getHighScore, setHighScore };