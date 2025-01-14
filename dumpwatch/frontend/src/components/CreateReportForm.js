import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import imageCompression from 'browser-image-compression';
const CreateReportForm = () => {
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [address, setAddress] = useState('');
    const [province, setProvince] = useState('');

    const userId = '85e50cfa-b63b-11ef-bb4c-f8e9a5819770';

    useEffect(() => {
        if (useCurrentLocation) fetchUserLocation();
    }, [useCurrentLocation]);

    const fetchUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setMessage('Unable to retrieve your location. Please enter it manually.');
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setMessage('Geolocation is not supported by your browser.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const reportData = {
            userId,
            description,
            latitude,
            longitude,
            image,
            address,
            province
        };
        try {
            if (!navigator.onLine) {
                setMessage('Currently offline. Please check your internet connection, and try again.');
                return;
            }

            const formData = new FormData();
            Object.keys(reportData).forEach(key => {
                if (key !== 'image') {
                    formData.append(key, reportData[key]);
                }
            });
            if (image) formData.append('image', image, image.name);

            await axios.post('/create-report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            setMessage('Post uploaded successfully!');
        } catch (error) {
            console.error('Full error:', error);
            
            if (!navigator.onLine) {
                setMessage('No internet connection. Please check your internet connection, and try again.');
            } else {
                setMessage(error.response?.data || 'Failed to upload post. Please try again.');
            }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };

            const compressedFile = await imageCompression(file, options);
            console.log('Original file size:', file.size / 1024 / 1024, 'MB');
            console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');

            setImage(compressedFile);
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <p className={`p-4 rounded-md ${message.includes('successfully' || 'offline') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}
            <div className="flex items-center justify-center">
                <input
                    type="checkbox"
                    id="locationSwitch"
                    checked={useCurrentLocation}
                    onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-green-700 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-green-700 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-green-700 checked:focus:bg-green-700 checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-green-700 dark:checked:after:bg-green-700 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                />
                <label
                    htmlFor="locationSwitch"
                    className="inline-block pl-[0.15rem] hover:cursor-pointer text-sm font-medium text-gray-900"
                >
                    {useCurrentLocation ? 'Use Current Location' : 'Manually Enter Address'}
                </label>
            </div>


            {useCurrentLocation ? (
                <>
                    <div>
                        <label className="block font-bold mb-1">Latitude:</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            readOnly
                            aria-label="Latitude"
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Longitude:</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            readOnly
                            aria-label="Longitude"
                        />
                    </div>
                    <button
                        aria-label="Fetch Location"
                        type="button"
                        onClick={fetchUserLocation}
                        className="flex items-center justify-center bg-[#535A46] text-white px-4 py-2 rounded-lg hover:bg-[#4b523f]"
                    >
                        Refresh Location
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 ml-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </button>
                </>
            ) : (
                <>
                    <div>
                        <label className="block font-bold mb-1">Street Address:</label>
                        <input
                            aria-label="Address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required={!useCurrentLocation}
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-1">Province:</label>
                        <input
                            aria-label="Province"
                            type="text"
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                            required={!useCurrentLocation}
                        />
                    </div>
                </>
            )
            }
            <div>
                <label className="block font-bold mb-1">Image:</label>
                <input
                    aria-label="Report Image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                />
            </div>
            <div>
                <label className="block font-bold mb-1">Description:</label>
                <textarea
                    aria-label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                ></textarea>
            </div>
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                Upload Post
            </button>
        </form >
    );
};

export default CreateReportForm;
