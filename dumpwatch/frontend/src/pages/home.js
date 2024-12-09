import React from 'react';
import PostForm from '../components/postForm';

const Home = () => {
    return (
        <div>
            {/* Header Section */}
            <header className="bg-green-700 text-white p-6">
                <div className="container mx-auto">
                    <h1 className="text-4xl font-bold">Welcome to DumpWatch</h1>
                    <p className="mt-2 text-lg">
                        Protecting the environment starts with you. Report illegal dumping and take action today.
                    </p>
                </div>
            </header>

            {/* Main Content Section */}
            <main className="container mx-auto my-10">
                {/* Image Section */}
                <div className="flex justify-center">
                    <img
                        src="https://via.placeholder.com/1200x400" // Replace with your hero image
                        alt="Environmental Protection"
                        className="rounded-lg shadow-lg"
                    />
                </div>

                {/* Info Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
                    <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold text-green-700">Partners</h2>
                        <p className="mt-2">
                            Join us in supporting our cause to protect the environment and stop illegal dumping.
                        </p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold text-green-700">Permits</h2>
                        <p className="mt-2">
                            Participate in our initiatives and learn how you can contribute to a cleaner community.
                        </p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-bold text-green-700">Mission</h2>
                        <p className="mt-2">
                            Empower communities to protect their surroundings and work towards a sustainable future.
                        </p>
                    </div>
                </div>

                {/* Post Form Section */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
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
