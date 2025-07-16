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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Домино
          </h1>
          <p className="text-gray-600">
            Выберите количество команд для начала игры
          </p>
        </div>

        {/* Карточка настроек */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Выбор команд */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Количество команд
            </label>
            <div className="grid grid-cols-3 gap-3">
              {teamOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedTeamCount(count)}
                  className={`
                    p-4 rounded-xl border-2 text-center font-medium transition-all
                    ${
                      selectedTeamCount === count
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs mt-1">
                    {count === 2 ? 'команды' : 'команды'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Названия команд */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Названия команд (необязательно)
            </label>
            <div className="space-y-3">
              {Array.from({ length: selectedTeamCount }, (_, i) => (
                <div key={i}>
                  <input
                    type="text"
                    placeholder={`Команда ${i + 1}`}
                    value={teamNames[i]}
                    onChange={(e) => handleTeamNameChange(i, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    maxLength={20}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Оставьте пустым для использования названий по умолчанию
            </p>
          </div>

          {/* Информация о правилах */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">📝 Правила игры:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Начисляйте очки: +5, +10, +15, +20, +25, +30, +35</li>
              <li>• При получении +35 команда побеждает</li>
              <li>• Дополнительные очки округляются до кратного 5</li>
              <li>• Можно отменять последние действия</li>
            </ul>
          </div>

          {/* Кнопка начала игры */}
          <button
            onClick={handleStartGame}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-colors"
          >
            Начать игру
          </button>
        </div>
      </div>
    </div>
  );
} 