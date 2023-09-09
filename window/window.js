board = document.querySelector(".board");
class BoardSq
{
    constructor(num, is_set, row, col)
    {
        this.row = row;
        this.col = col;
        this.num = num;
        this.is_set = is_set;
        
        this.doc_sq = document.createElement("div");
        this.doc_sq.classList.add("board-sq");
        this.doc_sq.textContent = this.num;
    }

    add_to_board()
    {
        board.append(this.doc_sq);
    }

}

board_sq_list = [];
for (i = 0; i<81; i++)
{
    sq = new BoardSq(i, false, 2, 3);
    board_sq_list.push(sq);
    sq.add_to_board();
}