import React, { useMemo } from 'react';
import { BlockData, MovingBlockState } from '../types';
import { GAME_CONFIG, COLORS } from '../constants';

interface BlockProps {
  data: BlockData | MovingBlockState;
  isMoving?: boolean;
  isArtifact?: boolean;
}

const Block: React.FC<BlockProps> = ({ data, isMoving, isArtifact }) => {
  
  // Calculate style properties
  const style: React.CSSProperties = {
    width: `${data.width}%`,
    left: `${data.x}%`,
    height: `${GAME_CONFIG.BLOCK_HEIGHT}px`,
    transform: 'translateX(-50%)', // Center based on X
    position: 'absolute',
    bottom: isMoving ? `${GAME_CONFIG.BLOCK_HEIGHT * 2}px` : '0px', // Moving block hovers above stack logic handled by parent usually, but for visual we simplify
  };

  // Determine appearance based on block type
  const bgClass = useMemo(() => {
    if (isArtifact) return 'bg-yellow-400 border-yellow-200';
    return 'bg-sand-500 border-sand-300';
  }, [isArtifact]);

  // Texture details
  const texture = useMemo(() => {
    if (isArtifact) {
      return (
        <div className="absolute inset-0 flex items-center justify-center opacity-70">
           {/* Hieroglyph-like symbol for artifact */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8d5524" strokeWidth="2">
             <circle cx="12" cy="12" r="6" />
             <path d="M12 2V6 M12 18V22 M2 12H6 M18 12H22" />
           </svg>
        </div>
      );
    }
    return (
       // Sandstone texture cracks
       <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1 left-2 w-2 h-1 bg-black rounded-full" />
          <div className="absolute bottom-2 right-4 w-3 h-1 bg-black rounded-full" />
       </div>
    );
  }, [isArtifact]);

  return (
    <div 
      style={style} 
      className={`
        ${bgClass} 
        border-4 border-b-black/30 border-r-black/30 border-t-white/30 border-l-white/30 
        shadow-lg transition-transform will-change-transform
        flex items-center justify-center overflow-hidden
        ${isArtifact ? 'shadow-glow z-10' : ''}
      `}
    >
      {texture}
      {/* Decorative center line for aesthetics */}
      <div className={`w-full h-[1px] ${isArtifact ? 'bg-yellow-600' : 'bg-sand-700'} opacity-30`} />
    </div>
  );
};

export default React.memo(Block);
