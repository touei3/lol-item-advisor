import type { ChampSelectState, IngameState } from '../../src/live'

// LoL 無しでUIを確認するためのモック。実際のチャンピオンキー/IDとアイテムIDを使用。
// 数値キー: MissFortune=21, Ahri=103, Zed=238, Leona=89, Malphite=54,
//           Soraka=16, LeeSin=64, Lux=99

export const mockChampSelect: ChampSelectState = {
  phase: 'champselect',
  myChampionKey: 21, // Miss Fortune
  myTeamKeys: [21, 64, 99],
  enemyTeamKeys: [103, 238, 89, 54, 16], // Ahri / Zed / Leona / Malphite / Soraka
}

export const mockIngame: IngameState = {
  phase: 'ingame',
  gameTime: 15 * 60,
  me: {
    championId: 'MissFortune',
    team: 'ORDER',
    // Doran's Bow(1086) / Boots of Swiftness(3009) / The Collector(6676) を所持 → 次はIE
    itemIds: ['1086', '3009', '6676'],
    summonerName: 'You',
    isMe: true,
  },
  allies: [
    { championId: 'Leona', team: 'ORDER', itemIds: [], summonerName: 'A1', isMe: false },
    { championId: 'LeeSin', team: 'ORDER', itemIds: [], summonerName: 'A2', isMe: false },
  ],
  enemies: [
    { championId: 'Malphite', team: 'CHAOS', itemIds: ['3068'], summonerName: 'E1', isMe: false },
    { championId: 'Ornn', team: 'CHAOS', itemIds: ['3075'], summonerName: 'E2', isMe: false },
    { championId: 'Soraka', team: 'CHAOS', itemIds: [], summonerName: 'E3', isMe: false },
    { championId: 'Ahri', team: 'CHAOS', itemIds: [], summonerName: 'E4', isMe: false },
    { championId: 'Amumu', team: 'CHAOS', itemIds: [], summonerName: 'E5', isMe: false },
  ],
}
