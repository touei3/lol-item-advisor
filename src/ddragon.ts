import type { DDragonChampion, DDragonItem } from './types'

const BASE = 'https://ddragon.leagueoflegends.com'
const LOCALE = 'ja_JP'

export interface DDragonData {
  version: string
  champions: DDragonChampion[]
  championById: Record<string, DDragonChampion>
  items: DDragonItem[]
  // 英語名（小文字・記号除去）→ アイテム（ビルド雛形の名前解決用）
  itemByName: Map<string, DDragonItem>
  // アイテムID → 日本語表示名
  itemNameJa: Map<string, string>
}

/** 表記ゆれを吸収するためのキー正規化 */
function nameKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function imageUrl(version: string, kind: 'champion' | 'item', full: string): string {
  return `${BASE}/cdn/${version}/img/${kind}/${full}`
}

let cache: DDragonData | null = null

export async function loadDDragon(): Promise<DDragonData> {
  if (cache) return cache

  const versions: string[] = await fetch(`${BASE}/api/versions.json`).then((r) => r.json())
  const version = versions[0]

  // チャンピオンとアイテム日本語名は ja_JP、ビルド雛形の名前解決には en_US を使う
  const [champRes, itemEnRes, itemJaRes] = await Promise.all([
    fetch(`${BASE}/cdn/${version}/data/${LOCALE}/champion.json`).then((r) => r.json()),
    fetch(`${BASE}/cdn/${version}/data/en_US/item.json`).then((r) => r.json()),
    fetch(`${BASE}/cdn/${version}/data/${LOCALE}/item.json`).then((r) => r.json()),
  ])

  const champions: DDragonChampion[] = Object.values(champRes.data)
  champions.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
  const championById: Record<string, DDragonChampion> = {}
  for (const c of champions) championById[c.id] = c

  // 日本語名（ID → 表示名）
  const itemNameJa = new Map<string, string>()
  for (const [id, raw] of Object.entries<any>(itemJaRes.data)) {
    itemNameJa.set(id, raw.name)
  }

  const itemByName = new Map<string, DDragonItem>()
  const items: DDragonItem[] = []
  for (const [id, raw] of Object.entries<any>(itemEnRes.data)) {
    const it: DDragonItem = { ...raw, id }
    // サモナーズリフト(11)で購入可能なものだけ対象
    if (!it.gold?.purchasable) continue
    if (it.maps && it.maps['11'] === false) continue
    items.push(it)
    const key = nameKey(it.name)
    // 同名の重複（オーンの強化版など）は最初に出た安価な方を優先
    if (!itemByName.has(key)) itemByName.set(key, it)
  }

  cache = { version, champions, championById, items, itemByName, itemNameJa }
  return cache
}

/** ビルド雛形のアイテム名（英語）を Data Dragon の実アイテムに解決 */
export function resolveItem(data: DDragonData, name: string): DDragonItem | undefined {
  return data.itemByName.get(nameKey(name))
}

/** アイテムの日本語表示名（無ければ英語名にフォールバック）*/
export function itemDisplayName(data: DDragonData, item: DDragonItem): string {
  return data.itemNameJa.get(item.id) ?? item.name
}
