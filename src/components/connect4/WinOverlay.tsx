import { GameState } from '../../lib/connect4/game';
import { DiscColor } from '../../lib/connect4/disc';
import type { PlayerJson } from '../../lib/connect4/player';
import { cn } from '../../lib/utils';

interface WinOverlayProps {
    gameState: GameState;
    winner: PlayerJson | null;
    onPlayAgain: () => void;
    onNewGame: () => void;
}

const WinOverlay = ({ gameState, winner, onPlayAgain, onNewGame }: WinOverlayProps) => {
    if (gameState === GameState.IN_PROGRESS) return null;

    const isDraw = gameState === GameState.DRAW;

    const buttonBase = cn(
        'py-3 px-6 rounded-base font-heading text-sm',
        'border-2 border-border cursor-pointer',
        'transition-all duration-200',
        'shadow-shadow',
        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
        'active:translate-x-[4px] active:translate-y-[4px]'
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in bg-overlay">
            <div className={cn(
                'relative p-8 rounded-base border-2 border-border',
                'bg-secondary-background shadow-[8px_8px_0px_0px_var(--border)]',
                'max-w-sm w-full mx-4',
                'animate-scale-bounce-in'
            )}>
                {/* Celebration emoji */}
                <div className="text-center mb-2">
                    <span className="text-5xl animate-confetti-burst inline-block">
                        {isDraw ? '🤝' : '🏆'}
                    </span>
                </div>

                {/* Result text */}
                <div className="text-center mb-6">
                    {isDraw ? (
                        <>
                            <h2 className="text-2xl font-heading mb-1">It's a Draw!</h2>
                            <p className="text-sm font-mono text-foreground/60">The board is full — no winner this time.</p>
                        </>
                    ) : winner && (
                        <>
                            <h2 className="text-2xl font-heading mb-2">
                                {winner.name} Wins!
                            </h2>
                            <div className="flex justify-center mb-2">
                                <div className={cn(
                                    'size-10 rounded-full border-2 bg-linear-to-br',
                                    winner.color === DiscColor.RED
                                        ? 'from-red-400 via-red-500 to-red-700 border-red-300'
                                        : 'from-blue-400 via-blue-500 to-blue-700 border-blue-300',
                                )}>
                                    <div className="w-full h-1/2 rounded-t-full bg-linear-to-b from-white/30 to-transparent" />
                                </div>
                            </div>
                            <p className="text-sm font-mono text-foreground/60">Congratulations! 🎉</p>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={onPlayAgain}
                        className={cn(buttonBase, 'bg-main text-main-foreground w-full')}
                    >
                        🔁 Play Again
                    </button>
                    <button
                        type="button"
                        onClick={onNewGame}
                        className={cn(buttonBase, 'bg-secondary-background text-foreground w-full')}
                    >
                        👋 New Players
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinOverlay;
