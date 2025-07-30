import { useState, useEffect } from "react";
import "./App.css";

const PAGE_SIZE = 10;
const USE_SPREAD_SHEET_MOCK =
  import.meta.env.VITE_ENV === "production" ? false : true;

const mockData = [
  "モック投稿1",
  "モック投稿2",
  "モック投稿3",
  "モック投稿4",
  "モック投稿5",
  "モック投稿6",
  "モック投稿7",
  "モック投稿8",
  "モック投稿9",
  "モック投稿10",
  "モック投稿11",
];

const GAS_ENDPOINT = import.meta.env.VITE_GAS_ENDPOINT;

const fetchFromSpreadsheet = async () => {
  if (!GAS_ENDPOINT) {
    console.warn(
      "Warning: GAS_ENDPOINT is not defined. Fetch and submit operations will fail."
    );
  }

  try {
    const res = await fetch(GAS_ENDPOINT);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.reverse();
  } catch (error) {
    console.error("Error fetching data from spreadsheet:", error);
    return [];
  }
};

const submitToSpreadsheet = async (text: string) => {
  if (!GAS_ENDPOINT) {
    throw new Error(
      "GAS_ENDPOINT is not defined. Cannot submit data to the spreadsheet."
    );
  }

  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error(
        `Failed to submit: ${response.status} ${response.statusText}`
      );
      throw new Error("Failed to submit data to the spreadsheet.");
    }
  } catch (error) {
    console.error(
      "An error occurred while submitting to the spreadsheet:",
      error
    );
    throw error; // Re-throw the error to allow further handling if needed
  }
};

export default function PostClient() {
  const [posts, setPosts] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = USE_SPREAD_SHEET_MOCK
        ? [...mockData].reverse()
        : await fetchFromSpreadsheet();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) return alert("投稿内容を入力してください。");
    if (USE_SPREAD_SHEET_MOCK) {
      const newMockData = [...mockData, text];
      setPosts([...newMockData].reverse());
    } else {
      await submitToSpreadsheet(text);
    }
    setText("");
    const data = USE_SPREAD_SHEET_MOCK
      ? [...mockData].reverse()
      : await fetchFromSpreadsheet();
    setPosts(data);
  };

  const start = page * PAGE_SIZE;
  const pagePosts = posts.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  return (
    <div className="max-w-xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">テキストシェアツール</h1>
      <textarea
        className="w-full h-24 border p-2 mb-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しい投稿..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        投稿
      </button>

      <div className="mt-6 space-y-4">
        {pagePosts.map((p, i) => (
          <div key={`${p}-${i}`} className="border-b pb-2 whitespace-pre-wrap">
            {p}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="text-blue-600"
        >
          前へ
        </button>
        <span>
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
          disabled={page + 1 >= totalPages}
          className="text-blue-600"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
