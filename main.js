const { app, BrowserWindow, Menu, ipcMain }  = require('electron');
const { spawn } = require('child_process');

const create_window = () => {

    const window = new BrowserWindow({
        width: 480,
        height: 480,
        title: "Sudoku",
        maximizable : false, // doesn't work on linux..
        icon : "./assets/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    window.loadFile("./window/window.html");
    window.setAspectRatio(1);

    menu_template = [{label:"Sudoku"},{label:"Dev Tools", role:"toggleDevTools"}];
    app_menu = Menu.buildFromTemplate(menu_template);
    Menu.setApplicationMenu(app_menu);

    function get_new_board()
    {
        brd = "";
        const solver = spawn("./solver", [0,0]);
        solver.stdout.on("data", (data) => {
            window.webContents.send("board", data.toString());
        });
    }

    get_new_board();
}

app.whenReady().then(() => {
    create_window();
});
