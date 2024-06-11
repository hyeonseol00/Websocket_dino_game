let gameAssets = {};

export const loadGameAssets = (assets) =>
{
	try
	{
		gameAssets = {
			stages: assets.stages,
			items: assets.items,
			itemUnlocks: assets.itemUnlocks
		};
		return gameAssets;
	}
	catch (err)
	{
		throw new Error("에셋 저장 중 에러가 발생했습니다: " + err.message);
	}
};

export const getGameAssets = () =>
{
	return gameAssets;
};