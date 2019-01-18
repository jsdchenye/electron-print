const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')

let mainWindow = null;
// 是否是 debug 模式
const debug = /--debug/.test(process.argv[2]);

function init () {
  // 创建用来交互的 window 窗口
  function createWindow() {
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
    };
    mainWindow = new BrowserWindow(windowOptions);
    mainWindow.loadURL(path.join('file://', __dirname, '/index/index.html'));

    if (debug) {
      mainWindow.webContents.openDevTools();
      mainWindow.maximize();
      require('devtron').install();
    }
    mainWindow.on('closed', () => { mainWindow = null; });
    // 监听获取打印机列表事件
    ipcMain.on('getPrinterList', (event) => {
      //主线程获取打印机列表
      const list = mainWindow.webContents.getPrinters();
      //通过webContents发送事件到渲染线程，同时将打印机列表也传过去
      mainWindow.webContents.send('getPrinterList', list);
  });
  };

  app.on('ready', () => {
    createWindow();
  });
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  })
}
// 执行初始化
init();