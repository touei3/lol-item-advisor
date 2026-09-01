import { contextBridge, ipcRenderer } from 'electron'
import type { LiveState } from '../../src/live'

// renderer に window.lol として安全なブリッジを公開する
contextBridge.exposeInMainWorld('lol', {
  onState: (cb: (state: LiveState) => void) => {
    const listener = (_e: unknown, state: LiveState) => cb(state)
    ipcRenderer.on('lol:state', listener)
    return () => ipcRenderer.removeListener('lol:state', listener)
  },
  getState: () => ipcRenderer.invoke('lol:getState') as Promise<LiveState>,
  setMock: (on: boolean) => ipcRenderer.send('lol:setMock', on),
  getBuild: (championKey: number) => ipcRenderer.invoke('lol:getBuild', championKey),
})
