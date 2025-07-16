'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameBoard() {
  const {
    teams,
    winner,
    history,
    resetGame,
    addPoints,
    undoLastAction,
    roundUpToNearest5,
  } = useGameStore();

  const [customPoints, setCustomPoints] = useState<{ [key: number]: string }>({});

  const fixedPoints = [5, 10, 15, 20, 25, 30, 35];

  const handleCustomPoints = (teamId: number) => {
    const inputValue = customPoints[teamId];
    if (!inputValue || inputValue.trim() === '') return;

    const points = parseInt(inputValue);
    if (isNaN(points) || points <= 0) return;

    const roundedPoints = roundUpToNearest5(points);
    addPoints(teamId, roundedPoints, 'custom');
    
    // Очищаем поле ввода
    setCustomPoints(prev => ({ ...prev, [teamId]: '' }));
  };

  const handleCustomInputChange = (teamId: number, value: string) => {
    setCustomPoints(prev => ({ ...prev, [teamId]: value }));
  };

  if (winner) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-2">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-4xl mb-3">🏆</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Победитель!
            </h1>
            <p className="text-lg text-purple-600 font-semibold mb-1">
              {winner.name}
            </p>
            <p className="text-gray-600 mb-4">
              Финальный счёт: {winner.score} очков
            </p>
            
            <button
              onClick={resetGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Новая игра
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 p-1 sm:p-2 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold text-gray-900">🎯 Домино</h1>
          <div className="flex gap-2">
            <button
              onClick={undoLastAction}
              disabled={history.length === 0}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              ↶ Отменить
            </button>
            <button
              onClick={resetGame}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Сброс
            </button>
          </div>
        </div>

        {/* Таблица команд */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              {/* Информация о команде */}
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-xl font-bold text-purple-600">{team.score} очков</p>
                </div>
              </div>

              {/* Кнопки фиксированных очков */}
              <div className="mb-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Фиксированные очки:</p>
                <div className="grid grid-cols-7 gap-1">
                  {fixedPoints.map((points) => (
                    <button
                      key={points}
                      onClick={() => addPoints(team.id, points, 'fixed')}
                      className={`
                        py-1 px-1 rounded font-medium transition-colors text-xs
                        ${
                          points === 35
                            ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200'
                        }
                      `}
                    >
                      +{points}
                    </button>
                  ))}
                </div>
              </div>

              {/* Дополнительные очки */}
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Дополнительные очки:
                </p>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Очки..."
                    value={customPoints[team.id] || ''}
                    onChange={(e) => handleCustomInputChange(team.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomPoints(team.id)}
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleCustomPoints(team.id)}
                    disabled={!customPoints[team.id] || customPoints[team.id].trim() === ''}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-colors"
                  >
                    +
                  </button>
                </div>
                {customPoints[team.id] && customPoints[team.id].trim() !== '' && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {parseInt(customPoints[team.id]) || 0} → +{roundUpToNearest5(parseInt(customPoints[team.id]) || 0)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* История действий - компактная */}
        {history.length > 0 && (
          <div className="mt-1 bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex-shrink-0">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="font-medium">Последнее:</span>
              {(() => {
                const lastAction = history[history.length - 1];
                const team = teams.find((t) => t.id === lastAction.teamId);
                return (
                  <span>
                    {team?.name}: +{lastAction.points}{lastAction.type === 'custom' && '*'}
                  </span>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 