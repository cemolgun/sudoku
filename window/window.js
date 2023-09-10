board = document.querySelector(".board");
class BoardSq
{
    constructor(index, value)
    {
        this.index = index;
        this.value = value;
        this.row = index/9;
        this.col = index%9;
        
        this.doc_sq = document.createElement("div");
        this.doc_sq.classList.add("board-sq");
        this.doc_sq.textContent = this.num;
    }

    add_to_board()
    {
        board.append(this.doc_sq);
    }

    update(num)
    {
        this.num = num;
        this.doc_sq.textContent = this.num;
    }

}

panel = document.querySelector(".panel");
class Button
{
    constructor(num)
    {
        this.num = num;
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
        console.log(`Clickled ${this.num}`)
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

document.addEventListener("keydown", (e)=>{
    if (key_num = parseInt(e.key))
    {
        console.log(key_num);
        button_list[key_num-1].click();
    }
});