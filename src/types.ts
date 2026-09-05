// ===== Data Dragon 由来の型 =====
export interface DDragonChampion {
  id: string // "Ahri" など（英数字ID）
  key: string // "103" など（数値ID 文字列）
  name: string // ローカライズ名（ja_JP なら日本語）
  title: string
  tags: string[] // Fighter / Tank / Mage / Assassin / Marksman / Support
  partype: string // Mana / Energy / None など
  info: {
    attack: number // 0-10 の設計レーティング
    defense: number
    magic: number
    difficulty: number
  }
  image: { full: string }
}

export interface RuneInfo {
  id: number
  name: string
  icon: string // "perk-images/Styles/..." （非バージョンのimg配下）
  styleId: number
}

export interface RuneStyleInfo {
  id: number
  name: string
  icon: string
}

export interface DDragonItem {
  id: string // 数値ID 文字列
  name: string
  image: { full: string }
  gold: { total: number; purchasable: boolean }
  tags: string[]
  maps: Record<string, boolean>
  description: string
}

// ===== アプリ内部の分類 =====
export type DamageType = 'physical' | 'magic' | 'mixed'

export type Archetype =
  | 'adc' // AD マークスマン
  | 'mage' // AP メイジ
  | 'ad-assassin'
  | 'ap-assassin'
  | 'ad-bruiser' // AD ファイター
  | 'ap-fighter' // AP ファイター（バトルメイジ寄り）
  | 'tank'
  | 'enchanter' // 支援サポート
  | 'tank-support' // タンク/エンゲージ サポート

export interface Classification {
  archetype: Archetype
  damageType: DamageType
}

// ===== 推奨結果 =====
export type ItemRole = 'start' | 'boots' | 'core' | 'counter' | 'late'

export interface RecommendedItem {
  name: string // 英語名（キー/重複判定用）
  displayName: string // 表示名（日本語、無ければ英語）
  item?: DDragonItem // Data Dragon で解決できたもの
  role: ItemRole
  reason?: string // なぜこのアイテムか（学習用）
}

export interface ThreatProfile {
  total: number
  physical: number
  magic: number
  tanks: number
  highCC: number
  highHeal: number
  // 比率（0-1）
  physicalRatio: number
  magicRatio: number
}
