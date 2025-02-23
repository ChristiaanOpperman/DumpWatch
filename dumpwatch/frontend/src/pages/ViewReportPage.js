// ViewReportPage.js
import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ViewReportPage = () => {
    const { t } = useTranslation();
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
            setReport(response.data);
        } catch (err) {
            setError(t('viewReport.error') || "Failed to load report details");
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/get-comments-by-reportId/${reportId}`);
            setComments(response.data || []);
        } catch (err) {
            setError(t('viewReport.error') || "Failed to load comments");
        }
    };

    const handlePostComment = async () => {
        if (!commentInput.trim()) return;
        setPosting(true);
        try {
            const newComment = {
                message: commentInput,
                userId: Number(userId),
                reportId: Number(reportId),
            };
            const response = await axios.post('/create-comment', newComment);
            if (response.data.comment) {
                const createdComment = response.data.comment;
                setComments(prevComments => [
                    ...prevComments,
                    {
                        commentId: createdComment.commentId,
                        reportId: createdComment.reportId,
                        userId: createdComment.userId,
                        createdDate: createdComment.createdDate,
                        message: createdComment.message,
                    }
                ]);
            } else {
                alert(t('viewReport.postCommentFailure') || "Failed to post comment. Please try again.");
            }
            setCommentInput('');
        } catch (err) {
            alert(t('viewReport.postCommentFailure') || "Failed to post comment. Please try again.");
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
            <Layout pageTitle={t('viewReport.pageTitle')}>
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-[#535A46] font-bold">{t('viewReport.loading')}</div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout pageTitle={t('viewReport.pageTitle')}>
                <div className="flex justify-center items-center h-full bg-[#C8D9A9] p-6">
                    <div className="text-red-600 font-bold">{error}</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout pageTitle={t('viewReport.pageTitle')}>
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
                            <h1 className="text-2xl font-bold mb-4">{t('viewReport.reportDetailsHeader')}</h1>
                            <p className="text-gray-800 font-bold mb-2">
                                {t('viewReport.descriptionLabel')} {report.description}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                {t('viewReport.createdOnLabel')} {new Date(report.createdDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                {t('viewReport.statusLabel')} {report.status}
                            </p>
                            <p className="text-sm text-gray-600">{report.place.placeName}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">{t('viewReport.addCommentHeader')}</h2>
                    <div className="mb-4">
                        <textarea
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder={t('viewReport.commentPlaceholder')}
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${posting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={posting}
                    >
                        {posting ? t('viewReport.postingButton') : t('viewReport.postCommentButton')}
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-xl font-bold mb-4">{t('viewReport.commentsHeader')}</h2>
                    {comments?.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.commentId} className="mb-4 border-b border-gray-300 pb-4">
                                <p className="text-gray-800 mb-2">{comment.message}</p>
                                <p className="text-sm text-gray-600">
                                    {t('viewReport.createdByLabel')} {comment.userId} on {new Date(comment.createdDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">{t('viewReport.noComments')}</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ViewReportPage;
