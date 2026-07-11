import { useState } from 'react';
import { DiscColor } from '../../lib/connect4/disc';
import { Player } from '../../lib/connect4/player';
import PlayerForm from './PlayerForm';
import { cn } from '../../lib/utils';

interface PlayerRegistrationProps {
    onStartGame: (p1: Player, p2: Player, isBotGame: boolean) => void;
}

interface PlayerData {
    name: string;
    color: DiscColor | null;
}

const PlayerRegistration = ({ onStartGame }: PlayerRegistrationProps) => {
    const [player1, setPlayer1] = useState<PlayerData>({ name: '', color: null });
    const [player2, setPlayer2] = useState<PlayerData>({ name: '', color: null });
    const [isBotMode, setIsBotMode] = useState(false);

    const handleBotToggle = () => {
        const newBotMode = !isBotMode;
        setIsBotMode(newBotMode);
        if (newBotMode) {
            // Auto-set bot name and color
            const botColor = player1.color === DiscColor.RED ? DiscColor.BLUE
                : player1.color === DiscColor.BLUE ? DiscColor.RED
                : DiscColor.BLUE;
            setPlayer2({ name: 'Bot 🤖', color: botColor });
        } else {
            setPlayer2({ name: '', color: null });
        }
    };

    // When player 1 changes color in bot mode, auto-update bot color
    const handleP1ColorChange = (color: DiscColor) => {
        setPlayer1((p) => ({ ...p, color }));
        if (isBotMode) {
            const botColor = color === DiscColor.RED ? DiscColor.BLUE : DiscColor.RED;
            setPlayer2((p) => ({ ...p, color: botColor }));
        }
    };

    const isValid =
        player1.name.trim().length > 0 &&
        player2.name.trim().length > 0 &&
        player1.color !== null &&
        player2.color !== null &&
        player1.color !== player2.color;

    const handleStart = () => {
        if (!isValid || !player1.color || !player2.color) return;
        onStartGame(
            new Player(player1.name.trim(), player1.color),
            new Player(player2.name.trim(), player2.color),
            isBotMode
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            {/* Decorative background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-main/10 rounded-full blur-3xl" />
            </div>

            {/* Registration Card */}
            <div className={cn(
                'relative w-full max-w-md mx-4 p-6 sm:p-8 rounded-base',
                'bg-secondary-background border-2 border-border shadow-shadow',
                'animate-scale-bounce-in'
            )}>
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl font-heading tracking-tight mb-1">
                        Connect
                        <span className="inline-block ml-1 px-2 py-0.5 bg-main text-main-foreground rounded-base border-2 border-border text-2xl">
                            4
                        </span>
                    </h1>
                    <p className="text-sm text-foreground/60 font-mono mt-3">
                        {isBotMode ? 'Set up your game against the bot' : 'Register both players to begin'}
                    </p>
                </div>

                {/* Bot Mode Toggle */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleBotToggle}
                        className={cn(
                            'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-base',
                            'border-2 border-border cursor-pointer',
                            'transition-all duration-200',
                            isBotMode
                                ? 'bg-main/15 shadow-none translate-x-[2px] translate-y-[2px]'
                                : 'bg-secondary-background shadow-shadow hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_var(--border)]'
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🤖</span>
                            <span className="font-heading text-sm">Play vs Bot</span>
                        </div>
                        {/* Toggle indicator */}
                        <div className={cn(
                            'w-10 h-6 rounded-full border-2 border-border relative transition-colors duration-200',
                            isBotMode ? 'bg-main' : 'bg-foreground/10'
                        )}>
                            <div className={cn(
                                'absolute top-0.5 size-4 rounded-full border border-border bg-secondary-background transition-all duration-200',
                                isBotMode ? 'left-[calc(100%-18px)]' : 'left-0.5'
                            )} />
                        </div>
                    </button>
                </div>

                {/* Divider */}
                <div className="w-full h-0.5 bg-border mb-6" />

                {/* Player Forms */}
                <div className="flex flex-col gap-6">
                    <PlayerForm
                        playerNumber={1}
                        name={player1.name}
                        color={player1.color}
                        onNameChange={(name) => setPlayer1((p) => ({ ...p, name }))}
                        onColorChange={handleP1ColorChange}
                        disabledColor={player2.color}
                    />

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-0.5 bg-border/40" />
                        <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest">vs</span>
                        <div className="flex-1 h-0.5 bg-border/40" />
                    </div>

                    {isBotMode ? (
                        /* Bot Info Card */
                        <div className="flex flex-col gap-4 animate-slide-up">
                            <h3 className="text-lg font-heading text-foreground flex items-center gap-2">
                                <span className={cn(
                                    'inline-flex items-center justify-center size-8 rounded-full text-sm font-bold border-2 border-black',
                                    'bg-linear-to-br from-emerald-300 to-teal-400 text-black'
                                )}>
                                    🤖
                                </span>
                                Bot Player
                            </h3>
                            <div className={cn(
                                'px-4 py-3 rounded-base border-2 border-border bg-foreground/5',
                                'flex items-center gap-3'
                            )}>
                                <div className={cn(
                                    'size-5 rounded-full border border-black/20',
                                    player2.color === DiscColor.RED
                                        ? 'bg-gradient-to-br from-red-400 via-red-500 to-red-700'
                                        : 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
                                )}>
                                    <div className="w-full h-1/2 rounded-t-full bg-linear-to-b from-white/30 to-transparent" />
                                </div>
                                <span className="text-sm font-mono text-foreground/70">
                                    Bot 🤖 — {player2.color === DiscColor.RED ? 'Red' : 'Blue'}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <PlayerForm
                            playerNumber={2}
                            name={player2.name}
                            color={player2.color}
                            onNameChange={(name) => setPlayer2((p) => ({ ...p, name }))}
                            onColorChange={(color) => setPlayer2((p) => ({ ...p, color }))}
                            disabledColor={player1.color}
                        />
                    )}
                </div>

                {/* Start Button */}
                <button
                    type="button"
                    disabled={!isValid}
                    onClick={handleStart}
                    className={cn(
                        'w-full mt-8 py-3 px-6 rounded-base font-heading text-lg',
                        'border-2 border-border cursor-pointer',
                        'transition-all duration-200',
                        isValid
                            ? 'bg-main text-main-foreground shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
                            : 'bg-foreground/10 text-foreground/30 cursor-not-allowed shadow-none'
                    )}
                >
                    {isValid ? (isBotMode ? '🤖 Start vs Bot!' : '🎮 Start Game!') : 'Fill in both players'}
                </button>
            </div>
        </div>
    );
};

export default PlayerRegistration;
