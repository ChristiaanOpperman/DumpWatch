import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const KnowledgeBasePage = () => {
    const [openFAQ, setOpenFAQ] = React.useState(null);

    const faqList = [
        {
            question: "How to report illegal dumping?",
            answer: "You can report an illegal dumping incident by visiting the 'Report' page within the DumpWatch platform.",
        },
        {
            question: "What happens after I submit a report?",
            answer: "Once submitted, it will be accessible to local organisations and community members for viewing, engagement, and action.",
        },
        {
            question: "Who can view my posts and comments?",
            answer: "Your posts and comments are visible to all members of the designated community, as well as to any registered user on the platform.",
        },
        {
            question: "Can I delete my posts and comments?",
            answer: "No, the ability to delete posts and comments will be introduced in a future update.",
        },
        {
            question: "I experienced an issue with the applicaiton, how can I contact support?",
            answer: "Any feedback or inquiries is highly valued and can be directed to our support team - via the email: support@dumpwatch.com.",
        }
    ]

    const funFacts = [
        "The Constitution of South Africa guarantees everyone the right of access to an environment that is not harmful to their health and wellbeing and to have the natural environment protected for the benefit of current and future generations",
        "South Africa generated 108 million tonnes of waste in 2011, and 59 million tonnes of that was general waste",
        "Approximately 98 million tonnes of waste generated in 2011 was landfilled in South Africa",
        "Only 10% of waste generated in South Africa is being recycled annually",
        "65% of waste generated in SA is recyclable",
        "Gauteng Province contributes about 45% of the total waste generated in the country",
        "An average person in SA generates about 1 tonne of waste per year and about 3 kg per day",
        "An average person in SA will throw about 900 times their adult body weight of waste in their lifetime (assuming a life expectancy of 56 years and an average adult body weight of 62 kg)",
        "Recycling 1 tonne of paper saves 17 mature trees, 26,498 litres of water, 2.3 m³ of landfill space, 238.48 litres of oil, and 4000 kilowatt hours of electricity",
        "Cigarette butts are the most littered item in the world, with 4.5 trillion discarded annually",
        "After South Africa introduced a levy system on plastic carry-bags in 2002, more and more people buy durable bags for reuse when doing shopping. The programme has raised millions of Rands in revenue",
        "Waste management contributed over R2.4bn of the GDP in 2011",
        "Over 1 million tonnes of plastic are thrown away in South Africa each year",
        "Plastic bags do not biodegrade. Light breaks them down into smaller and smaller particles that pollute the environment and are expensive and difficult to remove",
        "Approximately 88% of the energy is saved when plastic is made from recycled plastic rather than from the raw materials of gas and oil",
        "Tyres in stockpiles can serve as a breeding ground for mosquitoes and a habitat for rodents. Recycling of this waste stream can significantly avoid these problems",
        "Less than 5% of people in South Africa separate their waste at household level",
        "South Africa has over 1500 waste disposal sites. This can be significantly reduced if waste recycling is prioritised",
        "While landfill gas (methane) is a good fuel, most waste disposal facilities in South Africa are not efficiently collecting it and utilising the opportunity that comes with harvesting it",
        "Waste incinerators create more CO2 emissions than coal, oil, or natural gas-fuelled power plants",
        "It has been estimated that recycling, re-use, and composting create six to ten times as many jobs as waste incineration and landfills",
        "Recycling saves 3 to 5 times the energy generated by waste-to-energy plants, even without counting the wasted energy in the burned materials",
        "Recycling steel and tin cans saves 74% of the energy used to make them",
        "Recycling one aluminium can saves enough energy to run a 100-watt light bulb for 20 hours, a computer for 3 hours, and a TV for 2 hours",
        "Of 3.1 million tonnes of metal waste generated, 80% of that was recycled in 2011",
        "32% of glass waste generated in 2011 was recycled",
        "Recycling 1 tonne of mixed paper saves the energy equivalent of 185 gallons of oil",
        "Aluminium can be recycled forever with no loss of quality",
        "Recycling aluminium creates 97% less water pollution than making new metal from ore",
        "Every tonne of glass containers recycled saves over a tonne of natural resources",
        "For every 10% recycled glass used to make new glass containers, energy costs drop 2-3 per cent",
        "The energy saved by recycling one glass bottle can light a 100-watt light bulb for four hours or run a computer for 30 minutes",
        "1.2 million tonnes of virgin polymers were converted and 228,057 tonnes of plastics were recycled",
        "Because plastic water bottles are shielded from sunlight in landfills, they will not decompose for thousands of years",
        "Recycling one million laptops saves enough energy to power over 3000 homes in a year",
        "Recycling one million cell phones allows 35,274 pounds of copper, 772 pounds of silver, 75 pounds of gold, and 33 pounds of palladium to be recovered"
    ];

    const [funFact, setfunFact] = useState('');

    const articles = [
        { title: "What is illegal dumping?", description: "Illegal dumping is the unauthorised disposal of waste in public spaces, which harms the environment and public health.", source: "vizzia", link: "https://www.vizzia.eu/en/articles/understanding-illegal-dumping" },
        { title: "Illegal dumping is not only an eyesore but is hazardous too", description: "Illegal dumping in South Africa costs R350 million annually to remove 180,000 tonnes of waste.", source: "wwise", link: "https://wwise.co.za/articles/illegal-dumping-is-not-only-an-eyesore-but-is-hazardous-too/" },
    ];

    useEffect(() => {
        setfunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, []);

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
                            <a href={article.link} className="text-gray-700 mt-2 italic cursor-pointer">Source: {article.source}</a>
                        </div>
                    ))}
                </div>

                <div className="bg-[rgb(34,139,34)] text-white p-6 rounded-lg text-center shadow">
                    <h2 className="text-2xl font-bold">Today's Fun Fact</h2>
                    <p className="mt-4 text-lg">{funFact}</p>
                </div>

                <div className="space-y-4">
                    {faqList.map((faq, index) => (
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
