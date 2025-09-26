'use client';

import { askQuestion } from '@/utils/api';
import { useState } from 'react';

const Question = () => {
  const [value, setValue] = useState(
    'How was my mood been in the last two day?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const onChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting question:', value);
    const answer = await askQuestion(value);
    console.log('Received answer:', answer);

    setResponse(answer);
    setValue('');
    setIsLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          onChange={onChange}
          value={value}
          type="text"
          placeholder="Ask a question"
          className="border border-black/20 px-4 py-2 text-lg rounded-lg mr-4"
        />
        <button
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {isLoading && <div>Loading...</div>}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;
