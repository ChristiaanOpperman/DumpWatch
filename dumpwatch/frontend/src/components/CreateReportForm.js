import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/api';
import imageCompression from 'browser-image-compression';
import Select from 'react-select';


const CreateReportForm = () => {
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [postalCode, setPostalCode] = useState();
    const [placeId, setPlaceId] = useState();
    const [placeDetailId, setPlaceDetailId] = useState();
    const [places, setPlaces] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [placeOptions, setPlaceOptions] = useState([]);
    const [placeDetails, setPlaceDetails] = useState([]);
    const [locationMode, setLocationMode] = useState("community");
    const [userCommunities, setUserCommunities] = useState([]);



    // get user id from local storage
    const userId = parseInt(localStorage.getItem('userId'));
    const imageInputRef = useRef(null);

    useEffect(() => {
        fetchPlaces();
        getUserCommunities();
    }, []);

    useEffect(() => {
        if (useCurrentLocation) fetchUserLocation();
    }, [useCurrentLocation]);


    const getUserCommunities = async () => {
        try {
            const response = await axios.get(`/get-user-place-details/${userId}`);
            console.log('User communities:', response);
            setUserCommunities(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching user communities:', error);
            setUserCommunities([]);
        }
    }

    const fetchUserLocation = () => {
        setIsRefreshing(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude.toFixed(8);
                    const lng = position.coords.longitude.toFixed(8);
                    setLatitude(lat);
                    setLongitude(lng);
                    try {
                        const response = await axios.get(`/get-place-by-coordinates?lat=${lat}&lng=${lng}`);
                        const placeOptions = response.data.map((place) => ({
                            value: place.placeId,
                            label: place.placeName
                        }));
                        setPlaceOptions(placeOptions);
                    } catch (error) {
                        console.error('Error fetching place details:', error);
                        setMessage('Could not find details for your location.');
                    }
                    setIsRefreshing(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setMessage('Unable to retrieve your location. Please enter it manually.');
                    setIsRefreshing(false);
                }
            );
        } else {
            setMessage('Geolocation is not supported by your browser.');
            setIsRefreshing(false);
        }
    };

    const fetchPlaces = async () => {
        try {
            const response = await axios.get('/get-places');
            let places = response.data;
            console.log('Places:', places);
            setPlaces(places);
            const placeOptions = places.map((place) => ({
                value: place.placeId,
                label: place.placeName,
            }));
            setPlaceOptions(placeOptions);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    const fetchPlaceDetails = async (placeId) => {
        try {
            const response = await axios.get(`/get-place-details/${placeId}`);
            let placeDetails = response.data;
            setPlaceDetails(placeDetails.details);
            console.log('Place details:', placeDetails);
        } catch (error) {
            console.error('Error fetching place details:', error);
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
            placeDetailId,
            image,
        };
        console.log('Report data:', reportData);
        try {
            const formData = new FormData();
            Object.keys(reportData).forEach((key) => {
                if (key !== 'image') {
                    formData.append(key, reportData[key]);
                }
            });
            if (image) formData.append('image', image, image.name);

            console.log('Form data before sending:', [...formData.entries()]);

            await axios.post('/create-report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('Post uploaded successfully!');
            setDescription('');
            setImage(null);
            setPostalCode('');
            setPlaceDetailId();
            setPlaceId('');
            setUploadedFileName('');
            setFileSize('');
            if (imageInputRef.current) imageInputRef.current.value = '';
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

                <div className="flex space-x-4">
                    <button
                        className={`py-2 px-4 rounded-lg ${locationMode === "community" ? "bg-green-700 text-white" : "bg-gray-300"}`}
                        onClick={() => setLocationMode("community")}
                    >
                        In My Community
                    </button>
                    <button
                        className={`py-2 px-4 rounded-lg ${locationMode === "current" ? "bg-green-700 text-white" : "bg-gray-300"}`}
                        onClick={() => {
                            setLocationMode("current")
                            fetchUserLocation();
                        }}
                    >
                        Use Current Location
                    </button>
                    <button
                        className={`py-2 px-4 rounded-lg ${locationMode === "manual" ? "bg-green-700 text-white" : "bg-gray-300"}`}
                        onClick={() => {
                            setLocationMode("manual")
                            fetchPlaces();
                        }}
                    >
                        Manually Enter Address
                    </button>
                </div>
                {locationMode === "current" && (
                    <>
                        <div>
                            <label className="block font-bold mb-5">Places Near You:</label>
                            <Select
                                options={placeOptions}
                                value={placeOptions.find(option => option.value === placeId)}
                                onChange={(selectedOption) => {
                                    console.log('Selected option:', selectedOption);
                                    setPlaceId(selectedOption.value);
                                    fetchPlaceDetails(selectedOption.value);
                                }}
                                placeholder="Select a place"
                                className="w-full border p-2 rounded-lg"
                                isSearchable
                            />
                        </div>
                        {placeDetails && placeDetails.length > 0 && (
                            <div>
                                <label className="block font-bold mb-1">Postal Code:</label>
                                <Select
                                    options={placeDetails.map((detail) => ({ value: detail.placeDetailId, label: detail.postalCode }))}
                                    value={placeDetails.find((detail) => detail.value === postalCode)}
                                    onChange={(selectedOption) => {
                                        setPostalCode(selectedOption.label)
                                    }
                                    }
                                    placeholder="Select a postal code"
                                    className="w-full border p-2 rounded-lg"
                                    isSearchable
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={fetchUserLocation}
                            className="flex items-center justify-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 mt-5"
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
                    </>
                )}
                {locationMode === "manual" && (
                    <div>
                        <label className="block font-bold mb-1">Select Place:</label>
                        <Select
                            options={placeOptions}
                            value={placeOptions.find(option => option.value === placeId)}
                            onChange={(selectedOption) => {
                                setPlaceId(selectedOption.value);
                                fetchPlaceDetails(selectedOption.value);
                            }}
                            className="w-full border p-2 rounded-lg"
                            isSearchable
                        />
                        {placeDetails.length > 0 && (
                            <Select
                                options={placeDetails.map(detail => ({ value: detail.placeDetailId, label: detail.postalCode }))}
                                value={placeDetails.find(detail => detail.value === postalCode)}
                                onChange={(selectedOption) => {
                                    setPostalCode(selectedOption.label);
                                    setPlaceDetailId(selectedOption.value);
                                }}
                                className="w-full border p-2 rounded-lg mt-2"
                                isSearchable
                            />
                        )}
                    </div>
                )}

                {locationMode === "community" && (
                    <div>
                        <label className="block font-bold mb-1">Select From Your Communities:</label>
                        <Select
                            options={userCommunities.map(comm => ({
                                value: comm.placeDetailId,
                                label: `${comm.placeDetail.place.placeName} - ${comm.placeDetail.postalCode}`,
                            }))}
                            value={userCommunities.find(option => option.value === placeDetailId)}
                            onChange={(selectedOption) => {
                                setPlaceDetailId(selectedOption.value);
                            }}
                            className="w-full border p-2 rounded-lg"
                            isSearchable
                        />
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
                    ></textarea>
                </div>

                <div className="flex justify-center">
                    <button type="submit" className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800">
                        Upload Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReportForm;
