import { GameState, GameJson } from '../../lib/connect4/game';
import Board from './Board';
import GameStats from './GameStats';
import GameControls from './GameControls';
import WinOverlay from './WinOverlay';

interface GameBoardProps {
    snapshot: GameJson;
    onMakeMove: (col: number) => boolean;
    onUndo: () => boolean;
    onReset: () => void;
    onPlayAgain: () => void;
    canUndo: boolean;
    isBotThinking?: boolean;
    isBotGame?: boolean;
}

const GameBoard = ({
    snapshot,
    onMakeMove,
    onUndo,
    onReset,
    onPlayAgain,
    canUndo,
    isBotThinking = false,
    isBotGame = false,
}: GameBoardProps) => {
    const { player1, player2, currentPlayer, state, board, moveHistory } = snapshot;
    const activePlayer = currentPlayer === 'player1' ? player1 : player2;
    const isGameOver = state !== GameState.IN_PROGRESS;
    const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1] : undefined;

    // Determine winner for overlay
    const winner = state === GameState.WON ? lastMove?.player ?? null : null;

    // Disable board when game is over or bot is thinking
    const isBoardDisabled = isGameOver || isBotThinking;

    const handleDrop = (col: number) => {
        if (isBoardDisabled) return;
        onMakeMove(col);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-8">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6 animate-slide-up">
                <h1 className="text-2xl sm:text-3xl font-heading tracking-tight">
                    Connect
                    <span className="inline-block ml-1 px-2 py-0.5 bg-main text-main-foreground rounded-base border-2 border-border text-xl sm:text-2xl">
                        4
                    </span>
                </h1>
            </div>

            {/* Main layout: Board (left) + Stats (right) */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10 items-center lg:items-start justify-center w-full max-w-5xl">
                {/* Board */}
                <div className="shrink-0">
                    <Board
                        board={board}
                        currentPlayerColor={activePlayer.color}
                        isGameOver={isBoardDisabled}
                        lastMove={lastMove}
                        onDrop={handleDrop}
                        moveCounter={moveHistory.length}
                    />
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full lg:w-64">
                    <GameStats
                        player1={player1}
                        player2={player2}
                        currentPlayerName={activePlayer.name}
                        currentPlayerColor={activePlayer.color}
                        gameState={state}
                        moveHistory={moveHistory}
                        isBotThinking={isBotThinking}
                        isBotGame={isBotGame}
                    />
                    <GameControls
                        canUndo={canUndo && !isBotThinking}
                        onUndo={onUndo}
                        onReset={onReset}
                    />
                </div>
            </div>

            {/* Win/Draw Overlay */}
            <WinOverlay
                gameState={state}
                winner={winner}
                onPlayAgain={onPlayAgain}
                onNewGame={onReset}
            />
        </div>
    );
};

export default GameBoard;
