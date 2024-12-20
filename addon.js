const { addonBuilder } = require("stremio-addon-sdk");
const needle = require('needle');
const { setActivity, clearActivity } = require("./src/discordRPC");

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "dev.frankstam.stremio-discord-rpc",
	"version": "1.0.0",
	"catalogs": [ { "type": "movie", "id": "placeholder" } ],
	"resources": [
		"stream",
	],
	"types": [
		"movie",
		"series"
	],
	"name": "Discord Rich Presence",
	"description": "Show the movie or series you are watching on Stremio as your Discord status",
	"logo": "https://i.ibb.co/kGHhqr2/discord-mark-blue.png"
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async (args) => {
	// Only movies and series are supported as a Discord status, so return if the stream is not for one of those types
	if (args.type !== "movie" && args.type !== "series") {
		return Promise.resolve({ streams: [] });
	}

	const { type: itemType, id: itemIdFull } = args;
	const imdbId = itemIdFull.split(":")[0];
	const url = `https://cinemeta-live.strem.io/meta/${itemType}/${imdbId}.json`;

	try {
		const metaData = await fetchMetadata(url);
		const itemTitle = metaData?.name;
		const imageUrl = metaData?.poster;
		if (itemType === "movie") {
			setActivity(itemTitle, itemType, imageUrl);
		}
		else if (itemType === "series") {
			const seasonNumber = itemIdFull.split(":")[1];
			const episodeNumber = itemIdFull.split(":")[2];

			const episodeArray = metaData.videos;
			const episodeBeingWatched = episodeArray.find(video => video.id === itemIdFull);

			if (episodeBeingWatched) {
				const episodeTitle = episodeBeingWatched.title || episodeBeingWatched.name;
				setActivity(itemTitle, itemType, imageUrl, seasonNumber, episodeNumber, episodeTitle);
			} else {
				console.error(`Episode with ID ${itemIdFull} not found.`);
			}
		}
	} catch (error) {
		console.error("Failed to fetch metadata:", error);
	}

	return Promise.resolve({ streams: [] });
});

builder.defineCatalogHandler(async (args) => {
	// Workaround for clearing Discord status: In the Stremio menu, going to a page other than the Home page and then returning to the
	// Home page will clear the status. This is not really optimal, but will do for now
	await clearActivity()
});

async function fetchMetadata(url) {
	console.log(`Fetching metadata from ${url}`);
	try {
		const response = await needle("get", url);
		return response.body.meta;
	} catch (error) {
		console.error("Error fetching metadata:", error);
		return null;
	}
}

module.exports = builder.getInterface();