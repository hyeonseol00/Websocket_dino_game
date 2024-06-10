let currentStage;

function getCurrentStage()
{
	return currentStage;
}

function setCurrentStage(targetStage)
{
	console.log(currentStage, targetStage);
	currentStage = targetStage;
}

export { getCurrentStage, setCurrentStage };