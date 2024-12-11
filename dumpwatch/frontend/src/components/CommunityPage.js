import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';

const CommunityPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#C8D9A9] min-h-screen">
                {reports.length === 0 ? (
                    <div className="col-span-full text-center text-[#535A46] font-bold">
                        No reports found
                    </div>
                ) : (
                    reports.map(report => (
                        <div 
                            key={report.ReportId} 
                            className="bg-[#B1D968] p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
                        >
                            {report.image && (
                                <img 
                                    src={report.image} 
                                    alt="Report" 
                                    className="w-full h-48 object-cover rounded-md mb-4 border-4 border-[#83A04D]"
                                />
                            )}
                            <div className="text-[#535A46]">
                                <h2 className="text-lg font-bold mb-2">{report.Description}</h2>
                                <div className="text-sm">
                                    <p className="mb-1">
                                        <span className="font-semibold">Latitude:</span> {report.Latitude}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Longitude:</span> {report.Longitude}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </Layout>
    );
};

export default CommunityPage;