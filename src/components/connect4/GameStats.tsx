import { DiscColor } from '../../lib/connect4/disc';
import { GameState } from '../../lib/connect4/game';
import type { PlayerJson } from '../../lib/connect4/player';
import type { MoveJson } from '../../lib/connect4/move';
import { cn } from '../../lib/utils';

interface GameStatsProps {
    player1: PlayerJson;
    player2: PlayerJson;
    currentPlayerName: string;
    currentPlayerColor: DiscColor;
    gameState: GameState;
    moveHistory: MoveJson[];
    isBotThinking?: boolean;
    isBotGame?: boolean;
}

const PlayerCard = ({
    player,
    isCurrentTurn,
    moveCount,
    isThinking,
}: {
    player: PlayerJson;
    isCurrentTurn: boolean;
    moveCount: number;
    isThinking?: boolean;
}) => {
    const colorStyles = player.color === DiscColor.RED
        ? 'from-red-400 via-red-500 to-red-700 border-red-300'
        : 'from-blue-400 via-blue-500 to-blue-700 border-blue-300';

    return (
        <div className={cn(
            'p-3 sm:p-4 rounded-base border-2 border-border',
            'transition-all duration-300',
            isCurrentTurn
                ? 'shadow-shadow bg-secondary-background scale-[1.02]'
                : 'shadow-none translate-x-[2px] translate-y-[2px] bg-secondary-background/70 opacity-60'
        )}>
            <div className="flex items-center gap-3">
                {/* Disc indicator */}
                <div className={cn(
                    'size-7 sm:size-8 rounded-full border-2 bg-linear-to-br shrink-0',
                    colorStyles,
                    isCurrentTurn && !isThinking && 'animate-pulse-ring'
                )}>
                    <div className="w-full h-1/2 rounded-t-full bg-linear-to-b from-white/30 to-transparent" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-heading text-sm truncate">{player.name}</p>
                    {isThinking ? (
                        <p className="text-xs font-mono text-main flex items-center gap-1">
                            <span className="animate-bot-thinking">Thinking</span>
                            <span className="inline-flex gap-0.5">
                                <span className="size-1 rounded-full bg-main animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="size-1 rounded-full bg-main animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="size-1 rounded-full bg-main animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                        </p>
                    ) : (
                        <p className="text-xs font-mono text-foreground/50">
                            {moveCount} move{moveCount !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {isCurrentTurn && !isThinking && (
                    <span className="text-xs font-mono bg-main text-main-foreground px-2 py-0.5 rounded-base border border-border shrink-0">
                        TURN
                    </span>
                )}
                {isThinking && (
                    <span className="text-xs font-mono bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-base border border-border shrink-0 animate-pulse">
                        🤖
                    </span>
                )}
            </div>
        </div>
    );
};

const GameStats = ({
    player1,
    player2,
    currentPlayerName,
    currentPlayerColor,
    gameState,
    moveHistory,
    isBotThinking = false,
    isBotGame = false,
}: GameStatsProps) => {
    const p1Moves = moveHistory.filter((m) => m.player.name === player1.name).length;
    const p2Moves = moveHistory.filter((m) => m.player.name === player2.name).length;
    const totalMoves = moveHistory.length;

    return (
        <div className="flex flex-col gap-3 sm:gap-4 animate-slide-up w-full">
            {/* Turn Indicator */}
            {gameState === GameState.IN_PROGRESS && (
                <div className={cn(
                    'p-3 sm:p-4 rounded-base border-2 border-border shadow-shadow',
                    'bg-secondary-background text-center'
                )}>
                    <p className="text-xs font-mono text-foreground/50 uppercase tracking-widest mb-1">
                        {isBotThinking ? 'Bot Thinking' : 'Current Turn'}
                    </p>
                    <p className="text-lg sm:text-xl font-heading">{currentPlayerName}</p>
                    <div className="flex justify-center mt-2">
                        <div className={cn(
                            'size-4 rounded-full bg-linear-to-br',
                            currentPlayerColor === DiscColor.RED
                                ? 'from-red-400 to-red-700'
                                : 'from-blue-400 to-blue-700',
                            isBotThinking && 'animate-pulse'
                        )} />
                    </div>
                </div>
            )}

            {/* Player Cards */}
            <div className="flex flex-row lg:flex-col gap-3">
                <PlayerCard
                    player={player1}
                    isCurrentTurn={gameState === GameState.IN_PROGRESS && currentPlayerName === player1.name}
                    moveCount={p1Moves}
                />
                <PlayerCard
                    player={player2}
                    isCurrentTurn={gameState === GameState.IN_PROGRESS && currentPlayerName === player2.name}
                    moveCount={p2Moves}
                    isThinking={isBotThinking && isBotGame}
                />
            </div>

            {/* Move Counter */}
            <div className={cn(
                'p-2 sm:p-3 rounded-base border-2 border-border shadow-shadow',
                'bg-secondary-background text-center'
            )}>
                <p className="text-xs font-mono text-foreground/50 uppercase tracking-widest">Total Moves</p>
                <p className="text-2xl sm:text-3xl font-heading font-bold mt-1">{totalMoves}</p>
            </div>
        </div>
    );
};

export default GameStats;
