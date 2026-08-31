// 実機テスト用の診断ツール（GUI不要・読み取り専用）。
// LoLのローカルAPIが今応答するかを直接確認する。
import fs from 'node:fs'
import path from 'node:path'
import https from 'node:https'

const agent = new https.Agent({ rejectUnauthorized: false })

function get(url, auth, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { agent, headers: auth ? { Authorization: auth } : {} }, (res) => {
      let body = ''
      res.on('data', (d) => (body += d))
      res.on('end', () => resolve({ status: res.statusCode, body }))
    })
    req.on('error', reject)
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')))
  })
}

function lockfilesFromMetadata() {
  const metas = [
    'C:/ProgramData/Riot Games/Metadata/league_of_legends.live/league_of_legends.live.product_settings.yaml',
  ]
  const out = []
  for (const m of metas) {
    try {
      const txt = fs.readFileSync(m, 'utf8')
      const match = txt.match(/product_install_full_path:\s*"?([^"\n]+)"?/)
      if (match) out.push(path.join(match[1].trim(), 'lockfile'))
    } catch {}
  }
  return out
}

const LOCKFILES = [
  process.env.LOL_LOCKFILE,
  ...lockfilesFromMetadata(),
  'C:/Riot Games/League of Legends/lockfile',
  path.join(process.env.LOCALAPPDATA || '', 'Riot Games/League of Legends/lockfile'),
].filter(Boolean)

function readLock() {
  for (const p of LOCKFILES) {
    try {
      const txt = fs.readFileSync(p, 'utf8')
      const parts = txt.split(':')
      if (parts.length >= 5) return { path: p, port: parts[2], password: parts[3] }
    } catch {}
  }
  return null
}

console.log('=== LoL Item Advisor 診断 ===\n')

// 1) lockfile
console.log('[1] lockfile 検索:')
for (const p of LOCKFILES) console.log('   -', p, fs.existsSync(p) ? '✓ あり' : '× なし')
const lock = readLock()
if (!lock) {
  console.log('\n→ クライアント未起動、またはインストール先が既定と違います。')
  console.log('   LoLクライアント(ランチャー)を起動してから再実行してください。')
  console.log('   別パスの場合: set LOL_LOCKFILE=... で指定できます。')
} else {
  console.log(`\n   使用: ${lock.path}  (port=${lock.port})`)
  const auth = 'Basic ' + Buffer.from('riot:' + lock.password).toString('base64')
  const base = `https://127.0.0.1:${lock.port}`

  // 2) LCU 認証確認
  console.log('\n[2] LCU 認証確認 (/lol-summoner/v1/current-summoner):')
  try {
    const r = await get(`${base}/lol-summoner/v1/current-summoner`, auth)
    if (r.status === 200) {
      const s = JSON.parse(r.body)
      console.log(`   ✓ OK  召喚士: ${s.displayName || s.gameName || '(名前取得できず)'}`)
    } else {
      console.log(`   HTTP ${r.status}（ログイン前の可能性）`)
    }
  } catch (e) {
    console.log('   × 失敗:', String(e))
  }

  // 3) champ select
  console.log('\n[3] チャンピオン選択 (/lol-champ-select/v1/session):')
  try {
    const r = await get(`${base}/lol-champ-select/v1/session`, auth)
    if (r.status === 200) {
      const s = JSON.parse(r.body)
      const my = (s.myTeam || []).map((p) => p.championId).filter((k) => k > 0)
      const their = (s.theirTeam || []).map((p) => p.championId).filter((k) => k > 0)
      const mine = (s.myTeam || []).find((p) => p.cellId === s.localPlayerCellId)
      console.log('   ✓ 選択中！')
      console.log('     自分のピック(キー):', mine?.championId || '(未確定)')
      console.log('     味方の確定キー:', my.join(', ') || '(なし)')
      console.log('     敵の確定キー:', their.join(', ') || '(まだ見えない/ブラインド)')
    } else {
      console.log(`   HTTP ${r.status} → いまチャンピオン選択中ではありません`)
    }
  } catch (e) {
    console.log('   -', String(e))
  }
}

// 4) Live Client（試合中）
console.log('\n[4] 試合中 (127.0.0.1:2999/liveclientdata/allgamedata):')
try {
  const r = await get('https://127.0.0.1:2999/liveclientdata/allgamedata', undefined, 2000)
  if (r.status === 200) {
    const d = JSON.parse(r.body)
    const me = d.activePlayer?.summonerName || d.activePlayer?.riotIdGameName || '(不明)'
    console.log('   ✓ 試合中！')
    console.log('     自分:', me, '/ 経過:', Math.floor(d.gameData?.gameTime || 0), '秒')
    console.log('     プレイヤー数:', (d.allPlayers || []).length)
    for (const p of d.allPlayers || []) {
      console.log(
        `      [${p.team}] ${p.rawChampionName?.split('_').pop() || p.championName}  アイテム${(p.items || []).length}個  ${p.summonerName || p.riotIdGameName || ''}`,
      )
    }
  } else {
    console.log(`   HTTP ${r.status} → いま試合中ではありません`)
  }
} catch (e) {
  console.log('   -', String(e), '→ 試合中でない、またはAPI未起動')
}

console.log('\n=== 診断おわり ===')
