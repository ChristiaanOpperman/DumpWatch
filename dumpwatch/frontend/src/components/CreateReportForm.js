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

    // get user id from local storage
    const userId = parseInt(localStorage.getItem('userId'));
    const imageInputRef = useRef(null);

    useEffect(() => {
        fetchPlaces();

    }, []);

    useEffect(() => {
        if (useCurrentLocation) fetchUserLocation();
    }, [useCurrentLocation]);

    const fetchUserLocation = () => {
        setIsRefreshing(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                    try {
                        const response = await axios.get(`/get-place-by-coordinates?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
                        setPlaceId(response.data.placeId);
                        setPostalCode(response.data.postalCode);
                    } catch (error) {
                        console.error('Error fetching place details:', error);
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

                <div className="flex items-center justify-center mb-6">
                    <input
                        type="checkbox"
                        id="locationSwitch"
                        checked={useCurrentLocation}
                        onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                        // className="mr-2"
                        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-green-700 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-green-700 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0"

                    />
                    <label htmlFor="locationSwitch" className="text-sm font-medium text-gray-900">
                        {useCurrentLocation ? 'Use Current Location' : 'Manually Enter Address'}
                    </label>
                </div>

                {!useCurrentLocation && (
                    <div>
                        <label className="block font-bold mb-1">Select Place:</label>
                        <Select
                            options={placeOptions}
                            value={placeOptions.find(option => option.value === placeId)}
                            onChange={(selectedOption) => {
                                setPlaceId(selectedOption.value);
                                fetchPlaceDetails(selectedOption.value);
                            }}
                            placeholder="Select a place"
                            className="w-full border p-2 rounded-lg"
                            isSearchable
                        />
                    </div>
                )}

                {placeDetails && placeDetails.length > 0 && (
                    <div>
                        <label className="block font-bold mb-1">Postal Code:</label>
                        <Select
                            options={placeDetails.map((detail) => ({ value: detail.placeDetailId, label: detail.postalCode }))}
                            value={placeDetails.find((detail) => detail.value === postalCode)}
                            onChange={(selectedOption) => {
                                setPlaceDetailId(selectedOption.value);
                                setPostalCode(selectedOption.label)}
                            }
                            placeholder="Select a postal code"
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
