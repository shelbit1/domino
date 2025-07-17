'use client';

import { useGameStore } from '../store/gameStore';
import { useLanguage } from '../context/LanguageContext';

export default function ConfirmDialog() {
  const {
    showConfirmDialog,
    pendingAction,
    teams,
    confirmWinningAction,
    cancelWinningAction,
  } = useGameStore();
  const { t } = useLanguage();

  if (!showConfirmDialog || !pendingAction) return null;

  const team = teams.find((t) => t.id === pendingAction.teamId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md">
        {/* Иконка и заголовок */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('confirm.gameEnd')}
          </h2>
          <p className="text-gray-600">
            {t('confirm.winDescription')}
          </p>
        </div>

        {/* Информация о команде */}
        <div className="bg-purple-50 rounded-xl p-4 mb-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 mb-1">
              {team?.name}
            </h3>
            <p className="text-purple-700">
              {t('confirm.currentScore')} {team?.score} {t('game.points')}
            </p>
            <p className="text-lg font-bold text-purple-900 mt-2">
              {t('confirm.finalScore')} {(team?.score || 0) + 35} {t('game.points')}
            </p>
          </div>
        </div>

        {/* Предупреждение */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex">
            <div className="text-amber-600 text-xl mr-3">⚠️</div>
            <div>
              <h4 className="font-medium text-amber-900 mb-1">
                {t('confirm.warning')}
              </h4>
              <p className="text-sm text-amber-700">
                {t('confirm.warningText')}
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <button
            onClick={cancelWinningAction}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            {t('button.cancel')}
          </button>
          <button
            onClick={confirmWinningAction}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors"
          >
            {t('button.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
} 