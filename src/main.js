import { app, Menu, session } from 'electron'
import createWindow from './helpers/window'
import { buildMenu } from './helpers/menu'
import { SEQUENCE_WALLET_URL } from './helpers/wallet'

const lock = app.requestSingleInstanceLock()
if (!lock) {
  console.log('failed to get lock')
  app.quit()
} else {
  let userDataPath = app.getPath('userData')
  if (NODE_ENV !== 'production') {
    userDataPath = `${userDataPath} (${NODE_ENV})`
    app.setPath('userData', userDataPath)
  }

  app.setAboutPanelOptions({
    applicationName: 'Skyweaver',
    version: '', // darwin reports version twice unnecessarily
    credits: 'Horizon Blockchain Games – https://horizon.io',
    copyright: '(c) 2017-present Horizon Blockchain Games Inc.'
  })

  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

  const getUserAgent = () => {
    let ua = session.defaultSession.getUserAgent()
    ua = ua.replace('Skyweaver/', `Skyweaver-Desktop/v`)
    return ua
  }

  let windows

  app.on('ready', () => {
    const appUrl = 'https://dev4.skyweaver.net'

    const userAgent = getUserAgent()

    session.defaultSession.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        details.requestHeaders['User-Agent'] = userAgent
        callback({ cancel: false, requestHeaders: details.requestHeaders })
      }
    )

    windows = createWindow('main', {
      width: 1440,
      height: 840,
      darkTheme: true,
      backgroundColor: 'black'
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenu(windows.main)))

    // Register app cache on the main window's network stack
    // registerAppCache(windows.main, userDataPath)

    // Load the local static app
    windows.main.loadURL(
      appUrl,
      {
        httpReferrer: appUrl,
        userAgent: userAgent
      }
      // url.format({
      //   pathname: path.join(__dirname, 'app/index.html'),
      //   protocol: 'file:',
      //   slashes: true
      // })
    )

    // Work-around for electron/chrome 51+ onbeforeunload behavior
    // which prevents the app window to close if not invalidated.
    windows.main.webContents.on('dom-ready', () => {
      windows.main.webContents.executeJavaScript('window.onbeforeunload = null')
    })
  })

  app.on('window-all-closed', () => {
    app.quit()
  })

  app.on('second-instance', (_, args) => finishSequenceAuth(...args))
  app.on('open-url', (_, url) => finishSequenceAuth(url))

  function finishSequenceAuth(...urls) {
    const authURL = urls.find((arg) =>
      arg.startsWith('skyweavermobile://mobile.skyweaver.net/auth#')
    )
    if (!authURL) {
      return
    }

    windows.main.webContents.executeJavaScript(
      `console.log('AUTH URL',\`${authURL}\`)`
    )

    if (!windows.wallet) {
      console.warn(
        "command-line args contain callback url, but wallet window isn't open.. uh oh"
      )
      return
    }

    windows.main.webContents.executeJavaScript(`console.log('HAVE WALLET!!',)`)

    const hash = authURL.substr(authURL.indexOf('/auth#')).substr(1)

    let newLocation = SEQUENCE_WALLET_URL.toString()
    if (newLocation.substr(newLocation.length - 1) !== '/') {
      newLocation += '/'
    }
    newLocation += hash

    windows.main.webContents.executeJavaScript(
      `console.log('got second-instance auth callback, redirecting to:',\`${newLocation}\`)`
    )
    console.log(
      'got second-instance auth callback, redirecting to:',
      newLocation
    )

    // NOTE: instead of doing a full-reload, the wallet-webapp will detect the url
    // change and continue the auth flow from there as though it was a fresh page.
    const code = `(function() {
    window.location.href = '${newLocation}';
    return true;
  })();`
    windows.wallet.show()
    windows.wallet.restore()
    windows.wallet.focus()
    windows.wallet.webContents.executeJavaScript(code)
  }
}
