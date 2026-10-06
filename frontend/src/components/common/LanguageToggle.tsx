import React from 'react';
import { getLang, setLang, t } from '../../i18n';

export const LanguageToggle: React.FC = () => (
  <button
    type="button"
    aria-label="Change language / تغيير اللغة"
    onClick={() => { setLang(getLang() === 'ar' ? 'en' : 'ar'); window.location.reload(); }}
    className="px-2.5 py-1.5 text-sm font-semibold border border-[#E3D6BC] dark:border-[#4A3E2E] btn-press"
  >
    {t('lang.other')}
  </button>
);
