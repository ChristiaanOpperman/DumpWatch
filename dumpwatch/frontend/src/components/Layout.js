import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children, pageTitle }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <div className="relative min-h-screen bg-gray-100">
            {/* Menu Drawer */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isDrawerOpen ? 'block' : 'hidden'}`}
                onClick={toggleDrawer}
            ></div>

            <div className={`fixed top-0 left-0 h-full bg-white w-64 z-50 transition-transform transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="p-4 space-y-4">
                    <Link to="/" className="block text-lg font-bold text-green-700">Report</Link>
                    <Link to="/community" className="block text-lg font-bold text-green-700">Community</Link>
                </nav>
            </div>

            {/* Header */}
            <header className="bg-green-700 text-white p-6 flex justify-between items-center">
                <button onClick={toggleDrawer} className="focus:outline-none">
                    <div className="space-y-1">
                        <div className="w-6 h-1 bg-white"></div>
                        <div className="w-6 h-1 bg-white"></div>
                        <div className="w-6 h-1 bg-white"></div>
                    </div>
                </button>
                <h1 className="text-2xl font-bold">{pageTitle}</h1>
            </header>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-green-700 text-white p-4 text-center">
                <p>&copy; 2024 DumpWatch. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
