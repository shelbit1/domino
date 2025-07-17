'use client';

import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('ru')}
        className={`
          px-3 py-1 rounded-lg text-sm font-medium transition-colors
          ${
            language === 'ru'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
        `}
      >
        RU
      </button>
      <button
        onClick={() => setLanguage('az')}
        className={`
          px-3 py-1 rounded-lg text-sm font-medium transition-colors
          ${
            language === 'az'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }
        `}
      >
        AZ
      </button>
    </div>
  );
} 