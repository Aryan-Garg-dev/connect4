import { useGame } from '../../store/useGame';
import { Player } from '../../lib/connect4/player';
import PlayerRegistration from './PlayerRegistration';
import GameBoard from './GameBoard';

const Game = () => {
    const {
        snapshot,
        startGame,
        makeMove,
        undoLastMove,
        canUndo,
        resetGame,
    } = useGame();

    const handleStartGame = (p1: Player, p2: Player) => {
        startGame(p1, p2);
    };

    const handlePlayAgain = () => {
        if (!snapshot) return;
        // Restart with the same players
        const p1 = Player.fromObject(snapshot.player1);
        const p2 = Player.fromObject(snapshot.player2);
        startGame(p1, p2);
    };

    // Phase 1: Registration (no active game)
    if (!snapshot) {
        return <PlayerRegistration onStartGame={handleStartGame} />;
    }

    // Phase 2: Gameplay
    return (
        <GameBoard
            snapshot={snapshot}
            onMakeMove={makeMove}
            onUndo={undoLastMove}
            onReset={resetGame}
            onPlayAgain={handlePlayAgain}
            canUndo={canUndo()}
        />
    );
};

export default Game;