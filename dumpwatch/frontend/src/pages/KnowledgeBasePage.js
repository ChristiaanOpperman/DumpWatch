import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useTranslation } from 'react-i18next';

const KnowledgeBasePage = () => {
    const { t } = useTranslation();
    const [openFAQ, setOpenFAQ] = useState(null);
    const [funFact, setFunFact] = useState('');
    const faqs = t('knowledgeBase.faqs', { returnObjects: true });
    const funFacts = t('knowledgeBase.funFacts', { returnObjects: true });
    const articles = t('knowledgeBase.articles', { returnObjects: true });

    useEffect(() => {
        setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, []);

    return (
        <Layout pageTitle={t('knowledgeBase.pageTitle')}>
            <main className="container mx-auto mt-5 p-6 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map((article, index) => (
                        <div key={index} className="p-4 border border-gray-300 rounded-lg shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold text-[rgb(34,139,34)]">{article.title}</h2>
                            <p className="text-gray-700 mt-2">{article.description}</p>
                            <a href={article.link} className="text-gray-700 mt-2 italic cursor-pointer">
                                {t('knowledgeBase.source')} {article.source}
                            </a>
                        </div>
                    ))}
                </div>
                <div className="bg-[rgb(34,139,34)] text-white p-6 rounded-lg text-center shadow">
                    <h2 className="text-2xl font-bold">{t('knowledgeBase.funFactTitle')}</h2>
                    <p className="mt-4 text-lg">{funFact}</p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">{t('knowledgeBase.faqTitle')}</h2>
                    {faqs.map((faq, index) => (
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
