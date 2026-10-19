"use client";

import { useEffect, useState } from "react";

export default function SavedPage() {
  const [savedCities, setSavedCities] = useState<string[]>([]);

  useEffect(() => {
    const storedCities = localStorage.getItem("savedCities");

    if (storedCities) {
      setSavedCities(JSON.parse(storedCities));
    }
  }, []);

  return (
    <main>
      <h1>Saved Cities</h1>

      {savedCities.length === 0 ? (
        <p>No cities saved yet.</p>
      ) : (
        <ul>
          {savedCities.map((city) => (
            <li key={city}>{city}</li>
          ))}
        </ul>
      )}

      <a href="/">Back to Home</a>
    </main>
  );
}