'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    });

    const data = await res.json();
    setResponse(data.result); // assuming your Puppeteer returns something
  };

  return (
    <main className="p-4">
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Enter search terms:</label>
        <input
          type="text"
          id="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 m-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Search
        </button>
      </form>

      {response && (
        <div className="mt-4 p-4 bg-gray-100">
          <h2>Search Result:</h2>
          <pre>{response}</pre>
        </div>
      )}
    </main>
  );
}
