const { app, BrowserWindow, Menu}  = require('electron');
const { spawn } = require('child_process');

function get_new_board()
{
    const solver = spawn("./solver", ["new", 0 , Math.floor(Math.random()*2e10)]);
    solver.stdout.on("data", (data) => {console.log(data.toString())})
}

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

    get_new_board();

}

app.whenReady().then(() => {
    create_window();
});

