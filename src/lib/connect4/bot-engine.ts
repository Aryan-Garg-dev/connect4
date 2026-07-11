import { Response } from "../response";
import { Board } from "./board";
import { DiscColor } from "./disc";

export class BotEngine {
    static readonly WINDOW_LENGTH = 4;
    static readonly INF = Number.MAX_SAFE_INTEGER;

    private readonly playerColor: DiscColor;
    constructor(
        private readonly botColor: DiscColor
    ) {
        this.playerColor = botColor == DiscColor.BLUE
            ? DiscColor.RED
            : DiscColor.BLUE;
    }

    /**
     * Returns valid columns sorted by distance from center (center-first).
     * This dramatically improves alpha-beta pruning since center moves
     * are statistically stronger in Connect 4.
     */
    private getValidLocations(board: Board): Array<number> {
        const center = Math.floor(board.cols / 2);
        const validLocations: number[] = [];
        for (let c = 0; c < board.cols; c++) {
            if (board.canPlace(c)) validLocations.push(c);
        }
        // Sort by distance from center (closest first)
        validLocations.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
        return validLocations;
    }

    /**
     * Checks if a specific column wins for a given color.
     * Much cheaper than a full board scan — used for tactical shortcuts.
     */
    private doesMoveWin(board: Board, col: number, color: DiscColor): boolean {
        const row = board.getLowestEmptyRow(col);
        if (row === -1) return false;

        const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (const [dr, dc] of DIRECTIONS) {
            let count = 1;
            // Count in positive direction
            let [nr, nc] = [row + dr, col + dc];
            while (board.getCell(nr, nc)?.color === color) {
                count++;
                [nr, nc] = [nr + dr, nc + dc];
            }
            // Count in negative direction
            [nr, nc] = [row - dr, col - dc];
            while (board.getCell(nr, nc)?.color === color) {
                count++;
                [nr, nc] = [nr - dr, nc - dc];
            }
            if (count >= 4) return true;
        }
        return false;
    }

    private scorePosition(board: Board, color: DiscColor) {
        const boardSnapshot = board.toObject();

        let score = 0;

        // Score center column — heavily reward center control
        const centerColumn = Math.floor(board.cols / 2);
        let centerCount = 0;
        boardSnapshot.grid.forEach((row) => {
            if (row[centerColumn] == color) centerCount++;
        })
        score += centerCount * 6;

        // Also reward adjacent-to-center columns
        const adjCols = [centerColumn - 1, centerColumn + 1].filter(c => c >= 0 && c < board.cols);
        for (const adjCol of adjCols) {
            let adjCount = 0;
            boardSnapshot.grid.forEach((row) => {
                if (row[adjCol] == color) adjCount++;
            });
            score += adjCount * 3;
        }

        // Score horizontal positions
        boardSnapshot.grid.forEach((row) => {
            for (let c = 0; c < board.cols - 3; c++) {
                const window = row.slice(c, c + BotEngine.WINDOW_LENGTH);
                score += this.evaluateWindow(window, color)
            }
        })

        // Score vertical positions
        for (let c = 0; c < board.cols; c++) {
            const column = boardSnapshot.grid.map(row => row[c]);
            for (let r = 0; r < board.rows - 3; r++) {
                const window = column.slice(r, r + BotEngine.WINDOW_LENGTH);
                score += this.evaluateWindow(window, color);
            }
        }

        // Score positive diagonal
        for (let r = 0; r < board.rows - 3; r++) {
            for (let c = 0; c < board.cols - 3; c++) {
                const window = Array.from(
                    { length: BotEngine.WINDOW_LENGTH },
                    (_, i) => boardSnapshot.grid[r + i][c + i]
                );
                score += this.evaluateWindow(window, color);
            }
        }

        // Score negative diagonals
        for (let r = 0; r < board.rows - 3; r++) {
            for (let c = 0; c < board.cols - 3; c++) {
                const window = Array.from(
                    { length: BotEngine.WINDOW_LENGTH },
                    (_, i) => boardSnapshot.grid[r + 3 - i][c + i]
                );
                score += this.evaluateWindow(window, color);
            }
        }

        return score;
    }

    private evaluateWindow(window: Array<DiscColor | null>, color: DiscColor): number {
        let score = 0;
        const opponentColor = color == DiscColor.BLUE ? DiscColor.RED : DiscColor.BLUE;

        let playerPieceCount = 0, opponentPieceCount = 0, emptyCellCount = 0;
        for (let cellColor of window) {
            if (!cellColor) emptyCellCount++;
            else if (cellColor === opponentColor) opponentPieceCount++;
            else playerPieceCount++;
        }

        // Winning position — decisive
        if (playerPieceCount === 4) score += 100000;
        // Three in a row with open spot — very strong
        else if (playerPieceCount === 3 && emptyCellCount == 1) score += 50;
        // Two in a row with two open spots — developing
        else if (playerPieceCount === 2 && emptyCellCount == 2) score += 10;

        // Opponent threats — must be penalised more than own 3-in-a-row
        // to ensure the bot blocks instead of playing elsewhere
        if (opponentPieceCount == 3 && emptyCellCount == 1) score -= 80;
        // Opponent developing — minor concern
        else if (opponentPieceCount == 2 && emptyCellCount == 2) score -= 8;

        return score;
    }

    private isWinning(board: Board, color: DiscColor) {
        const countInDirection = (r: number, c: number, dr: number, dc: number): number => {
            let count = 0;
            let [nr, nc] = [r + dr, c + dc];
            while (board.getCell(nr, nc)?.color === color) {
                count++;
                [nr, nc] = [nr + dr, nc + dc];
            }
            return count;
        }

        const DIRECTIONS: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, -1]];

        for (let r = 0; r < board.rows; r++) {
            for (let c = 0; c < board.cols; c++) {
                if (board.getCell(r, c)?.color !== color) continue;
                for (const [dr, dc] of DIRECTIONS) {
                    const total = 1 + countInDirection(r, c, dr, dc) + countInDirection(r, c, -dr, -dc);
                    if (total >= 4) return true;
                }
            }
        }

        return false;
    }

    private isTerminalNode(board: Board) {
        return this.isWinning(board, DiscColor.BLUE)
            || this.isWinning(board, DiscColor.RED)
            || board.isFull();
    }

    private static random<T>(choices: Array<T>): T {
        const idx = Math.floor(Math.random() * choices.length);
        return choices[idx];
    }

    private minimax(board: Board, depth: number, alpha: number, beta: number, maximisingPlayer: boolean): [(number | null), number] {

        const validLocations = this.getValidLocations(board);

        const isTerminal = this.isTerminalNode(board);

        if (depth == 0 || isTerminal) {
            if (isTerminal) {
                if (this.isWinning(board, this.botColor)) return [null, BotEngine.INF];
                else if (this.isWinning(board, this.playerColor)) return [null, -BotEngine.INF];
                else return [null, 0];
            } else {
                return [null, this.scorePosition(board, this.botColor)]
            }
        }

        // Tactical shortcut: check for immediate wins/blocks before recursing
        const currentColor = maximisingPlayer ? this.botColor : this.playerColor;
        const opponentColor = maximisingPlayer ? this.playerColor : this.botColor;

        // Can we win immediately?
        for (const col of validLocations) {
            if (this.doesMoveWin(board, col, currentColor)) {
                return [col, maximisingPlayer ? BotEngine.INF : -BotEngine.INF];
            }
        }

        // Must we block an immediate opponent win?
        for (const col of validLocations) {
            if (this.doesMoveWin(board, col, opponentColor)) {
                // This column must be played (or we lose next turn)
                const boardCopy = board.copy();
                boardCopy.placeDisc(col, currentColor);
                const futureScore = this.minimax(boardCopy, depth - 1, alpha, beta, !maximisingPlayer)[1];
                return [col, futureScore];
            }
        }

        if (maximisingPlayer) {
            let value = -BotEngine.INF;
            let column = BotEngine.random(validLocations);
            for (let col of validLocations) {
                const boardCopy = board.copy();
                boardCopy.placeDisc(col, this.botColor);
                const newScore = this.minimax(boardCopy, depth - 1, alpha, beta, false)[1];
                if (newScore > value) {
                    value = newScore;
                    column = col;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
            return [column, value];
        } else {
            let value = BotEngine.INF;
            let column = BotEngine.random(validLocations);
            for (let col of validLocations) {
                const boardCopy = board.copy();
                boardCopy.placeDisc(col, this.playerColor);
                const newScore = this.minimax(boardCopy, depth - 1, alpha, beta, true)[1];
                if (newScore < value) {
                    value = newScore;
                    column = col;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) break;
            }
            return [column, value];
        }
    }

    getNextMove(board: Board, depth: number = 8): Response<{ column: number }> {
        const [bestColumn, bestScore] = this.minimax(
            board,
            depth,
            -BotEngine.INF,
            BotEngine.INF,
            true
        );

        if (bestColumn == null) {
            const validLocations = this.getValidLocations(board);
            if (validLocations.length > 0) {
                return {
                    success: true,
                    data: {
                        column: BotEngine.random(validLocations)
                    }
                }
            }
            return {
                success: false,
                message: "No valid moves available. The board is full."
            }
        }

        return {
            success: true,
            data: {
                column: bestColumn
            }
        };
    }
}