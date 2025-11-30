// components/TopicAccordion.tsx
'use client'
import ExplanationCarousel from './ExplanationCarousel';
import PromptInput from './PromptInput';
import MarkAsLearnedToggle from './MarkAsLearnedToggle';
import { TopicProps } from '@/types';
import { useTopicStore } from '@/app/stores/topicStore';
import { useExplanationStore } from '@/app/stores/explanationStore';
import { useState } from 'react';

  export default function TopicAccordion({ topic, chpId, topics, course_id,title,chp_name }: TopicProps) {
  const isOpen = useTopicStore((state) => state.expandedTopics[topic.title] ?? false);
  const toggleTopicExpanded = useTopicStore((state) => state.toggleTopicExpanded);
  const addExplanations = useExplanationStore((state) => state.addExplanations);
  const explanations = useExplanationStore((state) => state.getExplanations(topic.title));
  const [loading, setLoading] = useState(false)

  const fetchExplanations = async ({ prompt = '' } = {}) => {
    // alert('calling');
    setLoading(true);
    let contextString = `${title}, ${chp_name} `;

    topics.forEach((t) => {
      contextString += `, ${t.title}`;
    });

    try {
      const res = await fetch(`/api/explanations?topicId=${topic.id}&chpId=${chpId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic.title, contextString, prompt:prompt }),
      });

      console.log(res);
      if (!res.ok) {
        throw new Error('Failed to fetch explanation');
      }

      const data = await res.json();
      console.log(data, 'dsataexp');
      addExplanations(topic.title, data);
    } catch (error) {
      console.error('Error fetching explanation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!explanations || explanations.length === 0) {
      fetchExplanations();
    }
  };

  return (
    <div className="border rounded-lg p-2 bg-white shadow">
      <div
        className="w-full text-left font-medium text-blue-800 text-md flex justify-between items-center"
        onClick={() => toggleTopicExpanded(topic.title)}
      >
        {isOpen ? '▼' : '▶'} {topic.title}  <MarkAsLearnedToggle topicTitle={topic.title} topicId={Number(topic.id)} chapter_id={Number(chpId)} />
      </div>

      {isOpen && (
        explanations && explanations.length > 0 ? (
          <div className="mt-3 space-y-4">
            <ExplanationCarousel explanations={explanations} />
            <PromptInput topicTitle={topic.title} fetchExplanations={fetchExplanations} />
            <MarkAsLearnedToggle topicTitle={topic.title} topicId={Number(topic.id)} chapter_id={Number(chpId)} course_id={course_id} />
          </div>
        ) : (
          <button
            className="mt-3 text-blue-600 underline"
            onClick={handleLoadMore}
            disabled={loading}
          >
            Load more
          </button>
        )
      )}
    </div>
  );
}