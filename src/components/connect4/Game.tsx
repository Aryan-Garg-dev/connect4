import { useEffect, useRef } from 'react';
import { useGame } from '../../store/useGame';
import { Player } from '../../lib/connect4/player';
import { GameState } from '../../lib/connect4/game';
import PlayerRegistration from './PlayerRegistration';
import GameBoard from './GameBoard';

const Game = () => {
    const {
        snapshot,
        startGame,
        makeMove,
        makeBotMove,
        undoLastMove,
        canUndo,
        resetGame,
        isBotGame,
        isBotThinking,
    } = useGame();

    // Track the move count to trigger bot moves only on new human moves
    const prevMoveCountRef = useRef<number>(0);

    const handleStartGame = (p1: Player, p2: Player, botGame: boolean) => {
        startGame(p1, p2, botGame);
    };

    const handlePlayAgain = () => {
        if (!snapshot) return;
        // Restart with the same players
        const p1 = Player.fromObject(snapshot.player1);
        const p2 = Player.fromObject(snapshot.player2);
        startGame(p1, p2, isBotGame);
    };

    // Trigger bot move when it's the bot's turn
    useEffect(() => {
        if (!snapshot || !isBotGame) return;
        if (snapshot.state !== GameState.IN_PROGRESS) return;
        if (snapshot.currentPlayer !== 'player2') return;
        if (isBotThinking) return;

        const currentMoveCount = snapshot.moveHistory.length;
        if (currentMoveCount > prevMoveCountRef.current) {
            prevMoveCountRef.current = currentMoveCount;
            makeBotMove();
        }
    }, [snapshot, isBotGame, isBotThinking, makeBotMove]);

    // Keep ref in sync when moves change (e.g., undo, reset)
    useEffect(() => {
        if (snapshot) {
            prevMoveCountRef.current = snapshot.moveHistory.length;
        } else {
            prevMoveCountRef.current = 0;
        }
    }, [snapshot?.moveHistory.length]);

    // Phase 1: Registration (no active game)
    if (!snapshot) {
        return <PlayerRegistration onStartGame={handleStartGame} />;
    }

    // Phase 2: Gameplay
    return (
        <GameBoard
            snapshot={snapshot}
            onMakeMove={makeMove}
            onUndo={undoLastMove}
            onReset={resetGame}
            onPlayAgain={handlePlayAgain}
            canUndo={canUndo()}
            isBotThinking={isBotThinking}
            isBotGame={isBotGame}
        />
    );
};

export default Game;