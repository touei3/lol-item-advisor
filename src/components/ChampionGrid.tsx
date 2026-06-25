import { useMemo, useState } from 'react'
import { imageUrl } from '../ddragon'
import type { DDragonChampion } from '../types'

interface Props {
  version: string
  champions: DDragonChampion[]
  disabledIds?: Set<string>
  onPick: (champ: DDragonChampion) => void
}

export function ChampionGrid({ version, champions, disabledIds, onPick }: Props) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return champions
    return champions.filter(
      (c) => c.name.toLowerCase().includes(k) || c.id.toLowerCase().includes(k),
    )
  }, [q, champions])

  return (
    <div className="flex flex-col gap-3">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="チャンピオン名で検索…"
        className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none ring-1 ring-slate-700 focus:ring-sky-500"
      />
      <div className="grid max-h-[55vh] grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-2 overflow-y-auto pr-1">
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
