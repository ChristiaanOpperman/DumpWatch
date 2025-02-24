import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        const newLanguage = e.target.value;
        i18n.changeLanguage(newLanguage);
    };

    return (
        <Layout pageTitle={t('settings.title')}>
            <div className="max-w-4xl mx-auto p-6 bg-gray-200 min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-green-700">{t('settings.title')}</h1>

                <div className="mb-8">
                    <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-2">
                        {t('settings.selectLanguage')}
                    </label>
                    <select
                        id="language"
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700"
                    >
                        <option value="english">English</option>
                        <option value="zulu">Zulu</option>
                        <option value="xhosa">Xhosa</option>
                        <option value="afrikaans">Afrikaans</option>
                    </select>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-2 text-green-700">{t('settings.contactSupport')}</h2>
                    <p className="text-lg text-gray-700">
                        {t('settings.supportEmailText')}{' '}
                        <a href="mailto:dumpwatch@support" className="text-green-700 underline">
                            dumpwatch@support
                        </a>
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsPage;
