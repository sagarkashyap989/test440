import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get('topicId');
    const chpId = searchParams.get('chpId');
    const { title, contextString, prompt } = await req.json();
    console.log({ title, contextString, prompt }, '{ title,contextString,prompt } ')
    if (!topicId) {
        return NextResponse.json({ error: 'Missing topicId' }, { status: 400 });
    }
    try {
//         return NextResponse.json([
//   {
//     "id": 65,
//     "topic_id": 343,
//     "prompt": "\nExplain the topic 'Need and Relevance of Machine Learning' in a detailed, beginner-friendly way. Include definitions, examples, tables, and a conclusion — just like how you'd teach a student step by step.\n\nBut format your output strictly as a JSON array, where each item represents a section of the explanation, like this:\n\n[\n  { \"type\": \"paragraph\", \"content\": \"...\" },\n  { \"type\": \"table\", \"content\": { \"headers\": [...], \"rows\": [...] } },\n  { \"type\": \"paragraph\", \"content\": \"...\" }\n]\n\nFor the table:\n- Return it in structured format like:\n  {\n    \"type\": \"table\",\n    \"content\": {\n      \"headers\": [\"Header1\", \"Header2\"],\n      \"rows\": [\n        [\"Row1Col1\", \"Row1Col2\"],\n        [\"Row2Col1\", \"Row2Col2\"]\n      ]\n    }\n  }\n\nDo  include Markdown formatting.\nThis topic is part of my 'Need and Relevance of Machine Learning' syllabus — please structure it like a tutor preparing me for exams.\n",
//     "text": [
//       {
//         "type": "paragraph",
//         "content": "<h3>What is Machine Learning?</h3>\n\nMachine Learning (ML) is a subset of Artificial Intelligence (AI) that focuses on enabling computers to learn from data without being explicitly programmed. Instead of writing specific rules, ML algorithms identify patterns, make predictions, and improve their accuracy over time as they are exposed to more data. Think of it as teaching a computer to learn from experience, just like humans do.\n\n**Definition:** Machine learning is the study of computer algorithms that improve automatically through experience."
//       },
//       {
//         "type": "paragraph",
//         "content": "<h3>Why Do We Need Machine Learning?</h3>\n\nTraditional programming relies on explicitly defined rules to solve problems. However, many real-world problems are too complex or involve too much data for traditional methods to be effective. Machine learning addresses these limitations by:\n\n*   **Handling Complex Problems:** ML can tackle problems where the rules are unknown or too intricate to code manually.\n*   **Making Predictions:** ML excels at predicting future outcomes based on past data.\n*   **Automating Decisions:** ML can automate repetitive decision-making processes, freeing up human resources.\n*   **Discovering Insights:** ML can uncover hidden patterns and relationships within data that humans might miss."
//       },
//       {
//         "type": "table",
//         "content": {
//           "headers": [
//             "Traditional Programming",
//             "Machine Learning"
//           ],
//           "rows": [
//             [
//               "Requires explicit rules and instructions.",
//               "Learns from data without explicit programming."
//             ],
//             [
//               "Struggles with complex and dynamic problems.",
//               "Adapts to complex problems and changing data."
//             ],
//             [
//               "Limited ability to generalize from data.",
//               "Generalizes from data to make predictions."
//             ],
//             [
//               "Difficult to maintain and update for evolving scenarios.",
//               "Automatically improves with more data."
//             ]
//           ]
//         }
//       },
//       {
//         "type": "paragraph",
//         "content": "<h3>Relevance of Machine Learning</h3>\n\nMachine Learning is highly relevant in today's world because of the massive amounts of data being generated and the increasing need for automated and intelligent systems. Here are some key areas where ML is making a significant impact:"
//       },
//       {
//         "type": "table",
//         "content": {
//           "headers": [
//             "Industry",
//             "Application",
//             "Benefit"
//           ],
//           "rows": [
//             [
//               "Healthcare",
//               "Disease diagnosis, drug discovery, personalized medicine",
//               "Improved accuracy, faster treatment, better patient outcomes"
//             ],
//             [
//               "Finance",
//               "Fraud detection, algorithmic trading, risk assessment",
//               "Reduced losses, increased profits, better risk management"
//             ],
//             [
//               "Retail",
//               "Recommendation systems, customer segmentation, inventory optimization",
//               "Increased sales, improved customer experience, reduced costs"
//             ],
//             [
//               "Manufacturing",
//               "Predictive maintenance, quality control, process optimization",
//               "Reduced downtime, improved product quality, increased efficiency"
//             ],
//             [
//               "Transportation",
//               "Autonomous vehicles, traffic optimization, route planning",
//               "Increased safety, reduced congestion, lower fuel consumption"
//             ]
//           ]
//         }
//       },
//       {
//         "type": "paragraph",
//         "content": "<h3>Examples of Machine Learning in Action</h3>\n\n*   **Netflix Recommendation System:** ML algorithms analyze your viewing history to suggest movies and shows you might like.\n*   **Spam Filters:** ML models learn to identify spam emails based on patterns in the content and sender information.\n*   **Self-Driving Cars:** ML algorithms process sensor data to navigate roads, avoid obstacles, and make driving decisions.\n*   **Medical Diagnosis:** ML can analyze medical images and patient data to assist doctors in diagnosing diseases."
//       },
//       {
//         "type": "paragraph",
//         "content": "<h3>Conclusion</h3>\n\nMachine learning is essential because it provides solutions to problems that are too complex for traditional programming. Its ability to learn from data, make predictions, and automate decisions makes it a powerful tool across various industries. As data continues to grow, the need for machine learning will only increase, making it a crucial field for the future."
//       }
//     ],
//     "likes_count": 0,
//     "created_at": "2025-11-08T08:02:21.976Z",
//     "liked_by": [],
//     "learned_by": []
//   }
// ])
        const response = await fetch(`${process.env.API_URL}explanations/topic/${topicId}/${chpId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, contextString, prompt }),
        });

        if (!response.ok) throw new Error('Failed to fetch from backend');


        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.log('Backend fetch error:', err);

        return NextResponse.json(err);
    }
}

