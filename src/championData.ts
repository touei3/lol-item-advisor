// ===== チャンピオン個別の手入れデータ =====
// レーンは全チャンピオン分（レーン別フィルタ用）。
// build は主要チャンピオンから整備（OP.GG準拠の標準ビルド）。未整備のキャラは
// recommend 側でアーキタイプの汎用ビルドにフォールバックする。
// アイテム名は en_US（Data Dragon で解決）。16.13 時点。

export type Lane = 'TOP' | 'JUNGLE' | 'MID' | 'BOT' | 'SUPPORT'

export const LANE_LABEL: Record<Lane, string> = {
  TOP: 'トップ',
  JUNGLE: 'ジャングル',
  MID: 'ミッド',
  BOT: 'ボット',
  SUPPORT: 'サポート',
}

export const LANE_ORDER: Lane[] = ['TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT']

export interface ChampionBuild {
  start: string[]
  boots: string
  core: string[]
  late?: string[]
  coreReasons?: Record<string, string>
}

export interface ChampionEntry {
  lanes: Lane[]
  build?: ChampionBuild
}

// よく使う部品
const AD_START = ["Doran's Blade", 'Health Potion']
const AP_START = ["Doran's Ring", 'Health Potion']
const TANK_START = ["Doran's Shield", 'Health Potion']
const SUP_START = ['World Atlas', 'Health Potion']

export const CHAMPIONS: Record<string, ChampionEntry> = {
  // ===== TOP =====
  Aatrox: {
    lanes: ['TOP'],
    build: {
      start: AD_START,
      boots: 'Plated Steelcaps',
      core: ['Stridebreaker', "Sterak's Gage", 'Death\'s Dance'],
      late: ['Spirit Visage', 'Black Cleaver', 'Guardian Angel'],
    },
  },
  Ambessa: { lanes: ['TOP'] },
  Camille: { lanes: ['TOP', 'SUPPORT'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', 'Black Cleaver', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  Chogath: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Heartsteel', "Jak'Sho, The Protean", "Warmog's Armor"], late: ['Thornmail', 'Spirit Visage'] } },
  Darius: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Stridebreaker', "Sterak's Gage", 'Black Cleaver'], late: ["Death's Dance", 'Guardian Angel'] } },
  DrMundo: { lanes: ['TOP', 'JUNGLE'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Sunfire Aegis', 'Warmog\'s Armor', 'Spirit Visage'], late: ['Thornmail', 'Kaenic Rookern'] } },
  Fiora: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Blade of The Ruined King', "Sterak's Gage", "Death's Dance"], late: ['Guardian Angel', 'Spear of Shojin'] } },
  Gangplank: { lanes: ['TOP'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Essence Reaver', 'Trinity Force', 'Infinity Edge'], late: ["The Collector", 'Lord Dominik\'s Regards'] } },
  Garen: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Stridebreaker', 'Black Cleaver', "Sterak's Gage"], late: ["Death's Dance", 'Force of Nature', 'Thornmail'] } },
  Gnar: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Stridebreaker', 'Black Cleaver', "Sterak's Gage"], late: ['Force of Nature', 'Randuin\'s Omen'] } },
  Gragas: { lanes: ['JUNGLE', 'TOP', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Rod of Ages', "Rylai's Crystal Scepter", 'Cosmic Drive'], late: ["Zhonya's Hourglass", 'Void Staff'] } },
  Gwen: { lanes: ['TOP', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Riftmaker', "Rabadon's Deathcap", 'Nashor\'s Tooth'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Illaoi: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Black Cleaver'], late: ["Death's Dance", 'Spirit Visage'] } },
  Irelia: { lanes: ['TOP', 'MID'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Trinity Force', "Sterak's Gage", 'Blade of The Ruined King'], late: ["Death's Dance", 'Guardian Angel'] } },
  Jax: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Blade of The Ruined King', "Sterak's Gage", 'Trinity Force'], late: ["Death's Dance", 'Guardian Angel'] } },
  Jayce: { lanes: ['TOP', 'MID'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Eclipse', 'Manamune', "Youmuu's Ghostblade"], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  Kayle: { lanes: ['TOP', 'MID'], build: { start: AP_START, boots: "Berserker's Greaves", core: ['Nashor\'s Tooth', "Rabadon's Deathcap", 'Lich Bane'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Kennen: { lanes: ['TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Kled: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', 'Black Cleaver', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  KSante: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Hollow Radiance', "Jak'Sho, The Protean", 'Unending Despair'], late: ['Thornmail', 'Spirit Visage', 'Kaenic Rookern'] } },
  Malphite: { lanes: ['TOP', 'SUPPORT'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Sunfire Aegis', 'Frozen Heart', "Jak'Sho, The Protean"], late: ['Thornmail', 'Kaenic Rookern'] } },
  Mordekaiser: { lanes: ['TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Riftmaker', "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', 'Spirit Visage'] } },
  Nasus: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Spirit Visage'], late: ['Thornmail', 'Frozen Heart'] } },
  Olaf: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', "Sterak's Gage", 'Titanic Hydra'], late: ["Death's Dance", 'Guardian Angel'] } },
  Ornn: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Sunfire Aegis', "Jak'Sho, The Protean", 'Thornmail'], late: ['Spirit Visage', 'Kaenic Rookern'] } },
  Pantheon: { lanes: ['TOP', 'MID', 'SUPPORT'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Eclipse', 'Black Cleaver', "Sterak's Gage"], late: ['Serylda\'s Grudge', 'Guardian Angel'] } },
  Poppy: { lanes: ['TOP', 'JUNGLE', 'SUPPORT'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Iceborn Gauntlet', "Jak'Sho, The Protean", 'Thornmail'], late: ['Spirit Visage', 'Randuin\'s Omen'] } },
  Quinn: { lanes: ['TOP'], build: { start: AD_START, boots: "Berserker's Greaves", core: ['The Collector', 'Essence Reaver', 'Infinity Edge'], late: ["Lord Dominik's Regards", "Youmuu's Ghostblade"] } },
  Renekton: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Trinity Force'], late: ["Death's Dance", 'Guardian Angel'] } },
  Riven: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', 'Black Cleaver', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  Rumble: { lanes: ['TOP', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Liandry\'s Torment', "Rylai's Crystal Scepter", "Rabadon's Deathcap"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Sett: { lanes: ['TOP', 'SUPPORT'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Guardian Angel'] } },
  Shen: { lanes: ['TOP', 'SUPPORT'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Sunfire Aegis', "Jak'Sho, The Protean", 'Spirit Visage'], late: ['Thornmail', 'Kaenic Rookern'] } },
  Shyvana: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Nashor\'s Tooth', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Singed: { lanes: ['TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Rod of Ages', "Rylai's Crystal Scepter", 'Riftmaker'], late: ['Void Staff', 'Spirit Visage'] } },
  Sion: { lanes: ['TOP'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Heartsteel', "Jak'Sho, The Protean", "Warmog's Armor"], late: ['Thornmail', 'Spirit Visage'] } },
  Teemo: { lanes: ['TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Nashor\'s Tooth', 'Liandry\'s Torment', "Rabadon's Deathcap"], late: ['Void Staff', "Rylai's Crystal Scepter"] } },
  Trundle: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Spirit Visage'], late: ['Thornmail', 'Frozen Heart'] } },
  Tryndamere: { lanes: ['TOP'], build: { start: AD_START, boots: "Berserker's Greaves", core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', 'Guardian Angel'] } },
  Urgot: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Frozen Heart'] } },
  Volibear: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Spirit Visage'], late: ["Death's Dance", 'Thornmail'] } },
  Warwick: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Blade of The Ruined King', "Sterak's Gage", 'Spirit Visage'], late: ['Titanic Hydra', 'Thornmail'] } },
  Yorick: { lanes: ['TOP'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Stridebreaker', "Sterak's Gage", 'Spirit Visage'], late: ['Trinity Force', 'Thornmail'] } },
  MonkeyKing: { lanes: ['TOP', 'JUNGLE'], build: { start: AD_START, boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Guardian Angel', 'Spirit Visage'] } },

  // ===== JUNGLE =====
  Amumu: { lanes: ['JUNGLE', 'SUPPORT'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Mercury\'s Treads', core: ['Sunfire Aegis', "Jak'Sho, The Protean", 'Abyssal Mask'], late: ['Thornmail', 'Kaenic Rookern'] } },
  Belveth: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Blade of The Ruined King', "Sterak's Gage"], late: ['Guinsoo\'s Rageblade', 'Death\'s Dance'] } },
  Briar: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Stridebreaker', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Guardian Angel'] } },
  Diana: { lanes: ['JUNGLE', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", "Zhonya's Hourglass"], late: ['Shadowflame', 'Void Staff'] } },
  Ekko: { lanes: ['JUNGLE', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Zhonya's Hourglass", "Rabadon's Deathcap"], late: ['Shadowflame', 'Void Staff'] } },
  Elise: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Evelynn: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Fiddlesticks: { lanes: ['JUNGLE', 'SUPPORT'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Graves: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['The Collector', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', "Youmuu's Ghostblade"] } },
  Hecarim: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Trinity Force', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Guardian Angel'] } },
  Ivern: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Mikael\'s Blessing', 'Staff of Flowing Water'] } },
  JarvanIV: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Guardian Angel'] } },
  Kayn: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Eclipse', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  Khazix: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Edge of Night', 'Serylda\'s Grudge'] } },
  Kindred: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', 'Guinsoo\'s Rageblade'] } },
  LeeSin: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Eclipse', "Youmuu's Ghostblade", 'Black Cleaver'], late: ["Sterak's Gage", 'Guardian Angel'] } },
  Lillia: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ['Liandry\'s Torment', "Rylai's Crystal Scepter", "Rabadon's Deathcap"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  MasterYi: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Blade of The Ruined King', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Guardian Angel'] } },
  Nidalee: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Nocturne: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Eclipse', "Youmuu's Ghostblade", 'Black Cleaver'], late: ["Death's Dance", 'Guardian Angel'] } },
  Nunu: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: "Sorcerer's Shoes", core: ['Rod of Ages', "Rylai's Crystal Scepter", "Rabadon's Deathcap"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  RekSai: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Spirit Visage', 'Guardian Angel'] } },
  Rengar: { lanes: ['JUNGLE', 'TOP'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Edge of Night', 'Serylda\'s Grudge'] } },
  Sejuani: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Sunfire Aegis', "Jak'Sho, The Protean", 'Thornmail'], late: ['Spirit Visage', 'Kaenic Rookern'] } },
  Shaco: { lanes: ['JUNGLE', 'SUPPORT'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Edge of Night', 'Serylda\'s Grudge'] } },
  Skarner: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Iceborn Gauntlet', "Jak'Sho, The Protean", 'Thornmail'], late: ['Spirit Visage', 'Frozen Heart'] } },
  Udyr: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', "Sterak's Gage", 'Nashor\'s Tooth'], late: ['Spirit Visage', 'Kaenic Rookern'] } },
  Vi: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Guardian Angel', 'Spirit Visage'] } },
  Viego: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', 'Infinity Edge', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  XinZhao: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Black Cleaver', "Sterak's Gage", 'Death\'s Dance'], late: ['Guardian Angel', 'Spirit Visage'] } },
  Zac: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Mercury\'s Treads', core: ['Sunfire Aegis', "Jak'Sho, The Protean", "Warmog's Armor"], late: ['Thornmail', 'Spirit Visage'] } },
  Rammus: { lanes: ['JUNGLE'], build: { start: ['Gustwalker Hatchling', 'Refillable Potion'], boots: 'Plated Steelcaps', core: ['Sunfire Aegis', 'Thornmail', "Jak'Sho, The Protean"], late: ['Frozen Heart', 'Randuin\'s Omen'] } },
  Karthus: { lanes: ['JUNGLE', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Void Staff'], late: ['Shadowflame', "Zhonya's Hourglass"] } },

  // ===== MID =====
  Ahri: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Akali: { lanes: ['MID', 'TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Akshan: { lanes: ['MID', 'TOP'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['The Collector', 'Essence Reaver', 'Infinity Edge'], late: ["Lord Dominik's Regards", "Youmuu's Ghostblade"] } },
  Anivia: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Rod of Ages', "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Annie: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  AurelionSol: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Archangel\'s Staff', "Rabadon's Deathcap", 'Cryptbloom'], late: ['Void Staff', "Rylai's Crystal Scepter"] } },
  Aurora: { lanes: ['MID', 'TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Azir: { lanes: ['MID'], build: { start: AP_START, boots: 'Berserker\'s Greaves', core: ['Nashor\'s Tooth', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Cassiopeia: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Malignance', "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Corki: { lanes: ['MID', 'BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Trinity Force', 'Manamune', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Shadowflame'] } },
  Fizz: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Galio: { lanes: ['MID'], build: { start: AP_START, boots: 'Mercury\'s Treads', core: ['Rod of Ages', "Rabadon's Deathcap", 'Riftmaker'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Heimerdinger: { lanes: ['MID', 'TOP', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Hwei: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Kassadin: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Rod of Ages', "Rabadon's Deathcap", 'Lich Bane'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Katarina: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Leblanc: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Lissandra: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Lux: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', 'Banshee\'s Veil'] } },
  Malzahar: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", 'Blackfire Torch', "Rabadon's Deathcap"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Mel: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Naafiri: { lanes: ['MID', 'JUNGLE'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Eclipse', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  Orianna: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Qiyana: { lanes: ['MID', 'JUNGLE'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Eclipse', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  Ryze: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Archangel\'s Staff', 'Rod of Ages', "Rabadon's Deathcap"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Syndra: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Taliyah: { lanes: ['MID', 'JUNGLE'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Talon: { lanes: ['MID', 'JUNGLE'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  TwistedFate: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Veigar: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Void Staff'], late: ['Shadowflame', "Zhonya's Hourglass"] } },
  Velkoz: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', 'Horizon Focus'] } },
  Vex: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Viktor: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Vladimir: { lanes: ['MID', 'TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Riftmaker', "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Yasuo: { lanes: ['MID', 'TOP'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', 'Bloodthirster'], late: ["Lord Dominik's Regards", 'Guardian Angel'] } },
  Yone: { lanes: ['MID', 'TOP'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  Zed: { lanes: ['MID'], build: { start: AD_START, boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Serylda\'s Grudge', 'Edge of Night'] } },
  Ziggs: { lanes: ['MID', 'BOT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Zoe: { lanes: ['MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Sylas: { lanes: ['MID', 'TOP'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Riftmaker', "Rabadon's Deathcap", "Rylai's Crystal Scepter"], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Swain: { lanes: ['MID', 'SUPPORT', 'BOT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ['Liandry\'s Torment', "Rylai's Crystal Scepter", "Rabadon's Deathcap"], late: ['Void Staff', 'Spirit Visage'] } },

  // ===== BOT (ADC) =====
  Aphelios: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Infinity Edge', "Lord Dominik's Regards", 'Bloodthirster'], late: ['Phantom Dancer', 'Guardian Angel'] } },
  Ashe: { lanes: ['BOT', 'SUPPORT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ["Runaan's Hurricane", 'Bloodthirster'] } },
  Caitlyn: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['The Collector', 'Infinity Edge', 'Rapid Firecannon'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  Draven: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['The Collector', 'Infinity Edge', 'Bloodthirster'], late: ["Lord Dominik's Regards", "Youmuu's Ghostblade"] } },
  Ezreal: { lanes: ['BOT'], build: { start: ['Tear of the Goddess', 'Health Potion'], boots: 'Ionian Boots of Lucidity', core: ['Manamune', 'Trinity Force', 'Serylda\'s Grudge'], late: ['Bloodthirster', 'Guardian Angel'] } },
  Jhin: { lanes: ['BOT'], build: { start: AD_START, boots: 'Boots of Swiftness', core: ['The Collector', 'Rapid Firecannon', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  Jinx: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ["Runaan's Hurricane", 'Bloodthirster'] } },
  Kaisa: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Guinsoo\'s Rageblade', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  Kalista: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', "Runaan's Hurricane", 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Guinsoo\'s Rageblade'] } },
  KogMaw: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Guinsoo\'s Rageblade', 'Kraken Slayer', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  Lucian: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Essence Reaver', 'Navori Flickerblade', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  MissFortune: { lanes: ['BOT'], build: { start: AD_START, boots: 'Boots of Swiftness', core: ['The Collector', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', 'Rapid Firecannon'], coreReasons: { 'The Collector': '序盤の火力と処刑効果が強いコア', 'Infinity Edge': 'Rのクリ火力を最大化', "Lord Dominik's Regards": '装甲貫通＋対HP' } } },
  Nilah: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', 'Infinity Edge', "Sterak's Gage"], late: ["Death's Dance", 'Guardian Angel'] } },
  Samira: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['The Collector', 'Infinity Edge', 'Bloodthirster'], late: ["Lord Dominik's Regards", 'Guardian Angel'] } },
  Sivir: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ["Runaan's Hurricane", 'Bloodthirster'] } },
  Smolder: { lanes: ['BOT', 'MID'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Guinsoo\'s Rageblade', 'Infinity Edge', "Rabadon's Deathcap"], late: ['Void Staff', "Lord Dominik's Regards"] } },
  Tristana: { lanes: ['BOT', 'MID'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Rapid Firecannon', 'Bloodthirster'] } },
  Twitch: { lanes: ['BOT', 'JUNGLE'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', "Runaan's Hurricane", 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Bloodthirster'] } },
  Varus: { lanes: ['BOT', 'MID'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ["Runaan's Hurricane", 'Bloodthirster'] } },
  Vayne: { lanes: ['BOT', 'TOP'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Blade of The Ruined King', 'Guinsoo\'s Rageblade', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Guardian Angel'] } },
  Xayah: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ["Runaan's Hurricane", 'Bloodthirster'] } },
  Zeri: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Yun Tal Wildarrows', 'Infinity Edge'], late: ["Lord Dominik's Regards", 'Phantom Dancer'] } },
  Yunara: { lanes: ['BOT'], build: { start: AD_START, boots: 'Berserker\'s Greaves', core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', 'Phantom Dancer'] } },

  // ===== SUPPORT =====
  Alistar: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Bard: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Mikael\'s Blessing', 'Staff of Flowing Water'] } },
  Blitzcrank: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Brand: { lanes: ['SUPPORT', 'MID', 'JUNGLE'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", 'Liandry\'s Torment', "Rabadon's Deathcap"], late: ['Void Staff', "Rylai's Crystal Scepter"] } },
  Braum: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Janna: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Staff of Flowing Water', 'Mikael\'s Blessing'] } },
  Karma: { lanes: ['SUPPORT', 'MID'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Redemption', 'Mikael\'s Blessing'] } },
  Leona: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Lulu: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Mikael\'s Blessing', 'Redemption'] } },
  Milio: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Mikael\'s Blessing', 'Redemption'] } },
  Morgana: { lanes: ['SUPPORT', 'MID'], build: { start: SUP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Nami: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Mikael\'s Blessing', 'Redemption'] } },
  Nautilus: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Neeko: { lanes: ['MID', 'SUPPORT'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'], late: ['Void Staff', "Zhonya's Hourglass"] } },
  Pyke: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Hubris', "Youmuu's Ghostblade", 'Profane Hydra'], late: ['Edge of Night', 'Serylda\'s Grudge'] } },
  Rakan: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Moonstone Renewer', 'Locket of the Iron Solari', 'Redemption'], late: ['Mikael\'s Blessing', 'Zeke\'s Convergence'] } },
  Rell: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Renata: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Mikael\'s Blessing', 'Staff of Flowing Water'] } },
  Senna: { lanes: ['BOT', 'SUPPORT'], build: { start: SUP_START, boots: 'Boots of Swiftness', core: ['The Collector', 'Infinity Edge', "Lord Dominik's Regards"], late: ['Bloodthirster', 'Rapid Firecannon'] } },
  Seraphine: { lanes: ['SUPPORT', 'MID', 'BOT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ["Rabadon's Deathcap", 'Void Staff'] } },
  Sona: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Mikael\'s Blessing', 'Redemption'] } },
  Soraka: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Staff of Flowing Water', 'Mikael\'s Blessing'] } },
  TahmKench: { lanes: ['TOP', 'SUPPORT'], build: { start: TANK_START, boots: 'Plated Steelcaps', core: ['Heartsteel', "Jak'Sho, The Protean", 'Spirit Visage'], late: ['Warmog\'s Armor', 'Thornmail'] } },
  Taric: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Moonstone Renewer', 'Locket of the Iron Solari', 'Ardent Censer'], late: ['Redemption', 'Zeke\'s Convergence'] } },
  Thresh: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Mercury\'s Treads', core: ['Locket of the Iron Solari', "Knight's Vow", 'Zeke\'s Convergence'], late: ['Thornmail', 'Spirit Visage'] } },
  Yuumi: { lanes: ['SUPPORT'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Ardent Censer', 'Staff of Flowing Water'], late: ['Dawncore', 'Mikael\'s Blessing'] } },
  Zilean: { lanes: ['SUPPORT', 'MID'], build: { start: SUP_START, boots: 'Ionian Boots of Lucidity', core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'], late: ['Staff of Flowing Water', 'Mikael\'s Blessing'] } },
  Zyra: { lanes: ['SUPPORT', 'MID'], build: { start: AP_START, boots: "Sorcerer's Shoes", core: ["Luden's Echo", 'Liandry\'s Torment', "Rabadon's Deathcap"], late: ['Void Staff', "Rylai's Crystal Scepter"] } },
}

/** レーン情報の取得（手入れデータ優先、無ければ tags から推定）*/
export function getLanes(championId: string, tags: string[]): Lane[] {
  const entry = CHAMPIONS[championId]
  if (entry) return entry.lanes
  // フォールバック推定
  if (tags.includes('Marksman')) return ['BOT']
  if (tags.includes('Support')) return ['SUPPORT']
  if (tags.includes('Mage')) return ['MID']
  if (tags.includes('Assassin')) return ['MID', 'JUNGLE']
  if (tags.includes('Tank')) return ['TOP', 'JUNGLE']
  if (tags.includes('Fighter')) return ['TOP', 'JUNGLE']
  return ['MID']
}
