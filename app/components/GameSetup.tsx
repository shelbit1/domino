'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export default function GameSetup() {
  const [selectedTeamCount, setSelectedTeamCount] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '', '']);
  const initializeGame = useGameStore((state) => state.initializeGame);

  const teamOptions = [2, 3, 4];

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleStartGame = () => {
    const relevantTeamNames = teamNames.slice(0, selectedTeamCount);
    initializeGame(selectedTeamCount, relevantTeamNames);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            🎯 Домино
          </h1>
          <p className="text-sm text-gray-600">
            Выберите количество команд для начала игры
          </p>
        </div>

        {/* Карточка настроек */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {/* Выбор команд */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество команд
            </label>
            <div className="grid grid-cols-3 gap-2">
              {teamOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedTeamCount(count)}
                  className={`
                    p-3 rounded-lg border-2 text-center font-medium transition-all
                    ${
                      selectedTeamCount === count
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs mt-0.5">
                    команды
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Названия команд */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Названия команд (необязательно)
            </label>
            <div className="space-y-2">
              {Array.from({ length: selectedTeamCount }, (_, i) => (
                <div key={i}>
                  <input
                    type="text"
                    placeholder={`Команда ${i + 1}`}
                    value={teamNames[i]}
                    onChange={(e) => handleTeamNameChange(i, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    maxLength={20}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Оставьте пустым для названий по умолчанию
            </p>
          </div>

          {/* Информация о правилах */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h3 className="font-medium text-gray-900 mb-1 text-sm">📝 Правила:</h3>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li>• Очки: +5, +10, +15, +20, +25, +30, +35</li>
              <li>• При +35 команда побеждает</li>
              <li>• Доп. очки округляются до кратного 5</li>
              <li>• Можно отменять действия</li>
            </ul>
          </div>

          {/* Кнопка начала игры */}
          <button
            onClick={handleStartGame}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
} 