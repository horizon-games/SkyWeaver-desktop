import path from 'path'
import { app } from 'electron'

export function isSequenceWalletURL(url) {
  return url.hostname === 'sequence.app' || url.hostname === 'dev.sequence.app'
}

export const SEQUENCE_WALLET_URL = new URL('https://sequence.app')

const SKYWEAVER_SEQUENCE_AUTH_PROTOCOL = 'skyweavermobile'

// Grab this right before you open an auth window, so if you have multiple clients open,
// the currently logging in client gets the callback.
export function prepareSequenceAuthReceiver() {
  app.removeAsDefaultProtocolClient(SKYWEAVER_SEQUENCE_AUTH_PROTOCOL)

  if (process.platform === 'win32') {
    if (!app.isPackaged) {
      // Special handling on Windows while developing.
      // See https://stackoverflow.com/a/53786254/64904
      // Set the path of electron.exe and files
      // The following works for Electron v11.
      // Use the following console script to see the argv contents
      app.setAsDefaultProtocolClient(
        SKYWEAVER_SEQUENCE_AUTH_PROTOCOL,
        process.execPath,
        [path.resolve(__dirname, 'main.js')]
      )
    } else {
      app.setAsDefaultProtocolClient(
        SKYWEAVER_SEQUENCE_AUTH_PROTOCOL,
        process.execPath,
        []
      )
    }
  } else {
    app.setAsDefaultProtocolClient(SKYWEAVER_SEQUENCE_AUTH_PROTOCOL)
  }
}
