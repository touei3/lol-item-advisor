import type { Archetype } from './types'

export interface BuildTemplate {
  startItems: string[]
  defaultBoots: string
  // 状況に応じてMR/物理防御ブーツに差し替える際の候補
  bootsVsAD: string
  bootsVsAP: string
  core: string[] // 中心となる購入順（理由付け対象）
  late: string[] // 余った枠を埋める後半候補
  coreReasons: Record<string, string>
}

// 16.13 時点のアイテム名で記述。Data Dragon で名前解決される。
export const BUILDS: Record<Archetype, BuildTemplate> = {
  adc: {
    startItems: ["Doran's Blade", 'Health Potion'],
    defaultBoots: "Berserker's Greaves",
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Kraken Slayer', 'Infinity Edge', "Lord Dominik's Regards"],
    late: ['Bloodthirster', 'Phantom Dancer', "Runaan's Hurricane", 'Immortal Shieldbow'],
    coreReasons: {
      'Kraken Slayer': '安定した継続物理ダメージの主軸',
      'Infinity Edge': 'クリティカル火力を最大化するコア',
      "Lord Dominik's Regards": '装甲貫通＋対HP用の必須コア',
    },
  },
  mage: {
    startItems: ["Doran's Ring", 'Health Potion'],
    defaultBoots: "Sorcerer's Shoes",
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ["Luden's Echo", "Rabadon's Deathcap", 'Shadowflame'],
    late: ['Void Staff', 'Zhonya\'s Hourglass', "Rylai's Crystal Scepter", 'Cosmic Drive'],
    coreReasons: {
      "Luden's Echo": 'マナと爆発力を補う序盤コア',
      "Rabadon's Deathcap": 'AP総量を底上げする最重要コア',
      'Shadowflame': '魔法貫通でバースト力を強化',
    },
  },
  'ad-assassin': {
    startItems: ['Long Sword', 'Health Potion'],
    defaultBoots: 'Ionian Boots of Lucidity',
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Eclipse', "Youmuu's Ghostblade", 'Profane Hydra'],
    late: ['Edge of Night', 'The Collector', 'Serylda\'s Grudge'],
    coreReasons: {
      'Eclipse': 'バーストと耐久を両立する暗殺コア',
      "Youmuu's Ghostblade": '機動力＋貫通で奇襲性能を上げる',
      'Profane Hydra': '範囲処理とバースト火力を追加',
    },
  },
  'ap-assassin': {
    startItems: ["Doran's Ring", 'Health Potion'],
    defaultBoots: "Sorcerer's Shoes",
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Hextech Rocketbelt', "Rabadon's Deathcap", 'Shadowflame'],
    late: ["Zhonya's Hourglass", 'Void Staff', 'Lich Bane'],
    coreReasons: {
      'Hextech Rocketbelt': '差し込みとバーストを補う暗殺コア',
      "Rabadon's Deathcap": 'AP総量を底上げするコア',
      'Shadowflame': '魔法貫通でワンショット力を強化',
    },
  },
  'ad-bruiser': {
    startItems: ["Doran's Blade", 'Health Potion'],
    defaultBoots: 'Plated Steelcaps',
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Stridebreaker', 'Black Cleaver', "Sterak's Gage"],
    late: ["Death's Dance", 'Sundered Sky', 'Titanic Hydra', 'Guardian Angel'],
    coreReasons: {
      'Stridebreaker': '張り付き力と火力を両立するコア',
      'Black Cleaver': '装甲削り＋耐久で殴り合いに強い',
      "Sterak's Gage": '集団戦で落ちないための耐久コア',
    },
  },
  'ap-fighter': {
    startItems: ["Doran's Ring", 'Health Potion'],
    defaultBoots: "Sorcerer's Shoes",
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Riftmaker', "Rabadon's Deathcap", "Rylai's Crystal Scepter"],
    late: ['Liandry\'s Torment', 'Void Staff', "Zhonya's Hourglass", 'Cosmic Drive'],
    coreReasons: {
      'Riftmaker': '継戦火力と耐久を両立するコア',
      "Rabadon's Deathcap": 'AP総量を底上げするコア',
      "Rylai's Crystal Scepter": 'スロー付与で張り付き性能を強化',
    },
  },
  tank: {
    startItems: ['Doran\'s Shield', 'Health Potion'],
    defaultBoots: 'Plated Steelcaps',
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Sunfire Aegis', 'Jak\'Sho, The Protean', 'Warmog\'s Armor'],
    late: ['Thornmail', 'Spirit Visage', 'Kaenic Rookern', 'Frozen Heart'],
    coreReasons: {
      'Sunfire Aegis': '常時範囲ダメージで存在感を出す前線コア',
      "Jak'Sho, The Protean": '両耐性をスケールさせる万能コア',
      "Warmog's Armor": '大量HPで継戦・回復力を確保',
    },
  },
  enchanter: {
    startItems: ['World Atlas', 'Health Potion'],
    defaultBoots: 'Ionian Boots of Lucidity',
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Moonstone Renewer', 'Redemption', 'Ardent Censer'],
    late: ['Staff of Flowing Water', 'Mikael\'s Blessing', 'Echoes of Helia'],
    coreReasons: {
      'Moonstone Renewer': '集団回復を伸ばす支援コア',
      'Redemption': '広範囲の回復で集団戦を支える',
      'Ardent Censer': '味方ADの火力を底上げ',
    },
  },
  'tank-support': {
    startItems: ['World Atlas', 'Health Potion'],
    defaultBoots: 'Plated Steelcaps',
    bootsVsAD: 'Plated Steelcaps',
    bootsVsAP: "Mercury's Treads",
    core: ['Locket of the Iron Solari', 'Knight\'s Vow', 'Zeke\'s Convergence'],
    late: ['Thornmail', 'Spirit Visage', 'Kaenic Rookern', 'Abyssal Mask'],
    coreReasons: {
      'Locket of the Iron Solari': '集団シールドで味方を守るコア',
      "Knight's Vow": 'キャリーへのダメージ肩代わりと機動補助',
      "Zeke's Convergence": 'エンゲージとバフを両立',
    },
  },
}
