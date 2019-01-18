const { ipcRenderer } = require('electron');

const printBtn = document.getElementById('print-btn');
const webview = document.getElementById('print-webview');

printBtn.addEventListener('click', () => {
  // 将 webview 的src中引入的文件，发送 webview-print-render 事件，询问起是否渲染完，可以执行打印
  webview.send('webview-print-render', 'Gprinter_GP_58');
});

// 当 webview 中引入的文件执行了 ipcRenderer.sendToHost 发送事件之后，就会触发执行下面操作
webview.addEventListener('ipc-message', () => {
  if (event.channel === 'webview-print-do') {
    webview.print({
      silent: true,
      printBackground: true,
      deviceName: 'Gprinter_GP_58',
    }, (data) => { console.log("webview success", data); });
  }
});