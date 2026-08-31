import { getJson } from './insecureGet'
import type { IngamePlayer, IngameState } from '../../src/live'

// Live Client Data API: 試合中に 127.0.0.1:2999 で公開される公式のローカルAPI。
// 敵味方のチャンピオン・所持アイテム・ゲーム時間などが取れる。

function rawToId(raw?: string, name?: string): string {
  if (raw) {
    // "game_character_displayname_MissFortune" → "MissFortune"
    const id = raw.split('_').pop()
    if (id) return id
  }
  return (name || '').replace(/[^A-Za-z]/g, '')
}

/** 試合中ならその状態を返す。試合中でなければ null */
export async function fetchIngame(): Promise<IngameState | null> {
  try {
    const d = await getJson<any>(
      'https://127.0.0.1:2999/liveclientdata/allgamedata',
      undefined,
      1500,
    )
    if (!d || !Array.isArray(d.allPlayers)) return null

    const meName: string =
      d.activePlayer?.summonerName || d.activePlayer?.riotIdGameName || ''

    const players: IngamePlayer[] = d.allPlayers.map((p: any) => {
      const summonerName = p.summonerName || p.riotIdGameName || ''
      return {
        championId: rawToId(p.rawChampionName, p.championName),
        team: p.team === 'CHAOS' ? 'CHAOS' : 'ORDER',
        itemIds: (p.items || []).map((it: any) => String(it.itemID)),
        summonerName,
        isMe: !!meName && summonerName === meName,
      } as IngamePlayer
    })

    const me = players.find((p) => p.isMe)
    const myTeam = me?.team
    const allies = players.filter((p) => myTeam && p.team === myTeam && !p.isMe)
    const enemies = players.filter((p) => myTeam && p.team !== myTeam)

    return {
      phase: 'ingame',
      gameTime: Math.floor(d.gameData?.gameTime || 0),
      me,
      allies,
      enemies,
    }
  } catch {
    return null
  }
}
