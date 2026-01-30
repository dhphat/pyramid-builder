import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, BlockData, MovingBlockState } from '../types';
import { GAME_CONFIG, COLORS } from '../constants';
import Block from './Block';

interface GameCanvasProps {
  gameState: GameState;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
  setGameState: (state: GameState) => void;
  initialHighScore: number;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameOver, onScoreUpdate, setGameState, initialHighScore }) => {
  // State
  const [stack, setStack] = useState<BlockData[]>([]);
  const [movingBlock, setMovingBlock] = useState<MovingBlockState>({
    width: GAME_CONFIG.INITIAL_WIDTH_PERCENT,
    x: 50,
    direction: 1,
    speed: GAME_CONFIG.INITIAL_SPEED,
  });
  const [cameraY, setCameraY] = useState(0);
  const [effects, setEffects] = useState<{id: number, text: string, x: number, y: number, isMajor?: boolean}[]>([]);
  
  // Refs for loop
  const requestRef = useRef<number>();
  const movingBlockRef = useRef<MovingBlockState>(movingBlock);
  const scoreRef = useRef(0);
  
  // Sync ref with state
  useEffect(() => {
    movingBlockRef.current = movingBlock;
  }, [movingBlock]);

  // Initial Setup
  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      resetGame();
    }
  }, [gameState]);

  const resetGame = () => {
    const baseBlock: BlockData = {
      id: 0,
      width: GAME_CONFIG.INITIAL_WIDTH_PERCENT,
      x: 50,
      isPerfect: true,
      isArtifact: false,
      colorHex: COLORS.STONE_BASE
    };
    
    setStack([baseBlock]);
    setMovingBlock({
      width: GAME_CONFIG.INITIAL_WIDTH_PERCENT,
      x: 50,
      direction: 1,
      speed: GAME_CONFIG.INITIAL_SPEED,
    });
    scoreRef.current = 0;
    setCameraY(0);
    setEffects([]);
    onScoreUpdate(0);
    startLoop();
  };

  const startLoop = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    const loop = () => {
      updatePosition();
      requestRef.current = requestAnimationFrame(loop);
    };
    requestRef.current = requestAnimationFrame(loop);
  };

  const stopLoop = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const updatePosition = () => {
    const current = movingBlockRef.current;
    let newX = current.x + (current.speed * current.direction);

    // Bounce logic
    if (newX > 100 - (current.width / 2)) {
      newX = 100 - (current.width / 2);
      current.direction = -1;
    } else if (newX < 0 + (current.width / 2)) {
      newX = 0 + (current.width / 2);
      current.direction = 1;
    }

    current.x = newX;
    setMovingBlock({ ...current });
  };

  const handleTap = useCallback(() => {
    if (gameState !== GameState.PLAYING) return;

    const current = movingBlockRef.current;
    const topBlock = stack[stack.length - 1];
    
    // Calculate difference
    const diff = current.x - topBlock.x;
    const absDiff = Math.abs(diff);
    
    let newWidth = topBlock.width - absDiff;
    
    if (newWidth <= 0) {
      endGame();
      return;
    }

    let isPerfect = false;
    let placedX = current.x;

    // Perfect Drop Logic
    if (absDiff <= GAME_CONFIG.TOLERANCE_PERCENT) {
      isPerfect = true;
      placedX = topBlock.x; // Snap to center
      newWidth = topBlock.width; // Restore full width
      
      // Bonus Check
      const isCurrentArtifact = (scoreRef.current + 1) % GAME_CONFIG.ARTIFACT_INTERVAL === 0;

      if (isCurrentArtifact) {
        newWidth = Math.min(newWidth + GAME_CONFIG.ARTIFACT_BONUS_WIDTH, GAME_CONFIG.INITIAL_WIDTH_PERCENT);
        triggerEffect("EXPANDED!", placedX, stack.length);
      } else {
        triggerEffect("PERFECT!", placedX, stack.length);
      }
    } else {
      placedX = topBlock.x + (diff / 2);
    }

    // Update Score
    scoreRef.current += 1;
    onScoreUpdate(scoreRef.current);

    // Check for New Record IN-GAME
    if (scoreRef.current === initialHighScore + 1 && initialHighScore > 0) {
      triggerEffect("NEW RECORD!", 50, stack.length + 2, true);
      // Optional: Add a screen shake or flash
    }

    // Add to stack
    const newBlock: BlockData = {
      id: stack.length,
      width: newWidth,
      x: placedX,
      isPerfect,
      isArtifact: scoreRef.current % GAME_CONFIG.ARTIFACT_INTERVAL === 0,
      colorHex: COLORS.STONE_BASE
    };

    const newStack = [...stack, newBlock];
    setStack(newStack);

    // Camera Movement
    if (newStack.length > 4) {
      setCameraY((prev) => prev + GAME_CONFIG.BLOCK_HEIGHT);
    }

    // Spawn Next Block
    // Speed increases slightly
    const newSpeed = Math.min(
      GAME_CONFIG.MAX_SPEED, 
      GAME_CONFIG.INITIAL_SPEED + (scoreRef.current * 0.002 * GAME_CONFIG.SPEED_INCREMENT)
    );

    // Random start side
    const startDirection = Math.random() > 0.5 ? 1 : -1;
    const startX = startDirection === 1 ? 0 : 100;

    setMovingBlock({
      width: newWidth, // Inherit clipped width
      x: startX,
      direction: startDirection,
      speed: newSpeed
    });

  }, [gameState, stack, onScoreUpdate, initialHighScore]);

  const endGame = () => {
    stopLoop();
    setGameState(GameState.GAME_OVER);
    onGameOver(scoreRef.current);
  };

  const triggerEffect = (text: string, x: number, yIndex: number, isMajor: boolean = false) => {
    const id = Date.now();
    setEffects(prev => [...prev, { id, text, x, y: yIndex * GAME_CONFIG.BLOCK_HEIGHT, isMajor }]);
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id));
    }, isMajor ? 2000 : 800);
  };

  const onCanvasClick = () => {
    if (gameState === GameState.PLAYING) {
      handleTap();
    }
  };

  const stackStyle = {
    transform: `translateY(${cameraY}px)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full z-10 cursor-pointer overflow-hidden touch-manipulation"
      onClick={onCanvasClick}
    >
      {/* Container for game world that moves down */}
      <div 
        className="absolute bottom-0 left-0 w-full h-full transition-transform duration-500 ease-out will-change-transform"
        style={stackStyle}
      >
         {/* Render Stack */}
         {stack.map((block, index) => (
           <div key={block.id} style={{
             position: 'absolute',
             bottom: `${index * GAME_CONFIG.BLOCK_HEIGHT}px`,
             width: '100%',
             height: `${GAME_CONFIG.BLOCK_HEIGHT}px`
           }}>
             <Block data={block} isArtifact={block.isArtifact} />
           </div>
         ))}

         {/* Render Moving Block */}
         {gameState === GameState.PLAYING && (
           <div style={{
             position: 'absolute',
             bottom: `${stack.length * GAME_CONFIG.BLOCK_HEIGHT}px`,
             width: '100%',
             height: `${GAME_CONFIG.BLOCK_HEIGHT}px`
           }}>
             <Block 
              data={movingBlock} 
              isMoving 
              isArtifact={(scoreRef.current + 1) % GAME_CONFIG.ARTIFACT_INTERVAL === 0} 
            />
           </div>
         )}
      </div>

      {/* Effects Overlay */}
      {effects.map(effect => (
        <div 
          key={effect.id}
          className={`
            absolute font-bold ancient-font shadow-black drop-shadow-md
            ${effect.isMajor 
              ? 'text-4xl text-yellow-300 animate-bounce z-50 text-shadow-glow border-text-black' 
              : 'text-xl text-white animate-ping'}
          `}
          style={{
            left: `${effect.x}%`,
            bottom: effect.isMajor ? '60%' : '40%',
            transform: 'translateX(-50%)',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {effect.text}
        </div>
      ))}
    </div>
  );
};

export default GameCanvas;