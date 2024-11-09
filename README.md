# Stremio - Discord Rich Presence
Addon for [Stremio](https://www.stremio.com/) to show the movie or series you are watching as your Discord status.

# How to install
Stremio addons are hosted as Nodejs applications.

Because Discord has to be running on the same machine as the application, this addon should be run locally.

1. Clone the repository
2. Run the command `npm install`
3. Run the command `npm run start` to start the application

# How to use
1. Open Discord
2. Use Stremio as normal, starting a movie/series to watch
3. When you are done watching, visit another page than the Home page and return to the Home page to clear your status (This is not an optimal method, but it will have to do for now due to the way the Stremio Addon SDK works

# Dependencies
- [discord-rpc](https://www.npmjs.com/package/discord-rpc)
- [needle](https://www.npmjs.com/package/needle)
- [stremio-addon-sdk](https://www.npmjs.com/package/stremio-addon-sdk)

# Known issues
Stremio addons are mainly used for expanding Stremio functionality (adding more sources for streams, subtitles etc.)
Because of this, the functionality of addons like this is limited.

This addon uses the [defineStreamHandler](https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md) method to retrieve information about the movie/series you are about to watch.
This method is usually called when looking at the stream sources for a movie/series or when resuming a previously watched movie/series.
Thus, it is possible to click on a movie to show more details, return to the main menu, but still have your Discord status show that you are watching that movie.
