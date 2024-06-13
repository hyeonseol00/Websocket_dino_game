/* 
import { Entity, Schema } from 'redis-om';
import client from './client.js';

class Stage extends Entity { }

const stageSchema = new Schema(Stage, {
	uuid: { type: "string" },
	data: { type: "object[]" }
});

export const stageRepository = client.fetchRepository(stageSchema);

await stageRepository.createIndex();
 */