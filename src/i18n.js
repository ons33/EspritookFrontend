import HttpApi from 'i18next-http-backend'
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
//import i18next from 'i18next';
import cookies from 'js-cookie';
import Backend from 'i18next-http-backend'
import translationEN from'./Tarjamli/en/translation.json'
import translationFR from'./Tarjamli/fr/translation.json'
import translationAR from'./Tarjamli/ar/translation.json'


i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'eng',
    debug: true,

   
      // react: { useSuspense: false },
      resources: {
        en: { translation: translationEN },
        fr: { translation: translationFR },
        ar: { translation: translationAR }
      },
  });
     

  export default i18n;