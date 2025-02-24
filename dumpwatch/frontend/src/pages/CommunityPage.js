import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';
import CommunityDropdown from '../components/CommunityDropdownForm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CommunityPage = () => {
    const { t } = useTranslation();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showImages, setShowImages] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchReports('all');
    }, []);

    const fetchReports = async (placeDetailId) => {
        setLoading(true);
        setError(null);
        try {
            const endpoint = placeDetailId === 'all' ? '/get-reports' : `/get-reports-by-place-details-id/${placeDetailId}`;
            const response = await axios.get(endpoint);
            setReports(response.data);
        } catch (err) {
            setError(t('communityPage.errorLoading') || "Failed to load reports");
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout pageTitle={t('communityPage.pageTitle')}>
            <div className="p-6">
                <h1 className="text-center text-2xl font-bold mb-6">{t('communityPage.reportsHeading')}</h1>
                <CommunityDropdown onSelectCommunity={fetchReports} />

                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setShowImages(!showImages)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                        {showImages ? t('communityPage.hideImages') : t('communityPage.showImages')}
                    </button>
                </div>

                {loading && <p className="text-center">{t('communityPage.loadingReports')}</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!loading && (!reports || reports.length === 0) && (
                    <p className="text-center text-gray-500">{t('communityPage.noReports')}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {reports && reports.length > 0 && reports.map((report) => (
                        <div
                            key={report.reportId}
                            onClick={() => navigate(`/community/${report.reportId}`)}
                            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                        >
                            {showImages && (
                                <img
                                    loading="lazy"
                                    src={`http://localhost:8080/${report.imageUrl}`}
                                    alt="Posted Illegal Dump"
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    {t('communityPage.createdOn')} {new Date(report.createdDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-800 font-bold mb-2">
                                    {t('communityPage.description')} {report.description}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {t('communityPage.community')} {report.place.placeName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default CommunityPage;
