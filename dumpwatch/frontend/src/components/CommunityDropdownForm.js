import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Select from 'react-select';


const CommunityDropdown = ({ onSelectCommunity }) => {
    const [userCommunities, setUserCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [isRefreshing, setIsRefreshing] = useState('');
    const [placeOptions, setPlaceOptions] = useState([]);
    const [placeId, setPlaceId] = useState();
    const [message, setMessage] = useState('');
    const userId = localStorage.getItem('userId');
    const [placeDetails, setPlaceDetails] = useState([]);


    useEffect(() => {
        getUserCommunities();
        fetchPlaces();
    }, []);

    useEffect(() => {
        if (useCurrentLocation) {
            fetchUserLocation()
        }
        else {
            fetchPlaces()
        }
    }, [useCurrentLocation]);

    const fetchPlaces = async () => {
        try {
            const response = await axios.get('/get-places');
            let places = response.data;
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
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const communityData = {
            placeId: placeId,
            postalCode: postalCode,
            userId: userId,
        };
        const formData = new FormData();
        Object.keys(communityData).forEach((key) => {
            formData.append(key, communityData[key]);
        })
        console.log('communitydata: ', communityData);
        try {
            await axios.post('/create-user-place-detail', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            getUserCommunities();
            setShowForm(false);
        } catch (error) {
            console.error('Error adding community:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Select Community</h2>
            <select
                value={selectedCommunity}
                onChange={(e) => {
                    console.log('Selected community:', e.target.value);
                    setSelectedCommunity(e.target.value);
                    onSelectCommunity(e.target.value);
                }}
                className="w-full p-3 border rounded-lg"
            >
                <option value="all">All Communities</option>
                {userCommunities.map((comm) => (
                    <option key={comm.placeDetailId} value={comm.placeDetailId}>
                        {comm.placeDetail.place.placeName} - {comm.placeDetail.postalCode}
                    </option>
                ))}
            </select>

            <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg"
            >
                Add Community
            </button>

            {showForm && (
                <form onSubmit={handleFormSubmit} className="mt-6 p-4 bg-white rounded-lg shadow-md">
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
                    {useCurrentLocation && longitude && latitude ? (
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
                    ) : (
                        <>
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
                        </>
                    )}
                    <button type="submit" className="bg-green-700 text-white py-2 px-4 rounded-lg mt-10">
                        Save Community
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommunityDropdown;
