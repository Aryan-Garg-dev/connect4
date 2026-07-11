import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";
import type { HapticPreset } from "web-haptics";

// ─── Custom Haptic Patterns for Connect 4 ───────────────────────────────────

/** Disc landing in a column — satisfying thud */
const MOVE_PATTERN: HapticPreset = {
    pattern: [{ duration: 25, intensity: 0.7 }],
};

/** Victory celebration — triumphant ascending pulses */
const WIN_PATTERN: HapticPreset = {
    pattern: [
        { duration: 30, intensity: 0.5 },
        { delay: 80, duration: 40, intensity: 0.7 },
        { delay: 80, duration: 50, intensity: 0.9 },
        { delay: 80, duration: 60, intensity: 1.0 },
    ],
};

/** Losing — descending deflation */
const LOSE_PATTERN: HapticPreset = {
    pattern: [
        { duration: 50, intensity: 0.8 },
        { delay: 120, duration: 40, intensity: 0.5 },
        { delay: 120, duration: 30, intensity: 0.2 },
    ],
};

/** Draw — neutral double bump */
const DRAW_PATTERN: HapticPreset = {
    pattern: [
        { duration: 35, intensity: 0.5 },
        { delay: 100, duration: 35, intensity: 0.5 },
    ],
};

/** Game start — energetic ramp-up */
const START_PATTERN: HapticPreset = {
    pattern: [
        { duration: 20, intensity: 0.3 },
        { delay: 60, duration: 25, intensity: 0.6 },
        { delay: 60, duration: 35, intensity: 1.0 },
    ],
};

/** Bot is thinking — subtle pulsing rhythm */
const BOT_THINKING_PATTERN: HapticPreset = {
    pattern: [
        { duration: 15, intensity: 0.25 },
        { delay: 150, duration: 15, intensity: 0.25 },
        { delay: 150, duration: 15, intensity: 0.25 },
    ],
};

/** Undo move — quick reverse tap */
const UNDO_PATTERN: HapticPreset = {
    pattern: [
        { duration: 20, intensity: 0.6 },
        { delay: 40, duration: 15, intensity: 0.3 },
    ],
};

/** Reset/new game — clean sweep */
const RESET_PATTERN: HapticPreset = {
    pattern: [
        { duration: 40, intensity: 0.8 },
        { delay: 60, duration: 20, intensity: 0.4 },
    ],
};

/** Column hover — ultra-light tick */
const COLUMN_HOVER_PATTERN: HapticPreset = {
    pattern: [{ duration: 8, intensity: 0.15 }],
};

/** Button press — subtle confirmation */
const BUTTON_TAP_PATTERN: HapticPreset = {
    pattern: [{ duration: 12, intensity: 0.35 }],
};

/** Error toast — sharp buzz */
const ERROR_TOAST_PATTERN: HapticPreset = {
    pattern: [
        { duration: 40, intensity: 0.7 },
        { delay: 40, duration: 40, intensity: 0.7 },
        { delay: 40, duration: 40, intensity: 0.9 },
    ],
};

/** Invalid move — quick double-reject */
const INVALID_MOVE_PATTERN: HapticPreset = {
    pattern: [
        { duration: 30, intensity: 0.6 },
        { delay: 50, duration: 30, intensity: 0.8 },
    ],
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useGameHaptics() {
    const { trigger, cancel, isSupported } = useWebHaptics({ debug: false });

    const onMakeMove = useCallback(() => {
        trigger(MOVE_PATTERN);
    }, [trigger]);

    const onWin = useCallback(() => {
        trigger(WIN_PATTERN);
    }, [trigger]);

    const onLose = useCallback(() => {
        trigger(LOSE_PATTERN);
    }, [trigger]);

    const onDraw = useCallback(() => {
        trigger(DRAW_PATTERN);
    }, [trigger]);

    const onStart = useCallback(() => {
        trigger(START_PATTERN);
    }, [trigger]);

    const onBotThinking = useCallback(() => {
        trigger(BOT_THINKING_PATTERN);
    }, [trigger]);

    const onUndo = useCallback(() => {
        trigger(UNDO_PATTERN);
    }, [trigger]);

    const onReset = useCallback(() => {
        trigger(RESET_PATTERN);
    }, [trigger]);

    const onColumnHover = useCallback(() => {
        trigger(COLUMN_HOVER_PATTERN);
    }, [trigger]);

    const onButtonTap = useCallback(() => {
        trigger(BUTTON_TAP_PATTERN);
    }, [trigger]);

    const onErrorToast = useCallback(() => {
        trigger(ERROR_TOAST_PATTERN);
    }, [trigger]);

    const onInvalidMove = useCallback(() => {
        trigger(INVALID_MOVE_PATTERN);
    }, [trigger]);

    return {
        onMakeMove,
        onWin,
        onLose,
        onDraw,
        onStart,
        onBotThinking,
        onUndo,
        onReset,
        onColumnHover,
        onButtonTap,
        onErrorToast,
        onInvalidMove,
        cancel,
        isSupported,
    };
}
