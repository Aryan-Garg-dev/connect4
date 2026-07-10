import { Board, BoardJson, boardOptions } from "./board";
import { DiscColor } from "./disc";
import { Move, MoveJson } from "./move";
import { Player } from "./player";
import type { PlayerJson } from "./player";
import type { Response } from "../response";

export enum GameState {
    WON = 'WON',
    DRAW = 'DRAW',
    IN_PROGRESS = 'IN_PROGRESS'
}

type CurrentPlayer = 'player1' | 'player2';

export type GameJson = {
    player1: PlayerJson;
    player2: PlayerJson;
    currentPlayer: CurrentPlayer;
    state: GameState;
    board: BoardJson;
    moveHistory: MoveJson[];
};

export class Game {
    private state: GameState;
    private currentPlayer: Player;
    private readonly board: Board;
    private moveHistory: Move[];

    constructor(
        private readonly player1: Player,
        private readonly player2: Player,
        board?: Board,
        state?: GameState,
        currentPlayer?: Player,
        moveHistory?: Move[],
    ) {
        const { rows, cols, discsToWin } = boardOptions.CLASSIC;
        this.board = board ?? new Board(rows, cols, discsToWin);
        this.state = state ?? GameState.IN_PROGRESS;
        this.currentPlayer = currentPlayer ?? player1;
        this.moveHistory = moveHistory ?? [];
    }

    getState() { return this.state; }
    getCurrentPlayer() { return this.currentPlayer; }
    getBoard() { return this.board; }
    getPlayer1() { return this.player1; }
    getPlayer2() { return this.player2; }

    makeMove(column: number, player: Player): Response<Move> {
        if (this.state !== GameState.IN_PROGRESS) {
            return { success: false, message: "The game is already over." };
        }
        if (player !== this.currentPlayer) {
            return { success: false, message: "It is not your turn." };
        }

        const row = this.board.placeDisc(column, player.color);
        if (row === -1) {
            return { success: false, message: "That column is full." };
        }

        const move = new Move(row, column, player);
        this.moveHistory.push(move);

        if (this.checkWin(row, column, player.color)) {
            this.state = GameState.WON;
        } else if (this.board.isFull()) {
            this.state = GameState.DRAW;
        } else {
            this.currentPlayer = (player === this.player1) ? this.player2 : this.player1;
        }

        return { success: true, data: move };
    }

    countDiscsInDirection = (r: number, c: number, dr: number, dc: number, color: DiscColor): number => {
        let count = 0;
        let [nr, nc] = [r + dr, c + dc];
        let cell = this.board.getCell(nr, nc);
        while (cell != null && cell.color === color) {
            count++;
            [nr, nc] = [nr + dr, nc + dc];
            cell = this.board.getCell(nr, nc);
        }
        return count;
    }

    private static readonly DIRECTIONS: Array<[number, number]> = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    checkWin = (row: number, column: number, color: DiscColor): boolean => {
        if (row < 0 || row >= this.board.rows || column < 0 || column >= this.board.cols)
            return false;
        for (const [dr, dc] of Game.DIRECTIONS) {
            const count = 1
                + this.countDiscsInDirection(row, column, dr, dc, color)
                + this.countDiscsInDirection(row, column, -dr, -dc, color);
            if (count >= 4) return true;
        }
        return false;
    }

    canUndo(): boolean {
        return this.moveHistory.length > 0;
    }

    undoLastMove(): Response<Move> {
        if (this.moveHistory.length === 0) {
            return { success: false, message: "No moves to undo." };
        }
        const lastMove = this.moveHistory.pop()!;
        this.board.removeDisc(lastMove.row, lastMove.col);
        this.state = GameState.IN_PROGRESS;
        this.currentPlayer = lastMove.player;
        return { success: true, data: lastMove };
    }

    getLastMove(): Move | undefined {
        return this.moveHistory.at(-1);
    }

    toObject = (): GameJson => {
        const currentPlayer: CurrentPlayer =
            this.currentPlayer === this.player1 ? 'player1' : 'player2';

        return {
            player1: this.player1.toObject(),
            player2: this.player2.toObject(),
            currentPlayer,
            state: this.state,
            board: this.board.toObject(),
            moveHistory: this.moveHistory.map(m => m.toObject()),
        };
    }

    static fromObject = (data: GameJson): Game => {
        const p1 = Player.fromObject(data.player1);
        const p2 = Player.fromObject(data.player2);
        const board = Board.fromObject(data.board);
        const state = data.state;
        const currentPlayer = data.currentPlayer === 'player1' ? p1 : p2;
        const moveHistory = data.moveHistory.map(mj => {
            const player = mj.player.name === p1.name ? p1 : p2;
            return new Move(mj.row, mj.col, player);
        });
        return new Game(p1, p2, board, state, currentPlayer, moveHistory);
    }
}
