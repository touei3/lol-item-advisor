import type { LolBridge } from '../../src/live'

declare global {
  interface Window {
    lol: LolBridge
  }
}

export {}
