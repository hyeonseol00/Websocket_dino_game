# 웹소켓 게임 만들기
Node.js 서버를 구축하고 제공받은 클라이언트와 웹소켓을 통해 연결하는 프로젝트입니다.
express, socket.io, uuid, redis 등의 패키지를 활용했습니다.

<br><br><br>

## 개발한 주요 기능

<br>

### 스테이지 구분
```js
{
  "name": "stage",
  "version": "1.0.0",
  "data": [
    { "id": 1001, "score": 0, "scorePerSecond": 1 },
    { "id": 1002, "score": 10, "scorePerSecond": 2 },
    { "id": 1003, "score": 30, "scorePerSecond": 4 },
    { "id": 1004, "score": 70, "scorePerSecond": 8 },
    { "id": 1005, "score": 150, "scorePerSecond": 16 },
    { "id": 1006, "score": 310, "scorePerSecond": 32 },
    { "id": 1007, "score": 630, "scorePerSecond": 64 },
    { "id": 1008, "score": 1270, "scorePerSecond": 128 }
  ]
}
```
스테이지별 요구 점수를 돌파하면 서버로 다음 스테이지 이동을 요청합니다.
다음과 같은 절차를 따릅니다.

1. 클라이언트가 다음 스테이지 진입 가능 점수에 도달 시 서버로 스테이지 이동 요청
1. 서버에서 payload data 검증 후 스테이지 이동
1. 클라이언트로 변경된 스테이지를 포함한 response 전달
1. 클라이언트에서도 변경된 스테이지 적용

<br>

### 스테이지 별 점수 차등 획득
```js
update(deltaTime)
{
    const assets = getGameAssets();
    const stagesData = assets.stages.data;
    const stageScorePerSecond = +stagesData[getCurrentStage() - 1].scorePerSecond;

    this.score += deltaTime * 0.001 * stageScorePerSecond;
    this.sendEventForSwapStage(stagesData);
}
```
현재 진행중인 스테이지별로 점수를 차등 지급합니다. `stage.json` 에셋에서 데이터를 불러와 적용합니다.
서버에서 데이터를 검증할 때에도 같은 방식으로 검증합니다.

<br>

### 스테이지에 따라 다른 아이템 생성
```js
{
  "name": "item_unlock",
  "version": "1.0.0",
  "data": [
    { "id": 101, "stage_id": 1001, "item_id": [1] },
    { "id": 201, "stage_id": 1002, "item_id": [1, 2] },
    { "id": 301, "stage_id": 1003, "item_id": [1, 2, 3] },
    { "id": 401, "stage_id": 1004, "item_id": [2, 3, 4] },
    { "id": 501, "stage_id": 1005, "item_id": [3, 4, 5] },
    { "id": 601, "stage_id": 1006, "item_id": [4, 5, 6] },
    { "id": 701, "stage_id": 1007, "item_id": [5, 6] },
    { "id": 801, "stage_id": 1008, "item_id": [6] }
  ]
}
```
스테이지별 생성되는 아이템을 `item_unlock.json`에 정의해두고 해당 내용대로 아이템이 생성되게 만듭니다.
해당 데이터로 서버에서도 정상적인 아이템 획득인지 검증합니다.

<br>

### 아이템 획득 시 점수 획득, 아이템별 점수 차등 획득
```js
{
  "name": "item",
  "version": "1.0.0",
  "data": [
    { "id": 1, "score": 10, "spawnTerm": 3000 },
    { "id": 2, "score": 20, "spawnTerm": 3500 },
    { "id": 3, "score": 40, "spawnTerm": 4000 },
    { "id": 4, "score": 80, "spawnTerm": 4500 },
    { "id": 5, "score": 160, "spawnTerm": 5000 },
    { "id": 6, "score": 320, "spawnTerm": 5500 }
  ]
}
```
```js
getItem(itemId)
{
    const assets = getGameAssets();
    const itemssData = assets.items.data;
    const itemScore = itemssData.find(item => item.id == itemId).score;

    this.score += itemScore;

    sendEvent(21, { itemId, itemScore });
}
```
```js
export const getItemHandler = async (userId, payload) =>
{
	const { items, itemUnlocks } = getGameAssets();
	const serverTime = Date.now();
  
  	...

    setItem(userId, payload.itemId, serverTime);

    return { status: "success", message: `${payload.itemId}번 아이템 획득 성공` };
}
```
아이템 획득 시 점수를 획득하고 서버에 해당 사실을 알려 아이템 획득 사실을 저장합니다.
이렇게 저장된 데이터는 후에 점수 검증에 활용됩니다.

```js
// 클라이언트에서 추가된 점수가 아이템에 맞는 점수인지 검증
if (!(items.data.find((item) => item.id == payload.itemId).score == payload.itemScore))
    return { status: "fail", message: "해당 아이템에 맞는 점수가 아닙니다!" };

// 아이템을 획득한 시간간격 검증
if (lastItem)
{
    const elapsedTime = (serverTime - lastItem.timestamp) / 1000;

    if (elapsedTime <= items.data[lastItem.id - 1].spawnTime)
      return { status: "fail", message: "비정상적인 아이템 획득 속도입니다!" };
}
```
아이템별로 생성되는 시간도 다르며, 이 생성시간에 비해 비정상적으로 자주 아이템을 획득하게 되면 검증에 실패합니다.

<br>

### Broadcast 기능
```js
const response = await handler(data.userId, data.payload);

if (response.broadcast)
{
    io.emit("response", response.broadcast);
    return;
}
```
핸들러를 거쳐 생성된 `response` 중 `broadcast`가 포함되어 있으면 현재 접속 중인 모든 유저에게 `response`를 전달하는 기능입니다.

<br>

### 가장 높은 점수 기록 관리
```js
const broadcast = await updateHighScore(uuid, payload);
let message;

if (broadcast !== null)
    message = broadcast;
else
    message = { status: "success", message: "게임 종료", score: Math.floor(score) };
```
```js
export const updateHighScore = async (uuid, payload) =>
{
	await updateUuid(uuid);
	if (+payload.score >= await getHighScore())
		await setHighScore(Math.floor(+payload.score));
	else
		return null;

	return { status: "success", message: "게임 종료, 최고기록이 갱신되었습니다!", highScore: await getHighScore() };
};

```
`redis` 에 서버 최고기록을 저장하고 해당 기록을 돌파하면 접속중인 모든 클라이언트에게 `broadcast`로 최고기록을 전달, 즉시 최고기록 표시를 갱신합니다.

<br>

### 유저 정보 연결
```js
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
```
한 번이라도 접속했던 유저의 `uuid`를 `redis`에 저장, 서버에 접속 시 전에 최고기록을 갱신한 유저라면 특별한 메시지를 전달합니다.

<br>

### Redis 연동
```js
export const createStage = async (uuid) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	if (!stages)
	{
		await redisCli.set(stagesKey, `{ "${uuid}": [] }`);
		return;
	}

	stages[uuid] = [];
	await redisCli.set(stagesKey, JSON.stringify(stages));
};

export const setStage = async (uuid, id, timestamp) =>
{
	const stagesJSON = await redisCli.get(stagesKey);
	const stages = await JSON.parse(stagesJSON);

	stages[uuid].push({ id, timestamp });

	await redisCli.set(stagesKey, JSON.stringify(stages));
};
```
`redis`를 활용해 데이터를 저장합니다. `localStorage`와 비슷하게 문자열 형식으로만 사용할 수 있어 객체를 `JSON`형식으로 변환해 저장했습니다.
