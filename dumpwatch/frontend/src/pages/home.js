import React, { useState } from 'react';
import CreateReportForm from '../components/CreateReportForm';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [showSteps, setShowSteps] = useState(true); // State to toggle steps visibility


    const navigateToCommunity = () => {
        navigate('/community');
    };

    return (
        <Layout pageTitle="Report Illegal Dumping">
            <main className="container mx-auto p-4 space-y-6">
                {/* Steps Section */}
                {showSteps && (
                    <section className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-green-700 mb-2">How to Report Illegal Dumping</h2>
                        <ul className="list-decimal pl-6 text-gray-700">
                            <li className="mb-2">
                                <strong>Step 1:</strong> Provide the location details – use GPS or type it manually.
                            </li>
                            <li className="mb-2">
                                <strong>Step 2:</strong> Add a description and attach an image of the mess.
                            </li>
                            <li className="mb-2">
                                <strong>Step 3:</strong> Click <em>Upload Post</em>. You've done your part to keep the planet clean!
                            </li>
                        </ul>
                        <button
                            onClick={() => setShowSteps(false)} // Hide steps on click
                            className="mt-4 bg-green-700 text-white py-2 px-4 rounded-lg shadow hover:bg-green-800 transition"
                        >
                            Got it!
                        </button>
                    </section>
                )}

                {/* Report Form */}
                <section className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Report an Illegal Dumping</h2>
                    <CreateReportForm />
                </section>

                {/* Stats Section */}
                <section className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-black mb-2">Current Stats</h2>
                    <div className="flex justify-between text-gray-700">
                        <div>
                            <p className="text-lg font-semibold">Reports Filed</p>
                            <p className="text-2xl font-bold text-green-700">12,345</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Communities Involved</p>
                            <p className="text-2xl font-bold text-green-700">678</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Resolved Cases</p>
                            <p className="text-2xl font-bold text-green-700">9,876</p>
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
                        onClick={navigateToCommunity}
                        className="bg-[rgb(7,110,203)] text-white py-3 px-6 rounded-lg shadow hover:bg-[rgb(6,99,183)] transition"
                    >
                        Knowledge Base
                    </button>

                </section>
            </main>
        </Layout>
    );
};

export default Home;
