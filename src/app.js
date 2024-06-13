import express from "express";
import { IncomingMessage, ServerResponse, createServer } from "http";
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";
import { clearUser } from "./models/user.model.js";

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

initSocket(server);

app.get("/", (req, res, next) =>
{
	res.send("helloworld");
});

server.listen(PORT, async () =>
{
	console.log(`서버가 ${PORT}번 포트로 동작중입니다.`);

	try
	{
		clearUser();
		// 파일 읽는 부분
		const assets = await loadGameAssets();
		console.log(assets);
	}
	catch (err)
	{
		console.error("에셋 로드 중 오류가 발생했습니다: ", err);
	}
});