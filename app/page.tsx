"use client";

import { useEffect, useState } from "react";

type Weather = {  
  city: string;
  temperature: number;
  windSpeed: number;
};

export default function Home() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchedCity) return;

    async function getWeather() {
      setLoading(true);
      setError("");
      setWeather(null);

      try {
        const locationResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchedCity)}&count=1`
        );

        if (!locationResponse.ok) {
          throw new Error("Could not look up that city.");
        }

        const locationData = await locationResponse.json();
        const location = locationData.results?.[0];

        if (!location) {
          setError("City not found. Check the spelling and try again.");
          return;
        }

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
          throw new Error("Could not get the weather right now.");
        }

        const weatherData = await weatherResponse.json();

        setWeather({
          city: location.name,
          temperature: weatherData.current.temperature_2m,
          windSpeed: weatherData.current.wind_speed_10m,
        });
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    getWeather();
  }, [searchedCity]);

  function handleSearch() {
    const trimmedCity = city.trim();

    if (trimmedCity) {
      setSearchedCity(trimmedCity);
    }
  }

  function saveCity() {
    if (!weather) return;

    const savedCities = JSON.parse(
      localStorage.getItem("savedCities") || "[]"
    ) as string[];

    if (!savedCities.includes(weather.city)) {
      savedCities.push(weather.city);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 p-8 font-sans text-zinc-900">
      <h1 className="text-3xl font-semibold">Weather Dashboard</h1>

      <div className="flex gap-2">
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
          placeholder="Enter a city"
          className="rounded border border-zinc-300 px-3 py-2"
        />

        <button
          type="button"
          onClick={handleSearch}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p>Loading weather...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {weather && (
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-medium">{weather.city}</h2>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind speed: {weather.windSpeed} km/h</p>

          <button
            type="button"
            onClick={saveCity}
            className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Save City
          </button>
        </section>
      )}
    </main>
  );
}
