import { cn } from '../../lib/utils';

interface GameControlsProps {
    canUndo: boolean;
    onUndo: () => void;
    onReset: () => void;
}

const GameControls = ({ canUndo, onUndo, onReset }: GameControlsProps) => {
    const buttonBase = cn(
        'py-2.5 px-5 rounded-base font-heading text-sm',
        'border-2 border-border cursor-pointer',
        'transition-all duration-200'
    );

    const activeButton = cn(
        buttonBase,
        'shadow-shadow bg-secondary-background text-foreground',
        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
        'active:translate-x-[4px] active:translate-y-[4px]'
    );

    const disabledButton = cn(
        buttonBase,
        'bg-foreground/5 text-foreground/25 cursor-not-allowed shadow-none'
    );

    return (
        <div className="flex flex-col gap-3 w-full animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Undo */}
            <button
                type="button"
                disabled={!canUndo}
                onClick={onUndo}
                className={canUndo ? activeButton : disabledButton}
            >
                ↩ Undo Move
            </button>

            {/* Reset */}
            <button
                type="button"
                onClick={onReset}
                className={cn(
                    activeButton,
                    'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                )}
            >
                🔄 New Game
            </button>
        </div>
    );
};

export default GameControls;
