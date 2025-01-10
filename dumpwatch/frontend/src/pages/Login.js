import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [userType, setUserType] = useState('Community'); // Default type
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organisationName: '',
        category: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isRegister ? '/register' : '/login';
        const payload = {
            email: formData.email,
            password: formData.password,
            userType,
            ...(userType === 'Community' && { firstName: formData.firstName, lastName: formData.lastName }),
            ...(userType === 'Organisation' && { organisationName: formData.organisationName, category: formData.category }),
        };

        const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok) {
            if (!isRegister) {
                localStorage.setItem('token', result.token);
                navigate('/home');
            } else {
                alert('Registration successful! You can now log in.');
                setIsRegister(false);
            }
        } else {
            alert(result.error || 'Something went wrong.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
                    {isRegister ? 'Register' : 'Login'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <>
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                                    User Type
                                </label>
                                <select
                                    id="userType"
                                    name="userType"
                                    value={userType}
                                    onChange={(e) => setUserType(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Community">Community Member</option>
                                    <option value="Organisation">Organisation</option>
                                </select>
                            </div>
                            {userType === 'Community' && (
                                <>
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            {userType === 'Organisation' && (
                                <>
                                    <div>
                                        <label htmlFor="organisationName" className="block text-sm font-medium text-gray-700">
                                            Organisation Name
                                        </label>
                                        <input
                                            type="text"
                                            id="organisationName"
                                            name="organisationName"
                                            value={formData.organisationName}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        >
                                            <option value="" disabled>
                                                Select a category
                                            </option>
                                            <option value="Volunteer Group">Volunteer Group</option>
                                            <option value="Non-Governmental Organization">Non-Governmental Organization</option>
                                            <option value="Community Organisation">Community Organisation</option>
                                            <option value="Municipality">Municipality</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition"
                    >
                        {isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    {isRegister ? 'Already have an account?' : 'Don’t have an account?'}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-green-700 ml-1 hover:underline"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
