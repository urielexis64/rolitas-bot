require("dotenv").config();
const axios = require("axios");

class Spotify {
	currentToken = "";

	allPlaylists = {
		Rolitas: "7DJb4ZrCA6xTV057wDopgM",
		RolitasArdientes: "1vsDheCTaKXKdT68Bd9idY",
		RolitasDirty: "6edyVGP1odsLCTm4oK9Txk",
		RolitasBuenDia: "05pthw3W3zl4KdDegPZM68",
	};

	constructor() {
		// Set id of each playlist as class field
		setTimeout(async () => {
			await Promise.all([
				(this.currentTotalSongsRolitas = await this.getTotalRolitas(
					this.allPlaylists.Rolitas
				)),
				(this.currentTotalSongsArdientes = await this.getTotalRolitas(
					this.allPlaylists.RolitasArdientes
				)),
				(this.currentTotalSongsDirty = await this.getTotalRolitas(
					this.allPlaylists.RolitasDirty
				)),
			]);
		}, 0);

		// Refresh token each hour
		setInterval(() => {
			this.currentToken = this.getToken();
		}, 3600 * 1000);
	}

	// Required params to request new token
	get tokenParams() {
		return {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			grant_type: process.env.GRANT_TYPE,
		};
	}

	// Required headers to request new token
	get lastRolitasHeaders() {
		return {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${this.currentToken}`,
		};
	}

	// Required params to request playlists items
	get lastRolitasParams() {
		return {
			market: "es",
			offset: 100,
		};
	}

	// Get Spotify Token
	async getToken() {
		try {
			const instance = axios.create({
				baseURL: `https://accounts.spotify.com/api/token`,
				params: this.tokenParams,
			});
			const response = await instance.post();
			const newToken = response.data.access_token;
			return newToken;
		} catch (error) {
			return "error";
		}
	}

	// Get total items of the playlistId parameter
	async getTotalRolitas(playlistId) {
		try {
			if (!this.currentToken) this.currentToken = await this.getToken();

			const instance = axios.create({
				baseURL: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
				headers: this.lastRolitasHeaders,
				params: this.lastRolitasParams,
			});
			const response = await instance.get();
			const data = response.data;
			return data.total;
		} catch (error) {
			console.log(error);
			return "error";
		}
	}

	// Get items of the playlistId
	async lastRolitas(playlistId, limit = 5) {
		try {
			if (!this.currentToken) this.currentToken = await this.getToken();

			const instance = axios.create({
				baseURL: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
				headers: this.lastRolitasHeaders,
				params: this.lastRolitasParams,
			});
			const response = await instance.get();
			const data = response.data;
			const reverseItems = data.items.reverse();
			const lastLimitItems = reverseItems.slice(0, limit);
			const finalMessage = this.filterRolitas(lastLimitItems, playlistId);
			return finalMessage;
		} catch (error) {
			console.log(error);
			return "error";
		}
	}

	// Filter to get relevant info from each playlist item
	filterRolitas(rolitas = [], playlist = "") {
		let filteredRolitas = rolitas.map((rolita) => {
			return {
				name: rolita.track.name,
				artist: rolita.track.artists[0].name,
				added_by: rolita.added_by.id,
				added_at: rolita.added_at,
				song_url: rolita.track.album.external_urls.spotify,
			};
		});
		let rolitasLength = rolitas.length;
		switch (playlist) {
			case this.allPlaylists.Rolitas:
				playlist = "💕";
				break;
			case this.allPlaylists.RolitasArdientes:
				playlist = "Ardientes 🔥";
				break;
			case this.allPlaylists.RolitasDirty:
				playlist = "Dirty 🐷🧻";
				break;
			case this.allPlaylists.RolitasBuenDia:
				playlist = "Buen Día ☀";
				break;
		}
		let final = `*🆕 Últimas ${rolitasLength} Rolitas ${playlist} 🆕\n\n*`;

		filteredRolitas.forEach((rolita, index) => {
			const idx = index + 1;
			const {name, artist, added_by, added_at, song_url} = rolita;
			const datetime = new Date(added_at).toLocaleString("es-ES");
			const addedBy = added_by === "silaspalabras" ? "Üri 😼" : "Lü 🌞";

			final += `*${idx}.* ▶ [${name} - ${artist}](${song_url}) \n*Fecha:* ${datetime}\n*Agregada por:* ${addedBy}\n\n`;
		});
		return final;
	}

	// ! This function currently doesn't works
	async addRolita(playlistId, rolitaURL = "") {
		try {
			rolitaURL = "spotify:track:" + rolitaURL.slice(31, 53);
			console.log(rolitaURL);
			const instance = axios.create({
				baseURL: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
				headers: this.lastRolitasHeaders,
				params: {
					uris: rolitaURL,
				},
			});
			const response = await instance.post();
			const data = response.data;
			return "Rolita agregada";
		} catch (error) {
			console.log(error);
			return "error";
		}
	}
}

module.exports = Spotify;
