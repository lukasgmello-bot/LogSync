import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div>
      <label htmlFor="language-select">{i18n.t('language')}: </label>
      <select
        id="language-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="pt">{i18n.t('portuguese')}</option>
        <option value="es">{i18n.t('spanish')}</option>
        <option value="en">{i18n.t('english')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
