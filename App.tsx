import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { SHEET_API_URL } from './constants';

// Helper to handle local storage safely
const getStoredHighScore = () => {
  try {
    const stored = localStorage.getItem('pyramid_highscore');
    return stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    return 0;
  }
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore());
  // Track the high score at the start of the session to determine if a new record is set
  const startOfGameHighScoreRef = useRef(getStoredHighScore());

  // Handle high score sync with Google Sheets on mount
  useEffect(() => {
    const fetchHighScore = async () => {
      try {
        const response = await fetch(SHEET_API_URL);
        const data = await response.json();
        if (typeof data.highScore === 'number') {
          // If sheet score is higher than local, use it
          if (data.highScore > highScore) {
            setHighScore(data.highScore);
            startOfGameHighScoreRef.current = data.highScore;
            localStorage.setItem('pyramid_highscore', data.highScore.toString());
          }
        }
      } catch (error) {
        console.error('Failed to fetch high score from Google Sheets:', error);
      }
    };

    fetchHighScore();
  }, []);

  // Handle High Score Persistence and Sync
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem('pyramid_highscore', score.toString());

        // Sync to Google Sheets
        fetch(`${SHEET_API_URL}?score=${score}`)
          .then(res => res.json())
          .catch(err => console.error('Failed to sync score to Google Sheets:', err));
      } catch (e) {
        // Ignore storage errors
      }
    }
  }, [score, highScore]);

  const handleGameOver = (finalScore: number) => {
    // Vibration feedback if available
    if (navigator.vibrate) navigator.vibrate(200);
  };

  const startGame = () => {
    // Update the high score reference point for the new game
    startOfGameHighScoreRef.current = highScore;

    setScore(0);
    setGameState(GameState.PLAYING);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 select-none">

      {/* Background Layer */}
      <div className="absolute inset-0 bg-sunset-gradient z-0">
        {/* Sun */}
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-t from-yellow-500 to-transparent rounded-full opacity-50 blur-3xl" />

        {/* Pyramids in distance */}
        <div className="absolute bottom-[10%] left-[10%] w-40 h-32 bg-slate-800/50 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] blur-[2px]" />
        <div className="absolute bottom-[10%] right-[15%] w-60 h-48 bg-slate-800/60 [clip-path:polygon(50%_0%,_0%_100%,_100%_100%)] blur-[1px]" />

        {/* Dune Foreground */}
        <div className="absolute bottom-0 left-0 w-full h-[15%] bg-sand-900 [clip-path:polygon(0_20%,_100%_40%,_100%_100%,_0%_100%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[10%] bg-sand-700 [clip-path:polygon(0_50%,_100%_20%,_100%_100%,_0%_100%)] opacity-80" />

        {/* Stars */}
        <div className="absolute top-0 left-0 w-full h-1/2 opacity-60">
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-75" />
          <div className="absolute top-32 left-1/2 w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px]" />
        </div>
      </div>

      {/* Game Render Layer */}
      <GameCanvas
        gameState={gameState}
        onGameOver={handleGameOver}
        onScoreUpdate={setScore}
        setGameState={setGameState}
        initialHighScore={startOfGameHighScoreRef.current}
      />

      {/* UI Layer */}
      <UIOverlay
        gameState={gameState}
        score={score}
        highScore={highScore}
        initialHighScore={startOfGameHighScoreRef.current}
        onStart={startGame}
      />

    </div>
  );
};

export default App;