import { app, BrowserWindow, screen, shell } from 'electron'
import jetpack from 'fs-jetpack'
import { isSequenceWalletURL, prepareSequenceAuthReceiver } from './wallet'

export default (name, options) => {
  const userDataDir = jetpack.cwd(app.getPath('userData'))
  const stateStoreFile = `window-state-${name}.json`
  const defaultSize = {
    width: options.width,
    height: options.height
  }
  let state = {}

  const restore = () => {
    let restoredState = {}
    try {
      restoredState = userDataDir.read(stateStoreFile, 'json')
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, restoredState)
  }

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size = win.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    }
  }

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    })
  }

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds)
    })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    userDataDir.write(stateStoreFile, state, { atomic: true })
  }

  state = ensureVisibleOnSomeDisplay(restore())

  // set some defaults
  options = {
    ...options,
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      allowRunningInsecureContent: false,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: true,
      webgl: true,
      nativeWindowOpen: true
    }
  }

  const winOptions = Object.assign({}, options, state)

  const win = new BrowserWindow(winOptions)

  win.on('close', saveState)

  win.webContents.setWindowOpenHandler(({ url }) => {
    let parsedURL
    try {
      parsedURL = new URL(url)
    } catch (e) {
      console.warn('Failed to open child window with invalid URL ', url)
      return { action: 'deny' }
    }
    console.log(parsedURL)
    if (isSequenceWalletURL(parsedURL)) {
      prepareSequenceAuthReceiver()
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          autoHideMenuBar: true,
          darkTheme: true,
          backgroundColor: 'black'
        }
      }
    } else if (parsedURL.hostname === 'play.skyweaver.net') {
      return { action: 'deny' } // prevent shift-clicking or middle-clicking links from opening popups
    } else {
      // a link to any external website should open in your browser, not in electron.
      shell.openExternal(url)
      return { action: 'deny' }
    }
  })

  const windows = { main: win, wallet: null }

  windows.main.webContents.on('did-create-window', (child, details) => {
    let childURL
    try {
      childURL = new URL(details.url)
    } catch (e) {
      console.warn(
        'Created window with invalid URL ',
        details.url,
        ', closing.'
      )
      return
    }
    if (isSequenceWalletURL(childURL)) {
      if (windows.wallet) {
        windows.wallet.close()
      }
      windows.wallet = child
      windows.wallet.on('close', (ev) => {
        if (windows.wallet === ev.sender) {
          windows.wallet = null
        }
      })

      // All children of Sequence popup windows should open in your web browser.
      child.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
      })
      child.webContents.on('will-navigate', (event, url) => {
        let parsedURL
        try {
          parsedURL = new URL(url)
        } catch (e) {
          console.warn('Failed to navigate wallet window to invalid URL ', url)
          event.preventDefault()
          return
        }
        console.log(parsedURL)
        if (isSequenceWalletURL(parsedURL)) {
          return
        } else if (parsedURL.hostname === 'play.skyweaver.net') {
          windows.main.focus() // if you click "skyweaver" link in sequence app
        } else {
          // a navigate to any external website from the wallet should open in your browser, not in electron.
          shell.openExternal(url)
        }
        event.preventDefault()
      })
    }
  })

  return windows
}
