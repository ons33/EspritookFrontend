import { Suspense } from "react";
import { useTranslation } from "react-i18next";

const locales ={
    en:{title: 'English'},
    ar:{title:'Arabic'},
    fr:{title:" Français"}
};
function Test(){

    const { t, i18n} = useTranslation()


    return(
        <div>
            <ul>
                {Object.keys(locales).map((locale) =>(
                    <li key={locale}><button style={{fontWeight:i18n.resolvedLanguage ===locale ? 'bold': 'normal'} } type="submit" onClick={() => i18n.changeLanguage(locale)}>
                            {locales[locale].title}
                    </button>
                
                    </li>
                ))}
            </ul>
            <h1>{t('welcome')}</h1>
        </div>
    )
}
export default function WrappedApp(){
    return (
        <Suspense fallback="---Loading">
            <Test/>
        </Suspense>
    )
}




