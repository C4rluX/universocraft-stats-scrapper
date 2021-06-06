// A la hora de llamar este módulo debes pasar el argumento 'body', que coreesponde al HTML devuelto por hacer un fetch a:
// https://stats.universocraft.com/stats.php?player={username_del_jugador}

// Ejemplo de como podrías implementar este módulo con node-fetch.

/*
	
	const fetch = require("node-fetch");
	const uniStatsScrapper = require("./scrape-universocraft-stats.js");
	const playerUsername = "C4rluX2576";

	fetch(`https://stats.universocraft.com/stats.php?player=${playerUsername}`)
		.then(res => res.text())
		.then(body => {
			const stats = uniStatsScrapper(body);
			console.log(stats);
		})
		.catch(err => console.log(err));
	
*/

const scrape = (body) => {

	// Error devuelto si no se ha encontrado ningún usuario en la database

	if (body.includes("No se ha encontrado ningún usuario con ese nombre")) return {
		error: 1,
		desc: "the user doesn't exists or never played on the server",
		descEs: "el usuario no existe, o jamás ha jugado en el servidor"
	}


	// Dividir el string del HTML en un array, cada elemento del array contiene las tags y los contenidos de las tags del HTML

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


	// Extrae la sección del HTML en un string donde esta la data de los rangos del user

	const ranksData = splitBody.slice(
		splitBody.findIndex(e => e.startsWith('<div class="player-status"')),
		splitBody.indexOf("<h1>"))
		.join("");


	// Crea y filtra el array siguiente que contiene los rangos posibles que puede tener un user. El filtrado es según los que estén en el string de la data de los rangos

	var ranks = ["satur", "usuar", "jupit", "mercu", "premium", "yt1", "yt2", "yt3", "yt4"]; // valid ranks
	ranks = ranks.filter(e => ranksData.includes(e));


	// Obtiene el elemento del array donde se encuentra la img de la cabeza del usuario y posteriormente con el RegExp se extrae solo el link

	var userHead = splitBody.find(e => e.includes("https://api.mineskin.org/render/head"));
	userHead = userHead.match(/https:\/\/.+"\s/g)[0].slice(0, -2);


	// Se extrae la parte del array donde se encuentra la última conexión del usuario, posteriormente una vez teniendo el contenido del mismo, se modifica un poco el string para que quede lo más limpio posible

	var lastConnection = splitBody.find(e => e.startsWith("Hace ")).replace("Hace", "").split(".").join("").trim();
	if (lastConnection == "unos días") lastConnection = "unos días o más"

	// Se crea el objeto final que contiene la información del usuario

	require("fs").writeFileSync("./example.txt", splitBody.join("\n\n"), function (data, err) {

	});

	return {
		"username": splitBody[splitBody.indexOf("<h1>") + 1],
		ranks,
		userHead,
		"userSkin": userHead.replace("https://api.mineskin.org/render/head?url=", ""),
		lastConnection,
	}
}

module.exports = scrape;
