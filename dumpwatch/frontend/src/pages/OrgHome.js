import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';
import { useTranslation } from 'react-i18next';

const OrgHome = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [orgCommunities, setOrgCommunities] = useState([]);

    useEffect(() => {
        getUserCommunities();
    }, []);

    const navigateToCommunity = () => navigate('/community');
    const navigateToKnowledgeBase = () => navigate('/knowledge-base');

    const getUserCommunities = async () => {
        try {
            const response = await axios.get(`/get-user-place-details/${userId}`);
            setOrgCommunities(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setOrgCommunities([]);
        }
    };

    return (
        <Layout pageTitle={t('orgHome.pageTitle')}>
            <main className="container mx-auto p-4 space-y-6">
                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-green-700 mb-2">{t('orgHome.orgCommunities')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orgCommunities.map((community) => (
                            <div
                                key={community.placeDetailId}
                                className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-[rgb(34,139,34)]">
                                    {community.placeDetail.place.placeName} - {community.placeDetail.postalCode}
                                </h3>
                                <p className="text-gray-700 mt-2">{community.placeDetailDescription}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-black mb-2">{t('orgHome.statsTitle')}</h2>
                    <div className="flex justify-between text-gray-700">
                        <div>
                            <p className="text-lg font-semibold">{t('orgHome.cleanUpsCompleted')}</p>
                            <p className="text-2xl font-bold text-green-700">12,345</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">{t('orgHome.cleanUpsScheduled')}</p>
                            <p className="text-2xl font-bold text-green-700">678</p>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={navigateToCommunity}
                        className="bg-green-700 text-white py-3 px-6 rounded-lg shadow hover:bg-green-800 transition"
                    >
                        {t('orgHome.myCommunities')}
                    </button>
                    <button
                        onClick={navigateToKnowledgeBase}
                        className="bg-[rgb(7,110,203)] text-white py-3 px-6 rounded-lg shadow hover:bg-[rgb(6,99,183)] transition"
                    >
                        {t('orgHome.knowledgeBase')}
                    </button>
                </section>
            </main>
        </Layout>
    );
};

export default OrgHome;
