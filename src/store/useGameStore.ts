import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Game, GameJson } from "../lib/connect4/game";
import { Player } from "../lib/connect4/player";

interface GameStore {
    snapshot: GameJson | null;
    getGame: () => Game | null;
    startGame: (p1: Player, p2: Player) => void;
    makeMove: (column: number) => boolean;
    undoLastMove: () => boolean;
    canUndo: () => boolean;
    resetGame: () => void;
    getCurrentPlayer: () => Player | null;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            snapshot: null,

            getGame: () => {
                const snap = get().snapshot;
                return snap ? Game.fromObject(snap) : null;
            },

            startGame: (p1: Player, p2: Player) => {
                const game = new Game(p1, p2);
                set({ snapshot: game.toObject() });
                toast.success("Game started!");
            },

            makeMove: (column: number) => {
                const game = get().getGame();
                if (!game) {
                    toast.error("No active game.");
                    return false;
                }

                const result = game.makeMove(column, game.getCurrentPlayer());

                if (result.success) {
                    set({ snapshot: game.toObject() });
                } else {
                    toast.error(result.message);
                }

                return result.success;
            },

            undoLastMove: () => {
                const game = get().getGame();
                if (!game) {
                    toast.error("No active game.");
                    return false;
                }

                const result = game.undoLastMove();

                if (result.success) {
                    set({ snapshot: game.toObject() });
                    toast.info("Move undone.");
                } else {
                    toast.error(result.message);
                }

                return result.success;
            },

            canUndo: () => {
                const game = get().getGame();
                return game ? game.canUndo() : false;
            },

            resetGame: () => {
                set({ snapshot: null });
                toast.success("Game reset.");
            },

            getCurrentPlayer: () => {
                const game = get().getGame();
                return game ? game.getCurrentPlayer() : null;
            },
        }),
        { name: "connect4-game" }
    )
);
