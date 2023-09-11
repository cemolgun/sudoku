const { app, BrowserWindow, Menu}  = require('electron');

const create_window = () => {

    const window = new BrowserWindow({
        width: 480,
        height: 480,
        title: "Sudoku",
        maximizable : false, // doesn't work on linux..
        icon : "./assets/icon.png"
    });
    window.loadFile("./window/window.html");
    window.setAspectRatio(1);

    menu_template = [{label:"Sudoku"},{label:"Dev Tools", role:"toggleDevTools"}];
    app_menu = Menu.buildFromTemplate(menu_template);
    Menu.setApplicationMenu(app_menu);

}

app.whenReady().then(() => {
    create_window();
});