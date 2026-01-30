import React from 'react';
import { GameState } from '../types';
import { TEXTS } from '../constants';

interface UIOverlayProps {
  gameState: GameState;
  score: number;
  highScore: number;
  initialHighScore: number;
  onStart: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, score, highScore, initialHighScore, onStart }) => {
  if (gameState === GameState.PLAYING) {
    return (
      <div className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-start pointer-events-none">
        <div className="text-white drop-shadow-md">
           <h3 className="text-xs text-sand-300 font-bold tracking-widest uppercase">High Score</h3>
           <p className="text-2xl font-black ancient-font">{highScore}</p>
        </div>
        <div className="text-white drop-shadow-md text-right">
           <h3 className="text-xs text-sand-300 font-bold tracking-widest uppercase">{TEXTS.SCORE_LABEL}</h3>
           <p className="text-4xl font-black ancient-font text-egypt-gold">{score}</p>
        </div>
      </div>
    );
  }

  const isGameOver = gameState === GameState.GAME_OVER;
  const isNewRecord = isGameOver && score > initialHighScore && score > 0;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center animate-fade-in overflow-hidden">
      
      {/* Branding Header */}
      <div className="absolute top-8 left-0 w-full text-center">
        <h2 className="text-sand-300 text-xs md:text-sm font-bold tracking-widest uppercase opacity-80">
          FIRST Tech Challenge Vietnam <span className="mx-2">|</span> Mini Game
        </h2>
      </div>

      {/* Main Card */}
      <div className={`
        relative mb-8 p-1 transform transition-all duration-500
        ${isNewRecord ? 'scale-110 rotate-0' : 'rotate-1'}
      `}>
        {/* Glowing border effect for new record */}
        {isNewRecord && (
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-lg blur-xl opacity-75 animate-pulse" />
        )}

        <div className={`
          relative bg-egypt-blue p-8 border-4 shadow-2xl
          ${isNewRecord ? 'border-yellow-400' : 'border-sand-300'}
        `}>
          <h1 className="text-4xl md:text-5xl text-egypt-gold font-black ancient-font mb-4 drop-shadow-lg tracking-wider">
            {TEXTS.TITLE}
          </h1>
          <div className="w-24 h-1 bg-sand-500 mx-auto rounded-full mb-6"></div>
          
          {isGameOver && (
             <div className="mb-8">
               {isNewRecord ? (
                 <div className="animate-bounce">
                   <p className="text-yellow-400 text-lg font-bold uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
                     🏆 New Record! 🏆
                   </p>
                   <p className="text-7xl text-white font-black ancient-font mb-2 drop-shadow-xl text-shadow-glow">{score}</p>
                   <p className="text-yellow-200 text-sm">History Rewritten</p>
                 </div>
               ) : (
                 <>
                   <p className="text-sand-300 text-sm uppercase tracking-widest mb-1">Dynasty Ended</p>
                   <p className="text-6xl text-white font-black ancient-font mb-2">{score}</p>
                   <p className="text-sand-300 text-sm">Years Reigned</p>
                 </>
               )}
             </div>
          )}

          {!isGameOver && (
            <div className="mb-8 text-sand-300">
              <p className="mb-2">Stack blocks perfectly.</p>
              <p className="mb-2">Find <span className="text-yellow-400 font-bold">Golden Artifacts</span> to expand.</p>
              <p>One tap controls everything.</p>
            </div>
          )}

          <button 
            onClick={onStart}
            className={`
              group relative px-10 py-5 text-black font-bold text-xl ancient-font uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 border-2
              ${isNewRecord 
                ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 border-white shadow-[0_0_30px_rgba(234,179,8,0.8)]' 
                : 'bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]'}
            `}
          >
            <span className="relative z-10">{isGameOver ? TEXTS.RESTART : TEXTS.START}</span>
            <div className="absolute inset-0 bg-white/40 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="text-sand-500 text-xs font-mono bg-black/40 px-3 py-1 rounded-full">
        HIGH SCORE: {highScore}
      </div>
      
      {/* Branding Footer (Duplicate/Alternative position) */}
      <div className="absolute bottom-4 left-0 w-full text-center opacity-50">
         <p className="text-[10px] text-sand-700 tracking-[0.2em] font-serif">POWERED BY FIRST TECH CHALLENGE VIETNAM</p>
      </div>

      {/* Confetti-like particles for new record (Simple CSS implementation) */}
      {isNewRecord && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${1 + Math.random()}s`,
                animationDelay: `${Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UIOverlay;