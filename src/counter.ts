import { classify } from './classify'
import { HIGH_CC, HIGH_HEAL } from './gameData'
import type { Archetype, DDragonChampion, ThreatProfile } from './types'

export function buildThreatProfile(enemies: DDragonChampion[]): ThreatProfile {
  let physical = 0
  let magic = 0
  let tanks = 0
  let highCC = 0
  let highHeal = 0

  for (const e of enemies) {
    const cls = classify(e)
    if (cls.damageType === 'physical') physical += 1
    else if (cls.damageType === 'magic') magic += 1
    else {
      physical += 0.5
      magic += 0.5
    }
    if (e.tags.includes('Tank') || e.info.defense >= 7) tanks += 1
    if (HIGH_CC.has(e.id)) highCC += 1
    if (HIGH_HEAL.has(e.id)) highHeal += 1
  }

  const total = enemies.length || 1
  return {
    total: enemies.length,
    physical,
    magic,
    tanks,
    highCC,
    highHeal,
    physicalRatio: physical / total,
    magicRatio: magic / total,
  }
}

export interface CounterSuggestion {
  name: string
  reason: string
  priority: number // 大きいほど先に差し込む
}

/**
 * 自分のアーキタイプ × 脅威プロファイルから、差し込むべき対抗アイテムを決める。
 * アイテム名はプレイヤーのダメージタイプに合うものを選ぶ（AP には Void Staff 等）。
 */
export function counterItems(
  myArchetype: Archetype,
  profile: ThreatProfile,
): CounterSuggestion[] {
  const out: CounterSuggestion[] = []
  const isAP = myArchetype === 'mage' || myArchetype === 'ap-assassin' || myArchetype === 'ap-fighter'
  const isAD =
    myArchetype === 'adc' || myArchetype === 'ad-assassin' || myArchetype === 'ad-bruiser'
  const isADRanged = myArchetype === 'adc'
  const isTanky =
    myArchetype === 'tank' || myArchetype === 'tank-support' || myArchetype === 'ad-bruiser'
  const isSupport = myArchetype === 'enchanter' || myArchetype === 'tank-support'

  const add = (name: string, reason: string, priority: number) =>
    out.push({ name, reason, priority })

  // --- 回復が多い → 回復カット（グリーブ）---
  if (profile.highHeal >= 1) {
    const sev = profile.highHeal >= 2 ? '複数' : '1体'
    if (isADRanged) add('Mortal Reminder', `敵に回復持ちが${sev}。回復カット＋貫通で対応`, 90)
    else if (isAD) add('Chempunk Chainsword', `敵に回復持ちが${sev}。回復カットを付与`, 90)
    else if (isAP) add('Morellonomicon', `敵に回復持ちが${sev}。魔法系の回復カット`, 90)
    else if (isTanky) add('Thornmail', `敵に回復持ちが${sev}。接触で回復カットを与える`, 90)
    else add('Morellonomicon', `敵に回復持ちが${sev}。回復カットを付与`, 90)
  }

  // --- 高HP/タンクが多い → 割合ダメージ・貫通 ---
  if (profile.tanks >= 2) {
    if (isADRanged) add("Lord Dominik's Regards", '敵にタンクが多い。対HPの装甲貫通', 80)
    else if (myArchetype === 'ad-assassin') add("Serylda's Grudge", '敵にタンクが多い。貫通＋スロー', 80)
    else if (myArchetype === 'ad-bruiser') add('Black Cleaver', '敵にタンクが多い。装甲を削る', 80)
    else if (isAP) {
      add('Void Staff', '敵にタンク/MR持ちが多い。魔法貫通で貫く', 80)
      add("Liandry's Torment", '敵に高HPが多い。継続割合ダメージ', 55)
    } else add('Blade of The Ruined King', '敵に高HPが多い。割合ダメージ', 80)
  }

  // --- 物理が多い → 物理防御 ---
  if (profile.physicalRatio >= 0.6 && profile.total >= 2) {
    if (isAP) add("Zhonya's Hourglass", '敵は物理寄り。装甲＋無敵で凌ぐ', 70)
    else if (isTanky) add('Randuin\'s Omen', '敵は物理寄り。装甲＋クリ軽減', 70)
    else if (isAD) add('Guardian Angel', '敵は物理寄り。装甲＋復活で粘る', 60)
    else add('Frozen Heart', '敵は物理寄り。装甲＋AS低下', 65)
  }

  // --- 魔法が多い → 魔法防御 ---
  if (profile.magicRatio >= 0.6 && profile.total >= 2) {
    if (isTanky) add('Spirit Visage', '敵は魔法寄り。MR＋回復効果UP', 70)
    else if (isADRanged) add('Maw of Malmortius', '敵は魔法寄り。MR＋魔法シールド', 65)
    else if (isAP) add("Banshee's Veil", '敵は魔法寄り。スペルシールドで先手を防ぐ', 65)
    else if (isSupport) add('Mikael\'s Blessing', '敵は魔法寄り。MR＋CC解除を確保', 60)
    else add("Force of Nature", '敵は魔法寄り。MRを大きく確保', 65)
  }

  // --- CCが多い → CC耐性/解除 ---
  if (profile.highCC >= 2) {
    if (isADRanged || myArchetype === 'ad-assassin')
      add('Mercurial Scimitar', '敵にCCが多い。CC解除で生存', 75)
    else if (isAP) add("Banshee's Veil", '敵にCCが多い。スペルシールドで起点を防ぐ', 60)
    else add("Mercury's Treads", '敵にCCが多い。CC時間を短縮（ブーツ優先）', 50)
  }

  return out
}
