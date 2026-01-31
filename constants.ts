export const GAME_CONFIG = {
  BLOCK_HEIGHT: 50, // pixels
  INITIAL_WIDTH_PERCENT: 60, // percentage of screen width
  INITIAL_SPEED: 0.8, // percent per frame
  SPEED_INCREMENT: 0.05,
  MAX_SPEED: 2.5,
  TOLERANCE_PERCENT: 3, // Allowable error for "Perfect" drop
  ARTIFACT_INTERVAL: 5, // Every Nth block is an artifact
  ARTIFACT_BONUS_WIDTH: 5, // Width percentage gained on perfect artifact drop
  FPS: 60,
};

export const COLORS = {
  STONE_BASE: '#e1b382',
  STONE_DARK: '#c89666',
  ARTIFACT_GOLD: '#FFD700',
  PERFECT_FLASH: '#FFFFFF',
};

export const TEXTS = {
  TITLE: "PYRAMID BUILDER",
  START: "TAP TO START",
  RESTART: "TAP TO REBUILD",
  SCORE_LABEL: "YEARS",
};

export const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbw0vRvj_nQyRWTzYAn8bClV9SR9n-ptPTXed1QZ9apSrSytYWVHm0avvjjBtKpNLPI/exec";
