import React from 'react';
import CreateReportForm from '../components/CreateReportForm';
import Layout from '../components/Layout';

const Home = () => {
    return (
        <Layout pageTitle="Report"> 
            <main  className="container mx-auto ">
                {/* Post Form Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Report an Illegal Dumping</h2>
                    <CreateReportForm />
                </div>
            </main>
        </Layout>
    );
};

export default Home;
