#include <stdint.h>
#include <stdbool.h>
#include <time.h>
#include <stdlib.h>

char* empty = "000000000000000000000000000000000000000000000000000000000000000000000000000000000";

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

bool append_sq(Sq* arr[9], Sq* sq)
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
        * Calculates the columns rows and groups
        * Writes the pointers to the col row and gr arrays

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

            append_sq(board->rows[rw], squares);
            append_sq(board->cols[cl], squares);
            append_sq(board->groups[gr], squares);

            ++squares;
        }
    }
}

void fill_board(Board* board, char* numstr) /* Fill the board with given char array */
{
    for (uint8_t i = 0; i < 81; i++)
    {
        board->squares[i].num = numstr[i] - 48;     /* ASCII: '0' = 48, '1' = 49 ... */
    }
}

uint8_t array_qty(uint8_t arr[9])   /* Returns the index of first 0 */
{
    for (uint8_t i = 0; i < 9; i++)
    {
        if (!arr[i])
            return i;
    }
}

bool append_num(uint8_t arr[9], uint8_t num)
{
    for (uint8_t i = 0; i < 9; i++)
    {
        if (!arr[i])
        {
            arr[i] = num;
            return true;
        }
    }
    return false;
}

typedef struct
{
    uint8_t qty;
    uint8_t arr[9];
} PossibleNums;

bool calc_possible_nums(PossibleNums* possible_nums, Sq* col[], Sq* row[], Sq* gr[])
{
    /*
        * Fills the possible_arr with numbers that are not in columns rows or groups
        * Returns the number of non 0 numbers in array
        
        ! Don't forget to init possible_arr = {0}
    */

    for (uint8_t i = 1; i < 10; i++)
    {
        bool add = true;
        for (uint8_t j = 0; j < 9; j++)
        {
            if (col[j]->num == i || row[j]->num == i || gr[j]->num == i)
            {
                add = false;
                break;
            }
        }
        if (add)
            append_num(possible_nums->arr, i);
    }
    return (possible_nums->qty = array_qty(possible_nums->arr));
}

bool is_possible(PossibleNums* pn, uint8_t num) /* Checks if num is in possible numbers */
{
    for (uint8_t i = 0; i < pn->qty ; i++)
    {
        if (pn->arr[i] == num)
            return true;
    }
    return false;
}

bool check(Board* board)
{
    /* 
        * If board is full checks every element and returns true or false accordingly
        * If board is filled wrong way returns false wheter it is full or half filled.
    */

    for (uint8_t i = 0; i < 81; i++)
    {
        PossibleNums possible_nums = {0};

        uint8_t current_num = board->squares[i].num;
        board->squares[i].num = 0;

        calc_possible_nums(&possible_nums,
                            board->cols[board->squares[i].col],
                            board->rows[board->squares[i].row],
                            board->groups[board->squares[i].gr]);

        board->squares[i].num = current_num;

        if (!is_possible(&possible_nums, board->squares[i].num))
            return false;
    }
    return true;
}

void create_new(Board* board)
{

    /*
        * Creates a new solved board.
        * Assigns random numbers from possible nums array.
        * If random assignments cause impropriety ereases the board and starts over.
    */

    fill_board(board, empty);

    for (uint8_t i = 0; i < 81; i++)
    {
        PossibleNums possible_nums = {0};        
        calc_possible_nums(&possible_nums,
                            board->cols[board->squares[i].col],
                            board->rows[board->squares[i].row],
                            board->groups[board->squares[i].gr]);

        if (!possible_nums.qty)
        {
            fill_board(board, empty);
            i = -1;
            continue;
        }
        else
            board->squares[i].num = possible_nums.arr[rand()%possible_nums.qty];
    }

}

int main(int argc, char* argv[])
{
    int seed;
    if (argv[1])
        seed = atoi(argv[1]);
    else
        seed = time(NULL);

    srand(seed);

    Board board = {0};
    generate_board(&board);
    
    create_new(&board);

    printf("\n\n");
    printf("%d", check(&board));
    printf("\n\n");

    board.squares[74].num = 0;

    for (int i = 0; i < 81; i++)
    {
        printf("%d", board.squares[i].num);
    }
    printf("\n\n");
    printf("%d", check(&board));

}