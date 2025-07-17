'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'az';

type TranslationKey = 
  | 'app.title'
  | 'button.cancel' | 'button.confirm' | 'button.add' | 'button.undo' | 'button.reset' | 'button.newGame' | 'button.startGame'
  | 'setup.subtitle' | 'setup.teamCount' | 'setup.teams' | 'setup.teamNames' | 'setup.teamPlaceholder' | 'setup.emptyHint' | 'setup.rules' | 'setup.rulesPoint1' | 'setup.rulesPoint2' | 'setup.rulesPoint3' | 'setup.rulesPoint4'
  | 'game.winner' | 'game.finalScore' | 'game.points' | 'game.fixedPoints' | 'game.customPoints' | 'game.pointsPlaceholder' | 'game.lastActions' | 'game.latest' | 'game.additional'
  | 'confirm.gameEnd' | 'confirm.winDescription' | 'confirm.currentScore' | 'confirm.finalScore' | 'confirm.warning' | 'confirm.warningText';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Словари переводов
const translations: Record<Language, Record<TranslationKey, string>> = {
  ru: {
    // Общие
    'app.title': '🎯 Домино',
    'button.cancel': 'Отмена',
    'button.confirm': 'Подтвердить',
    'button.add': 'Добавить',
    'button.undo': '↶ Отменить',
    'button.reset': '🔄 Сброс',
    'button.newGame': 'Новая игра',
    'button.startGame': 'Начать игру',

    // Настройка игры
    'setup.subtitle': 'Выберите количество команд для начала игры',
    'setup.teamCount': 'Количество команд',
    'setup.teams': 'команды',
    'setup.teamNames': 'Названия команд (необязательно)',
    'setup.teamPlaceholder': 'Команда',
    'setup.emptyHint': 'Оставьте пустым для названий по умолчанию',
    'setup.rules': '📝 Правила:',
    'setup.rulesPoint1': '• Очки: +5, +10, +15, +20, +25, +30, +35',
    'setup.rulesPoint2': '• При +35 команда побеждает',
    'setup.rulesPoint3': '• Доп. очки округляются до кратного 5',
    'setup.rulesPoint4': '• Можно отменять действия',

    // Игровое поле
    'game.winner': 'Победитель!',
    'game.finalScore': 'Финальный счёт:',
    'game.points': 'очков',
    'game.fixedPoints': 'Фиксированные очки:',
    'game.customPoints': 'Дополнительные очки:',
    'game.pointsPlaceholder': 'Очки...',
    'game.lastActions': '📋 Последние действия:',
    'game.latest': 'Последнее:',
    'game.additional': '(доп.)',

    // Диалог подтверждения
    'confirm.gameEnd': 'Завершение игры',
    'confirm.winDescription': 'Команда получает +35 очков и побеждает!',
    'confirm.currentScore': 'Текущий счёт:',
    'confirm.finalScore': 'Финальный счёт:',
    'confirm.warning': 'Внимание!',
    'confirm.warningText': 'После подтверждения игра будет завершена и эта команда станет победителем.',
  },
  az: {
    // Общие
    'app.title': '🎯 Domino',
    'button.cancel': 'Ləğv et',
    'button.confirm': 'Təsdiq et',
    'button.add': 'Əlavə et',
    'button.undo': '↶ Geri al',
    'button.reset': '🔄 Yenidən',
    'button.newGame': 'Yeni oyun',
    'button.startGame': 'Oyunu başlat',

    // Настройка игры
    'setup.subtitle': 'Oyuna başlamaq üçün komanda sayını seçin',
    'setup.teamCount': 'Komanda sayı',
    'setup.teams': 'komanda',
    'setup.teamNames': 'Komanda adları (məcburi deyil)',
    'setup.teamPlaceholder': 'Komanda',
    'setup.emptyHint': 'Standart adlar üçün boş buraxın',
    'setup.rules': '📝 Qaydalar:',
    'setup.rulesPoint1': '• Xallar: +5, +10, +15, +20, +25, +30, +35',
    'setup.rulesPoint2': '• +35-də komanda qazanır',
    'setup.rulesPoint3': '• Əlavə xallar 5-ə qədər yuvarlaqlaşır',
    'setup.rulesPoint4': '• Əməliyyatları ləğv etmək mümkündür',

    // Игровое поле
    'game.winner': 'Qalib!',
    'game.finalScore': 'Son nəticə:',
    'game.points': 'xal',
    'game.fixedPoints': 'Sabit xallar:',
    'game.customPoints': 'Əlavə xallar:',
    'game.pointsPlaceholder': 'Xallar...',
    'game.lastActions': '📋 Son əməliyyatlar:',
    'game.latest': 'Sonuncu:',
    'game.additional': '(əlavə)',

    // Диалог подтверждения
    'confirm.gameEnd': 'Oyunun bitməsi',
    'confirm.winDescription': 'Komanda +35 xal alır və qazanır!',
    'confirm.currentScore': 'Cari nəticə:',
    'confirm.finalScore': 'Son nəticə:',
    'confirm.warning': 'Diqqət!',
    'confirm.warningText': 'Təsdiqdən sonra oyun bitəcək və bu komanda qalib olacaq.',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('ru');

  // Загружаем сохраненный язык при инициализации
  useEffect(() => {
    const savedLanguage = localStorage.getItem('domino-language') as Language;
    if (savedLanguage && ['ru', 'az'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('domino-language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 