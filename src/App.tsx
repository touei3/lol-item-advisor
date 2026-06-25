import { useEffect, useMemo, useState } from 'react'
import { ChampionGrid } from './components/ChampionGrid'
import { BuildResult } from './components/BuildResult'
import { imageUrl, loadDDragon, type DDragonData } from './ddragon'
import { recommend } from './recommend'
import type { DDragonChampion } from './types'

type PickerMode = { kind: 'my' } | { kind: 'enemy'; slot: number } | null

export default function App() {
  const [data, setData] = useState<DDragonData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [myChamp, setMyChamp] = useState<DDragonChampion | null>(null)
  const [enemies, setEnemies] = useState<(DDragonChampion | null)[]>([
    null, null, null, null, null,
  ])
  const [picker, setPicker] = useState<PickerMode>(null)

  useEffect(() => {
    loadDDragon()
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  const enemyList = useMemo(
    () => enemies.filter((e): e is DDragonChampion => e !== null),
    [enemies],
  )

  const rec = useMemo(() => {
    if (!data || !myChamp) return null
    return recommend(data, myChamp, enemyList)
  }, [data, myChamp, enemyList])

  const usedEnemyIds = useMemo(() => {
    const s = new Set<string>()
    for (const e of enemies) if (e) s.add(e.id)
    if (myChamp) s.add(myChamp.id)
    return s
  }, [enemies, myChamp])

  function handlePick(champ: DDragonChampion) {
    if (!picker) return
    if (picker.kind === 'my') {
      setMyChamp(champ)
    } else {
      setEnemies((prev) => {
        const next = [...prev]
        next[picker.slot] = champ
        return next
      })
    }
    setPicker(null)
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-center text-rose-300">
        データの読み込みに失敗しました：{error}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400">
        Data Dragon を読み込み中…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">LoL アイテムビルドアドバイザー</h1>
        <p className="mt-1 text-sm text-slate-400">
          自分と敵を選ぶと、敵構成に合わせたアイテム購入順を提案します（パッチ {data.version} /
          Riot Data Dragon）
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* 左：選択パネル */}
        <div className="flex flex-col gap-5">
          <section>
            <h2 className="mb-2 text-sm font-bold text-sky-300">自分のチャンピオン</h2>
            <ChampionSlot
              version={data.version}
              champ={myChamp}
              placeholder="選択する"
              onClick={() => setPicker({ kind: 'my' })}
              onClear={myChamp ? () => setMyChamp(null) : undefined}
            />
          </section>

          <section>
            <h2 className="mb-2 text-sm font-bold text-rose-300">
              敵チーム（最大5人・分かる分だけでOK）
            </h2>
            <div className="grid grid-cols-5 gap-2 lg:grid-cols-2 xl:grid-cols-3">
              {enemies.map((e, i) => (
                <ChampionSlot
                  key={i}
                  version={data.version}
                  champ={e}
                  placeholder={`敵 ${i + 1}`}
                  onClick={() => setPicker({ kind: 'enemy', slot: i })}
                  onClear={
                    e
                      ? () =>
                          setEnemies((prev) => {
                            const next = [...prev]
                            next[i] = null
                            return next
                          })
                      : undefined
                  }
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              ※ 1体だけでも対面用の提案が出ます。人数が増えるほど精度が上がります。
            </p>
          </section>
        </div>

        {/* 右：結果 */}
        <div>
          {rec ? (
            <BuildResult version={data.version} rec={rec} />
          ) : (
            <div className="rounded-xl bg-slate-800/30 p-10 text-center text-slate-500 ring-1 ring-slate-700">
              まず「自分のチャンピオン」を選んでください
            </div>
          )}
        </div>
      </div>

      {/* ピッカーモーダル */}
      {picker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPicker(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-slate-900 p-5 ring-1 ring-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">
                {picker.kind === 'my' ? '自分のチャンピオンを選択' : '敵チャンピオンを選択'}
              </h3>
              <button
                onClick={() => setPicker(null)}
                className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-slate-800"
              >
                閉じる ✕
              </button>
            </div>
            <ChampionGrid
              version={data.version}
              champions={data.champions}
              disabledIds={usedEnemyIds}
              onPick={handlePick}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ChampionSlot({
  version,
  champ,
  placeholder,
  onClick,
  onClear,
}: {
  version: string
  champ: DDragonChampion | null
  placeholder: string
  onClick: () => void
  onClear?: () => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-xl bg-slate-800/60 p-2.5 text-left ring-1 ring-slate-700 transition hover:ring-sky-500"
      >
        {champ ? (
          <img
            src={imageUrl(version, 'champion', champ.image.full)}
            alt={champ.name}
            className="h-11 w-11 rounded-md"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-700 text-lg text-slate-500">
            +
          </div>
        )}
        <span className={`truncate text-sm ${champ ? 'text-white' : 'text-slate-500'}`}>
          {champ ? champ.name : placeholder}
        </span>
      </button>
      {onClear && (
        <button
          onClick={onClear}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-xs text-slate-300 hover:bg-rose-600 hover:text-white"
          title="クリア"
        >
          ✕
        </button>
      )}
    </div>
  )
}
