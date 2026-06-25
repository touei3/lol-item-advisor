import type { Archetype, Classification, DamageType, DDragonChampion } from './types'

/**
 * フレックス/特殊スケーリングなど、tags + info だけでは正しく判定しにくい
 * チャンピオンの上書きマップ。運用しながら少しずつ追記すればよい。
 * （ここに無いチャンピオンは自動判定でカバーされる）
 */
const OVERRIDES: Record<string, Partial<Classification>> = {
  Teemo: { archetype: 'mage', damageType: 'magic' },
  Kennen: { archetype: 'mage', damageType: 'magic' },
  Gragas: { archetype: 'ap-fighter', damageType: 'magic' },
  Vladimir: { archetype: 'mage', damageType: 'magic' },
  Swain: { archetype: 'mage', damageType: 'magic' },
  Rumble: { archetype: 'ap-fighter', damageType: 'magic' },
  Mordekaiser: { archetype: 'ap-fighter', damageType: 'magic' },
  Singed: { archetype: 'ap-fighter', damageType: 'magic' },
  Kayle: { archetype: 'adc', damageType: 'magic' },
  Quinn: { archetype: 'adc', damageType: 'physical' },
  Graves: { archetype: 'adc', damageType: 'physical' },
  KaiSa: { archetype: 'adc', damageType: 'mixed' },
  "Kai'Sa": { archetype: 'adc', damageType: 'mixed' },
  Ezreal: { archetype: 'adc', damageType: 'physical' },
  Jax: { archetype: 'ad-bruiser', damageType: 'physical' },
  Diana: { archetype: 'ap-assassin', damageType: 'magic' },
  Ekko: { archetype: 'ap-assassin', damageType: 'magic' },
  Akali: { archetype: 'ap-assassin', damageType: 'magic' },
  Fizz: { archetype: 'ap-assassin', damageType: 'magic' },
  Katarina: { archetype: 'ap-assassin', damageType: 'magic' },
  Lillia: { archetype: 'ap-fighter', damageType: 'magic' },
  Elise: { archetype: 'mage', damageType: 'magic' },
  Nidalee: { archetype: 'mage', damageType: 'magic' },
  Heimerdinger: { archetype: 'mage', damageType: 'magic' },
  Yasuo: { archetype: 'adc', damageType: 'physical' },
  Yone: { archetype: 'ad-bruiser', damageType: 'mixed' },
  Senna: { archetype: 'adc', damageType: 'physical' },
}

function has(champ: DDragonChampion, tag: string): boolean {
  return champ.tags.includes(tag)
}

function autoDamageType(champ: DDragonChampion): DamageType {
  if (has(champ, 'Marksman')) return 'physical'
  if (has(champ, 'Mage')) return 'magic'
  const { attack, magic } = champ.info
  if (magic > attack + 1) return 'magic'
  if (attack > magic + 1) return 'physical'
  return 'mixed'
}

function autoArchetype(champ: DDragonChampion, dmg: DamageType): Archetype {
  if (has(champ, 'Marksman')) return 'adc'

  if (has(champ, 'Support')) {
    // タンク/エンゲージ系サポート vs 支援系サポート
    if (has(champ, 'Tank') || champ.info.defense >= 6) return 'tank-support'
    return 'enchanter'
  }

  if (has(champ, 'Tank')) return 'tank'

  if (has(champ, 'Assassin')) {
    return dmg === 'magic' ? 'ap-assassin' : 'ad-assassin'
  }

  if (has(champ, 'Mage')) {
    // 耐久寄りメイジは ap-fighter 扱い
    return champ.info.defense >= 6 ? 'ap-fighter' : 'mage'
  }

  if (has(champ, 'Fighter')) {
    return dmg === 'magic' ? 'ap-fighter' : 'ad-bruiser'
  }

  // フォールバック
  if (dmg === 'magic') return 'mage'
  return 'ad-bruiser'
}

export function classify(champ: DDragonChampion): Classification {
  const dmg = autoDamageType(champ)
  const base: Classification = {
    damageType: dmg,
    archetype: autoArchetype(champ, dmg),
  }
  const ov = OVERRIDES[champ.id]
  if (ov && (ov.archetype || ov.damageType)) {
    return {
      archetype: ov.archetype ?? base.archetype,
      damageType: ov.damageType ?? base.damageType,
    }
  }
  return base
}

export const ARCHETYPE_LABEL: Record<Archetype, string> = {
  adc: 'AD マークスマン',
  mage: 'AP メイジ',
  'ad-assassin': 'AD アサシン',
  'ap-assassin': 'AP アサシン',
  'ad-bruiser': 'AD ファイター',
  'ap-fighter': 'AP ファイター',
  tank: 'タンク',
  enchanter: 'エンチャンター',
  'tank-support': 'タンク/エンゲージ サポート',
}

export const DAMAGE_LABEL: Record<DamageType, string> = {
  physical: '物理',
  magic: '魔法',
  mixed: '混合',
}
