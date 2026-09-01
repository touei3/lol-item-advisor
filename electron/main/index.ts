import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import type { LiveState } from '../../src/live'
import { fetchBuild } from './deeplol'
import { fetchChampSelect, isClientRunning } from './lcu'
import { fetchIngame } from './liveclient'
import { mockChampSelect, mockIngame } from './mock'

let win: BrowserWindow | null = null
let mock = false
let mockTick = 0
let lastState: LiveState = { phase: 'idle' }
const POLL_MS = 1500

function createWindow() {
  win = new BrowserWindow({
    width: 380,
    height: 600,
    minWidth: 320,
    minHeight: 420,
    alwaysOnTop: true,
    skipTaskbar: false,
    title: 'LoL Item Advisor',
    backgroundColor: '#0a0e14',
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  // フルスクリーン気味のゲームより前面に出す
  win.setAlwaysOnTop(true, 'screen-saver')

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  win.on('closed', () => (win = null))
}

async function poll(): Promise<LiveState> {
  if (mock) {
    mockTick++
    // 数秒ごとに champselect と ingame を交互に表示
    return Math.floor(mockTick / 5) % 2 === 0 ? mockChampSelect : mockIngame
  }
  const ingame = await fetchIngame()
  if (ingame) return ingame
  const champselect = await fetchChampSelect()
  if (champselect) return champselect
  return {
    phase: 'idle',
    message: isClientRunning()
      ? 'LoLクライアント検出。ロビー／チャンピオン選択を待っています…'
      : 'LoLを起動すると自動で連携します',
  }
}

function startLoop() {
  const tick = async () => {
    try {
      lastState = await poll()
      win?.webContents.send('lol:state', lastState)
    } catch (e) {
      lastState = { phase: 'error', message: String(e) }
      win?.webContents.send('lol:state', lastState)
    }
  }
  tick()
  setInterval(tick, POLL_MS)
}

app.whenReady().then(() => {
  ipcMain.handle('lol:getState', () => lastState)
  ipcMain.handle('lol:getBuild', (_e, championKey: number) => fetchBuild(championKey))
  ipcMain.on('lol:setMock', (_e, on: boolean) => {
    mock = !!on
    mockTick = 0
  })

  createWindow()
  startLoop()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
