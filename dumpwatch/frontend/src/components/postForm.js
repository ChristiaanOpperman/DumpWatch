import React, { useState } from 'react';
import axios from '../api/api';
import imageCompression from 'browser-image-compression';

const PostForm = () => {
    const [description, setDescription] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [image, setImage] = useState(null);
    const [message, setMessage] = useState('');

    const userId = '85e50cfa-b63b-11ef-bb4c-f8e9a5819770';

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('description', description);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('image', image, image.name);

        try {
            const response = await axios.post('/create-report', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Post uploaded successfully!');
        } catch (error) {
            console.error('Full error:', error);
            console.error('Error response:', error.response);
            setMessage(error.response?.data || 'Failed to upload post. Please try again.');
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const options = {
                maxSizeMB: 10, // The max file size you want the file to be
                maxWidthOrHeight: 1920, // The max width or height of the image
                useWebWorker: true // Use web worker for performance
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
                <p className={`p-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </p>
            )}

            {/* Description Field */}
            <div>
                <label className="block font-bold mb-1">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                ></textarea>
            </div>

            {/* Latitude Field */}
            <div>
                <label className="block font-bold mb-1">Latitude:</label>
                <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                />
            </div>

            {/* Longitude Field */}
            <div>
                <label className="block font-bold mb-1">Longitude:</label>
                <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                />
            </div>

            {/* Image Upload Field */}
            <div>
                <label className="block font-bold mb-1">Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                />
            </div>

            {/* Submit Button */}
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
                Upload Post
            </button>
        </form>
    );
};

export default PostForm;
