import { WebHaptics } from "web-haptics";

/**
 * Singleton vanilla WebHaptics instance for use outside React components
 * (e.g., in Zustand stores, utility functions, etc.)
 */
const haptics = new WebHaptics({ debug: false });

/** Error toast haptic — sharp buzz for error notifications */
export function triggerErrorToast() {
    haptics.trigger({
        pattern: [
            { duration: 40, intensity: 0.7 },
            { delay: 40, duration: 40, intensity: 0.7 },
            { delay: 40, duration: 40, intensity: 0.9 },
        ],
    });
}

/** Info/warning toast haptic — gentle nudge for info notifications */
export function triggerInfoToast() {
    haptics.trigger({
        pattern: [
            { duration: 20, intensity: 0.4 },
            { delay: 60, duration: 15, intensity: 0.3 },
        ],
    });
}

/** Success toast haptic — ascending double-tap */
export function triggerSuccessToast() {
    haptics.trigger({
        pattern: [
            { duration: 30, intensity: 0.5 },
            { delay: 60, duration: 40, intensity: 1 },
        ],
    });
}

export default haptics;
