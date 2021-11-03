# universocraft-stats-scrapper
Este módulo tiene como finalidad scrappear los stats y la información de algún jugador de UniversoCraft.
Funciona a base de webscrapping 'vanilla', módulo *node-fetch* necesario para fetchear información.

# ¿Cómo usarlo?
Primero que todo, debes instalar 'node-fetch', módulo de npm que permite obtener la información:
```
npm install node-fetch
```

Para usar el scrapper primero debes requerirlo:
```
const uniStatsScrapper = require("./scrape-universocraft-stats.js");
```
El módulo contiene una única función la cual es la que permite obtener información de usuarios del servidor, recibe dos argumentos:
```
uniStatsScrapper(nombreDeUsuario, lenguajeDeLasKeys)
```
- nombreDeUsuario: nombre de usuario del jugador. String.
- lenguajeDeLasKeys: argumento opcional. Idioma en el que recibirás las keys en el objeto JSON devuelto por el scrapper. String que puede ser 'es' o 'en'. Por defecto las keys se devuelven en 'camelCase'.

La función es asíncrona, por lo que debes usar promises o async/await para usarla. Esta misma devuelve un objeto JSON con la información del usuario.

La respueta o el objeto JSON retornado por la función tiene las siguientes propiedades:

- username: Nombre de usuario del jugador.
- ranks: Rangos que posee el jugador en el servidor, puede ser alguno de estos: satur (Saturno), usuar (Usuario), jupit (Júpiter), mercu (Mercurio), premium (Premium, pero este no aparece a veces aún el jugador siendo Premium, por ejemplo cuando el jugador ya tiene otro rango que no sea Usuario), neptu (Neptuno), strea (Streamer), y yt1, yt2, yt3, yt4 (Todos estos pertenecen al rango YouTuber, el número de al lado del String no estoy 100% seguro que significa pero creo que hace referencia a la popularidad del YouTuber, mientras más alto más famoso es).
- userHead: Contiene el enlace para obtener la 'cabeza' del jugador en 3D. Este argumento lo pongo porque en la página de las estadísticas de UniversoCraft usan esta API (mineskin.org) para mostrar la pequeña imagen de la cabeza del usuario.

![Imagen1](https://github.com/C4rluX/universocraft-stats-scrapper/blob/main/readmeImages/image1.png?raw=true)

- userSkin: Contiene el enlace para obtener la skin del jugador.
- lastConnection: Última vez que se conectó el jugador al servidor.
- stats: Información de las estadísticas del usuario por modalidad. Cada modalidad tiene su propia información, pero si cierta modalidad contiene el String "En mantenimiento" (es), "In maintenance" (en) o "maintenance" (camelCase), significa que está en mantenimiento, y que no se pueden acceder a las estadísticas.

### Ejemplos de uso:

```
// Código
const uniStatsScrapper = require("./scrape-universocraft-stats.js");
uniStatsScrapper("C4rluX2576")
    .then(stats => console.log(stats))
    .catch(err => console.log(err))
    
// Resultado
{
  username: 'c4rlux2576',
  ranks: [ 'usuar' ],
  userHead: 'https://api.mineskin.org/render/head?url=http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  userSkin: 'http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  lastConnection: '1 hora',
  stats: {
    destroyTheNexus: {
      victories: 0,
      kills: 11,
      killsWithBow: 0,
      deaths: 31,
      damageToNexus: 0,
      nexusDestructions: 0,
      blocksPlaced: 245,
      blocksDestroyed: 270,
      destroyedOres: 23,
      destroyedLogs: 66
    },
    skywars: {
      victories: 500,
      kills: 3932,
      deaths: 3540,
      blocksPlaced: 159120,
      blocksDestroyed: 19222,
      projectilesLaunched: 19539,
      projectilesImpacted: 4982
    },
    luckyWars: {
      victories: 10,
      kills: 47,
      deaths: 69,
      blocksPlaced: 1057,
      blocksDestroyed: 880,
      projectilesLaunched: 138,
      projectilesImpacted: 123
    },
    eggwars: {
      victories: 6,
      kills: 60,
      brokenEggs: 7,
      deaths: 99,
      blocksPlaced: 1402,
      blocksDestroyed: 238,
      projectilesLaunched: 10,
      projectilesImpacted: 23
    },
    bedwars: {
      victories: 157,
      kills: 2584,
      finalKills: 628,
      brokenBeds: 500,
      deaths: 2451,
      finalDeaths: 479,
      gamesPlayed: 744
    },
    teamSkywars: {
      victories: 11,
      kills: 257,
      deaths: 275,
      blocksPlaced: 6479,
      blocksDestroyed: 1050,
      projectilesLaunched: 1224,
      projectilesImpacted: 355
    },
    speedBuilders: { victories: 0, loses: 1, perfectBuilds: 3 },
    buildBattle: { victories: 0, gamesPlayed: 4, score: 11 },
    runFromTheBeast: {
      totalVictories: 26,
      victoriesAsRunner: 26,
      victoriesAsBeast: 0,
      killsAsRunner: 1,
      killsAsBeast: 13
    },
    partyGames: { victories: 0, kills: 17, deaths: 19, gamesPlayed: 3 },
    hungerGames: { victories: 15, kills: 0, deaths: 394 },
    skyPit: { level: 1, unicoins: 332, assistances: 31, kills: 28, deaths: 45 },
    arenaPvp: { victories: 534, kills: 572, loses: 312 },
    uhc: { victories: 0, loses: 9, gamesPlayed: 14, kills: 3, deaths: 13 },
    murderMystery: { victories: 13, loses: 14, kills: 5, deaths: 14 },
    captureTheWool: {
      score: 44,
      kills: 12,
      killsWithBow: 0,
      maximumBowKillDistance: 61,
      woolsPlaced: 1
    }
  }
}
```

```
// Código
const uniStatsScrapper = require("./scrape-universocraft-stats.js");
uniStatsScrapper("C4rluX2576", 'es')
    .then(stats => console.log(stats))
    .catch(err => console.log(err))
   
// Resultado
{
  username: 'c4rlux2576',
  ranks: [ 'usuar' ],
  userHead: 'https://api.mineskin.org/render/head?url=http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  userSkin: 'http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  lastConnection: '1 hora',
  stats: {
    'Destruye el Nexus': {
      Victorias: 0,
      Asesinatos: 11,
      'Asesinatos con arco': 0,
      Muertes: 31,
      'Daños al nexus': 0,
      'Destrucciones del nexus': 0,
      'Bloques colocados': 245,
      'Bloques destruidos': 270,
      'Menas destruidas': 23,
      'Troncos destruidos': 66
    },
    SkyWars: {
      Victorias: 500,
      Asesinatos: 3932,
      Muertes: 3540,
      'Bloques colocados': 159120,
      'Bloques destruidos': 19222,
      'Projectiles lanzados': 19539,
      'Projectiles impactados': 4982
    },
    LuckyWars: {
      Victorias: 10,
      Asesinatos: 47,
      Muertes: 69,
      'Bloques colocados': 1057,
      'Bloques destruidos': 880,
      'Projectiles lanzados': 138,
      'Projectiles impactados': 123
    },
    EggWars: {
      Victorias: 6,
      Asesinatos: 60,
      'Huevos rotos': 7,
      Muertes: 99,
      'Bloques colocados': 1402,
      'Bloques destruidos': 238,
      'Projectiles lanzados': 10,
      'Projectiles impactados': 23
    },
    BedWars: {
      Victorias: 157,
      Asesinatos: 2584,
      'Asesinatos finales': 628,
      'Camas destruidas': 500,
      Muertes: 2451,
      'Muertes finales': 479,
      'Partidas jugadas': 744
    },
    TeamSkyWars: {
      Victorias: 11,
      Asesinatos: 257,
      Muertes: 275,
      'Bloques colocados': 6479,
      'Bloques destruidos': 1050,
      'Projectiles lanzados': 1224,
      'Projectiles impactados': 355
    },
    SpeedBuilders: { Victorias: 0, Perdidas: 1, 'Construcciones perfectas': 3 },
    BuildBattle: { Victorias: 0, 'Partidas jugadas': 4, Puntaje: 11 },
    'Escapa de la Bestia': {
      'Victorias totales': 26,
      'Victorias como corredor': 26,
      'Victorias como bestia': 0,
      'Asesinato como corredor': 1,
      'Asesinato como bestia': 13
    },
    'Party Games': {
      Victorias: 0,
      Asesinatos: 17,
      Muertes: 19,
      'Partidas jugadas': 3
    },
    'Juegos del Hambre': { Victorias: 15, Asesinatos: 0, Muertes: 394 },
    SkyPit: {
      Nivel: 1,
      Unicoins: 332,
      Asistencias: 31,
      Asesinatos: 28,
      Muertes: 45
    },
    ArenaPvP: { Victorias: 534, Asesinatos: 572, Perdidas: 312 },
    UHC: {
      Victorias: 0,
      Perdidas: 9,
      'Partidas jugadas': 14,
      Asesinatos: 3,
      Muertes: 13
    },
    MurderMystery: { Victorias: 13, Perdidas: 14, Asesinatos: 5, Muertes: 14 },
    'Captura la Lana': {
      Puntaje: 44,
      Asesinatos: 12,
      'Asesinatos con arco': 0,
      'Distancia máxima de muerte con arco': 61,
      'Lanas colocadas': 1
    }
  }
}

```

```
// Código
const uniStatsScrapper = require("./scrape-universocraft-stats.js");
uniStatsScrapper("C4rluX2576", 'en')
    .then(stats => console.log(stats))
    .catch(err => console.log(err))
    
// Resultado
{
  username: 'c4rlux2576',
  ranks: [ 'usuar' ],
  userHead: 'https://api.mineskin.org/render/head?url=http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  userSkin: 'http://textures.minecraft.net/texture/49ff8565313b26b7ce9335b479072620134011ea6abd495a0632dac4c8483',
  lastConnection: '1 hora',
  stats: {
    'Destroy The Nexus': {
      Victories: 0,
      Kills: 11,
      'Kills with bow': 0,
      Deaths: 31,
      'Damage to nexus': 0,
      'Nexus destructions': 0,
      'Blocks placed': 245,
      'Blocks destroyed': 270,
      'Destroyed ores': 23,
      'Destroyed logs': 66
    },
    Skywars: {
      Victories: 500,
      Kills: 3932,
      Deaths: 3540,
      'Blocks placed': 159120,
      'Blocks destroyed': 19222,
      'Projectiles launched': 19539,
      'Projectiles impacted': 4982
    },
    'Lucky Wars': {
      Victories: 10,
      Kills: 47,
      Deaths: 69,
      'Blocks placed': 1057,
      'Blocks destroyed': 880,
      'Projectiles launched': 138,
      'Projectiles impacted': 123
    },
    Eggwars: {
      Victories: 6,
      Kills: 60,
      'Broken eggs': 7,
      Deaths: 99,
      'Blocks placed': 1402,
      'Blocks destroyed': 238,
      'Projectiles launched': 10,
      'Projectiles impacted': 23
    },
    Bedwars: {
      Victories: 157,
      Kills: 2584,
      'Final kills': 628,
      'Broken beds': 500,
      Deaths: 2451,
      'Final deaths': 479,
      'Games played': 744
    },
    'Team Skywars': {
      Victories: 11,
      Kills: 257,
      Deaths: 275,
      'Blocks placed': 6479,
      'Blocks destroyed': 1050,
      'Projectiles launched': 1224,
      'Projectiles impacted': 355
    },
    'Speed Builders': { Victories: 0, Loses: 1, 'Perfect builds': 3 },
    'Build Battle': { Victories: 0, 'Games played': 4, Score: 11 },
    'Run From The Beast': {
      'Total victories': 26,
      'Victories as runner': 26,
      'Victories as beast': 0,
      'Kills as runner': 1,
      'Kills as beast': 13
    },
    'Party Games': { Victories: 0, Kills: 17, Deaths: 19, 'Games played': 3 },
    'Hunger Games': { Victories: 15, Kills: 0, Deaths: 394 },
    'Sky Pit': { Level: 1, Unicoins: 332, Assistances: 31, Kills: 28, Deaths: 45 },
    ArenaPvP: { Victories: 534, Kills: 572, Loses: 312 },
    UHC: {
      Victories: 0,
      Loses: 9,
      'Games played': 14,
      Kills: 3,
      Deaths: 13
    },
    'Murder Mystery': { Victories: 13, Loses: 14, Kills: 5, Deaths: 14 },
    'Capture The Wool': {
      Score: 44,
      Kills: 12,
      'Kills with bow': 0,
      'Maximum bow kill distance': 61,
      'Wools placed': 1
    }
  }
}
```

### Errores:
- "Invalid username": Cuando se envía un nombre de usuario vacío al módulo.
- "Invalid player username, must be a string": Cuando se envía en el argumento del nombre del usuario, un tipo de dato que no es un String.
- "Invalid lang argument, must be a string": Cuando se envía en el argumento del lenguaje de las keys, un tipo de dato que no es un String.
- "The user doesn't exists": Cuando el usuario especificado nunca ha entrado en UniversoCraft.
- Otro error: error ocurrido al obtener información de las estadísticas del usuario en UniversoCraft (de node-fetch) o durante el scrapping.
