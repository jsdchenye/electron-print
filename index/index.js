const { ipcRenderer } = require('electron');

const printBtn = document.getElementById('print-btn');
const webview = document.getElementById('print-webview');

var deviceName = '';

// 渲染线程主动发送 getPrinterList 事件到主线程请求打印机列表
ipcRenderer.send('getPrinterList');
// 监听主线程获取到打印机列表后的回调
ipcRenderer.once('getPrinterList', (event, data) => {
  //data就是打印机列表
  deviceName = (data[0] && data[0].name) || '';
});


printBtn.addEventListener('click', () => {
  // 将 webview 的src中引入的文件，发送 webview-print-render 事件，询问起是否渲染完，可以执行打印
  webview.send('webview-print-render', deviceName);
});

// 当 webview 中引入的文件执行了 ipcRenderer.sendToHost 发送事件之后，就会触发执行下面操作
onload = () => {
  webview.addEventListener('ipc-message', () => {
    if (event.channel === 'webview-print-do') {
      webview.print({
        silent: true,
        printBackground: true,
        deviceName: deviceName,
      }, (data) => { console.log("webview success", data); });
    }
  });
};
