import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Layout = ({ children, pageTitle }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();


    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="relative min-h-screen bg-gray-200">
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isDrawerOpen ? 'block' : 'hidden'}`}
                onClick={toggleDrawer}
            ></div>

            <div
                className={`fixed top-0 right-0 h-full bg-white w-64 z-50 transition-transform transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <header className="bg-green-700 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold">Menu</h1>
                    </div>
                    <button aria-label="menu" onClick={toggleDrawer} className="focus:outline-none">
                        <div className="space-y-1">
                            <div className="w-6 h-1 bg-white"></div>
                            <div className="w-6 h-1 bg-white"></div>
                            <div className="w-6 h-1 bg-white"></div>
                        </div>
                    </button>
                </header>

                <nav className="p-4 space-y-4">
                    <Link
                        to="/home"
                        className={`block text-lg font-bold ${window.location.pathname === '/home' ? 'text-green-700' : 'text-gray-500'}`}
                    >
                        Report
                    </Link>
                    <Link
                        to="/community"
                        className={`block text-lg font-bold ${window.location.pathname.includes('/community') ? 'text-green-700' : 'text-gray-500'}`}
                    >
                        Community
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block text-lg font-bold text-gray-500 hover:text-green-700 w-full text-left"
                    >
                        Log Out
                    </button>
                </nav>
            </div>

            <div className="flex flex-col min-h-screen bg-gray-200">
                <header className="bg-green-700 text-white p-6 flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold">DumpWatch</h1>
                            <img src="/mobile-logo.png" alt="DumpWatch Logo" className="h-8 w-8" />
                        </div>
                        <p className="text-m text-gray-300">{pageTitle}</p>
                    </div>
                    <button aria-label="menu-header" onClick={toggleDrawer} className="focus:outline-none">
                        <div className="space-y-1">
                            <div className="w-6 h-1 bg-white"></div>
                            <div className="w-6 h-1 bg-white"></div>
                            <div className="w-6 h-1 bg-white"></div>
                        </div>
                    </button>
                </header>
                <main className="flex-grow">
                    {children}
                </main>
                <footer className="bg-green-700 text-white p-4 text-center">
                    <p>&copy; 2024 DumpWatch. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
