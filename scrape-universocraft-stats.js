// Con este scrapper puedes obtener información y las estadísticas de algún jugador del servidor de Minecraft: UniversoCraft (mc.universocraft.com)

// Ejemplos de como podrías implementar este módulo:

/*
	
	const uniStatsScrapper = require("./scrape-universocraft-stats.js");
	uniStatsScrapper("C4rluX2576")
		.then(stats => console.log(stats))
		.catch(err => console.log(err))

	const uniStatsScrapper = require("./scrape-universocraft-stats.js"); 
	uniStatsScrapper("C4rluX2576", 'es') // Keys del objeto de las estadísticas en español
		.then(stats => console.log(stats))
		.catch(err => console.log(err))

	const uniStatsScrapper = require("./scrape-universocraft-stats.js");
	uniStatsScrapper("C4rluX2576", 'en') // Keys del objeto de las estadísticas en inglés
		.then(stats => console.log(stats))
		.catch(err => console.log(err))
	
*/

const fetch = require("node-fetch");

// Objeto que contiene los nombres de las modalidades y los nombres clave que tendrán
const gamemodesKeyNames = {
	"Destruye el Nexus": "destroyTheNexus",
	"SkyWars": "skywars",
	"LuckyWars": "luckyWars",
	"EggWars": "eggwars",
	"BedWars": "bedwars",
	"TeamSkyWars": "teamSkywars",
	"SpeedBuilders": "speedBuilders",
	"BuildBattle": "buildBattle",
	"Escapa de la Bestia": "runFromTheBeast",
	"Party Games": "partyGames",
	"Juegos del Hambre": "hungerGames",
	"SkyPit": "skyPit",
	"ArenaPvP": "arenaPvp",
	"UHC": "uhc",
	"MurderMystery": "murderMystery",
	"Captura la Lana": "captureTheWool"
};

// Objecto que contiene los nombres clave que tendrán las estadísticas
const statsKeyNames = {
	"victorias": "victories",
	"asesinatos": "kills",
	"asesinatos con arco": "killsWithBow",
	"muertes": "deaths",
	"daños al nexus": "damageToNexus",
	"destrucciones del nexus": "nexusDestructions",
	"bloques colocados": "blocksPlaced",
	"bloques destruidos": "blocksDestroyed",
	"menas destruidas": "destroyedOres",
	"troncos destruidos": "destroyedLogs",
	"projectiles lanzados": "projectilesLaunched",
	"projectiles impactados": "projectilesImpacted",
	"perdidas": "loses",
	"partidas jugadas": "gamesPlayed",
	"huevos rotos": "brokenEggs",
	"asesinatos finales": "finalKills",
	"camas destruidas": "brokenBeds",
	"muertes finales": "finalDeaths",
	"construcciones perfectas": "perfectBuilds",
	"puntaje": "score",
	"victorias totales": "totalVictories",
	"victorias como corredor": "victoriesAsRunner",
	"victorias como bestia": "victoriesAsBeast",
	"asesinato como corredor": "killsAsRunner",
	"asesinato como bestia": "killsAsBeast",
	"nivel": "level",
	"unicoins": "unicoins",
	"asistencias": "assistances",
	"distancia máxima de muerte con arco": "maximumBowKillDistance",
	"lanas colocadas": "woolsPlaced",
}

const scrape = async (player = "", lang = "camelCase") => {

	// Esto es para que sea 'opcional' incluir el módulo 'formatHTMLEntities.js' en tu proyecto
	// En fín, esta función es para decodear las entidades HTML

	// Función sencilla para 'parsear' números scrappeados
	function parseNumber(str) {
		if (isNaN(str)) return 0;
		else return parseInt(str);
	}

	// Función que convierte un texto en camelCase (ejemplo: textoDeEjemplo) a un texto
	// más 'leíble' (ejemplo: Texto de ejemplo)
	function readableCamelCase(str) {
		return str.split("").map((e, i) => {
			if (i == 0) { return e.toUpperCase(); }
			if (e == e.toUpperCase()) { return " " + e.toLowerCase(); }
			return e;
		}).join("");
	}

	// Función para capitalizar strings y para 'acomodar' el nombre de algún minijuego (en inglés)
	function capitalizeAndFormatEnglishGamemode(str) {

		var string = str.split("").map((e, i) => {
			if (str.split("")[i - 1] == " ") return e.toUpperCase();
			return e;
		}).join("");
		
		if (string == "Arena Pvp") string = "ArenaPvP";
		if (string == "Uhc") string = "UHC";
		return string;

	}

	// Fetch principal
	const body = await (await fetch("https://stats.universocraft.com/stats.php?player=" + encodeURIComponent(player))).text();

	// Error devuelto si no se ha encontrado ningún usuario en la página de los stats
	if (body.includes("No se ha encontrado ningún usuario con ese nombre")) throw "The user doesn't exists";

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
	var ranks = ["satur", "usuar", "jupit", "mercu", "premium", "neptu", "strea", "yt1", "yt2", "yt3", "yt4"]; // valid ranks
	ranks = ranks.filter(e => ranksData.includes(e));

	// Obtiene el elemento del array donde se encuentra la img de la cabeza del usuario y posteriormente con el RegExp se extrae solo el link
	var userHead = splitBody.find(e => e.includes("https://api.mineskin.org/render/head"));
	userHead = userHead.match(/https:\/\/.+"\s/g)[0].slice(0, -2);

	// Se extrae la parte del array donde se encuentra la última conexión del usuario, posteriormente una vez teniendo el contenido del mismo, se modifica un poco el string para que quede lo más limpio posible
	var lastConnection = splitBody.find((e, i) => e.startsWith("Hace ") && splitBody[i - 1] == "<p>").replace("Hace", "").split(".").join("").trim();
	if (lastConnection == "unos días") lastConnection = "unos días o más"

	// Se extrae la parte del array del body donde se encuentran las estadísticas del usuario
	var statsBody = splitBody.slice(
		splitBody.findIndex(e => e.includes('<div id="content">')),
		splitBody.findIndex(e => e.includes('<script src="https://code.jquery.com'))
	);

	// Se crea la variable que contendrá las estadísticas
	var stats = {};

	// Se hace un forEach encima de las keys de la variable de los gamemodesKeyNames
	// Para sacar la información de cada uno
	Object.keys(gamemodesKeyNames).forEach(e => {

		// Una variable que contendrá la información extraída
		let gamemodeStats = {};

		// Una variable que contendrá donde se encuentra el índice del gamemode en el HTML
		const gamemodeIndex = splitBody.findIndex(g => g.includes(e));

		// Una variable que contendrá el indice de la stat actual que esta siendo scrappeada del HTML
		// Esta variable se irá actualizando para ir pasando a la siguiente stat mediante un while de más adelante
		var gameStatIndex = splitBody.findIndex((h, i) => i > gamemodeIndex && h.includes('class="game-stat-title"'));

		// While que irá scrappeando y guardando las stats en gamemodeStats, que irá aumentando la variable
		// gameStatIndex de 16 en 16 para ir pasando a la siguiente stat scrappeada
		// Esto funciona debido al patrón que se sigue en la estructura del HTML de la página de las stats en UniversoCraft
		while (true) {
			
			// Anexar en gamemodeStats el nombre de la stat y el valor que tiene, que en este caso se pasa
			// en la función parseNumber() de antes para que en vez de ser un string, sea un número
			// Dependiendo del lang
			if (lang == 'es') { 
				const statName = splitBody[gameStatIndex + 1].toLowerCase();
				gamemodeStats[ statName[0].toUpperCase() + statName.slice(1) ] = parseNumber(splitBody[gameStatIndex + 5]);
			 }
			else if (lang == 'en') {  gamemodeStats[ readableCamelCase( statsKeyNames[ splitBody[gameStatIndex + 1].toLowerCase() ] ) ] = parseNumber(splitBody[gameStatIndex + 5]); }
			else { gamemodeStats[ statsKeyNames[ splitBody[gameStatIndex + 1].toLowerCase() ] ] = parseNumber(splitBody[gameStatIndex + 5]); }
				
			// Se le suma 16 a la variable gameStatIndex para pasar a la siguiente stat scrappeada
			gameStatIndex += 16;

			// Si se llega hasta un cierto final donde el nombre de la stat empieze en '<' significa
			// que se ha llegado al final de las estadísticas del minijuego actual, y prodece a rompar
			// el While
			if (splitBody[gameStatIndex + 1].startsWith("<")) break;

		}
		
		// Se anexa la información scrappeada del minijuego actual a la variable stats que posteriormente
		// se añadirá al objeto final que contiene la información del usuario, dependiendo del lang
		if (lang == 'es')  { stats[e] = gamemodeStats; }
		else if (lang == 'en') { stats[ capitalizeAndFormatEnglishGamemode(readableCamelCase(gamemodesKeyNames[e])) ] = gamemodeStats; }
		else { stats[ gamemodesKeyNames[e] ] = gamemodeStats; }

	});

	// Se crea el objeto final que contiene la información del usuario
	return {
		"username": splitBody[splitBody.indexOf("<h1>") + 1],
		ranks,
		userHead,
		"userSkin": userHead.replace("https://api.mineskin.org/render/head?url=", ""),
		lastConnection,
		stats
	}
}

module.exports = scrape;
