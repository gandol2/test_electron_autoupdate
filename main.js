const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater"); // 자동 업데이트 모듈

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile("index.html");
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
  // 업데이트 확인
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("appVersion", event => {
  event.sender.send("appVersion", { version: app.getVersion() });
});

// 자동 업데이트 모듈 이벤트
autoUpdater.on("update-available", () => {
  console.log("최신 업데이트가 존재 합니다.");
  mainWindow.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  console.log("업데이트가 완료 되었습니다.");
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
