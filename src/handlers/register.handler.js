import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.handler.js";
import { addUuid, getUuid } from "../models/uuid.model.js";

const registerHandler = (io) =>
{
	io.on("connection", async (socket) =>
	{
		// 이벤트 처리
		const userUUID = socket.handshake.query.uuid != "null" ?
			socket.handshake.query.uuid :
			uuidv4();

		await addUser({ uuid: userUUID, socketId: socket.id });
		await addUuid(userUUID);

		handleConnection(socket, userUUID);

		socket.on("event", (data) => handlerEvent(io, socket, data));
		// 접속 해제 시 이벤트
		socket.on("disconnect", () => { handleDisconnect(socket, userUUID); });
	});
};

export default registerHandler;