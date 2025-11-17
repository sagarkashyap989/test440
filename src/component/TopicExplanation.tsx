'use client';

import { useState } from 'react';
import MarkAsLearnedToggle from './MarkAsLearnedToggle';
import { Explanation, TopicExplanationProps } from '@/types';


export default function TopicExplanation({ topic }: TopicExplanationProps) {
  const [expanded, setExpanded] = useState(false);
  const [explanations, setExplanations] = useState<Explanation[]>(topic.explanations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  // Sort explanations by likes descending (most liked first)
  const sortedExplanations = [...explanations].sort((a, b) => b.likes - a.likes);

  // When topic expands, show most liked explanation first
  // Keep currentIndex in sync with sorted array
  // We'll just use sortedExplanations[currentIndex]

  const handleLike = (id: number) => {
    setExplanations((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, likes: exp.likes + 1 } : exp
      )
    );
  };

  const handleAddExplanation = async () => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    try {
      // Call your OpenAI API here with customPrompt to generate new explanation
      // For now, mock the API call with a timeout

      await new Promise((r) => setTimeout(r, 1500));

      const newExplanation: Explanation = {
        id: Date.now(),
        text: `New explanation for prompt: "${customPrompt}" (mocked)`,
        prompt: customPrompt,
        likes: 0,
      };

      setExplanations((prev) => [...prev, newExplanation]);
      setCustomPrompt('');
      setCurrentIndex(explanations.length); // show newly added explanation
    } catch (error) {
      console.error('Failed to generate explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const explanation = sortedExplanations[currentIndex] || explanations[0];
  // Inside your TopicExplanation component
  let structuredContent: { type: string; content: string }[] = [];

  try {
    const jsonMatch = explanation.text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      structuredContent = JSON.parse(jsonMatch[1]);
    } else {
      console.warn("No JSON content found in explanation text.");
    }
  } catch (error) {
    console.error("Failed to parse explanation text:", error);
  }


  return (
    <div className="border rounded mb-4">
      <button
        className="w-full text-left p-3 bg-gray-200 hover:bg-gray-300 flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="font-semibold">{topic.title}</span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="p-3 bg-white space-y-4">
          {/* <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded shadow-sm min-h-[80px]">
            {explanation.text}
          </div> */}

          {structuredContent.length > 0 ? (
            <div className="space-y-4">
              {structuredContent.map((section, idx) => {
                if (section.type === 'paragraph') {
                  return (
                    <p key={idx} className="text-gray-800 leading-relaxed">
                      {section.content}
                    </p>
                  );
                } else if (section.type === 'table') {
                  return (
                    <div key={idx} className="overflow-x-auto">
                      <table className="min-w-full table-auto border border-gray-300 text-left text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            {section.content.headers.map((header: string, hIdx: number) => (
                              <th key={hIdx} className="px-4 py-2 border">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.content.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="even:bg-gray-50">
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className="px-4 py-2 border">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-800 border p-3 rounded shadow-sm min-h-[80px]">
              {explanation.text}
            </div>
          )}


          <div>
            <label htmlFor={`prompt-${topic.title}`} className="block mb-1 font-medium">
              Not clear? Ask again in your own wwwwwwords
            </label>
            <input
              id={`prompt-${topic.title}`}
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Explain in simpler terms, give examples, etc."
              disabled={loading}
            />
            <button
              onClick={handleAddExplanation}
              disabled={loading || !customPrompt.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Explanation'}
            </button>
          </div>

          {/* Explanation Carousel */}
          <div className="flex overflow-x-auto space-x-4 mt-4 py-2 border-t">
            {sortedExplanations.map((exp, idx) => (
              <div
                key={exp.id}
                onClick={() => setCurrentIndex(idx)}
                className={`min-w-[220px] p-3 rounded cursor-pointer border ${idx === currentIndex ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                  }`}
              >
                <div className="text-sm italic text-gray-600 mb-2 truncate max-w-[200px]">
                  Prompt: {exp.prompt}
                </div>

                <div className="text-gray-700 mb-2 whitespace-normal max-h-24 overflow-hidden text-ellipsis">
                  {exp.text}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(exp.id);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  👍 {exp.likes}
                </button>
              </div>
            ))}
          </div>

          {/* Mark as Learned Toggle */}
          <div className="mt-4">
            <MarkAsLearnedToggle topicTitle={topic.title} />
          </div>
        </div>
      )}
    </div>
  );
}
