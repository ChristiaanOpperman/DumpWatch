import React, { useState, useEffect, useRef } from 'react';
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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [fileSize, setFileSize] = useState('');

    const userId = '85e50cfa-b63b-11ef-bb4c-f8e9a5819770';
    const imageInputRef = useRef(null);

    useEffect(() => {
        if (useCurrentLocation) fetchUserLocation();
    }, [useCurrentLocation]);

    const fetchUserLocation = () => {
        setIsRefreshing(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setTimeout(() => {
                        setLatitude(position.coords.latitude.toString());
                        setLongitude(position.coords.longitude.toString());
                        setIsRefreshing(false);
                    }, 1000);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setMessage('Unable to retrieve your location. Please enter it manually.');
                    setIsRefreshing(false);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setMessage('Geolocation is not supported by your browser.');
            setIsRefreshing(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            setImage(compressedFile);
            setUploadedFileName(file.name);
            setFileSize(formatFileSize(compressedFile.size));
        } catch (error) {
            console.error('Error compressing image:', error);
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
            province,
        };
        try {
            if (!navigator.onLine) {
                setMessage('Currently offline. Please check your internet connection.');
                return;
            }

            const formData = new FormData();
            Object.keys(reportData).forEach((key) => {
                if (key !== 'image') {
                    formData.append(key, reportData[key]);
                }
            });
            if (image) formData.append('image', image, image.name);

            await axios.post('/create-report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('Post uploaded successfully!');
            setDescription('');
            setImage(null);
            setAddress('');
            setProvince('');
            setUploadedFileName('');
            setFileSize('');
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Post submission error:', error);
            setMessage(error.response?.data || 'Failed to upload post. Please try again.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-center mb-8">Report an Illegal Dumping</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                    <div className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <div className="flex items-center justify-center mb-6">
                    <input
                        type="checkbox"
                        id="locationSwitch"
                        checked={useCurrentLocation}
                        onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-green-700 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-green-700 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0"
                    />
                    <label htmlFor="locationSwitch" className="text-sm font-medium text-gray-900">
                        {useCurrentLocation ? 'Use Current Location' : 'Manually Enter Address'}
                    </label>
                </div>

                {useCurrentLocation ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block font-bold mb-1">Latitude:</label>
                            <input
                                type="text"
                                value={latitude}
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                                readOnly
                                aria-label="Latitude"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">Longitude:</label>
                            <input
                                type="text"
                                value={longitude}
                                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
                                readOnly
                                aria-label="Longitude"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={fetchUserLocation}
                            className="flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50"
                            disabled={isRefreshing}
                        >
                            <span>Refresh Location</span>
                            {isRefreshing ? (<div
                                className="inline-block ml-2 h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                                <span
                                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                                >Loading...</span>
                            </div>) :
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4 ml-2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block font-bold mb-1">Street Address:</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required={!useCurrentLocation}
                                aria-label="Address"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-1">Province:</label>
                            <input
                                type="text"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required={!useCurrentLocation}
                                aria-label="Province"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block font-bold mb-1">Image:</label>
                    <div className="relative">
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            required
                            aria-label="Report Image"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Choose File
                        </label>
                        {uploadedFileName && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">File: {uploadedFileName}</p>
                                <p className="text-xs text-gray-500">Size: {fileSize}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block font-bold mb-1">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 min-h-32"
                        required
                        aria-label="Description"
                    ></textarea>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors duration-200 font-medium"
                    >
                        Upload Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReportForm;