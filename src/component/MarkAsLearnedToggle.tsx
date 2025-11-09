// components/MarkAsLearnedToggle.tsx
import { useState } from 'react';
import { useTopicStore } from '@/app/stores/topicStore';
import { useUser } from '@auth0/nextjs-auth0';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useUserStore } from '@/app/stores/userStore'; // adjust path as needed
import { useLearnedTopicsStore } from '@/app/stores/learnedTopicsStore';

type Props = {
  topicTitle: string;
  topicId?: number; // Optional, if needed for API calls
  chapter_id?: number; // Optional, if needed for API calls
  course_id?: number; // Optional, if needed for API calls
};

export default function MarkAsLearnedToggle({ topicTitle, topicId, chapter_id,course_id }: Props) { 
  const { isLearned, markAsLearned, unmarkAsLearned } = useLearnedTopicsStore();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const userData = useUserStore((state) => state.user);
  const [error, setError] = useState<string | null>(null);

  // Get state from store
  const learned =  isLearned(topicId || 0); 
  const toggleLearned = useTopicStore(state => state.toggleLearned);

  const handleToggle = async () => {
    if (!user) {
      setError('Please login to track your learning progress');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Optimistically update UI
      const newLearnedState = !learned;
      if (newLearnedState) {
        markAsLearned(topicId || 0);
      } else {
        unmarkAsLearned(topicId || 0);
      }
      toggleLearned(topicTitle);

      // Call API to sync with backend
      const response = await fetch(`/api/learned_topics/${topicId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth0_id: user.sub,
          email: user.email,
          name: user.name,
          picture: user.picture,
          learned: newLearnedState,
          user_id: userData?.id, // Pass user ID if needed
          chapter_id:chapter_id,
          course_id:course_id
        }),
      });
      console.log(response,'response')

      if (!response.ok) {
        // Revert if API call fails
        toggleLearned(topicTitle);
        throw new Error(await response.text() || 'Failed to update learning status');
      }

      // Optional: Handle response data if needed
      const data = await response.json();
      console.log('Learning status updated:', data);

    } catch (err) {
      console.error('Error updating learning status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update learning status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isLoading}
          className={`flex items-center gap-2 p-1 rounded-md ${learned
              ? 'text-green-600 hover:bg-green-50'
              : 'text-gray-500 hover:bg-gray-50'
            }`}
          aria-label={learned ? 'Mark as not learned' : 'Mark as learned'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className={`w-4 h-4 ${learned ? 'fill-current' : ''}`} />
          )}
          <span className="text-sm">
            {learned ? 'Learned' : 'Mark as Learned'} 
          </span>
        </button>
      </label> 
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}