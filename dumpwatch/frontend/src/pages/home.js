import React from 'react';
import PostForm from '../components/PostForm';

const Home = () => {
    return (
        <div>
            {/* Header Section */}
            <header className="bg-green-700 text-white p-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold">DumpWatch</h1>
                    <p className="mt-2 text-lg">
                        Protecting the environment starts with you. Report illegal dumping and take action today.
                    </p>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="container mx-auto my-10">

                {/* Post Form Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Report an Illegal Dumping</h2>
                    <PostForm />
                </div>
            </main>

            {/* Footer Section */}
            <footer className="bg-green-700 text-white p-4 text-center">
                <p>&copy; 2024 DumpWatch. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
