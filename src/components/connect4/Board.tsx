import { useState } from 'react';
import { DiscColor } from '../../lib/connect4/disc';
import { BoardJson } from '../../lib/connect4/board';
import { MoveJson } from '../../lib/connect4/move';
import Disc from './Disc';
import { cn } from '../../lib/utils';

interface ColumnProps {
    colIndex: number;
    cells: (DiscColor | null)[];
    currentPlayerColor: DiscColor;
    isGameOver: boolean;
    lastMove: MoveJson | undefined;
    onDrop: (col: number) => void;
    moveCounter: number;
}

const Column = ({
    colIndex,
    cells,
    currentPlayerColor,
    isGameOver,
    lastMove,
    onDrop,
    moveCounter,
}: ColumnProps) => {
    const [isHovered, setIsHovered] = useState(false);

    // Find the lowest empty row for ghost disc
    const lowestEmptyRow = (() => {
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i] === null) return i;
        }
        return -1;
    })();

    const isFull = lowestEmptyRow === -1;
    const canInteract = !isGameOver && !isFull;

    return (
        <div
            className={cn(
                'flex flex-col gap-1 sm:gap-2 items-center p-0.5 sm:p-1 rounded-lg',
                'transition-all duration-200 cursor-pointer',
                canInteract && 'hover:bg-white/10',
                !canInteract && 'cursor-not-allowed'
            )}
            onMouseEnter={() => canInteract && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => canInteract && onDrop(colIndex)}
        >
            {cells.map((cellColor, rowIndex) => {
                const isGhost = isHovered && cellColor === null && rowIndex === lowestEmptyRow;
                const isLatest = lastMove?.row === rowIndex && lastMove?.col === colIndex;
                const shouldAnimate = isLatest && cellColor !== null;

                return (
                    <Disc
                        key={`${rowIndex}-${colIndex}-${moveCounter}`}
                        color={isGhost ? currentPlayerColor : cellColor}
                        isGhost={isGhost}
                        isLatestMove={isLatest && cellColor !== null}
                        shouldAnimate={shouldAnimate}
                    />
                );
            })}
        </div>
    );
};

interface BoardProps {
    board: BoardJson;
    currentPlayerColor: DiscColor;
    isGameOver: boolean;
    lastMove: MoveJson | undefined;
    onDrop: (col: number) => void;
    moveCounter: number;
}

const Board = ({ board, currentPlayerColor, isGameOver, lastMove, onDrop, moveCounter }: BoardProps) => {
    // Transform row-major grid to column-major for column components
    const columns: (DiscColor | null)[][] = [];
    for (let c = 0; c < board.cols; c++) {
        const col: (DiscColor | null)[] = [];
        for (let r = 0; r < board.rows; r++) {
            col.push(board.grid[r][c]);
        }
        columns.push(col);
    }

    return (
        <div className="flex flex-col items-center gap-2 sm:gap-3">
            {/* Column indicators */}
            <div className="flex gap-1 sm:gap-2">
                {columns.map((_, i) => (
                    <div
                        key={i}
                        className="w-10 sm:w-12 md:w-14 flex items-center justify-center"
                    >
                        <span className="text-xs font-mono text-indigo-300/60">{i + 1}</span>
                    </div>
                ))}
            </div>

            {/* Board frame */}
            <div className={cn(
                'p-2 sm:p-3 md:p-4 rounded-xl',
                'bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-800',
                'border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]',
                'relative overflow-hidden'
            )}>
                {/* Shimmer overlay */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s ease-in-out infinite',
                    }}
                />

                {/* Columns container */}
                <div className="flex gap-1 sm:gap-2 relative z-10">
                    {columns.map((cells, colIndex) => (
                        <Column
                            key={colIndex}
                            colIndex={colIndex}
                            cells={cells}
                            currentPlayerColor={currentPlayerColor}
                            isGameOver={isGameOver}
                            lastMove={lastMove}
                            onDrop={onDrop}
                            moveCounter={moveCounter}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;