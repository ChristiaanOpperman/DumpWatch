import React from 'react';
import Layout from '../components/Layout';

const KnowledgeBasePage = () => {
    const articles = [
        { title: 'Article 1', description: 'A brief description of Article 1.' },
        { title: 'Article 2', description: 'A brief description of Article 2.' },
    ];

    const [openFAQ, setOpenFAQ] = React.useState(null);


    const funFact = 'Did you know? Recycling just one ton of paper can save 17 trees and 7,000 gallons of water!';

    return (
        <Layout pageTitle="Knowledge Base">
            <main className="container mx-auto mt-5 p-6 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-semibold text-[rgb(34,139,34)]">{article.title}</h2>
                            <p className="text-gray-700 mt-2">{article.description}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[rgb(34,139,34)] text-white p-6 rounded-lg text-center shadow">
                    <h2 className="text-2xl font-bold">Today's Fun Fact</h2>
                    <p className="mt-4 text-lg">{funFact}</p>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            question: "How to report illegal dumping?",
                            answer: "You can report illegal dumping through the DumpWatch app by submitting a report with location details and images.",
                        },
                        {
                            question: "What happens after I submit a report?",
                            answer: "Once submitted, your report will be reviewed, and the relevant authorities will be notified.",
                        },
                        {
                            question: "How to contact community admins?",
                            answer: "You can contact community admins via the 'Contact' section within the DumpWatch platform.",
                        },
                    ].map((faq, index) => (
                        <div key={index} className="border border-gray-300 rounded-lg shadow">
                            <button
                                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                className="w-full text-left p-4 bg-gray-50 hover:bg-white focus:outline-none flex justify-between items-center"
                            >
                                <span className="text-lg font-semibold text-gray-700">{faq.question}</span>
                                <span className="text-green-700 text-xl">{openFAQ === index ? "▲" : "▼"}</span>
                            </button>
                            {openFAQ === index && (
                                <div className="p-4 bg-white text-gray-600 border-t border-gray-300">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </main>
        </Layout>
    );
};

export default KnowledgeBasePage;
