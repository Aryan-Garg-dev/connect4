import { useState } from 'react';
import { DiscColor } from '../../lib/connect4/disc';
import { cn } from '../../lib/utils';

interface PlayerFormProps {
    playerNumber: 1 | 2;
    name: string;
    color: DiscColor | null;
    onNameChange: (name: string) => void;
    onColorChange: (color: DiscColor) => void;
    disabledColor?: DiscColor | null;
}

const COLOR_OPTIONS: { value: DiscColor; label: string; bg: string; ring: string; activeBg: string }[] = [
    {
        value: DiscColor.RED,
        label: 'Red',
        bg: 'bg-gradient-to-br from-red-400 via-red-500 to-red-700',
        ring: 'ring-red-400',
        activeBg: 'bg-red-500/10 border-red-500',
    },
    {
        value: DiscColor.BLUE,
        label: 'Blue',
        bg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
        ring: 'ring-blue-400',
        activeBg: 'bg-blue-500/10 border-blue-500',
    },
];

const PlayerForm = ({
    playerNumber,
    name,
    color,
    onNameChange,
    onColorChange,
    disabledColor,
}: PlayerFormProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: `${(playerNumber - 1) * 150}ms` }}>
            <h3 className="text-lg font-heading text-foreground flex items-center gap-2">
                <span className={cn(
                    'inline-flex items-center justify-center size-8 rounded-full text-sm font-bold border-2 border-black',
                    playerNumber === 1
                        ? 'bg-linear-to-br from-amber-300 to-orange-400 text-black'
                        : 'bg-linear-to-br from-emerald-300 to-teal-400 text-black'
                )}>
                    P{playerNumber}
                </span>
                Player {playerNumber}
            </h3>

            {/* Name Input */}
            <div className="relative">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter name..."
                    maxLength={16}
                    className={cn(
                        'w-full px-4 py-3 rounded-base font-sans text-sm',
                        'bg-secondary-background text-foreground',
                        'border-2 border-border outline-none',
                        'transition-all duration-200',
                        'placeholder:text-foreground/40',
                        isFocused
                            ? 'shadow-none translate-x-[2px] translate-y-[2px]'
                            : 'shadow-shadow'
                    )}
                />
            </div>

            {/* Color Selector */}
            <div className="flex gap-3">
                {COLOR_OPTIONS.map((option) => {
                    const isSelected = color === option.value;
                    const isDisabled = disabledColor === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => onColorChange(option.value)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-base border-2 border-border',
                                'font-sans text-sm font-medium cursor-pointer',
                                'transition-all duration-200',
                                isSelected
                                    ? 'shadow-none translate-x-[2px] translate-y-[2px] bg-main text-main-foreground'
                                    : 'shadow-shadow bg-secondary-background text-foreground hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--border)]',
                                isDisabled && 'opacity-30 cursor-not-allowed hover:translate-x-0 hover:translate-y-0 hover:shadow-shadow'
                            )}
                        >
                            <div className={cn(
                                'size-5 rounded-full border border-black/20',
                                option.bg,
                            )}>
                                <div className="w-full h-1/2 rounded-t-full bg-linear-to-b from-white/30 to-transparent" />
                            </div>
                            {option.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PlayerForm;
