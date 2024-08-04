'use client';

import type { ChangeEventHandler, FC } from 'react';

import type { LocaleConfig } from '@/types';

type SimpleLocaleConfig = Pick<LocaleConfig, 'name' | 'code'>;

type LanguageSwitcherProps = {
  onChange?: (newLocale: SimpleLocaleConfig) => void;
  currentLanguage: string;
  availableLanguages: Array<SimpleLocaleConfig>;
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  onChange = () => {},
  currentLanguage,
  availableLanguages,
}) => {
  const handleChange: ChangeEventHandler<HTMLSelectElement> = event => {
    const newLocale = availableLanguages.find(({ code }) => code === event.target.value);
    if (!newLocale) return;
    if (newLocale.code === currentLanguage) return;
    onChange(newLocale);
  };

  return (
    <select
      onChange={handleChange}
      value={currentLanguage}
      className="border border-gray-300 font-medium focus:outline-none focus-visible:ring"
    >
      {availableLanguages.map(({ name, code }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
};
