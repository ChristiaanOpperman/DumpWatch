import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';

const ViewReportPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInput, setCommentInput] = useState('');
    const [posting, setPosting] = useState(false);

    const userId = localStorage.getItem('userId');

    const fetchReport = async () => {
        try {
            const response = await axios.get(`/get-report-by-reportId/${reportId}`);
            console.log('fetching report: ', response.data);
            setReport(response.data);
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Failed to load report details');
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/get-comments-by-reportId/${reportId}`);
            console.log('Comments:', response.data || []);
            setComments(response.data || []);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Failed to load comments');
        }
    };

    const handlePostComment = async () => {
        if (!commentInput.trim()) return;
        setPosting(true);

        try {
            console.log('UserId: ', userId);
            const newComment = {
                message: commentInput,
                userId: Number(userId), // Convert to number to match backend userId,
                reportId: Number(reportId),
            };

            console.log('Posting comment:', newComment);
            const response = await axios.post('/create-comment', newComment);

            if (response.data.comment) {
                const createdComment = response.data.comment;

                setComments(prevComments => [
                    ...prevComments,
                    {
                        CommentId: createdComment.commentId, // Use ID from backend
                        ReportId: createdComment.reportId,
                        UserId: createdComment.userId,
                        CreatedDate: createdComment.createdDate, // Use real timestamp
                        Message: createdComment.message,
                    }
                ]);
            } else {
                console.error('Comment creation failed: No valid response from backend');
                alert('Failed to post comment. Please try again.');
            }

            setCommentInput('');
        } catch (err) {
            console.error('Error posting comment:', err);
            alert('Failed to post comment. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchReport(), fetchComments()]);
            setLoading(false);
        };

        fetchData();
    }, [reportId]);

    if (loading) {
        return (
            <Layout pageTitle="View Report">
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-[#535A46] font-bold">Loading report and comments...</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout pageTitle="View Report">
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-red-600 font-bold">{error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout pageTitle="View Report">
            <div className="bg-gray-200 p-6">
                {report && (
                    <div className="bg-white rounded-lg shadow-md mb-6">
                        {report.imageUrl && (
                            <img
                                src={`http://localhost:8080/${report.imageUrl}`}
                                alt="Reported Post"
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                        )}
                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-4">Report Details</h1>
                            <p className="text-gray-800 font-bold mb-2">Description: {report.description}</p>
                            <p className="text-sm text-gray-600 mb-2">
                                Created on: {new Date(report.createdDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">{report.place.placeName}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Add a Comment</h2>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="Write a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${posting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={posting}
                    >
                        {posting ? 'Posting...' : 'Post Comment'}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">Comments</h2>

                    {comments?.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.CommentId} className="mb-4 border-b border-gray-300 pb-4">
                                <p className="text-gray-800 mb-2">{comment.Message}</p>
                                <p className="text-sm text-gray-600">
                                    Created by: {comment.UserId} on {new Date(comment.CreatedDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No comments have been added yet.</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ViewReportPage;
