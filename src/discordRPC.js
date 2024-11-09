const rpc = require("discord-rpc");
const clientId = "1304184351763730472";

const client = new rpc.Client({ transport: "ipc" });

async function setActivity(title, itemType, seasonNumber, episodeNumber, episodeTitle) {
    if (!client) return;
    let presence = {
        details: `${title}`,
        largeImageKey: "stremio",
        instance: false,
    };

    if (itemType === "movie") {
        presence.state = `Watching a movie`
    }

    else if (itemType === "series") {
        presence.state = `S${seasonNumber}E${episodeNumber}: ${episodeTitle}`
    }
    client.setActivity(presence);
}

client.on("ready", () => {
    console.log("Connected to Discord!");
});

client.login({ clientId }).catch(console.error);

module.exports = { setActivity };
