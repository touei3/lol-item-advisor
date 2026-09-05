import https from 'node:https'
import type { DeeplolBuild } from '../../src/live'

// Deeplol の CDNキャッシュAPI から統計ビルドを取得する（main プロセス専用）。
// ・User-Agent が無いと 403 になるためブラウザUAを付与
// ・登場チャンピオン分だけ・キャッシュ前提で低頻度アクセス
// ・失敗時は null を返し、renderer 側で手書きデータにフォールバックする

const BASE = 'https://b2c-api-cdn.deeplol.gg'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
const TIER = 'Emerald+'

function getJson<T = any>(url: string, timeoutMs = 4000): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      let body = ''
      res.on('data', (d) => (body += d))
      res.on('end', () => {
        if ((res.statusCode ?? 0) >= 200 && (res.statusCode ?? 0) < 300) {
          try {
            resolve(JSON.parse(body) as T)
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error('HTTP ' + res.statusCode))
        }
      })
    })
    req.on('error', reject)
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')))
  })
}

// --- バージョン（1時間キャッシュ）---
let versionCache: { value: string; at: number } | null = null
async function getGameVersion(): Promise<string> {
  if (versionCache && Date.now() - versionCache.at < 3600_000) return versionCache.value
  const v = await getJson<{ recent_version: string }>(`${BASE}/champion/version?cnt=2`)
  versionCache = { value: v.recent_version, at: Date.now() }
  return v.recent_version
}

// --- ビルド（チャンピオン単位でキャッシュ）---
const buildCache = new Map<string, { value: DeeplolBuild | null; at: number }>()
const BUILD_TTL = 6 * 3600_000 // 6時間

/** キャッシュを全消去（メニューの再読み込み用）。次回取得で最新パッチ/ビルドを取り直す */
export function clearBuildCache(): void {
  buildCache.clear()
  versionCache = null
}

function pickLane(buildByLane: Record<string, any>): { lane: string; data: any } | null {
  let best: { lane: string; data: any; games: number } | null = null
  for (const [lane, data] of Object.entries<any>(buildByLane)) {
    if (lane === 'Aram') continue // SRのみ
    const games = data?.games ?? 0
    if (!best || games > best.games) best = { lane, data, games }
  }
  return best ? { lane: best.lane, data: best.data } : null
}

/** チャンピオンキー（Riot数値キー）から統計ビルドを取得。失敗時 null */
export async function fetchBuild(championKey: number): Promise<DeeplolBuild | null> {
  // 環境変数で無効化可能（規約回避したい場合 → 手書きデータにフォールバック）
  if (process.env.DEEPLOL_DISABLE) return null
  try {
    const version = await getGameVersion()
    const cacheKey = `${championKey}:${version}:${TIER}`
    const cached = buildCache.get(cacheKey)
    if (cached && Date.now() - cached.at < BUILD_TTL) return cached.value

    const url = `${BASE}/champion/build?platform_id=KR&champion_id=${championKey}&game_version=${encodeURIComponent(
      version,
    )}&tier=${encodeURIComponent(TIER)}`
    const json = await getJson<{ build_by_lane: Record<string, any> }>(url)
    const picked = pickLane(json.build_by_lane || {})
    if (!picked) {
      buildCache.set(cacheKey, { value: null, at: Date.now() })
      return null
    }
    const b0 = picked.data.build_lst?.[0]
    if (!b0) {
      buildCache.set(cacheKey, { value: null, at: Date.now() })
      return null
    }

    const rune = b0.rune
    const build: DeeplolBuild = {
      championKey,
      laneLabel: picked.lane,
      startIds: Array.isArray(b0.start_item?.build) ? b0.start_item.build : [],
      bootsId: typeof b0.boots?.item === 'number' ? b0.boots.item : undefined,
      coreIds: Array.isArray(b0.item?.build) ? b0.item.build : [],
      runes: rune
        ? {
            main: Array.isArray(rune.main_build) ? rune.main_build : [],
            sub: Array.isArray(rune.sub_build) ? rune.sub_build : [],
            stat: Array.isArray(rune.stat_build) ? rune.stat_build : [],
          }
        : undefined,
      meta: {
        winRate: picked.data.win_rate,
        games: picked.data.games,
        tier: TIER,
        version,
      },
    }
    // コアが空なら使えないので null 扱い
    const value = build.coreIds.length ? build : null
    buildCache.set(cacheKey, { value, at: Date.now() })
    return value
  } catch {
    return null
  }
}
