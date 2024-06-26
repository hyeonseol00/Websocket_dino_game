import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createItem, getItem } from "../models/item.model.js";
import { getHighScore } from "../models/score.model.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import { getUuid } from "../models/uuid.model.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = async (socket, uuid) =>
{
	await removeUser(socket.id);
	console.log(`사용자 접속 해제: ${socket.id}`);
	console.log("현재 접속 중 유저: ", await getUser());
};

export const handleConnection = async (socket, uuid) =>
{
	console.log(`ID ${socket.id}의 소켓으로 새로운 사용자가 접속했습니다: ${uuid}`);
	console.log("현재 접속 중 유저: ", await getUser());

	await createStage(uuid);
	await createItem(uuid);

	let message;
	const uuidInfo = await getUuid(uuid);

	if (uuidInfo.isHighScored)
		message = "반갑습니다! 최고 기록을 달성한 전적이 있으시군요!";
	else
		message = "안녕하세요! 최고 기록에 도전해 봅시다!";

	socket.emit("connection", { message, uuid, gameAssets: getGameAssets(), highScore: await getHighScore() });
};

export const handlerEvent = async (io, socket, data) =>
{
	if (!CLIENT_VERSION.includes(data.clientVersion))
	{
		socket.emit("response", { status: "fail", message: "클라이언트 버전이 잘못되었습니다." });
		return;
	}

	const handler = handlerMappings[data.handlerId];
	if (!handler)
	{
		socket.emit("response", { status: "fail", message: "핸들러를 찾을 수 없습니다." });
		return;
	}

	const response = await handler(data.userId, data.payload);

	if (response.broadcast)
	{
		io.emit("response", response.broadcast);
		return;
	}

	socket.emit("response", response);
};