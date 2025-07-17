'use client';

import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function GameSetup() {
  const [selectedTeamCount, setSelectedTeamCount] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['', '', '', '']);
  const initializeGame = useGameStore((state) => state.initializeGame);
  const { t } = useLanguage();

  const teamOptions = [2, 3, 4];

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeamNames = [...teamNames];
    newTeamNames[index] = name;
    setTeamNames(newTeamNames);
  };

  const handleStartGame = () => {
    const relevantTeamNames = teamNames.slice(0, selectedTeamCount);
    const teamPrefix = t('setup.teamPlaceholder');
    initializeGame(selectedTeamCount, relevantTeamNames, teamPrefix);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="w-full max-w-md">
        {/* Заголовок и переключатель языка */}
        <div className="text-center mb-4">
          <div className="flex justify-between items-start mb-2">
            <div></div>
            <LanguageSwitcher />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {t('app.title')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('setup.subtitle')}
          </p>
        </div>

        {/* Карточка настроек */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {/* Выбор команд */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('setup.teamCount')}
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
                    {t('setup.teams')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Названия команд */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('setup.teamNames')}
            </label>
            <div className="space-y-2">
              {Array.from({ length: selectedTeamCount }, (_, i) => (
                <div key={i}>
                  <input
                    type="text"
                    placeholder={`${t('setup.teamPlaceholder')} ${i + 1}`}
                    value={teamNames[i]}
                    onChange={(e) => handleTeamNameChange(i, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    maxLength={20}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('setup.emptyHint')}
            </p>
          </div>

          {/* Информация о правилах */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <h3 className="font-medium text-gray-900 mb-1 text-sm">{t('setup.rules')}</h3>
            <ul className="text-xs text-gray-600 space-y-0.5">
              <li>{t('setup.rulesPoint1')}</li>
              <li>{t('setup.rulesPoint2')}</li>
              <li>{t('setup.rulesPoint3')}</li>
              <li>{t('setup.rulesPoint4')}</li>
            </ul>
          </div>

          {/* Кнопка начала игры */}
          <button
            onClick={handleStartGame}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {t('button.startGame')}
          </button>
        </div>
      </div>
    </div>
  );
} 