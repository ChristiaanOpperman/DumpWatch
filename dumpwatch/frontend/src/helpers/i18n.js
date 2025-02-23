import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationZU from './locales/zu/translation.json';
import translationSI from './locales/si/translation.json';
import translationXH from './locales/xh/translation.json';
import translationAF from './locales/af/translation.json';

const resources = {
    english: { translation: translationEN },
    zulu: { translation: translationZU },
    sipedi: { translation: translationSI },
    xhosa: { translation: translationXH },
    afrikaans: { translation: translationAF }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'english',
        debug: false,
        interpolation: { escapeValue: false }
    });

export default i18n;