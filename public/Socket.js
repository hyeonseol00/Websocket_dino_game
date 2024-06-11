import { loadGameAssets } from './Assets.js';
import { CLIENT_VERSION } from './Constants.js';
import { setCurrentStage } from './GaApplication.js';

const socket = io('http://localhost:3000', {
	query: {
		clientVersion: CLIENT_VERSION,
	},
});

let userId = null;
socket.on('response', (data) =>
{
	if (data.currentStage !== undefined)
		setCurrentStage(data.currentStage);

	console.log('response: ', data);
});

socket.on('connection', (data) =>
{
	console.log('connection: ', data);
	userId = data.uuid;
	loadGameAssets(data.gameAssets);
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
