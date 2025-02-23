// Home.js
import React, { useState } from 'react';
import CreateReportForm from '../components/CreateReportForm';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showSteps, setShowSteps] = useState(true);

    const navigateToCommunity = () => navigate('/community');
    const navigateToKnowledgeBase = () => navigate('/knowledge-base');

    return (
        <Layout pageTitle={t('home.pageTitle')}>
            <main className="container mx-auto p-4 space-y-6">
                {showSteps && (
                    <section className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-green-700 mb-2">{t('home.stepsHeader')}</h2>
                        <ul className="list-decimal pl-6 text-gray-700">
                            <li className="mb-2">{t('home.step1')}</li>
                            <li className="mb-2">{t('home.step2')}</li>
                            <li className="mb-2">{t('home.step3')}</li>
                        </ul>
                        <button
                            onClick={() => setShowSteps(false)}
                            className="mt-4 bg-green-700 text-white py-2 px-4 rounded-lg shadow hover:bg-green-800 transition"
                        >
                            {t('home.gotItButton')}
                        </button>
                    </section>
                )}

                <section className="bg-white p-8 rounded-lg shadow-lg">
                    <CreateReportForm />
                </section>

                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-black mb-2">{t('home.currentStats')}</h2>
                    <div className="flex justify-between text-gray-700">
                        <div>
                            <p className="text-lg font-semibold">{t('home.reportsFiled')}</p>
                            <p className="text-2xl font-bold text-green-700">12,345</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{t('home.communitiesInvolved')}</p>
                            <p className="text-2xl font-bold text-green-700">678</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{t('home.resolvedCases')}</p>
                            <p className="text-2xl font-bold text-green-700">9,876</p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={navigateToCommunity}
                        className="bg-green-700 text-white py-3 px-6 rounded-lg shadow hover:bg-green-800 transition"
                    >
                        {t('home.myCommunities')}
                    </button>
                    <button
                        onClick={navigateToKnowledgeBase}
                        className="bg-[rgb(7,110,203)] text-white py-3 px-6 rounded-lg shadow hover:bg-[rgb(6,99,183)] transition"
                    >
                        {t('home.knowledgeBase')}
                    </button>
                </section>
            </main>
        </Layout>
    );
};

export default Home;
