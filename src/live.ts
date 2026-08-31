// Electron の main（LoLローカルAPIを読む側）→ renderer（UI）へ渡すゲーム状態の型。
// main は Node、renderer は Chromium。この型ファイルは DOM 非依存で両方から import する。

export type GamePhase = 'idle' | 'champselect' | 'ingame' | 'error'

export interface ChampSelectState {
  phase: 'champselect'
  /** 自分の確定ピック（数値キー、未確定は undefined）*/
  myChampionKey?: number
  /** 味方チームの確定ピック（数値キー）*/
  myTeamKeys: number[]
  /** 敵チームの確定ピック（数値キー、ドラフトで見えている分）*/
  enemyTeamKeys: number[]
}

export interface IngamePlayer {
  /** DDragon のチャンピオンID（"MissFortune" 等）*/
  championId: string
  /** 陣営 */
  team: 'ORDER' | 'CHAOS'
  /** 所持アイテムID（DDragon item id 文字列）*/
  itemIds: string[]
  summonerName: string
  isMe: boolean
}

export interface IngameState {
  phase: 'ingame'
  /** ゲーム内経過秒 */
  gameTime: number
  me?: IngamePlayer
  allies: IngamePlayer[]
  enemies: IngamePlayer[]
}

export type LiveState =
  | { phase: 'idle'; message?: string }
  | { phase: 'error'; message: string }
  | ChampSelectState
  | IngameState

// preload が公開する API の型（renderer から window.lol で参照）
export interface LolBridge {
  /** 状態が変わるたびに呼ばれる。解除関数を返す */
  onState: (cb: (state: LiveState) => void) => () => void
  /** 現在の状態を一度だけ取得 */
  getState: () => Promise<LiveState>
  /** モードの切替（実クライアント / モック）*/
  setMock: (on: boolean) => void
}
