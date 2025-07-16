'use client';

import { useGameStore } from '../store/gameStore';
import GameSetup from './GameSetup';
import GameBoard from './GameBoard';
import ConfirmDialog from './ConfirmDialog';

export default function DominoApp() {
  const isGameStarted = useGameStore((state) => state.isGameStarted);

  return (
    <>
      {isGameStarted ? <GameBoard /> : <GameSetup />}
      <ConfirmDialog />
    </>
  );
} 