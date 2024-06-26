import { getGameAssets } from "./Assets.js";
import { getCurrentStage } from "./GaApplication.js";
import Item from "./Item.js";

class ItemController
{
	INTERVAL_MIN = 3000;
	INTERVAL_MAX = 5000;

	nextInterval = null;
	items = [];


	constructor(ctx, itemImages, scaleRatio, speed)
	{
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.itemImages = itemImages;
		this.scaleRatio = scaleRatio;
		this.speed = speed;

		this.setNextItemTime(0);
	}

	setNextItemTime(index)
	{
		let spawnTerm;
		try { spawnTerm = getGameAssets().items.data[index].spawnTerm; }
		catch { spawnTerm = 3000; }

		this.nextInterval = spawnTerm;
	}

	getRandomNumber(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	createItem()
	{
		const assets = getGameAssets();
		const currentStageItemUnlocks = assets.itemUnlocks.data[getCurrentStage() - 1].item_id;
		const index = this.getRandomNumber(currentStageItemUnlocks[0] - 1, currentStageItemUnlocks.at(-1) - 1);
		const itemInfo = this.itemImages[index];
		const x = this.canvas.width * 1.5;
		const y = this.getRandomNumber(
			10,
			this.canvas.height - itemInfo.height
		);

		const item = new Item(
			this.ctx,
			itemInfo.id,
			x,
			y,
			itemInfo.width,
			itemInfo.height,
			itemInfo.image
		);

		this.items.push(item);

		return index;
	}


	update(gameSpeed, deltaTime)
	{
		if (this.nextInterval <= 0)
		{
			this.setNextItemTime(this.createItem());
		}

		this.nextInterval -= deltaTime;

		this.items.forEach((item) =>
		{
			item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
		});

		this.items = this.items.filter(item => item.x > -item.width);
	}

	draw()
	{
		this.items.forEach((item) => item.draw());
	}

	collideWith(sprite)
	{
		const collidedItem = this.items.find(item => item.collideWith(sprite));
		if (collidedItem)
		{
			this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
			return {
				itemId: collidedItem.id
			};
		}
	}

	reset()
	{
		this.items = [];
	}
}

export default ItemController;