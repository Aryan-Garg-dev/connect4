import { DiscColor } from '../../lib/connect4/disc';
import { cn } from '../../lib/utils';

const COLOR_STYLES: Record<DiscColor, { bg: string; gradient: string; ring: string }> = {
    [DiscColor.RED]: {
        bg: 'bg-red-500',
        gradient: 'bg-gradient-to-br from-red-400 via-red-500 to-red-700',
        ring: 'ring-red-400/50',
    },
    [DiscColor.BLUE]: {
        bg: 'bg-blue-500',
        gradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
        ring: 'ring-blue-400/50',
    },
};

interface DiscProps {
    color: DiscColor | null;
    isGhost?: boolean;
    isLatestMove?: boolean;
    shouldAnimate?: boolean;
}

const Disc = ({ color, isGhost = false, isLatestMove = false, shouldAnimate = false }: DiscProps) => {
    const baseClasses = 'size-10 sm:size-12 md:size-14 rounded-full transition-all duration-200';

    if (!color && !isGhost) {
        return (
            <div
                className={cn(
                    baseClasses,
                    'bg-indigo-950/40 border-2 border-indigo-800/30',
                    'shadow-inner'
                )}
            />
        );
    }

    if (isGhost && color) {
        const style = COLOR_STYLES[color];
        return (
            <div
                className={cn(
                    baseClasses,
                    style.bg,
                    'opacity-30 animate-ghost-pulse',
                    'border-2 border-dashed',
                    color === DiscColor.RED ? 'border-red-300' : 'border-blue-300'
                )}
            />
        );
    }

    if (color) {
        const style = COLOR_STYLES[color];
        return (
            <div
                className={cn(
                    baseClasses,
                    style.gradient,
                    'border-2',
                    color === DiscColor.RED ? 'border-red-300' : 'border-blue-300',
                    'shadow-lg',
                    shouldAnimate && 'animate-disc-drop',
                    isLatestMove && 'animate-pulse-ring ring-2 ring-white/60'
                )}
            >
                {/* Gloss effect */}
                <div className="w-full h-1/2 rounded-t-full bg-linear-to-b from-white/30 to-transparent" />
            </div>
        );
    }

    return <div className={cn(baseClasses, 'bg-indigo-950/40')} />;
};

export default Disc;