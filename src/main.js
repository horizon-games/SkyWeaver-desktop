import path from 'path'
import url from 'url'
import { app, Menu, session } from 'electron'
import createWindow from './helpers/window'
import { buildMenu } from './helpers/menu'

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
  ua = ua.replace('Skyweaver/', 'Skyweaver-Desktop/')
  return ua
}

app.on('ready', () => {

  // const appUrl = 'http://localhost:3000'
  const appUrl = 'https://dev5.skyweaver.net'

  const userAgent = getUserAgent()

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = userAgent
    callback({ cancel: false, requestHeaders: details.requestHeaders })
  })

  const mainWindow = createWindow('main', {
    width: 1440,
    height: 840
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenu(mainWindow)))

  // Register app cache on the main window's network stack
  // registerAppCache(mainWindow, userDataPath)

  // Load the local static app
  mainWindow.loadURL(
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
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript("window.onbeforeunload = null")
  })

})

app.on('window-all-closed', () => {
  app.quit()
})
