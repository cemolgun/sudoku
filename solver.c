#include <stdint.h>
#include <stdbool.h>

typedef struct 
{
    uint8_t col;
    uint8_t row;
    uint8_t gr;
    uint8_t num;
} Sq;

typedef struct 
{
    Sq squares[81];
    Sq* rows[9][9];
    Sq* cols[9][9];
    Sq* groups[9][9];
} Board;

#include <stdio.h>
void print_sq(Sq sq)
{
    printf("Col: %d\nRow: %d\nGroup: %d\nNumber: %d",sq.col, sq.row, sq.gr, sq.num);
}

bool append(Sq* arr[9], Sq* sq)
{
    for (uint8_t i = 0; i < 9; i++)
    {
        if (!arr[i])
        {
            arr[i] = sq;
            return true;
        }
    }
    return false;
}

void generate_board(Board* board)
{
    /*
        ! Don't forget to init board as board = {0} before using this func. 
        ! Otherwise non null pointers will cause problem.
    */

    Sq* squares = board->squares;
    uint8_t g;
    for (uint8_t rw = 0; rw < 9; rw++)
    {
        for (uint8_t cl = 0; cl < 9; cl++)
        {

            squares->col = cl;
            squares->row = rw;
            /* squares->num = 0;    Everything is already set to 0 on board initialization */

            uint8_t gr = 3*(rw/3)+ cl/3;;
            squares->gr =  gr;

            append(board->rows[rw], squares);
            append(board->cols[cl], squares);
            append(board->groups[gr], squares);

            ++squares;
        }
    }
}

void fill_board(Board* board, char* numstr)
{
    for (uint8_t i = 0; i < 81; i++)
    {
        board->squares[i].num = numstr[i] - 48;     /* ASCII: '0' = 48, '1' = 49 ... */
    }
}

void make_new(Board* board)
{

}

int main()
{
    Board board = {0};

    generate_board(&board);

    fill_board(&board, "123982398443985348534958298349345984359298212215615665112321651651154154454556167");

    for (uint8_t i = 0; i < 9; i++)
    {
        for (uint8_t j = 0; j < 9; j++)
        {
            print_sq(*board.groups[i][j]);
            printf("\n\n");
        }
        
    }

}