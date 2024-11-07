const { addonBuilder } = require("stremio-addon-sdk")
const needle = require('needle')
const { setActivity } = require("./src/discordRPC");

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.DiscordRPC",
	"version": "0.0.1",
	"catalogs": [],
	"resources": [
		"stream",
	],
	"types": [
		"movie",
		"series"
	],
	"name": "Discord Rich Presence",
	"description": "Show what you are watching on Discord"
}
const builder = new addonBuilder(manifest)

builder.defineStreamHandler((args) => {
	const { type: itemType, id: itemIdFull } = args;

	const baseUrl = "https://cinemeta-live.strem.io/meta";

	let url = "";
	const imdbId = itemIdFull.split(":")[0];
	let seasonNumber;
	let episodeNumber;

	if (itemType === "movie") {
		url = `${baseUrl}/movie/${imdbId}.json`;
		console.log(`Fetching movie metadata from ${url}`);

		if (url) {
			needle.get(url, (err, resp, body) => {
				if (body && body.meta) {
					setActivity(body.meta.name, itemType);
				} else {
					console.error("Invalid body or body.meta is missing.");
				}
			});
		}

	} else if (itemType === "series") {
		seasonNumber = itemIdFull.split(":")[1]
		episodeNumber = itemIdFull.split(":")[2]
		url = `${baseUrl}/series/${imdbId}.json`;
		console.log(`Fetching series metadata from ${url}`);

		if (url) {
			needle.get(url, (err, resp, body) => {
				if (body && body.meta) {
					const episodeArray = body.meta.videos;
					const episode = episodeArray.find(video => video.id === itemIdFull);
					if (episode) {  // Check if episode is found
						// Use `title` if available, otherwise `name`
						const episodeTitle = episode.title || episode.name;
						setActivity(body.meta.name, itemType, seasonNumber, episodeNumber, episodeTitle);
					} else {
						console.error(`Episode with ID ${itemIdFull} not found.`);
					}
				} else {
					console.error("Invalid body or body.meta is missing.");
				}
			});
		}
	}

	return Promise.resolve({ streams: [] });
});

module.exports = builder.getInterface()