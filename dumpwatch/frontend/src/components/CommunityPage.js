import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';

const CommunityPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showImages, setShowImages] = useState(false); // State to toggle image visibility

    const fetchReports = async () => {
        try {
            const response = await axios.get('/get-reports');
            console.log('Reports:', response.data);
            setReports(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Failed to load reports');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) {
        return (
            <Layout pageTitle="Community">
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-[#535A46] font-bold">Loading reports...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout pageTitle="Community">
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-red-600 font-bold">{error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout pageTitle="Community">
            <div className="bg-gray-200 p-6">
                <h1 className="text-center text-[#535A46] font-bold text-2xl mb-6">Community Reports</h1>
                
                <div className="flex justify-center mb-4">
                    <button 
                        onClick={() => setShowImages(!showImages)} 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showImages ? 'Hide Images' : 'Show Images'}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {reports.map((report) => (
                        <div key={report.ReportId} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {showImages && (
                                <img
                                    src={`http://localhost:8080/${report.ImageURL}`} 
                                    alt="Posted Illegal Dump"
                                    className="w-full h-48 object-cover"
                                />
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
