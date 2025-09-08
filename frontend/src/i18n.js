import i18n from 'i18next'
import {initReactI18next} from "react-i18next";
import arabicTranslation from './translation/ar.json'

const resources = {
    ar: {
        translation: arabicTranslation
    }
}
i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "ar",
        interpolation: {
            escapeValue: false
        }
    })
export default i18n;
