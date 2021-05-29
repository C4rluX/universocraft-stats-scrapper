var fetch = require('node-fetch');

var usernameArg = "C4rluX2576";

fetch("https://stats.universocraft.com/stats.php?player=" + usernameArg)
	.then(res => res.text())
	.then(body => {

		const scrape = (body) => {

			if (body.includes("No se ha encontrado ningún usuario con ese nombre")) return {
				error: 1,
				desc: "the user doesn't exists or never played on the server",
				descEs: "el usuario no existe, o jamás ha jugado en el servidor"
			}

			var pushString = "";
			var splitBody = [];

			body.split("").map(e => {
				if (e == "<") {
					if (pushString.trim()) splitBody.push(pushString.trim());
					pushString = e;
				} else if (e == ">") {
					pushString += e;
					splitBody.push(pushString.trim());
					pushString = "";
				} else pushString += e
			});

			const ranksData = splitBody.slice(
				splitBody.findIndex(e => e.startsWith('<div class="player-status"')),
				splitBody.indexOf("<h1>"))
				.join("");

			var ranks = ["satur", "usuar", "jupit", "mercu", "premium", "yt1", "yt2", "yt3", "yt4"]; // valid ranks
			ranks = ranks.filter(e => ranksData.includes(e));

			var userHead = splitBody.find(e => e.includes("https://api.mineskin.org/render/head"));
			userHead = userHead.match(/https:\/\/.+"\s/g)[0].slice(0, -2);

			var lastConnection = splitBody.find(e => e.startsWith("Hace ")).replace("Hace", "").split(".").join("").trim();
			
			if (lastConnection == "unos días") lastConnection = "unos días o más"

			return {
				"username": splitBody[splitBody.indexOf("<h1>") + 1],
				"ranks": ranks,
				"userHead": userHead,
				"userSkin": userHead.replace("https://api.mineskin.org/render/head?url=", ""),
				"lastConnection": lastConnection,
			}
		}

		const statsScrapped = scrape(body);
		console.log(statsScrapped);
		console.log("Username: " + usernameArg);

	})