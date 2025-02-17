import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [userTypeId, setUserTypeId] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        category: '',
    });
    const [errorMessage, setErrorMessage] = useState();
    const [errors, setErrors] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setErrorMessage(undefined);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({ email: '', password: '' });

        if (!validateEmail(formData.email)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
            return;
        }

        if (isRegister && !validatePassword(formData.password)) {
            setErrors((prev) => ({
                ...prev,
                password: 'Password must contain at least 6 characters, including letters and numbers',
            }));
            return;
        }

        const endpoint = isRegister ? '/register' : '/login';
        const payload = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            // make the below a number
            userTypeId: parseInt(userTypeId),
        };

        try {
            console.log('sending: ', payload, ' to : ', endpoint);

            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            console.group('user response: ', result);

            if (response.ok) {
                if (!isRegister) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('userId', result.userId);
                    localStorage.setItem('userType', result.userType);
                    navigate('/home');
                } else {
                    alert('Registration successful! You can now log in.');
                    setIsRegister(false);
                }
            } else {
                setErrorMessage(result.error || 'An unknown error occurred.');
            }
        } catch (error) {
            setErrorMessage('Something went wrong while attempting to log in.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-4">
                    {isRegister ? 'Register' : 'Login'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                        <p className="text-red-600 text-center text-sm mt-2">{errorMessage}</p>
                    )}
                    {isRegister && (
                        <>
                            <div>
                                <label htmlFor="userTypeId" className="block text-sm font-medium text-gray-700">
                                    User Type
                                </label>
                                <select
                                    id="userTypeId"
                                    name="userTypeId"
                                    value={userTypeId}
                                    onChange={(e) => setUserTypeId(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="" disabled>Select user type</option>
                                    <option value="5">Community Member</option>
                                    <option value="1">Volunteer Group</option>
                                    <option value="2">Non-Governmental Organization</option>
                                    <option value="3">Community Organisation</option>
                                    <option value="4">Municipality</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
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
