import { create } from 'zustand';

export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface GameAction {
  id: string;
  teamId: number;
  points: number;
  timestamp: number;
  type: 'fixed' | 'custom';
}

interface GameState {
  // Состояние игры
  isGameStarted: boolean;
  teams: Team[];
  winner: Team | null;
  history: GameAction[];
  showConfirmDialog: boolean;
  pendingAction: { teamId: number; points: number } | null;

  // Действия
  initializeGame: (teamCount: number, teamNames?: string[], teamPrefix?: string) => void;
  addPoints: (teamId: number, points: number, type: 'fixed' | 'custom') => void;
  confirmWinningAction: () => void;
  cancelWinningAction: () => void;
  undoLastAction: () => void;
  resetGame: () => void;
  roundUpToNearest5: (value: number) => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Начальное состояние
  isGameStarted: false,
  teams: [],
  winner: null,
  history: [],
  showConfirmDialog: false,
  pendingAction: null,

  // Инициализация игры
  initializeGame: (teamCount: number, teamNames?: string[], teamPrefix?: string) => {
    const defaultPrefix = teamPrefix || 'Команда';
    const teams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: i + 1,
      name: teamNames?.[i]?.trim() || `${defaultPrefix} ${i + 1}`,
      score: 0,
    }));

    set({
      isGameStarted: true,
      teams,
      winner: null,
      history: [],
      showConfirmDialog: false,
      pendingAction: null,
    });
  },

  // Округление до ближайшего кратного 5 вверх
  roundUpToNearest5: (value: number) => {
    return Math.ceil(value / 5) * 5;
  },

  // Добавление очков
  addPoints: (teamId: number, points: number, type: 'fixed' | 'custom') => {
    const { teams, history } = get();

    // Если это +35 И это фиксированные очки (кнопка), показываем диалог подтверждения
    if (points === 35 && type === 'fixed') {
      set({
        showConfirmDialog: true,
        pendingAction: { teamId, points },
      });
      return;
    }

    // Обычное начисление очков
    const updatedTeams = teams.map((team) =>
      team.id === teamId
        ? { ...team, score: team.score + points }
        : team
    );

    const newAction: GameAction = {
      id: Date.now().toString(),
      teamId,
      points,
      timestamp: Date.now(),
      type,
    };

    set({
      teams: updatedTeams,
      history: [...history, newAction],
    });
  },

  // Подтверждение победного действия (+35)
  confirmWinningAction: () => {
    const { teams, history, pendingAction } = get();
    
    if (!pendingAction) return;

    const { teamId, points } = pendingAction;
    
    const updatedTeams = teams.map((team) =>
      team.id === teamId
        ? { ...team, score: team.score + points }
        : team
    );

    const winner = updatedTeams.find((team) => team.id === teamId)!;

    const newAction: GameAction = {
      id: Date.now().toString(),
      teamId,
      points,
      timestamp: Date.now(),
      type: 'fixed',
    };

    set({
      teams: updatedTeams,
      history: [...history, newAction],
      winner,
      showConfirmDialog: false,
      pendingAction: null,
    });
  },

  // Отмена победного действия
  cancelWinningAction: () => {
    set({
      showConfirmDialog: false,
      pendingAction: null,
    });
  },

  // Отмена последнего действия
  undoLastAction: () => {
    const { teams, history } = get();
    
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];
    const updatedTeams = teams.map((team) =>
      team.id === lastAction.teamId
        ? { ...team, score: team.score - lastAction.points }
        : team
    );

    set({
      teams: updatedTeams,
      history: history.slice(0, -1),
      winner: null, // Сбрасываем победителя при отмене
    });
  },

  // Сброс игры
  resetGame: () => {
    set({
      isGameStarted: false,
      teams: [],
      winner: null,
      history: [],
      showConfirmDialog: false,
      pendingAction: null,
    });
  },
})); 