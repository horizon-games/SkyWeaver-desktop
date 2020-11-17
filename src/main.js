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

if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'Skyweaver',
    credits: 'Horizon Blockchain Games \n https://horizon.io',
    copyright: '(c) 2019-present Horizon Blockchain Games Inc.'
  })
}

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.on('ready', () => {

  // const appUrl = 'https://dev5.skyweaver.net'
  // const appUrl = 'http://localhost:3000'
  const appUrl = 'https://beta.skyweaver.net'

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome'
    // details.requestHeaders["Referer"] = appUrl
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
      httpReferrer: appUrl
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
