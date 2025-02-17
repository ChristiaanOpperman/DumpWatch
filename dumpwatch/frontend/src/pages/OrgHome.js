import React, { useEffect, useState } from 'react';
import CreateReportForm from '../components/CreateReportForm';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from '../api/api';

const OrgHome = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [orgCommunities, setOrgCommunities] = useState([]);

    useEffect(() => {
        getUserCommunities();
    }, []);

    const navigateToCommunity = () => {
        navigate('/community');
    };

    const navigateToKnowledgeBase = () => {
        navigate('/knowledge-base');
    };

    const getUserCommunities = async () => {
        try {
            const response = await axios.get(`/get-user-place-details/${userId}`);
            console.log('User communities:', response);
            setOrgCommunities(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching user communities:', error);
            setOrgCommunities([]);
        }
    }

    return (
        <Layout pageTitle="Administration">
            <main className="container mx-auto p-4 space-y-6">

                {/* Show Organization Communities */}
                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-green-700 mb-2">Orginisation Communities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orgCommunities.map((community) => (
                            <div
                                key={community.placeDetailId}
                                className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold text-[rgb(34,139,34)]">{community.placeDetail.place.placeName} - {community.placeDetail.postalCode}</h3>
                                <p className="text-gray-700 mt-2">{community.placeDetailDescription}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-black mb-2">Our Stats:</h2>
                    <div className="flex justify-between text-gray-700">
                        <div>
                            <p className="text-lg font-semibold">Clean Ups Completed</p>
                            <p className="text-2xl font-bold text-green-700">12,345</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Clean Ups Scheduled</p>
                            <p className="text-2xl font-bold text-green-700">678</p>
                        </div>
                    </div>
                </section>

                {/* Navigation Buttons */}
                <section className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={navigateToCommunity}
                        className="bg-green-700 text-white py-3 px-6 rounded-lg shadow hover:bg-green-800 transition"
                    >
                        My Communities
                    </button>
                    <button
                        onClick={navigateToKnowledgeBase}
                        className="bg-[rgb(7,110,203)] text-white py-3 px-6 rounded-lg shadow hover:bg-[rgb(6,99,183)] transition"
                    >
                        Knowledge Base
                    </button>

                </section>
            </main>
        </Layout>
    );
};

export default OrgHome;
