import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star } from "lucide-react";
import api from "./apiClient";

export default function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  // Keep selected city in component state
  const [city, setCity] = useState(
    localStorage.getItem("cineverse_city") || "Yelahanka"
  );

  // -------------------------------------------------------
  // LOAD MOVIE DETAILS
  // -------------------------------------------------------
  useEffect(() => {
    if (!id) return;
    loadMovie();
  }, [id]);

  const loadMovie = async () => {
    try {
      const res = await api.get(`/api/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      console.error("Error loading movie:", err);
    }
  };

  // -------------------------------------------------------
  // CITY CHANGE LISTENER (Navbar updates this)
  // -------------------------------------------------------
  useEffect(() => {
    const handleCityChange = () => {
      const stored = localStorage.getItem("cineverse_city") || "Yelahanka";
      setCity(stored);
    };

    // Custom event fired from Navbar when city is changed
    window.addEventListener("cineverse_city_changed", handleCityChange);

    return () => {
      window.removeEventListener("cineverse_city_changed", handleCityChange);
    };
  }, []);

  // -------------------------------------------------------
  // LOAD SHOWS BASED ON MOVIE + CITY
  // -------------------------------------------------------
  useEffect(() => {
    if (!id) return;
    loadShowsByCity(city);
  }, [id, city]);

  const loadShowsByCity = async (selectedCity) => {
    try {
      const res = await api.get(
        `/api/shows/by-movie/${id}?city=${encodeURIComponent(selectedCity)}`
      );

      setShows(res.data || []);
    } catch (err) {
      console.error("Error loading shows:", err);
      setShows([]);
    }
  };

  // -------------------------------------------------------
  // RENDER SECTION
  // -------------------------------------------------------
  if (!movie) {
    return (
      <div className="p-10 text-center text-xl font-semibold">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BACKGROUND BANNER */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-25">
          <img
            src={movie.posterUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-64 h-96 object-cover rounded-lg shadow-xl mx-auto md:mx-0"
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

              <div className="flex items-center gap-3 mb-4">
                <Star size={22} className="fill-red-500 text-red-500" />
                <span className="text-xl font-semibold">
                  {movie.rating}/10
                </span>
              </div>

              <p className="text-gray-300 text-lg">
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p className="text-gray-300 text-lg">
                <strong>Language:</strong> {movie.language}
              </p>
              <p className="text-gray-300 text-lg">
                <strong>Duration:</strong> {movie.durationMinutes} minutes
              </p>
              <p className="text-gray-300 text-lg">
                <strong>Release Date:</strong> {movie.releaseDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SHOWTIME SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Shows in {city}
        </h2>

        {shows.length === 0 && (
          <p className="text-gray-500">No showtimes available in this city.</p>
        )}

        {/* SHOW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows.map((show) => (
            <Link
              key={show.id}
              to={`/booking/${show.id}`}  // ⭐ correct route for seat layout
              state={{
                movie,
                show,
                theatre: {
                  id: show.theatreId,
                  name: show.theatreName || `Theatre #${show.theatreId}`,
                  city: show.city,
                },
              }}
              className="p-5 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <h3 className="text-xl font-semibold mb-1">
                {show.theatreName || `Theatre #${show.theatreId}`}
              </h3>

              <p className="text-gray-600">{show.city}</p>

              <p className="text-gray-700 font-medium mt-2">
                🎭 {show.showDate} — {show.showTime}
              </p>

              <p className="mt-2 text-red-500 font-bold">₹ {show.price}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="flex justify-center gap-6 py-6 mb-10">
        <Link
          to="/"
          className="bg-gray-700 hover:bg-gray-800 text-white px-10 py-3 rounded-lg font-bold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
