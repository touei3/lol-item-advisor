import { BUILDS } from './builds'
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
  const profile = buildThreatProfile(enemies)

  // --- スタートアイテム ---
  const startItems = template.startItems.map((n) => make(data, n, 'start'))

  // --- ブーツ選択（脅威に応じて差し替え）---
  let bootsName = template.defaultBoots
  let bootsReason = '標準のブーツ'
  if (profile.highCC >= 2 || profile.magicRatio >= 0.6) {
    bootsName = template.bootsVsAP
    bootsReason =
      profile.highCC >= 2 ? '敵のCCが多いためテナシティ重視' : '敵が魔法寄りのため魔法防御ブーツ'
  } else if (profile.physicalRatio >= 0.6) {
    bootsName = template.bootsVsAD
    bootsReason = '敵が物理寄りのため物理防御ブーツ'
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
  for (const n of template.core) {
    push(make(data, n, 'core', template.coreReasons[n]))
  }

  // --- 対抗アイテム（優先度順）---
  const counters = counterItems(classification.archetype, profile).sort(
    (a, b) => b.priority - a.priority,
  )

  const extraOptions: RecommendedItem[] = []
  for (const c of counters) {
    const item = make(data, c.name, 'counter', c.reason)
    if (buildOrder.length < TARGET_SLOTS) {
      if (!push(item)) {
        // すでにビルドに含まれている場合は無視
      }
    } else {
      const key = c.name.toLowerCase()
      if (!used.has(key) && !extraOptions.some((e) => e.name.toLowerCase() === key)) {
        extraOptions.push(item)
      }
    }
  }

  // --- 余り枠を後半候補で埋める ---
  for (const n of template.late) {
    if (buildOrder.length >= TARGET_SLOTS) break
    push(make(data, n, 'late'))
  }

  return { classification, profile, startItems, buildOrder, extraOptions }
}
