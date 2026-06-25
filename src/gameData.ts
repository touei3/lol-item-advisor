// Data Dragon では取得できない「CC量」「回復量」は、よく知られた有限の集合として
// 手動で整備する。新チャンピオンはここに追記すれば反映される。
// （ダメージタイプ・タンク度は Data Dragon から自動判定するためここには不要）

/** ハードCC（スタン/拘束/エアボーン/長時間スロー等）を多く持つチャンピオン */
export const HIGH_CC = new Set<string>([
  'Leona', 'Nautilus', 'Amumu', 'Sejuani', 'Rammus', 'Maokai', 'Sett',
  'Morgana', 'Lissandra', 'Lulu', 'Nami', 'Thresh', 'Blitzcrank', 'Pyke',
  'Ashe', 'Varus', 'Jhin', 'Malzahar', 'Warwick', 'Volibear', 'Ornn',
  'Galio', 'Zac', 'Vi', 'JarvanIV', 'Wukong', 'Rell', 'Neeko', 'Skarner',
  'Veigar', 'Annie', 'Twisted Fate', 'TwistedFate', 'Cassiopeia', 'Anivia',
  'Gnar', 'Gragas', 'Alistar', 'Braum', 'Taric', 'Zyra', 'Swain', 'Ahri',
  'Hecarim', 'Nocturne', 'Diana', 'Camille', 'Renata', 'KSante', 'Yone',
])

/** 高い回復/ライフスティール/サステインを持つチャンピオン（回復カットが刺さる相手）*/
export const HIGH_HEAL = new Set<string>([
  'Soraka', 'Yuumi', 'Sona', 'Nami', 'Aatrox', 'Vladimir', 'DrMundo',
  'Sylas', 'Warwick', 'Swain', 'Olaf', 'Briar', 'Nasus', 'Fiora',
  'Sett', 'Volibear', 'Mordekaiser', 'Sion', 'Ramus', 'Rammus',
  'Zac', 'Kayn', 'Trundle', 'Renekton', 'Irelia', 'Gangplank',
  'Senna', 'Samira', 'Lillia', 'Gwen', 'Kled', 'Yorick', 'Maokai',
  'Taric', 'Soraka', 'Vladimir',
])
