import { loadGameAssets } from './Assets.js';
import { CLIENT_VERSION } from './Constants.js';
import { setCurrentStage, setHighScore } from './GaApplication.js';

let userId = localStorage.getItem("uuid");

const socket = io('http://localhost:3000', {
	query: {
		clientVersion: CLIENT_VERSION,
		uuid: userId
	},
});

socket.on('response', (data) =>
{
	if (data.currentStage !== undefined)
		setCurrentStage(data.currentStage);

	if (data.highScore !== undefined)
		setHighScore(data.highScore);

	console.log('response: ', data);
});

socket.on('connection', (data) =>
{
	console.log('connection: ', data);
	if (!userId)
	{
		localStorage.setItem("uuid", data.uuid);
		userId = data.uuid;
	}
	loadGameAssets(data.gameAssets);
	setHighScore(data.highScore);
});

const sendEvent = (handlerId, payload) =>
{
	socket.emit('event', {
		userId,
		clientVersion: CLIENT_VERSION,
		handlerId,
		payload,
	});
};

export { sendEvent };
