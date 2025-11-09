
// components/PromptInput.tsx
import { useExplanationStore } from '@/app/stores/explanationStore';
import { useState } from 'react';


type Props = {
  topicTitle: string;
  fetchExplanations: Function;
};

export default function PromptInput({ topicTitle, fetchExplanations }: Props) {
  const [prompt, setPrompt] = useState('');
  const addExplanation = useExplanationStore((state) => state.addExplanation);

  const handleSubmit = async () => {
    // TODO: Call API with custom prompt
    fetchExplanations({prompt});

    // addExplanation(topicTitle, {
    //   id: Date.now(), // Better ID generation using timestamp
    //   text: 'this is a new explanation for ' + topicTitle,
    //   prompt: 'test prompt',
    //   likes: 99
    // });
    console.log(`Prompt for ${topicTitle}: ${prompt}`);
    setPrompt('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-700">Not clear? Ask again in your own words:</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
