import { useGameStore } from "./useGameStore";

export const useGame = () => {
    const {
        snapshot,
        getGame,
        startGame,
        makeMove,
        makeBotMove,
        undoLastMove,
        resetGame,
        getCurrentPlayer,
        canUndo,
        isBotGame,
        isBotThinking,
    } = useGameStore();

    return {
        game: getGame(),
        snapshot,
        startGame,
        makeMove,
        makeBotMove,
        undoLastMove,
        canUndo,
        resetGame,
        getCurrentPlayer,
        isBotGame,
        isBotThinking,
    };
};
