'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStoreChange = (store: string) => {
    setStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading
    setResult('');

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, stores }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('An error occurred while fetching results.');
    }

    setLoading(false); // end loading
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Search term..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <div className="flex flex-col space-y-1">
          {['Spar', 'Auchan', 'Aldi', 'Lidl'].map((store) => (
            <label key={store} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={store}
                checked={stores.includes(store)}
                onChange={() => handleStoreChange(store)}
              />
              {store}
            </label>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading ? 'bg-gray-400' : 'bg-blue-600'
          } text-white`}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="mt-6 text-blue-600 font-medium">Loading results...</div>
      )}

      {result && !loading && (
        <pre className="mt-6 p-4 bg-gray-100 border rounded overflow-x-auto">{result}</pre>
      )}
    </main>
  );
}
