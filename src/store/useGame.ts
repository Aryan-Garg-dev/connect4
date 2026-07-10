import { useGameStore } from "./useGameStore";

export const useGame = () => {
    const { snapshot, getGame, startGame, makeMove, undoLastMove, resetGame, getCurrentPlayer, canUndo } =
        useGameStore();

    return {
        game: getGame(),
        snapshot,
        startGame,
        makeMove,
        undoLastMove,
        canUndo,
        resetGame,
        getCurrentPlayer,
    };
};
