const rpc = require("discord-rpc");
const clientId = "1304184351763730472";

const client = new rpc.Client({ transport: "ipc" });

client.on("ready", () => {
    console.log("Connected to Discord!");
});


client.login({ clientId }).catch(() => {
    console.error("Could not login to Discord. Please make sure that the Discord application is running and start this application again");
    process.exit();
});

async function setActivity(title, itemType, imageUrl, seasonNumber, episodeNumber, episodeTitle) {
    if (!client) return;
    let presence = {
        details: `${title}`,
        largeImageKey: imageUrl,
        instance: false,
    };

    if (itemType === "movie") {
        presence.state = `Watching a movie`;
    }

    else if (itemType === "series") {
        presence.state = `S${seasonNumber}E${episodeNumber}: ${episodeTitle}`;
    }
    client.setActivity(presence);

    console.log("Changed Discord status to the following:");
    logStatus(presence);
}

async function clearActivity() {
    console.log("Clearing Discord status");
    client.clearActivity();
}

function logStatus(presence) {
    console.log("===================");
    console.log("Stremio");
    console.log(presence.details);
    console.log(presence.state);
    console.log("===================");
}

module.exports = { setActivity, clearActivity };
