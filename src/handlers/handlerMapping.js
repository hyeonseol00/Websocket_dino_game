import { gameEnd, gameStart } from "./game.handler.js";
import { getItemHandler } from "./item.handler.js";
import { updateHighScore } from "./score.handler.js";
import { moveStageHandler } from "./stage.handler.js";

const handlerMappings = {
	2: gameStart,
	3: gameEnd,
	11: moveStageHandler,
	21: getItemHandler,
	31: updateHighScore
};

export default handlerMappings;