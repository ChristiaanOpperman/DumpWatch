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
    const [status, setStatus] = useState();
    const [toastMessage, setToastMessage] = useState();
    const userType = localStorage.getItem('userType');

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([fetchReport(), fetchComments()]);
            setLoading(false);
        };
        fetchData();
    }, [reportId]);

     useEffect(() => {
        setTimeout(()=>{
            setToastMessage(undefined)
        }, 2000)
    }, [toastMessage]);

    const fetchReport = async () => {
        try {
            const response = await axios.get(`/get-report-by-reportId/${reportId}`);
            setReport(response.data);
            setStatus(response.data.status)
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

    const updateReportStatus = async (status) => {
        try {
            const response = await axios.put('/set-report-status', {
                ReportId: reportId,
                Status: status
            });
    
            if (response.data) {
                setStatus(response.data.status);
                fetchReport(); 
                setToastMessage(t('viewReport.successStatus'));
            } else {
                setToastMessage(t('viewReport.successFail'));
                console.log('Error in setting post status: ', response);
            }
        } catch (e) {
            setToastMessage('Failed in updating report status!');
            console.log('Error in setting post status: ', e);
        }
    };

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
                                loading="lazy"
                                src={`http://localhost:8080/${report.imageUrl}`}
                                alt="Reported Post"
                                className="w-full h-64 object-cover rounded-t-lg"
                            />
                        )}
                        {toastMessage && (
                            <div className={`p-4 rounded-md ${toastMessage.includes(t('viewReport.successStatus')) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {toastMessage}
                            </div>
                        )}
                        {userType === "Organisation" && (
                            <div className="mb-2">
                                <div className="relative inline-block w-full">
                                    <select
                                        value={status}
                                        onChange={(e) => {
                                            updateReportStatus(e.target.value)
                                        }}
                                        className={`w-auto m-2 p-3 border rounded-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-green-500 ${status === 'Open' ? "bg-blue-200 text-blue-800" : status === 'Scheduled' ? "bg-green-200 text-green-800" : "bg-green-600 text-white"}`}>
                                        <option value="Open" className="bg-blue-200 text-blue-800">{t('viewReport.statusOpen')}</option>
                                        <option value="Scheduled" className="bg-green-200 text-green-800">{t('viewReport.statusScheduled')}</option>
                                        <option value="Resolved" className="bg-green-600 text-white">{t('viewReport.statusResolved')}</option>
                                    </select>
                                </div>
                            </div>
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
