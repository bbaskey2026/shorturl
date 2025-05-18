import React, { useState, useEffect } from "react";
import "./App.css";
import BentoCard from "./BentoCard";

const App = () => {
  const [url, setUrl] = useState("");
  const [shortUrls, setShortUrls] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("urls")) || [];
    setShortUrls(stored);
  }, []);

  const shortenUrl = () => {
    if (!url.trim()) return;

    const shortCode = Math.random().toString(36).substring(2, 8);
    const newEntry = {
      original: url,
      short: `${window.location.origin}/${shortCode}`,
      createdAt: new Date().toLocaleString(),
      clicks: 0,
    };

    const updated = [newEntry, ...shortUrls];
    setShortUrls(updated);
    localStorage.setItem("urls", JSON.stringify(updated));
    setUrl("");
  };

  const handleClick = (index) => {
    const updated = [...shortUrls];
    updated[index].clicks += 1;
    setShortUrls(updated);
    localStorage.setItem("urls", JSON.stringify(updated));
    window.open(updated[index].original, "_blank");
  };

  return (
    <div className="portfolio-container">
      <h1>URL Shortener </h1>

      <div className="bento-grid">
        <BentoCard title="Shorten URL" className="large dark">
          <input
            type="text"
            placeholder="Enter long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={shortenUrl}>Generate</button>
        </BentoCard>

        <BentoCard title="Insights 📊" className="large">
          {shortUrls.length === 0 ? (
            <p>No URLs shortened yet.</p>
          ) : (
            <ul>
              {shortUrls.map((item, i) => (
                <li key={i}>
                  <p><strong>🔗:</strong> <span onClick={() => handleClick(i)} className="link">{item.short}</span></p>
                  <p>📅 {item.createdAt} | 👁️ {item.clicks} clicks</p>
                </li>
              ))}
            </ul>
          )}
        </BentoCard>

        <BentoCard title="About App">
          <p>
            This is a frontend-only URL shortener demo with click analytics stored in `localStorage`.
          </p>
        </BentoCard>

        <BentoCard title="Quote" className="dark">
          <blockquote>“Simplicity is the soul of efficiency.” – Austin Freeman</blockquote>
        </BentoCard>
      </div>
    </div>
  );
};

export default App;
