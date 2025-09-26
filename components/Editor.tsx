'use client';

import { updateEntry } from '@/utils/api';
import { useState } from 'react';
import { useAutosave } from 'react-autosave';

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const data = await updateEntry(entry.id, _value);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });
  const { mood, summary, subject, color, negative } = analysis;

  const analysisData = [
    {
      name: 'Subject',
      value: subject,
    },
    {
      name: 'Summary',
      value: summary,
    },
    {
      name: 'Mood',
      value: mood,
    },
    {
      name: 'negative',
      value: negative ? 'True' : 'False',
    },
  ];

  return (
    <div className="grid grid-cols-3 w-full h-full">
      <div className="col-span-2">
        {isLoading && <div>...loading</div>}
        <textarea
          rows={50}
          className="p-8 text-xl outline-none w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          name="editors"
        />
      </div>
      <div className="border-l border-black/10">
        <div className="  px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li className="px-2 py-4 flex items-center justify-between border-y border-black/10">
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
