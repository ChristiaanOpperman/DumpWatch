import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';
import CommunityDropdown from '../components/CommunityDropdownForm';
import { useNavigate } from 'react-router-dom';

const CommunityPage = () => {
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
            console.log('placeDetailId', placeDetailId);
            const endpoint = placeDetailId === 'all' ? '/get-reports' : `/get-reports-by-place-details-id/${placeDetailId}`;
            
            const response = await axios.get(endpoint);
            console.log('response', response.data);
            console.log('Reports:', response.data);
            setReports(response.data);
        } catch (err) {
            setError('Failed to load reports');
            setReports([]);
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
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                        {showImages ? 'Hide Images' : 'Show Images'}
                    </button>
                </div>

                {loading && <p className="text-center">Loading reports...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && reports.length === 0 && (
                    <p className="text-center text-gray-500">No reports available.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {reports.map((report) => (
                        <div onClick={() => navigate(`/community/${report.reportId}`)} key={report.reportId} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105">
                            {showImages && (
                                <img src={`http://localhost:8080/${report.imageUrl}`} alt="Posted Illegal Dump" className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <p className="text-sm text-gray-600 mb-2">
                                    Created on: {new Date(report.createdDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-800 font-bold mb-2">
                                    Description: {report.description}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Community: {report.place.placeName}
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
