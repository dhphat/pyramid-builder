export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface BlockData {
  id: number;
  width: number;
  x: number; // Center position percentage (0-100)
  isPerfect: boolean;
  isArtifact: boolean;
  colorHex: string;
}

export interface MovingBlockState {
  width: number;
  x: number; // Center position percentage
  direction: 1 | -1;
  speed: number;
}
