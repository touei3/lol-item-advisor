import fs from 'node:fs'
import path from 'node:path'
import { getJson } from './insecureGet'
import type { ChampSelectState } from '../../src/live'

// LCU（League Client Update API）: クライアントのローカルREST API。
// lockfile から port と password を読み、Basic認証でアクセスする。
const STATIC_LOCKFILES = [
  'C:/Riot Games/League of Legends/lockfile',
  path.join(process.env.LOCALAPPDATA || '', 'Riot Games/League of Legends/lockfile'),
]

// Riot のメタデータからインストール先を自動検出（インストール先が既定と違っても拾える）
const METADATA_YAMLS = [
  'C:/ProgramData/Riot Games/Metadata/league_of_legends.live/league_of_legends.live.product_settings.yaml',
]

function lockfilesFromMetadata(): string[] {
  const out: string[] = []
  for (const m of METADATA_YAMLS) {
    try {
      const txt = fs.readFileSync(m, 'utf8')
      const match = txt.match(/product_install_full_path:\s*"?([^"\n]+)"?/)
      if (match) out.push(path.join(match[1].trim(), 'lockfile'))
    } catch {
      // メタデータが無ければ無視
    }
  }
  return out
}

interface Lock {
  port: string
  password: string
}

function readLockfile(): Lock | null {
  const candidates = [
    process.env.LOL_LOCKFILE,
    ...lockfilesFromMetadata(),
    ...STATIC_LOCKFILES,
  ].filter(Boolean) as string[]
  for (const p of candidates) {
    try {
      const txt = fs.readFileSync(p, 'utf8')
      // 形式: LeagueClient:pid:port:password:protocol
      const parts = txt.split(':')
      if (parts.length >= 5) return { port: parts[2], password: parts[3] }
    } catch {
      // 存在しない候補はスキップ
    }
  }
  return null
}

/** クライアント（ランチャー）が起動しているか */
export function isClientRunning(): boolean {
  return !!readLockfile()
}

/** チャンピオン選択中ならその状態を返す。選択中でなければ null */
export async function fetchChampSelect(): Promise<ChampSelectState | null> {
  const lock = readLockfile()
  if (!lock) return null
  const auth = 'Basic ' + Buffer.from('riot:' + lock.password).toString('base64')
  const base = `https://127.0.0.1:${lock.port}`
  try {
    const s = await getJson<any>(`${base}/lol-champ-select/v1/session`, auth)
    if (!s || !Array.isArray(s.myTeam)) return null
    const localCell = s.localPlayerCellId
    const myTeamKeys: number[] = s.myTeam
      .map((p: any) => p.championId)
      .filter((k: number) => k > 0)
    const enemyTeamKeys: number[] = (s.theirTeam || [])
      .map((p: any) => p.championId)
      .filter((k: number) => k > 0)
    const mine = s.myTeam.find((p: any) => p.cellId === localCell)
    const myChampionKey = mine && mine.championId > 0 ? mine.championId : undefined
    return { phase: 'champselect', myChampionKey, myTeamKeys, enemyTeamKeys }
  } catch {
    // 404 = チャンピオン選択中でない
    return null
  }
}
