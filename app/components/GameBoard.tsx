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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Победитель!
            </h1>
            <p className="text-xl text-purple-600 font-semibold mb-2">
              {winner.name}
            </p>
            <p className="text-gray-600 mb-6">
              Финальный счёт: {winner.score} очков
            </p>
            
            <button
              onClick={resetGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-colors"
            >
              Новая игра
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">🎯 Домино</h1>
          <div className="flex gap-3">
            <button
              onClick={undoLastAction}
              disabled={history.length === 0}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors"
            >
              ↶ Отменить
            </button>
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
            >
              🔄 Сброс
            </button>
          </div>
        </div>

        {/* Таблица команд */}
        <div className="space-y-2">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              {/* Информация о команде */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <p className="text-2xl font-bold text-purple-600">{team.score} очков</p>
                </div>
              </div>

              {/* Кнопки фиксированных очков */}
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Фиксированные очки:</p>
                <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
                  {fixedPoints.map((points) => (
                    <button
                      key={points}
                      onClick={() => addPoints(team.id, points, 'fixed')}
                      className={`
                        py-1.5 px-2.5 rounded-lg font-medium transition-colors text-sm
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
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Дополнительные очки (округление до кратного 5):
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Введите очки..."
                    value={customPoints[team.id] || ''}
                    onChange={(e) => handleCustomInputChange(team.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomPoints(team.id)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleCustomPoints(team.id)}
                    disabled={!customPoints[team.id] || customPoints[team.id].trim() === ''}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    Добавить
                  </button>
                </div>
                {customPoints[team.id] && customPoints[team.id].trim() !== '' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {parseInt(customPoints[team.id]) || 0} → +{roundUpToNearest5(parseInt(customPoints[team.id]) || 0)} очков
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* История действий */}
        {history.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
            <h3 className="font-medium text-gray-900 mb-2">📋 История игры:</h3>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {history.slice(-5).reverse().map((action) => {
                const team = teams.find((t) => t.id === action.teamId);
                return (
                  <div key={action.id} className="text-sm text-gray-600 flex justify-between">
                    <span>
                      {team?.name}: +{action.points} очков
                      {action.type === 'custom' && ' (доп.)'}
                    </span>
                    <span className="text-gray-400">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 