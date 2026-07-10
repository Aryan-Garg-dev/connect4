import { useState } from 'react';
import { DiscColor } from '../../lib/connect4/disc';
import { Player } from '../../lib/connect4/player';
import PlayerForm from './PlayerForm';
import { cn } from '../../lib/utils';

interface PlayerRegistrationProps {
    onStartGame: (p1: Player, p2: Player) => void;
}

interface PlayerData {
    name: string;
    color: DiscColor | null;
}

const PlayerRegistration = ({ onStartGame }: PlayerRegistrationProps) => {
    const [player1, setPlayer1] = useState<PlayerData>({ name: '', color: null });
    const [player2, setPlayer2] = useState<PlayerData>({ name: '', color: null });

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
            new Player(player2.name.trim(), player2.color)
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
                'relative w-full max-w-md mx-4 p-8 rounded-base',
                'bg-secondary-background border-2 border-border shadow-shadow',
                'animate-scale-bounce-in'
            )}>
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-heading tracking-tight mb-1">
                        Connect
                        <span className="inline-block ml-1 px-2 py-0.5 bg-main text-main-foreground rounded-base border-2 border-border text-2xl">
                            4
                        </span>
                    </h1>
                    <p className="text-sm text-foreground/60 font-mono mt-3">
                        Register both players to begin
                    </p>
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
                        onColorChange={(color) => setPlayer1((p) => ({ ...p, color }))}
                        disabledColor={player2.color}
                    />

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-0.5 bg-border/40" />
                        <span className="text-xs font-mono text-foreground/40 uppercase tracking-widest">vs</span>
                        <div className="flex-1 h-0.5 bg-border/40" />
                    </div>

                    <PlayerForm
                        playerNumber={2}
                        name={player2.name}
                        color={player2.color}
                        onNameChange={(name) => setPlayer2((p) => ({ ...p, name }))}
                        onColorChange={(color) => setPlayer2((p) => ({ ...p, color }))}
                        disabledColor={player1.color}
                    />
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
                    {isValid ? '🎮 Start Game!' : 'Fill in both players'}
                </button>
            </div>
        </div>
    );
};

export default PlayerRegistration;
