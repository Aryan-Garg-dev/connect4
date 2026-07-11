import { useEffect, useRef } from 'react';
import { useGame } from '../../store/useGame';
import { Player } from '../../lib/connect4/player';
import { GameState } from '../../lib/connect4/game';
import { useGameHaptics } from '../../hooks/useGameHaptics';
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

    const haptics = useGameHaptics();

    // Track the move count to trigger bot moves only on new human moves
    const prevMoveCountRef = useRef<number>(0);

    // Track previous game state to detect transitions
    const prevGameStateRef = useRef<GameState | null>(null);
    const prevBotThinkingRef = useRef<boolean>(false);

    const handleStartGame = (p1: Player, p2: Player, botGame: boolean) => {
        startGame(p1, p2, botGame);
        haptics.onStart();
    };

    const handlePlayAgain = () => {
        if (!snapshot) return;
        // Restart with the same players
        const p1 = Player.fromObject(snapshot.player1);
        const p2 = Player.fromObject(snapshot.player2);
        startGame(p1, p2, isBotGame);
        haptics.onStart();
    };

    const handleMakeMove = (col: number) => {
        const success = makeMove(col);
        if (success) {
            haptics.onMakeMove();
        } else {
            haptics.onInvalidMove();
        }
        return success;
    };

    const handleUndo = () => {
        const success = undoLastMove();
        if (success) {
            haptics.onUndo();
        }
        return success;
    };

    const handleReset = () => {
        resetGame();
        haptics.onReset();
    };

    // Detect game-over state transitions for win/draw/lose haptics
    useEffect(() => {
        if (!snapshot) {
            prevGameStateRef.current = null;
            return;
        }

        const prevState = prevGameStateRef.current;
        const currentState = snapshot.state;

        // Only fire haptics on the transition from IN_PROGRESS to a terminal state
        if (prevState === GameState.IN_PROGRESS && currentState !== GameState.IN_PROGRESS) {
            if (currentState === GameState.DRAW) {
                haptics.onDraw();
            } else if (currentState === GameState.WON) {
                // Determine if the human won or lost (in bot mode)
                const lastMove = snapshot.moveHistory[snapshot.moveHistory.length - 1];
                if (isBotGame && lastMove?.player.name === snapshot.player2.name) {
                    // Bot won → human lost
                    haptics.onLose();
                } else {
                    haptics.onWin();
                }
            }
        }

        prevGameStateRef.current = currentState;
    }, [snapshot?.state, snapshot?.moveHistory.length, isBotGame, haptics]);

    // Fire haptic when bot starts thinking
    useEffect(() => {
        if (isBotThinking && !prevBotThinkingRef.current) {
            haptics.onBotThinking();
        }
        prevBotThinkingRef.current = isBotThinking;
    }, [isBotThinking, haptics]);

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
            onMakeMove={handleMakeMove}
            onUndo={handleUndo}
            onReset={handleReset}
            onPlayAgain={handlePlayAgain}
            canUndo={canUndo()}
            isBotThinking={isBotThinking}
            isBotGame={isBotGame}
        />
    );
};

export default Game;