const RPC = require("discord-rpc");
const clientId = "1304184351763730472";

const rpc = new RPC.Client({ transport: "ipc" });

async function setActivity(title, itemType, seasonNumber, episodeNumber, episodeTitle) {
    if (!rpc) return;
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
    rpc.setActivity(presence);
}

rpc.on("ready", () => {
    console.log("Connected to Discord!");
});

rpc.login({ clientId }).catch(console.error);

module.exports = { setActivity };
