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
  
  // Адаптивные размеры в зависимости от количества команд
  const teamCount = teams.length;
  const isCompact = teamCount >= 3;

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
      <div className={`h-screen bg-gray-50 flex items-center justify-center ${isCompact ? 'p-2' : 'p-4'}`}>
        <div className="w-full max-w-md text-center">
          <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${isCompact ? 'p-6' : 'p-8'}`}>
            <div className={`${isCompact ? 'text-4xl mb-3' : 'text-6xl mb-4'}`}>🏆</div>
            <h1 className={`font-bold text-gray-900 ${isCompact ? 'text-2xl mb-2' : 'text-3xl mb-3'}`}>
              Победитель!
            </h1>
            <p className={`text-purple-600 font-semibold ${isCompact ? 'text-lg mb-1' : 'text-xl mb-2'}`}>
              {winner.name}
            </p>
            <p className={`text-gray-600 ${isCompact ? 'mb-4' : 'mb-6'}`}>
              Финальный счёт: {winner.score} очков
            </p>
            
            <button
              onClick={resetGame}
              className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors ${
                isCompact ? 'py-3 px-4' : 'py-4 px-6'
              }`}
            >
              Новая игра
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-gray-50 overflow-hidden ${isCompact ? 'p-1 sm:p-2' : 'p-3 sm:p-4'}`}>
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Заголовок */}
        <div className={`flex justify-between items-center ${isCompact ? 'mb-2' : 'mb-4'}`}>
          <h1 className={`font-bold text-gray-900 ${isCompact ? 'text-lg' : 'text-2xl'}`}>🎯 Домино</h1>
          <div className={`flex ${isCompact ? 'gap-2' : 'gap-3'}`}>
            <button
              onClick={undoLastAction}
              disabled={history.length === 0}
              className={`bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors ${
                isCompact ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'
              }`}
            >
              ↶ Отменить
            </button>
            <button
              onClick={resetGame}
              className={`bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors ${
                isCompact ? 'px-3 py-1 text-sm' : 'px-4 py-2 text-base'
              }`}
            >
              🔄 Сброс
            </button>
          </div>
        </div>

        {/* Таблица команд */}
        <div className={`flex-1 overflow-y-auto ${isCompact ? 'space-y-1' : 'space-y-3'}`}>
          {teams.map((team) => (
            <div key={team.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 ${isCompact ? 'p-2' : 'p-4'}`}>
              {/* Информация о команде */}
              <div className={`flex justify-between items-center ${isCompact ? 'mb-2' : 'mb-4'}`}>
                <div>
                  <h3 className={`font-semibold text-gray-900 ${isCompact ? 'text-base' : 'text-xl'}`}>{team.name}</h3>
                  <p className={`font-bold text-purple-600 ${isCompact ? 'text-xl' : 'text-3xl'}`}>{team.score} очков</p>
                </div>
              </div>

              {/* Кнопки фиксированных очков */}
              <div className={isCompact ? 'mb-2' : 'mb-4'}>
                <p className={`font-medium text-gray-700 ${isCompact ? 'text-xs mb-1' : 'text-sm mb-3'}`}>Фиксированные очки:</p>
                <div className={`grid grid-cols-7 ${isCompact ? 'gap-1' : 'gap-2'}`}>
                  {fixedPoints.map((points) => (
                    <button
                      key={points}
                      onClick={() => addPoints(team.id, points, 'fixed')}
                      className={`
                        rounded font-medium transition-colors
                        ${isCompact ? 'py-1 px-1 text-xs' : 'py-2 px-2 text-sm'}
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
                <p className={`font-medium text-gray-700 ${isCompact ? 'text-xs mb-1' : 'text-sm mb-2'}`}>
                  Дополнительные очки:
                </p>
                <div className={`flex ${isCompact ? 'gap-1' : 'gap-2'}`}>
                  <input
                    type="number"
                    placeholder="Очки..."
                    value={customPoints[team.id] || ''}
                    onChange={(e) => handleCustomInputChange(team.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomPoints(team.id)}
                    className={`flex-1 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      isCompact ? 'px-2 py-1 text-sm' : 'px-3 py-2 text-base'
                    }`}
                  />
                  <button
                    onClick={() => handleCustomPoints(team.id)}
                    disabled={!customPoints[team.id] || customPoints[team.id].trim() === ''}
                    className={`bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded transition-colors ${
                      isCompact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                    }`}
                  >
                    {isCompact ? '+' : 'Добавить'}
                  </button>
                </div>
                {customPoints[team.id] && customPoints[team.id].trim() !== '' && (
                  <p className={`text-gray-500 ${isCompact ? 'text-xs mt-0.5' : 'text-sm mt-1'}`}>
                    {parseInt(customPoints[team.id]) || 0} → +{roundUpToNearest5(parseInt(customPoints[team.id]) || 0)} очков
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* История действий - адаптивная */}
        {history.length > 0 && (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-100 flex-shrink-0 ${
            isCompact ? 'mt-1 p-2' : 'mt-3 p-3'
          }`}>
            {isCompact ? (
              // Компактная версия - только последнее действие
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
            ) : (
              // Расширенная версия - несколько последних действий
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-sm">📋 Последние действия:</h3>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {history.slice(-3).reverse().map((action) => {
                    const team = teams.find((t) => t.id === action.teamId);
                    return (
                      <div key={action.id} className="text-sm text-gray-600 flex justify-between">
                        <span>
                          {team?.name}: +{action.points} очков
                          {action.type === 'custom' && ' (доп.)'}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 