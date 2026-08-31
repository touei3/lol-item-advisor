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

export interface Recommendation {
  classification: Classification
  profile: ThreatProfile
  curated: boolean // チャンピオン個別の手入れビルドか（false=型ベースの汎用）
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

export function recommend(
  data: DDragonData,
  myChamp: DDragonChampion,
  enemies: DDragonChampion[],
): Recommendation {
  const classification = classify(myChamp)
  const template = BUILDS[classification.archetype]
  const curatedBuild = CHAMPIONS[myChamp.id]?.build
  const profile = buildThreatProfile(enemies)

  // 個別ビルドがあれば優先、無ければ型ベースの汎用ビルド
  const startNames = curatedBuild?.start ?? template.startItems
  const baseBoots = curatedBuild?.boots ?? template.defaultBoots
  const coreNames = curatedBuild?.core ?? template.core
  const lateNames = curatedBuild?.late ?? template.late
  const coreReasons = curatedBuild?.coreReasons ?? template.coreReasons

  // --- スタートアイテム ---
  const startItems = startNames.map((n) => make(data, n, 'start'))

  // --- ブーツ選択 ---
  // 火力キャリー(ADC/メイジ/アサシン/エンチャンター)は基本ブーツを維持し、防具はアイテムで対応。
  // 耐久寄り(タンク/ブルーザー)のみ、敵構成に応じて防御ブーツへ差し替える。
  const tanky =
    classification.archetype === 'tank' ||
    classification.archetype === 'tank-support' ||
    classification.archetype === 'ad-bruiser' ||
    classification.archetype === 'ap-fighter'

  let bootsName = baseBoots
  let bootsReason = curatedBuild ? 'このチャンピオンの標準ブーツ' : '標準のブーツ'

  if (tanky) {
    if (profile.highCC >= 3) {
      bootsName = template.bootsVsAP // Mercury's Treads
      bootsReason = '敵のCCが非常に多いためテナシティ重視'
    } else if (profile.magicRatio >= 0.6 && profile.total >= 2) {
      bootsName = template.bootsVsAP
      bootsReason = '敵が魔法寄りのため魔法防御ブーツ'
    } else if (profile.physicalRatio >= 0.6 && profile.total >= 2) {
      bootsName = template.bootsVsAD // Plated Steelcaps
      bootsReason = '敵が物理寄りのため物理防御ブーツ'
    }
  }

  const used = new Set<string>()
  const buildOrder: RecommendedItem[] = []
  const push = (item: RecommendedItem) => {
    const key = item.name.toLowerCase()
    if (used.has(key)) return false
    used.add(key)
    buildOrder.push(item)
    return true
  }

  push(make(data, bootsName, 'boots', bootsReason))

  // --- コア ---
  for (const n of coreNames) {
    push(make(data, n, 'core', coreReasons?.[n]))
  }

  // --- 対抗アイテム（優先度順）---
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

  // --- 余り枠を後半候補で埋める ---
  for (const n of lateNames) {
    if (buildOrder.length >= TARGET_SLOTS) break
    push(make(data, n, 'late'))
  }

  return {
    classification,
    profile,
    curated: !!curatedBuild,
    startItems,
    buildOrder,
    extraOptions,
  }
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
