import { useEffect, useMemo, useState } from 'react'
import { BuildResult } from '../../src/components/BuildResult'
import {
  championFromKey,
  championFromRawName,
  imageUrl,
  loadDDragon,
  type DDragonData,
} from '../../src/ddragon'
import { computeNextItem, recommend } from '../../src/recommend'
import type { LiveState } from '../../src/live'
import type { DDragonChampion } from '../../src/types'

export function DesktopApp() {
  const [data, setData] = useState<DDragonData | null>(null)
  const [state, setState] = useState<LiveState>({ phase: 'idle' })
  const [mock, setMock] = useState(false)
  const hasBridge = typeof window !== 'undefined' && !!window.lol

  useEffect(() => {
    loadDDragon().then(setData).catch(() => setData(null))
  }, [])

  useEffect(() => {
    if (!hasBridge) return
    const off = window.lol.onState(setState)
    window.lol.getState().then(setState)
    return off
  }, [hasBridge])

  const toggleMock = () => {
    const next = !mock
    setMock(next)
    window.lol?.setMock(next)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3 py-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <PhaseBadge phase={state.phase} />
          <span className="text-xs font-bold text-slate-200">LoL Item Advisor</span>
        </div>
        {hasBridge && (
          <button
            onClick={toggleMock}
            className={`rounded px-2 py-0.5 text-[10px] ${
              mock ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-700 text-slate-300'
            }`}
            title="LoLが無くても画面を確認できます"
          >
            {mock ? 'モック中' : 'モック'}
          </button>
        )}
      </header>

      <main className="p-3">
        {!data ? (
          <Centered>Data Dragon 読み込み中…</Centered>
        ) : state.phase === 'idle' ? (
          <IdleView message={state.message} hasBridge={hasBridge} />
        ) : state.phase === 'error' ? (
          <Centered>エラー: {state.message}</Centered>
        ) : state.phase === 'champselect' ? (
          <ChampSelectView data={data} state={state} />
        ) : (
          <IngameView data={data} state={state} />
        )}
      </main>
    </div>
  )
}

// ===== フェーズ表示 =====
function PhaseBadge({ phase }: { phase: LiveState['phase'] }) {
  const map: Record<LiveState['phase'], { label: string; cls: string }> = {
    idle: { label: '待機', cls: 'bg-slate-600' },
    champselect: { label: 'ピック', cls: 'bg-sky-600' },
    ingame: { label: '試合中', cls: 'bg-emerald-600' },
    error: { label: 'エラー', cls: 'bg-rose-600' },
  }
  const m = map[phase]
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${m.cls}`}>{m.label}</span>
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="py-16 text-center text-sm text-slate-500">{children}</div>
}

function IdleView({ message, hasBridge }: { message?: string; hasBridge: boolean }) {
  return (
    <div className="py-12 text-center">
      <div className="mb-2 text-4xl">🎮</div>
      <p className="text-sm text-slate-400">{message ?? 'LoLの起動を待っています…'}</p>
      {!hasBridge && (
        <p className="mt-3 text-[11px] text-amber-400">
          ※ ブラウザ表示のため実連携は無効です（Electronアプリとして起動してください）
        </p>
      )}
      <p className="mt-4 text-[11px] text-slate-600">
        チャンピオン選択に入ると敵ピックへのカウンター、
        <br />
        試合が始まると次のおすすめアイテムを表示します。
      </p>
    </div>
  )
}

// ===== チャンピオン選択：敵ピックへのカウンター =====
function ChampSelectView({
  data,
  state,
}: {
  data: DDragonData
  state: Extract<LiveState, { phase: 'champselect' }>
}) {
  const enemies = state.enemyTeamKeys
    .map((k) => championFromKey(data, k))
    .filter((c): c is DDragonChampion => !!c)
  const my = state.myChampionKey ? championFromKey(data, state.myChampionKey) : undefined

  const rec = useMemo(
    () => (my ? recommend(data, my, enemies) : null),
    [data, my, enemies],
  )

  return (
    <div className="flex flex-col gap-3">
      <ChampRow title="敵チームのピック" version={data.version} champs={enemies} empty="敵ピック待ち…" />
      {my ? (
        <div className="flex items-center gap-2 rounded-lg bg-slate-800/60 p-2">
          <img src={imageUrl(data.version, 'champion', my.image.full)} className="h-8 w-8 rounded" />
          <span className="text-xs text-slate-300">
            あなた: <span className="font-semibold text-white">{my.name}</span>
          </span>
        </div>
      ) : (
        <p className="rounded-lg bg-slate-800/60 p-3 text-center text-xs text-slate-400">
          自分のチャンピオンを確定すると、敵構成に合わせたビルドとカウンターを表示します
        </p>
      )}
      {rec && <BuildResult version={data.version} rec={rec} />}
    </div>
  )
}

// ===== 試合中：次のおすすめアイテム =====
function IngameView({
  data,
  state,
}: {
  data: DDragonData
  state: Extract<LiveState, { phase: 'ingame' }>
}) {
  const my = state.me ? championFromRawName(data, state.me.championId) : undefined
  const enemies = state.enemies
    .map((e) => championFromRawName(data, e.championId))
    .filter((c): c is DDragonChampion => !!c)
  const owned = useMemo(() => new Set(state.me?.itemIds ?? []), [state.me])

  const { rec, next, order } = useMemo(() => {
    if (!my) return { rec: null, next: undefined, order: [] as ReturnType<typeof computeNextItem>['order'] }
    const r = recommend(data, my, enemies)
    const n = computeNextItem(r, owned)
    return { rec: r, next: n.next, order: n.order }
  }, [data, my, enemies, owned])

  const mm = Math.floor(state.gameTime / 60)
  const ss = String(Math.floor(state.gameTime % 60)).padStart(2, '0')

  if (!my) return <Centered>自分のチャンピオンを取得中…</Centered>

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={imageUrl(data.version, 'champion', my.image.full)} className="h-8 w-8 rounded" />
          <span className="text-sm font-semibold text-white">{my.name}</span>
        </div>
        <span className="text-xs text-slate-400">⏱ {mm}:{ss}</span>
      </div>

      {/* 次の1手 */}
      <div className="rounded-xl bg-emerald-500/10 p-3 ring-1 ring-emerald-500/40">
        <div className="mb-1 text-[11px] font-bold text-emerald-300">次に買うべきアイテム</div>
        {next ? (
          <div className="flex items-center gap-3">
            {next.item && (
              <img
                src={imageUrl(data.version, 'item', next.item.image.full)}
                className="h-14 w-14 rounded-md ring-2 ring-emerald-400"
              />
            )}
            <div className="min-w-0">
              <div className="text-sm font-bold text-white">{next.displayName}</div>
              {next.reason && <div className="text-xs text-slate-300">{next.reason}</div>}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-300">コアビルド完成！状況に応じて対策アイテムを検討</div>
        )}
      </div>

      {/* 敵チーム構成 */}
      <ChampRow title="敵チーム" version={data.version} champs={enemies} empty="—" />

      {/* ビルド順（所持済みは薄く） */}
      <div>
        <div className="mb-1 text-[11px] font-bold text-slate-300">推奨ビルド順</div>
        <div className="flex flex-wrap gap-1.5">
          {order.map((it, i) => (
            <div key={it.name + i} className="relative" title={it.displayName}>
              {it.item ? (
                <img
                  src={imageUrl(data.version, 'item', it.item.image.full)}
                  className={`h-10 w-10 rounded-md ring-1 ${
                    it.owned ? 'opacity-30 ring-slate-600' : 'ring-sky-500'
                  }`}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-700 text-[8px]">
                  ?
                </div>
              )}
              {it.owned && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] text-white">
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 脅威分析 */}
      {rec && (
        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          <MiniStat label="物理" value={`${Math.round(rec.profile.physicalRatio * 100)}%`} />
          <MiniStat label="魔法" value={`${Math.round(rec.profile.magicRatio * 100)}%`} />
          <MiniStat label="タンク" value={`${rec.profile.tanks}`} />
          <MiniStat label="CC" value={`${rec.profile.highCC}`} />
          <MiniStat label="回復" value={`${rec.profile.highHeal}`} />
          <MiniStat label="敵数" value={`${rec.profile.total}`} />
        </div>
      )}
    </div>
  )
}

function ChampRow({
  title,
  version,
  champs,
  empty,
}: {
  title: string
  version: string
  champs: DDragonChampion[]
  empty: string
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-bold text-rose-300">{title}</div>
      {champs.length === 0 ? (
        <div className="text-xs text-slate-600">{empty}</div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {champs.map((c) => (
            <div key={c.id} className="flex flex-col items-center" title={c.name}>
              <img src={imageUrl(version, 'champion', c.image.full)} className="h-9 w-9 rounded" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-800/60 px-2 py-1 text-center">
      <div className="text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  )
}
