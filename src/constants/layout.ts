/**
 * Screen-derived layout maths. Kept out of config.ts so the pure-logic unit
 * tests never pull a native module in.
 */
import { Dimensions } from 'react-native';

const win = Dimensions.get('window');

export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

export const H_PADDING = 16;
export const HEADER_TOP = 44;
export const HEADER_H = 72;
export const HEADER_TOTAL = HEADER_TOP + HEADER_H;

export const CONTENT_W = SCREEN_W - H_PADDING * 2;

/** Match card geometry (rules #4/#5: derive, never guess). */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 14;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER;
export const BOARD_CONTENT_W = BOARD_MAX_W - 2 * BOARD_FRAME;

export const PICK_GAP = 10;
export const PICK_W = Math.floor((BOARD_CONTENT_W - 2 * PICK_GAP) / 3);

export const TILE_GAP = 12;
export const HALF_TILE_W = Math.floor((CONTENT_W - TILE_GAP) / 2);

export const CHIP_GAP = 10;
export const CHIP_W = Math.floor((CONTENT_W - 2 * CHIP_GAP) / 3);

export const COLLECTION_CARD_W = Math.floor((SCREEN_W - 32 - 12) / 2);

export const CTA_W = CONTENT_W;
export const SECONDARY_W = 104;
export const GO_LIVE_W = CONTENT_W - SECONDARY_W - 10;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

/** Height left for the match board once the header and the controls are out. */
export const GAME_CONTROLS_H = 230;
export const BOARD_AVAILABLE_H = SCREEN_H - HEADER_TOTAL - GAME_CONTROLS_H;

/** Short viewports drop to the compact card and a smaller verdict ring. */
export const DENSE = BOARD_AVAILABLE_H < 430;
export const RING_SIZE = DENSE ? 120 : 150;
export const RESULT_MAX_ROWS = DENSE ? 3 : 5;
