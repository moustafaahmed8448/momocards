/**
 * The unboxing state machine.
 *
 * React renders `data-stage={stage}` on the root element; the
 * entire choreography (seal → flap → card → actions) lives in
 * `globals.css` under the "UNBOXING CHOREOGRAPHY" section.
 * Keep the two in sync — this file only owns what CSS can't:
 * the moment the action panel mounts.
 */
export type Stage = "idle" | "opening" | "open";

/**
 * Delay from `opening` → `open`, in ms.
 * Must be ≥ the longest CSS transition (card: 520 + 1100 = 1620ms),
 * otherwise the actions appear while the card is still travelling.
 */
export const OPEN_DELAY = 1750;

/** Reduced motion: collapse the choreography into an instant jump. */
export const OPEN_DELAY_REDUCED = 0;