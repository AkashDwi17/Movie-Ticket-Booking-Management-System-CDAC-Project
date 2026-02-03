import { useEffect, useState } from "react";
import api from "./apiClient";

export default function AdminDashboard() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [m, s, b] = await Promise.all([
          api.get("/api/movies"),
          api.get("/api/shows"),
          api.get("/api/bookings/all"),
        ]);

        setMovies(m.data || []);
        setShows(s.data || []);
        setBookings(b.data || []);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">Total Movies</p>
          <p className="text-2xl font-bold mt-1">
            {loading ? "--" : movies.length}
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">Total Shows</p>
          <p className="text-2xl font-bold mt-1">
            {loading ? "--" : shows.length}
          </p>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <p className="text-xs text-slate-400">Total Bookings</p>
          <p className="text-2xl font-bold mt-1">
            {loading ? "--" : bookings.length}
          </p>
        </div>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Movies */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm font-semibold mb-2">Movies</h2>
          <ul className="text-xs text-slate-300 max-h-64 overflow-auto">
            {movies.map((m) => (
              <li key={m.id ?? crypto.randomUUID()} className="border-b border-slate-700 py-1">
                {m.title || "Untitled"}
              </li>
            ))}
          </ul>
        </div>

        {/* Shows */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm font-semibold mb-2">Shows</h2>
          <ul className="text-xs text-slate-300 max-h-64 overflow-auto">
            {shows.map((s) => (
              <li key={s.id ?? crypto.randomUUID()} className="border-b border-slate-700 py-1">
                {(s.movieName || movies.find(m => m.id === s.movieId)?.title || "Movie")}
                {" — "}
                {s.showTime || "--:--"}
              </li>
            ))}
          </ul>
        </div>

        {/* Bookings */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <h2 className="text-sm font-semibold mb-2">Bookings</h2>
          <ul className="text-xs text-slate-300 max-h-64 overflow-auto">
            {bookings.map((b) => (
              <li key={b.id ?? crypto.randomUUID()} className="border-b border-slate-700 py-1">
                #{b.id} — {b.movieName || `Show ${b.showId}`} — {b.seats || "No Seats"}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
