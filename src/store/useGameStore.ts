import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { Game, GameJson, GameState } from "../lib/connect4/game";
import { Player } from "../lib/connect4/player";
import { Board } from "../lib/connect4/board";
import { BotEngine } from "../lib/connect4/bot-engine";
import { triggerErrorToast, triggerInfoToast, triggerSuccessToast } from "../lib/haptics";

interface GameStore {
    snapshot: GameJson | null;
    isBotGame: boolean;
    isBotThinking: boolean;
    getGame: () => Game | null;
    startGame: (p1: Player, p2: Player, isBotGame?: boolean) => void;
    makeMove: (column: number) => boolean;
    makeBotMove: () => void;
    undoLastMove: () => boolean;
    canUndo: () => boolean;
    resetGame: () => void;
    getCurrentPlayer: () => Player | null;
}

export const useGameStore = create<GameStore>()(
    persist(
        (set, get) => ({
            snapshot: null,
            isBotGame: false,
            isBotThinking: false,

            getGame: () => {
                const snap = get().snapshot;
                return snap ? Game.fromObject(snap) : null;
            },

            startGame: (p1: Player, p2: Player, isBotGame: boolean = false) => {
                const game = new Game(p1, p2);
                set({ snapshot: game.toObject(), isBotGame, isBotThinking: false });
                toast.success("Game started!");
                triggerSuccessToast();
            },

            makeMove: (column: number) => {
                const game = get().getGame();
                if (!game) {
                    toast.error("No active game.");
                    triggerErrorToast();
                    return false;
                }

                const result = game.makeMove(column, game.getCurrentPlayer());

                if (result.success) {
                    set({ snapshot: game.toObject() });
                } else {
                    toast.error(result.message);
                    triggerErrorToast();
                }

                return result.success;
            },

            makeBotMove: () => {
                const { snapshot, isBotGame } = get();
                if (!snapshot || !isBotGame) return;
                if (snapshot.state !== GameState.IN_PROGRESS) return;
                if (snapshot.currentPlayer !== 'player2') return;

                set({ isBotThinking: true });

                // Add a delay so the bot move feels natural
                setTimeout(() => {
                    const game = get().getGame();
                    if (!game) {
                        set({ isBotThinking: false });
                        return;
                    }

                    const board = Board.fromObject(game.getBoard().toObject());
                    const botColor = game.getPlayer2().color;
                    const engine = new BotEngine(botColor);
                    const result = engine.getNextMove(board);

                    if (result.success) {
                        const moveResult = game.makeMove(result.data.column, game.getCurrentPlayer());
                        if (moveResult.success) {
                            set({ snapshot: game.toObject(), isBotThinking: false });
                        } else {
                            set({ isBotThinking: false });
                        }
                    } else {
                        set({ isBotThinking: false });
                    }
                }, 800);
            },

            undoLastMove: () => {
                const game = get().getGame();
                if (!game) {
                    toast.error("No active game.");
                    triggerErrorToast();
                    return false;
                }

                const { isBotGame } = get();

                if (isBotGame) {
                    // In bot mode, undo two moves (bot's + human's) to get back to human's turn
                    // First undo the bot's move (if the current turn is human's, the last move was bot's)
                    const firstUndo = game.undoLastMove();
                    if (!firstUndo.success) {
                        toast.error(firstUndo.message);
                        triggerErrorToast();
                        return false;
                    }
                    // Then undo the human's move
                    const secondUndo = game.undoLastMove();
                    if (!secondUndo.success) {
                        // If second undo fails, we still have the first undo applied
                        set({ snapshot: game.toObject() });
                        toast.info("Move undone.");
                        triggerInfoToast();
                        return true;
                    }
                    set({ snapshot: game.toObject(), isBotThinking: false });
                    toast.info("Moves undone.");
                    triggerInfoToast();
                    return true;
                }

                const result = game.undoLastMove();

                if (result.success) {
                    set({ snapshot: game.toObject() });
                    toast.info("Move undone.");
                    triggerInfoToast();
                } else {
                    toast.error(result.message);
                    triggerErrorToast();
                }

                return result.success;
            },

            canUndo: () => {
                const game = get().getGame();
                if (!game) return false;
                const { isBotGame, isBotThinking } = get();
                if (isBotThinking) return false;
                if (isBotGame) {
                    // Need at least 2 moves to undo in bot mode (human + bot)
                    // But also allow undo if it's the human's turn and there are moves
                    return game.canUndo();
                }
                return game.canUndo();
            },

            resetGame: () => {
                set({ snapshot: null, isBotGame: false, isBotThinking: false });
                toast.success("Game reset.");
                triggerSuccessToast();
            },

            getCurrentPlayer: () => {
                const game = get().getGame();
                return game ? game.getCurrentPlayer() : null;
            },
        }),
        {
            name: "connect4-game",
            partialize: (state) => ({
                snapshot: state.snapshot,
                isBotGame: state.isBotGame,
            }),
        }
    )
);
