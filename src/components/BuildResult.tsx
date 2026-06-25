import { ARCHETYPE_LABEL, DAMAGE_LABEL } from '../classify'
import { imageUrl } from '../ddragon'
import type { Recommendation } from '../recommend'
import type { RecommendedItem } from '../types'

const ROLE_STYLE: Record<RecommendedItem['role'], string> = {
  start: 'ring-slate-600',
  boots: 'ring-amber-500',
  core: 'ring-sky-500',
  counter: 'ring-rose-500',
  late: 'ring-slate-600',
}

function ItemCard({
  version,
  item,
  index,
}: {
  version: string
  item: RecommendedItem
  index?: number
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-slate-800/60 p-2.5">
      <div className="relative shrink-0">
        {item.item ? (
          <img
            src={imageUrl(version, 'item', item.item.image.full)}
            alt={item.displayName}
            title={item.displayName}
            className={`h-12 w-12 rounded-md ring-2 ${ROLE_STYLE[item.role]}`}
          />
        ) : (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-md bg-slate-700 text-[9px] ring-2 ${ROLE_STYLE[item.role]}`}
          >
            ?
          </div>
        )}
        {index != null && (
          <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[11px] font-bold">
            {index}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{item.displayName}</span>
          {item.role === 'counter' && (
            <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300">
              対策
            </span>
          )}
          {item.role === 'boots' && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
              ブーツ
            </span>
          )}
        </div>
        {item.reason && <p className="mt-0.5 text-xs text-slate-400">{item.reason}</p>}
      </div>
    </div>
  )
}

export function BuildResult({ version, rec }: { version: string; rec: Recommendation }) {
  const { classification, profile, curated, startItems, buildOrder, extraOptions } = rec

  return (
    <div className="flex flex-col gap-5">
      {/* 自分の型 */}
      <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-slate-700">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-sm font-bold text-sky-300">あなたのタイプ</h3>
          {curated ? (
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
              個別ビルド
            </span>
          ) : (
            <span className="rounded bg-slate-500/20 px-1.5 py-0.5 text-[10px] text-slate-300">
              汎用ビルド（型ベース）
            </span>
          )}
        </div>
        <p className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            {ARCHETYPE_LABEL[classification.archetype]}
          </span>
          <span className="ml-2 text-slate-400">
            ダメージ: {DAMAGE_LABEL[classification.damageType]}
          </span>
        </p>
      </div>

      {/* 敵の脅威プロファイル */}
      {profile.total > 0 && (
        <div className="rounded-xl bg-slate-800/40 p-4 ring-1 ring-slate-700">
          <h3 className="mb-2 text-sm font-bold text-rose-300">敵チームの脅威分析</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 sm:grid-cols-3">
            <Stat label="物理ダメージ" value={`${Math.round(profile.physicalRatio * 100)}%`} />
            <Stat label="魔法ダメージ" value={`${Math.round(profile.magicRatio * 100)}%`} />
            <Stat label="タンク" value={`${profile.tanks} 体`} />
            <Stat label="CC持ち" value={`${profile.highCC} 体`} />
            <Stat label="回復持ち" value={`${profile.highHeal} 体`} />
            <Stat label="入力済み" value={`${profile.total} / 5`} />
          </div>
        </div>
      )}

      {/* スタート */}
      <Section title="スタートアイテム" color="text-slate-300">
        <div className="flex flex-wrap gap-2">
          {startItems.map((it) => (
            <ItemCard key={it.name} version={version} item={it} />
          ))}
        </div>
      </Section>

      {/* ビルド順 */}
      <Section title="購入順序（推奨ビルド）" color="text-sky-300">
        <div className="flex flex-col gap-2">
          {buildOrder.map((it, i) => (
            <ItemCard key={it.name} version={version} item={it} index={i + 1} />
          ))}
        </div>
      </Section>

      {/* その他の対策候補 */}
      {extraOptions.length > 0 && (
        <Section title="その他の対策候補（枠と相談）" color="text-rose-300">
          <div className="flex flex-col gap-2">
            {extraOptions.map((it) => (
              <ItemCard key={it.name} version={version} item={it} />
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-900/50 px-3 py-2">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  )
}

function Section({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className={`mb-2 text-sm font-bold ${color}`}>{title}</h3>
      {children}
    </div>
  )
}
