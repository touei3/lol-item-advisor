import type { DDragonData } from './ddragon'
import { runeIconUrl } from './ddragon'

export interface ResolvedRune {
  id: number
  name: string
  iconUrl: string
}

export interface ResolvedRunes {
  primaryStyle?: { name: string; iconUrl: string }
  keystone?: ResolvedRune
  primary: ResolvedRune[] // 副ルーン3つ
  secondaryStyle?: { name: string; iconUrl: string }
  secondary: ResolvedRune[] // 2つ
  shards: { id: number; name: string }[] // 攻/汎/防シャード（テキスト）
}

// スタッツシャードは Data Dragon に無いため名前を手持ちで（ベストエフォート）
const SHARD_NAME: Record<number, string> = {
  5008: '適応力',
  5005: '攻撃速度',
  5007: 'スキルヘイスト',
  5002: '物理防御',
  5003: '魔法防御',
  5001: '体力(レベル比例)',
  5011: '体力',
  5013: '行動妨害&スロー耐性',
  5010: '移動速度',
}

function toRune(data: DDragonData, id: number): ResolvedRune | undefined {
  const r = data.runeById.get(id)
  if (!r) return undefined
  return { id, name: r.name, iconUrl: runeIconUrl(r.icon) }
}

function toStyle(data: DDragonData, id: number) {
  const s = data.runeStyleById.get(id)
  return s ? { name: s.name, iconUrl: runeIconUrl(s.icon) } : undefined
}

/** Deeplol のルーンID配列（main/sub/stat）を表示用に解決 */
export function resolveRunes(
  data: DDragonData,
  runes?: { main: number[]; sub: number[]; stat: number[] },
): ResolvedRunes | null {
  if (!runes || !runes.main?.length) return null
  const [mainStyleId, keystoneId, ...mainRest] = runes.main
  const [subStyleId, ...subRest] = runes.sub || []

  return {
    primaryStyle: mainStyleId ? toStyle(data, mainStyleId) : undefined,
    keystone: keystoneId ? toRune(data, keystoneId) : undefined,
    primary: mainRest.map((id) => toRune(data, id)).filter((r): r is ResolvedRune => !!r),
    secondaryStyle: subStyleId ? toStyle(data, subStyleId) : undefined,
    secondary: subRest.map((id) => toRune(data, id)).filter((r): r is ResolvedRune => !!r),
    shards: (runes.stat || []).map((id) => ({ id, name: SHARD_NAME[id] ?? `#${id}` })),
  }
}
