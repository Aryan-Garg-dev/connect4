import { Player } from "./player";
import type { PlayerJson } from "./player";

export type MoveJson = {
    row: number;
    col: number;
    player: PlayerJson;
};

export class Move {
    constructor(
        readonly row: number,
        readonly col: number,
        readonly player: Player
    ) { }

    toObject = (): MoveJson => ({
        row: this.row,
        col: this.col,
        player: this.player.toObject(),
    });

    static fromObject = (data: MoveJson): Move => {
        return new Move(data.row, data.col, Player.fromObject(data.player));
    };
}
