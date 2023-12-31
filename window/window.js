const electron = require("electron");
const { ipcRenderer } = electron;

selected_sq = 0;

board = document.querySelector(".board");
class BoardSq
{
    constructor(index, value)
    {
        this.set_by_pc = false;
        this.index = index;
        this.value = value;
        this.row = Math.floor(index/9);
        this.col = index%9;
        
        this.doc_sq = document.createElement("div");
        this.doc_sq.classList.add("board-sq");
        this.doc_sq.textContent = this.value;

        if (this.col == 2 || this.col == 5)
        {
            this.doc_sq.classList.add("vertical-line-right");
        }
        else if (this.col == 3 || this.col == 6)
        {
            this.doc_sq.classList.add("vertical-line-left");
        }
        if (this.row == 2 || this.row == 5)
        {
            this.doc_sq.classList.add("horizontal-line-bottom");
        }
        else if (this.row == 3 || this.row == 6)
        {
            this.doc_sq.classList.add("horizontal-line-top");
        }
    }

    add_to_board()
    {
        board.append(this.doc_sq);
        this.doc_sq.addEventListener("click", ()=>{
            if (selected_sq) 
                selected_sq.doc_sq.setAttribute("selected-sq", false);

            this.doc_sq.setAttribute("selected-sq", true);
            selected_sq = this;
        })
    }

    update(value)
    {
        if (this.set_by_pc)
            return;
        this.value = value;
        this.doc_sq.textContent = this.value;
    }

    set_square(value)
    {
        if (value != "0")
        {
            this.update(value);
            this.set_by_pc = true;
            this.doc_sq.classList.add("set-by-pc");
        }
    }

}

panel = document.querySelector(".panel");
class Button
{
    constructor(num)
    {
        this.num = num.toString();
        this.doc_button = document.createElement("div");
        this.doc_button.classList.add("button");
        this.doc_button.textContent = this.num;
    }
    add_to_board()
    {
        panel.append(this.doc_button);
        this.doc_button.addEventListener("click", ()=>{this.click()})
    }
    click()
    {
        selected_sq.update(this.num);
    }


}

board_sq_list = [];
for (i = 0; i<81; i++)
{
    sq = new BoardSq(i);
    board_sq_list.push(sq);
    sq.add_to_board();
}

button_list = []
for (i = 1; i<10; i++)
{
    button = new Button(i);
    button_list.push(button);
    button.add_to_board();
}

function del()
{
    selected_sq.update();
}

function del_all()
{
    for (i = 0; i<81; i++)
    {
        board_sq_list[i].update();
    }
}

function submit()
{
    check_string = "";
    for (i = 0; i<81; i++)
        if (board_sq_list[i].value)
            check_string += board_sq_list[i].value;
        else
            check_string += "0";
    
    ipcRenderer.send("submit", check_string);
    ipcRenderer.on("submit", (e, data) => {
        if (data == "true")
        {
            document.querySelector(".result").textContent = "Correct";
            document.querySelector(".result").style = "visibility: visible";
            ipcRenderer.removeListener("submit");
        }
        if (data == "false")
        {
            document.querySelector(".result").textContent = "Incorrect";
            document.querySelector(".result").style = "visibility: visible";
            ipcRenderer.removeListener("submit");
        }
    });
}

document.querySelector(".del").addEventListener("click", del);
document.querySelector(".del-all").addEventListener("click", del_all);
document.querySelector(".submit").addEventListener("click", submit);


document.addEventListener("keydown", (e)=>{
    if (key_num = parseInt(e.key))
    {
        console.log(key_num);
        button_list[key_num-1].click();
    }
    else if (e.key == "Backspace" || e.key == "Delete")
    {
        if (e.shiftKey)
            del_all();
        else
            del();
    }
    
});

document.addEventListener("click", (e)=>{document.querySelector(".result").style = "visibility: hidden";})

ipcRenderer.send("send_board", "send_board");
ipcRenderer.on("send_board", (e, data) => {
    for (i = 0; i < 81; i++)
        board_sq_list[i].set_square(data[i]);
});