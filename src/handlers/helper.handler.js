import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createItem } from "../models/item.model.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = (socket, uuid) =>
{
	removeUser(socket.id);
	console.log(`사용자 접속 해제: ${socket.id}`);
	console.log("현재 접속 중 유저: ", getUser());
};

export const handleConnection = (socket, uuid) =>
{
	console.log(`ID ${socket.id}의 소켓으로 새로운 사용자가 접속했습니다: ${uuid}`);
	console.log("현재 접속 중 유저: ", getUser());

	createStage(uuid);
	createItem(uuid);

	socket.emit("connection", { uuid, gameAssets: getGameAssets() });
};

export const handlerEvent = (io, socket, data) =>
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

	const response = handler(data.userId, data.payload);

	if (response.broadcast)
	{
		io.emit("response", "broadcast");
		return;
	}

	socket.emit("response", response);
};