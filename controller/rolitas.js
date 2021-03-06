const TelegramBot = require("node-telegram-bot-api");
const Spotify = require("../models/spotify");

const token = process.env.TOKEN;
const parse_mode = "Markdown";
const telegramOptions = {parse_mode, disable_web_page_preview: true};

const bot = new TelegramBot(token, {polling: {interval: 3000}});
const spotify = new Spotify();

bot.onText(/id/, async (msg, match) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, chatId);
});

bot.onText(/\/last(rolitas|ardientes|dirty|buendia|viejitas)\s*(\d{0,2})/, async (msg, match) => {
	const chatId = msg.chat.id;
	let playlist = match[1];
	let limit = match[2];

	switch (playlist) {
		case "rolitas":
			playlist = spotify.allPlaylists.Rolitas;
			break;
		case "ardientes":
			playlist = spotify.allPlaylists.RolitasArdientes;
			break;
		case "dirty":
			playlist = spotify.allPlaylists.RolitasDirty;
			break;
		case "buendia":
			playlist = spotify.allPlaylists.RolitasBuenDia;
			break;
		case "viejitas":
			playlist = spotify.allPlaylists.RolitasViejitas;
			break;
	}

	try {
		if (limit.length !== 0) {
			limit = parseInt(limit);
		} else {
			limit = 5;
		}
	} catch (e) {
		limit = 5;
	}

	const newRolitas = await spotify.lastRolitas(playlist, limit);
	bot.sendMessage(chatId, newRolitas, telegramOptions);
});

checkNewRolitas(spotify.allPlaylists.Rolitas, spotify.currentTotalSongsRolitas);
checkNewRolitas(spotify.allPlaylists.RolitasArdientes, spotify.currentTotalSongsArdientes);
checkNewRolitas(spotify.allPlaylists.RolitasDirty, spotify.currentTotalSongsDirty);
checkNewRolitas(spotify.allPlaylists.RolitasBuenDia, spotify.currentTotalSongsBuenDia);
checkNewRolitas(spotify.allPlaylists.RolitasViejitas, spotify.currentTotalSongsViejitas);

function checkNewRolitas(playlistId, currentTotalPlaylist) {
	setInterval(async () => {
		const totalSongs = await spotify.getTotalRolitas(playlistId);
		if (totalSongs !== currentTotalPlaylist) {
			const difference = totalSongs - currentTotalPlaylist;
			currentTotalPlaylist = totalSongs;
			if (difference > 0) {
				const lastRolita = await spotify.lastRolitas(playlistId, difference);

				const playlistName = Object.entries(spotify.allPlaylists).find(
					(playlist) => playlist[1] === playlistId
				);
				bot.sendMessage(
					"641803561",
					`*${playlistName[0]}*\n\n*??Hay ${difference} nuevas rolitas!*\n\n${lastRolita}`,
					telegramOptions
				);
				bot.sendMessage(
					"1618494293",
					`*${playlistName[0]}*\n\n*??Hay ${difference} nuevas rolitas!*\n\n${lastRolita}`,
					telegramOptions
				);
			}
		}
	}, 2 * 60_000);
}
