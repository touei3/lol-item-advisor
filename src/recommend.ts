import { BUILDS } from './builds'
import { CHAMPIONS } from './championData'
import { classify } from './classify'
import { buildThreatProfile, counterItems } from './counter'
import type { DDragonData } from './ddragon'
import { itemDisplayName, resolveItem } from './ddragon'
import type {
  Classification,
  DDragonChampion,
  RecommendedItem,
  ThreatProfile,
} from './types'

export type BuildSource = 'deeplol' | 'curated' | 'generic'

/** Deeplol 等から渡す統計ビルドの上書き（アイテムIDで指定）*/
export interface BuildOverride {
  startIds: number[]
  bootsId?: number
  coreIds: number[]
  laneLabel?: string
  meta?: { winRate?: number; games?: number; tier: string; version: string }
}

export interface Recommendation {
  classification: Classification
  profile: ThreatProfile
  source: BuildSource // ビルドの出どころ
  buildMeta?: { winRate?: number; games?: number; tier: string; version: string; lane?: string }
  startItems: RecommendedItem[]
  buildOrder: RecommendedItem[] // ブーツ＋コア＋差し込み（最大6枠）
  extraOptions: RecommendedItem[] // 枠に入りきらなかった対抗候補
}

const TARGET_SLOTS = 6 // ブーツを含むアイテム枠数

function make(
  data: DDragonData,
  name: string,
  role: RecommendedItem['role'],
  reason?: string,
): RecommendedItem {
  const item = resolveItem(data, name)
  return {
    name,
    displayName: item ? itemDisplayName(data, item) : name,
    role,
    reason,
    item,
  }
}

function itemFromId(
  data: DDragonData,
  id: number,
  role: RecommendedItem['role'],
  reason?: string,
): RecommendedItem {
  const item = data.itemById.get(String(id))
  return {
    name: item?.name ?? `item:${id}`,
    displayName: item ? itemDisplayName(data, item) : `#${id}`,
    role,
    reason,
    item,
  }
}

export function recommend(
  data: DDragonData,
  myChamp: DDragonChampion,
  enemies: DDragonChampion[],
  override?: BuildOverride,
): Recommendation {
  const classification = classify(myChamp)
  const template = BUILDS[classification.archetype]
  const curatedBuild = CHAMPIONS[myChamp.id]?.build
  const profile = buildThreatProfile(enemies)

  let source: BuildSource
  let buildMeta: Recommendation['buildMeta']
  let startItems: RecommendedItem[]
  let bootsItem: RecommendedItem
  let coreItems: RecommendedItem[]
  let lateItems: RecommendedItem[]

  if (override && override.coreIds.length) {
    // === Deeplol 統計ビルド ===
    source = 'deeplol'
    buildMeta = override.meta
      ? { ...override.meta, lane: override.laneLabel }
      : { tier: '', version: '', lane: override.laneLabel }
    startItems = override.startIds.map((id) => itemFromId(data, id, 'start'))
    bootsItem =
      override.bootsId != null
        ? itemFromId(data, override.bootsId, 'boots', 'Deeplol統計の推奨ブーツ')
        : make(data, curatedBuild?.boots ?? template.defaultBoots, 'boots', '標準のブーツ')
    coreItems = override.coreIds.map((id, i) =>
      itemFromId(data, id, 'core', i === 0 ? 'Deeplol統計のコア（勝率ベース）' : undefined),
    )
    lateItems = [] // Deeplol のコアで十分埋まる
  } else {
    // === 手書きデータ（個別 or 型ベース汎用）===
    source = curatedBuild ? 'curated' : 'generic'
    const startNames = curatedBuild?.start ?? template.startItems
    const coreNames = curatedBuild?.core ?? template.core
    const lateNames = curatedBuild?.late ?? template.late
    const coreReasons = curatedBuild?.coreReasons ?? template.coreReasons

    startItems = startNames.map((n) => make(data, n, 'start'))

    // ブーツ選択：火力キャリーは基本ブーツ維持、耐久寄りのみ脅威に応じ防御ブーツへ
    const tanky =
      classification.archetype === 'tank' ||
      classification.archetype === 'tank-support' ||
      classification.archetype === 'ad-bruiser' ||
      classification.archetype === 'ap-fighter'
    let bootsName = curatedBuild?.boots ?? template.defaultBoots
    let bootsReason = curatedBuild ? 'このチャンピオンの標準ブーツ' : '標準のブーツ'
    if (tanky) {
      if (profile.highCC >= 3) {
        bootsName = template.bootsVsAP
        bootsReason = '敵のCCが非常に多いためテナシティ重視'
      } else if (profile.magicRatio >= 0.6 && profile.total >= 2) {
        bootsName = template.bootsVsAP
        bootsReason = '敵が魔法寄りのため魔法防御ブーツ'
      } else if (profile.physicalRatio >= 0.6 && profile.total >= 2) {
        bootsName = template.bootsVsAD
        bootsReason = '敵が物理寄りのため物理防御ブーツ'
      }
    }
    bootsItem = make(data, bootsName, 'boots', bootsReason)
    coreItems = coreNames.map((n) => make(data, n, 'core', coreReasons?.[n]))
    lateItems = lateNames.map((n) => make(data, n, 'late'))
  }

  // === 共通：ブーツ→コア→対抗→後半 の順で最大6枠に組む ===
  const used = new Set<string>()
  const buildOrder: RecommendedItem[] = []
  const push = (item: RecommendedItem) => {
    const key = item.name.toLowerCase()
    if (used.has(key)) return false
    used.add(key)
    buildOrder.push(item)
    return true
  }

  push(bootsItem)
  for (const it of coreItems) push(it)

  // 対抗アイテム（敵構成に応じた差し込み）
  const counters = counterItems(classification.archetype, profile).sort(
    (a, b) => b.priority - a.priority,
  )
  const extraOptions: RecommendedItem[] = []
  for (const c of counters) {
    const item = make(data, c.name, 'counter', c.reason)
    const key = c.name.toLowerCase()
    if (buildOrder.length < TARGET_SLOTS) {
      push(item)
    } else if (!used.has(key) && !extraOptions.some((e) => e.name.toLowerCase() === key)) {
      extraOptions.push(item)
    }
  }

  // 余り枠を後半候補で埋める
  for (const it of lateItems) {
    if (buildOrder.length >= TARGET_SLOTS) break
    push(it)
  }

  return { classification, profile, source, buildMeta, startItems, buildOrder, extraOptions }
}

export interface NextItemResult {
  /** 次に買うべき1手（所持済みを飛ばした最初の推奨アイテム）*/
  next?: RecommendedItem
  /** ビルド順の各アイテムに所持フラグを付けたもの */
  order: (RecommendedItem & { owned: boolean })[]
}

/**
 * 試合中用：推奨ビルド順と現在の所持アイテムID集合から「次の1手」を割り出す。
 * 所持済みアイテムは飛ばし、まだ持っていない最初の推奨を next とする。
 */
export function computeNextItem(
  rec: Recommendation,
  ownedItemIds: Set<string>,
): NextItemResult {
  const order = rec.buildOrder.map((it) => ({
    ...it,
    owned: !!it.item && ownedItemIds.has(it.item.id),
  }))
  const next = order.find((it) => !it.owned)
  return { next, order }
}
