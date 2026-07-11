import { Disc, DiscColor } from "./disc";

export type BoardJson = {
    rows: number;
    cols: number;
    discsToWin: number;
    grid: Array<Array<DiscColor | null>>;
};

export const boardOptions = {
    CLASSIC: {
        rows: 6,
        cols: 7,
        discsToWin: 4
    }
}

export const getEmptyBoard = (rows: number, cols: number) => Array.from(
    { length: rows },
    () => Array.from(
        { length: cols },
        () => null
    )
);

export class Board {
    private readonly grid: Array<Array<Disc | null>>;
    constructor(
        readonly rows: number,
        readonly cols: number,
        readonly discsToWin: number
    ) {
        this.grid = getEmptyBoard(rows, cols);
    }

    getLowestEmptyRow = (column: number): number => {
        for (let i = this.rows - 1; i >= 0; i--)
            if (this.grid[i][column] == null) return i;
        return -1;
    }

    getCell = (r: number, c: number): Disc | null => {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return null;
        return this.grid[r][c];
    }

    canPlace = (column: number): boolean => {
        return this.getLowestEmptyRow(column) != -1;
    }

    placeDisc = (column: number, color: DiscColor): number => {
        if (column < 0 || column >= this.cols) return -1;
        const row = this.getLowestEmptyRow(column);
        if (row == -1) return -1;
        this.grid[row][column] = new Disc(color);
        return row;
    }

    isFull = (): boolean => {
        return this.grid[0].every(cell => cell !== null);
    }

    removeDisc = (row: number, col: number): void => {
        this.grid[row][col] = null;
    }

    copy = () => {
        const copy = new Board(this.rows, this.cols, this.discsToWin);
        this.grid.forEach((row, r) => {
            row.forEach((disc, c) => {
                if (disc !== null) {
                    copy.grid[r][c] = new Disc(disc.color);
                }
            });
        });
        return copy;
    }

    toObject = (): BoardJson => {
        return {
            rows: this.rows,
            cols: this.cols,
            discsToWin: this.discsToWin,
            grid: this.grid.map(row => row.map(cell => cell?.color ?? null)),
        };
    }

    static fromObject = (data: BoardJson): Board => {
        const board = new Board(data.rows, data.cols, data.discsToWin);
        data.grid.forEach((row, r) => {
            row.forEach((color, c) => {
                if (color !== null) {
                    board.grid[r][c] = new Disc(color);
                }
            });
        });
        return board;
    }

}
