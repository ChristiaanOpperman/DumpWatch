import React, { useState, useEffect } from 'react';
import axios from '../api/api';

const CommunityDropdown = ({ onSelectCommunity }) => {
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [placeOptions, setPlaceOptions] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState('');

    useEffect(() => {
        // fetchCommunities();
        fetchPlaces();
    }, []);

    // const fetchCommunities = async () => {
    //     try {
    //         const response = await axios.get('/get-user-places');
    //         setCommunities(response.data);
    //     } catch (error) {
    //         console.error('Error fetching communities:', error);
    //     }
    // };

    const fetchPlaces = async () => {
        try {
            const response = await axios.get('/get-places');
            setPlaceOptions(response.data);
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    const fetchUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLatitude(position.coords.latitude.toString());
                    setLongitude(position.coords.longitude.toString());
                    try {
                        const response = await axios.get(`/get-place-by-coordinates?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
                        setPostalCode(response.data.postalCode);
                    } catch (error) {
                        console.error('Error fetching place by coordinates:', error);
                    }
                },
                (error) => console.error('Error getting location:', error)
            );
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const communityData = {
            placeId: selectedPlace,
            postalCode,
        };
        try {
            await axios.post('/add-user-community', communityData);
            // fetchCommunities();
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
                    setSelectedCommunity(e.target.value);
                    onSelectCommunity(e.target.value);
                }}
                className="w-full p-3 border rounded-lg"
            >
                <option value="all">All Communities</option>
                {communities.map((comm) => (
                    <option key={comm.PlaceDetailId} value={comm.PlaceDetailId}>
                        {comm.PlaceName} - {comm.PostalCode}
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
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={useCurrentLocation}
                            onChange={() => setUseCurrentLocation(!useCurrentLocation)}
                            className="mr-2"
                        />
                        <span>{useCurrentLocation ? 'Use Current Location' : 'Enter Manually'}</span>
                    </div>
                    {useCurrentLocation ? (
                        <>
                            <div className="mb-4">
                                <label className="block font-bold">Latitude:</label>
                                <input type="text" value={latitude} readOnly className="w-full border p-2 rounded-lg" />
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold">Longitude:</label>
                                <input type="text" value={longitude} readOnly className="w-full border p-2 rounded-lg" />
                            </div>
                            <button
                                type="button"
                                onClick={fetchUserLocation}
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Refresh Location
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block font-bold">Select Place:</label>
                                <select
                                    value={selectedPlace}
                                    onChange={(e) => setSelectedPlace(e.target.value)}
                                    className="w-full border p-2 rounded-lg"
                                >
                                    <option value="">Select a place</option>
                                    {placeOptions.map((place) => (
                                        <option key={place.PlaceId} value={place.PlaceId}>
                                            {place.PlaceName} ({place.CountryCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold">Postal Code:</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full border p-2 rounded-lg"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <button type="submit" className="bg-green-700 text-white py-2 px-4 rounded-lg">
                        Save Community
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommunityDropdown;
