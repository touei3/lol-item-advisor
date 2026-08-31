import https from 'node:https'

// LoL のローカルAPI（LCU / Live Client）は自己署名証明書のため検証を無効化する。
// 宛先は 127.0.0.1 固定なので、この用途では安全。
const agent = new https.Agent({ rejectUnauthorized: false })

export function getJson<T = unknown>(
  url: string,
  auth?: string,
  timeoutMs = 1500,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { agent, headers: auth ? { Authorization: auth } : {} },
      (res) => {
        let body = ''
        res.on('data', (d) => (body += d))
        res.on('end', () => {
          const code = res.statusCode ?? 0
          if (code >= 200 && code < 300) {
            try {
              resolve(JSON.parse(body) as T)
            } catch (e) {
              reject(e)
            }
          } else {
            reject(new Error('HTTP ' + code))
          }
        })
      },
    )
    req.on('error', reject)
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')))
  })
}
