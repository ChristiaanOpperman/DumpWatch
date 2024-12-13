import React from 'react';
import PostForm from '../components/PostForm';
import Layout from '../components/Layout';

const Home = () => {
    return (
        <Layout pageTitle="Report"> 
            <main  className="container mx-auto my-10">
                {/* Post Form Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Report an Illegal Dumping</h2>
                    <PostForm />
                </div>
            </main>
        </Layout>
    );
};

export default Home;
