// ブラウザで各フェーズのUIを確認するための開発用ハーネス（Electron不要）。
// window.lol をモックで差し込み、ボタンで状態を切り替える。
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DesktopApp } from './DesktopApp'
import { mockChampSelect, mockIngame } from '../main/mock'
import type { LiveState } from '../../src/live'

let cb: ((s: LiveState) => void) | null = null
;(window as unknown as { lol: unknown }).lol = {
  onState: (f: (s: LiveState) => void) => {
    cb = f
    return () => {
      cb = null
    }
  },
  getState: () => Promise.resolve({ phase: 'idle', message: 'プレビュー' } as LiveState),
  setMock: () => {},
}

function emit(s: LiveState) {
  cb?.(s)
}

function Harness() {
  return (
    <div>
      <div className="fixed bottom-2 left-2 z-50 flex gap-1.5">
        <button
          onClick={() => emit({ phase: 'idle', message: 'LoLを起動すると連携します' })}
          className="rounded bg-slate-700 px-2 py-1 text-[10px] text-white"
        >
          idle
        </button>
        <button
          onClick={() => emit(mockChampSelect)}
          className="rounded bg-sky-600 px-2 py-1 text-[10px] text-white"
        >
          champselect
        </button>
        <button
          onClick={() => emit(mockIngame)}
          className="rounded bg-emerald-600 px-2 py-1 text-[10px] text-white"
        >
          ingame
        </button>
      </div>
      <DesktopApp />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
)
