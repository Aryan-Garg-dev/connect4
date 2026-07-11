import { cn } from '../../lib/utils';
import { useGameHaptics } from '../../hooks/useGameHaptics';

interface GameControlsProps {
    canUndo: boolean;
    onUndo: () => void;
    onReset: () => void;
}

const GameControls = ({ canUndo, onUndo, onReset }: GameControlsProps) => {
    const { onButtonTap } = useGameHaptics();
    const buttonBase = cn(
        'py-2 sm:py-2.5 px-4 sm:px-5 rounded-base font-heading text-sm',
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
        <div className="flex flex-row sm:flex-col gap-3 w-full animate-slide-up" style={{ animationDelay: '200ms' }}>
            {/* Undo */}
            <button
                type="button"
                disabled={!canUndo}
                onClick={() => { onButtonTap(); onUndo(); }}
                className={cn(
                    canUndo ? activeButton : disabledButton,
                    'flex-1 sm:flex-auto'
                )}
            >
                ↩ Undo Move
            </button>

            {/* Reset */}
            <button
                type="button"
                onClick={() => { onButtonTap(); onReset(); }}
                className={cn(
                    activeButton,
                    'flex-1 sm:flex-auto',
                    'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50'
                )}
            >
                🔄 New Game
            </button>
        </div>
    );
};

export default GameControls;
