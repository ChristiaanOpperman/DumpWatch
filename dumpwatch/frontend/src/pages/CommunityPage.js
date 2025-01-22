import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';
import CommunityDropdown from '../components/CommunityDropdownForm';

const CommunityPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showImages, setShowImages] = useState(false);

    useEffect(() => {
        fetchReports('all');
    }, []);

    const fetchReports = async (communityId) => {
        setLoading(true);
        try {
            const endpoint = communityId === 'all' ? '/get-reports' : `/get-reports/${communityId}`;
            const response = await axios.get(endpoint);
            setReports(response.data);
        } catch (err) {
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout pageTitle="Community">
            <div className="p-6">
                <h1 className="text-center text-2xl font-bold mb-6">Community Reports</h1>
                <CommunityDropdown onSelectCommunity={fetchReports} />

                <div className="flex justify-center mb-4">
                    <button
                        onClick={() => setShowImages(!showImages)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showImages ? 'Hide Images' : 'Show Images'}
                    </button>
                </div>

                {loading && <p className="text-center">Loading reports...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {reports.map((report) => (
                        <div key={report.ReportId} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105">
                            {showImages && (
                                <img src={`http://localhost:8080/${report.ImageURL}`} alt="Posted Illegal Dump" className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Created on: {new Date(report.CreatedDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-800 font-bold mb-2">
                                    Description: {report.Description}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Latitude: {report.Latitude}, Longitude: {report.Longitude}
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
