const { app, BrowserWindow } = require('electron');

const create_window = () => {
    const window = new BrowserWindow({
        width: 500,
        height: 500,
        title: "Sudoku"
  });
  window.loadFile("./window/window.html");
}

app.whenReady().then(() => {
    create_window();
});