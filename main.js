const { app, BrowserWindow, Menu, ipcMain }  = require('electron');
const { spawn } = require('child_process');

process.on('uncaughtException', (error) => {

  });

difficulty = "16";
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

    

    menu_template = [
        {
            label:"New Game",
            submenu: [
                {
                    label: "Hard",
                    click: ()=>{
                        window.close();
                        difficulty = "36";
                        create_window();
                    }
                },
                {
                    label: "Medium",
                    click: ()=>{
                        window.close();
                        difficulty = "24"; 
                        create_window();
                    }
                },
                {
                    label: "Easy",
                    click: ()=>{
                        window.close();
                        difficulty = "16";
                        create_window();}
                }
            ]
        },
        //{label:"Dev Tools", role:"toggleDevTools"}
    ];


    app_menu = Menu.buildFromTemplate(menu_template);
    Menu.setApplicationMenu(app_menu);

    function get_new_board()
    {
        //console.log(difficulty);
        brd = "";
        const solver = spawn("./solver", ["new",0, difficulty]);
        solver.stdout.on("data", (data) => {
            window.webContents.send("send_board", data.toString());
        });
    }

    function check_board(board)
    {
        const checker = spawn("./solver", ["check", board]);
        checker.stdout.on("data", (data) => {
            //console.log(data.toString());
            window.webContents.send("submit", data.toString());
        });
    }

    ipcMain.on("send_board", (e, data) => {
        if (data)
            get_new_board();
    })

    ipcMain.on("submit", (e, data) => {
        check_board(data);
    })

}

app.whenReady().then(() => {
    create_window();
});
