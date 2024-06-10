import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, "../../assets");

// 파일 읽는 함수
// 비동기 병렬로 읽는다.
const readFileAsync = (filename) =>
{
	return new Promise((resolve, reject) =>
	{
		fs.readFile(path.join(basePath, filename), "utf8", (err, data) =>
		{
			if (err)
			{
				reject(err);
				return;
			}
			resolve(JSON.parse(data));
		});
	});
};

export const loadGameAssets = async () =>
{
	try
	{
		const [stages, items, itemUnlocks] = await Promise.all([
			readFileAsync("stage.json"),
			readFileAsync("item.json"),
			readFileAsync("item_unlock.json")
		]);

		gameAssets = { stages, items, itemUnlocks };
		return gameAssets;
	}
	catch (err)
	{
		throw new Error("에셋 로드 중 에러가 발생했습니다: " + err.message);
	}
};

export const getGameAssets = () =>
{
	return gameAssets;
};