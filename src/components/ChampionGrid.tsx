import { useMemo, useState } from 'react'
import { getLanes, LANE_LABEL, LANE_ORDER, type Lane } from '../championData'
import { imageUrl } from '../ddragon'
import type { DDragonChampion } from '../types'

interface Props {
  version: string
  champions: DDragonChampion[]
  disabledIds?: Set<string>
  onPick: (champ: DDragonChampion) => void
}

// 実際のLoL選択画面と同じレーン別フィルタ
type LaneFilter = 'all' | Lane

const LANE_ICON: Record<Lane, string> = {
  TOP: '⬆️',
  JUNGLE: '🌳',
  MID: '🛣️',
  BOT: '🏹',
  SUPPORT: '➕',
}

export function ChampionGrid({ version, champions, disabledIds, onPick }: Props) {
  const [q, setQ] = useState('')
  const [lane, setLane] = useState<LaneFilter>('all')

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    return champions.filter((c) => {
      if (lane !== 'all' && !getLanes(c.id, c.tags).includes(lane)) return false
      if (!k) return true
      return c.name.toLowerCase().includes(k) || c.id.toLowerCase().includes(k)
    })
  }, [q, lane, champions])

  const tabs: { key: LaneFilter; label: string; icon: string }[] = [
    { key: 'all', label: '全て', icon: '◆' },
    ...LANE_ORDER.map((l) => ({ key: l as LaneFilter, label: LANE_LABEL[l], icon: LANE_ICON[l] })),
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* レーン別フィルタ */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const active = lane === t.key
          return (
            <button
              key={t.key}
              onClick={() => setLane(t.key)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                active
                  ? 'bg-sky-600 text-white ring-1 ring-sky-400'
                  : 'bg-slate-800 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-700'
              }`}
            >
              <span aria-hidden>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="チャンピオン名で検索…"
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-sky-500"
      />

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{filtered.length} 体</span>
        {(lane !== 'all' || q) && (
          <button
            onClick={() => {
              setLane('all')
              setQ('')
            }}
            className="text-slate-400 hover:text-slate-200"
          >
            絞り込みをクリア
          </button>
        )}
      </div>

      <div className="grid max-h-[50vh] grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 overflow-y-auto pr-1">
        {filtered.map((c) => {
          const disabled = disabledIds?.has(c.id)
          return (
            <button
              key={c.id}
              disabled={disabled}
              onClick={() => onPick(c)}
              title={c.name}
              className={`group flex flex-col items-center gap-1 rounded-lg p-1 transition ${
                disabled
                  ? 'cursor-not-allowed opacity-30'
                  : 'hover:bg-slate-700/60 hover:ring-1 hover:ring-sky-500'
              }`}
            >
              <img
                src={imageUrl(version, 'champion', c.image.full)}
                alt={c.name}
                loading="lazy"
                className="h-12 w-12 rounded-md"
              />
              <span className="line-clamp-1 w-full truncate text-center text-[10px] text-slate-300">
                {c.name}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-slate-500">
            該当するチャンピオンがいません
          </p>
        )}
      </div>
    </div>
  )
}
