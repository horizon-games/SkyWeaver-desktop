!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}([function(e,t){e.exports=require("electron")},function(e,t){e.exports=require("fs-jetpack")},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("url")},function(e){e.exports=JSON.parse('{"name":"SkyWeaver","version":"0.3.0","description":"SkyWeaver for Desktop","author":"Team Horizon <info@horizongames.net>","credits":"Horizon Blockchain Games https://horizongames.net","license":"MIT","homepage":"https://github.com/horizon-games/SkyWeaver-desktop","main":"build/main.js","build":{"productName":"SkyWeaver","appId":"net.horizongames.skyweaver","files":["build/**/*","resources/**"],"directories":{"buildResources":"resources"},"win":{"target":["portable"]},"mac":{"target":["dmg"]},"linux":{"target":["tar.gz","AppImage"]}},"scripts":{"dev":"node scripts/start.js","clean":"rimraf dist","build":"webpack --mode production --color --config=webpack.config.js --env=production","pack":"yarn dist:all --dir","dist":"yarn build && electron-builder","dist:all":"yarn dist -wml","dist:windows":"yarn dist -w","dist:mac":"yarn dist -m","dist:linux":"yarn dist -l"},"dependencies":{"electron-fetch":"^1.2.1","fs-jetpack":"^2.1.0"},"devDependencies":{"@babel/core":"7.10.4","@babel/preset-env":"7.10.4","babel-loader":"8.1.0","electron":"9.1.0","electron-builder":"22.7.0","request":"^2.88.0","rimraf":"^3.0.2","source-map-support":"^0.5.9","webpack":"4.43.0","webpack-cli":"^3.1.0","webpack-node-externals":"2.3.0"}}')},function(e,t,r){"use strict";r.r(t);r(2),r(3);var n=r(0),o=r(1),i=r.n(o),a=(e,t)=>{const r=i.a.cwd(n.app.getPath("userData")),o=`window-state-${e}.json`,a={width:t.width,height:t.height};let s,l={};var c;return c=(()=>{let e={};try{e=r.read(o,"json")}catch(e){}return Object.assign({},a,e)})(),l=n.screen.getAllDisplays().some(e=>((e,t)=>e.x>=t.x&&e.y>=t.y&&e.x+e.width<=t.x+t.width&&e.y+e.height<=t.y+t.height)(c,e.bounds))?c:(()=>{const e=n.screen.getPrimaryDisplay().bounds;return Object.assign({},a,{x:(e.width-a.width)/2,y:(e.height-a.height)/2})})(),t={...t,webPreferences:{nodeIntegration:!1,nodeIntegrationInWorker:!1,allowRunningInsecureContent:!1}},s=new n.BrowserWindow(Object.assign({},t,l)),s.on("close",()=>{s.isMinimized()||s.isMaximized()||Object.assign(l,(()=>{const e=s.getPosition(),t=s.getSize();return{x:e[0],y:e[1],width:t[0],height:t[1]}})()),r.write(o,l,{atomic:!0})}),s};r(4);n.app.getPath("userData");"darwin"===process.platform&&n.app.setAboutPanelOptions({applicationName:"SkyWeaver",credits:"Horizon Blockchain Games \n https://horizongames.net",copyright:"(c) 2019-present Horizon Blockchain Games Inc."}),n.app.on("ready",()=>{const e=a("main",{width:1440,height:840});n.Menu.setApplicationMenu(n.Menu.buildFromTemplate(function(e){let t=[];return"darwin"===process.platform?t.push({label:n.app.getName(),submenu:[{role:"about"},{type:"separator"},{role:"services",submenu:[]},{type:"separator"},{role:"hide"},{role:"hideothers"},{role:"unhide"},{type:"separator"},{role:"quit"}]}):t.push({label:"File",submenu:[{role:"quit"}]}),t.push({label:"Edit",submenu:[{role:"undo"},{role:"redo"},{type:"separator"},{role:"cut"},{role:"copy"},{role:"paste"},{role:"selectall"}]},{role:"window",submenu:[{label:"Full Screen",accelerator:"F11",click:()=>{const t=!e.isFullScreen();e.setMenuBarVisibility(!t),e.setFullScreen(t)}},{label:"Windowed",click:()=>{e.setMenuBarVisibility(!0),e.setFullScreen(!1)}},{role:"minimize"}]},{label:"Inspector",submenu:[{label:"Toggle DevTools",accelerator:"Alt+CmdOrCtrl+I",click:()=>{n.BrowserWindow.getFocusedWindow().toggleDevTools()}}]},{role:"help",submenu:[{label:"Learn More",click:()=>{n.shell.openExternal("https://www.skyweaver.net")}}]}),t}(e))),e.loadURL("https://beta.skyweaver.net/"),e.webContents.on("dom-ready",()=>{e.webContents.executeJavaScript("window.onbeforeunload = null")})}),n.app.on("window-all-closed",()=>{n.app.quit()})}]);