import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./apiClient";

// --------------------------
// FIXED DATE LABEL
// --------------------------
function formatShowDateLabel(rawDate) {
  if (!rawDate) return rawDate;

  let yyyy, mm, dd;
  const parts = rawDate.split("-");

  // yyyy-MM-dd
  if (parts[0].length === 4) {
    [yyyy, mm, dd] = parts;
  }
  // dd-MM-yyyy
  else {
    [dd, mm, yyyy] = parts;
  }

  const d = new Date(yyyy, mm - 1, dd);

  const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("en-IN", { month: "short" });

  return `${weekday} ${day} ${month}`;
}

// --------------------------
// FIXED TIME LABEL
// Supports both "18:30" AND "18.30"
// --------------------------
function formatShowTimeLabel(rawTime) {
  if (!rawTime) return "";

  // CASE: 18.30 (float/string-decimal)
  if (!rawTime.includes(":")) {
    const [h, m] = rawTime.split(".");
    const hour = Number(h);
    const minute = (m || "00").padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${String(displayHour).padStart(2, "0")}:${minute} ${ampm}`;
  }

  // Already HH:mm
  const [hStr, mStr] = rawTime.split(":");
  let h = Number(hStr);
  const m = (mStr || "00").padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";

  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
}

// --------------------------
// FIXED DATE NORMALIZATION
// --------------------------
const normalizeDate = (date) => {
  const p = date.split("-");
  return p[0].length === 4 ? date : `${p[2]}-${p[1]}-${p[0]}`;
};

export default function Booking() {
  const { id: showId } = useParams();  // ❗ showId, NOT movieId
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [dateTabs, setDateTabs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLang, setSelectedLang] = useState("ALL");
  const [selectedPrice, setSelectedPrice] = useState("ALL");
  const [selectedTime, setSelectedTime] = useState("ALL");

  // --------------------------
  // LOAD MOVIE + SHOWS + THEATRES
  // --------------------------
  useEffect(() => {
    if (!showId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ⭐ 1️⃣ FIRST GET SHOW DETAILS (correct way)
        const showRes = await api.get(`/api/shows/${showId}`);
        const showData = showRes.data;

        // ⭐ 2️⃣ USE show.movieId TO FETCH MOVIE (not showId)
        const movieRes = await api.get(`/api/movies/${showData.movieId}`);
        setMovie(movieRes.data);

        // ⭐ 3️⃣ FETCH ALL SHOWS FOR THIS MOVIE
        const showsRes = await api.get(`/api/shows/by-movie/${showData.movieId}`);
        const shows = showsRes.data || [];

        // CREATE DATE TABS
        const uniqueDateStrings = Array.from(
          new Set(shows.map((s) => normalizeDate(s.showDate)))
        );

        const tabs = uniqueDateStrings.map((raw) => ({
          raw,
          label: formatShowDateLabel(raw)
        }));

        setDateTabs(tabs);
        if (tabs.length > 0) setSelectedDate(tabs[0]);

        // FETCH THEATRES
        const theatreIds = Array.from(new Set(shows.map((s) => s.theatreId)));

        const theatreMap = {};
        await Promise.all(
          theatreIds.map(async (tid) => {
            const res = await api.get(`/api/theatres/view/${tid}`);
            theatreMap[tid] = res.data;
          })
        );

        // GROUP SHOWS
        const grouped = {};
        shows.forEach((show) => {
          if (!grouped[show.theatreId]) grouped[show.theatreId] = [];
          grouped[show.theatreId].push(show);
        });

        const theatreList = Object.entries(grouped).map(
          ([tid, showList]) => ({
            theatreId: Number(tid),
            theatre: theatreMap[tid],
            shows: showList
          })
        );

        setTheatres(theatreList);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  // --------------------------
  // HANDLE SHOW CLICK
  // --------------------------
  const handleShowClick = (show, theatre) => {
    const token = localStorage.getItem("cineverse_token");
    if (!token) return navigate("/login");

    navigate(`/seat/${show.id}`, {
      state: { show, theatre, movie }
    });
  };

  // --------------------------
  // FILTER TIME
  // --------------------------
  const filterShowByTime = (show) => {
    if (selectedTime === "ALL") return true;

    let raw = show.showTime;

    if (!raw.includes(":")) {
      const [h] = raw.split(".");
      raw = `${h}:00`;
    }

    const [hStr] = raw.split(":");
    const h = Number(hStr);

    if (selectedTime === "MORNING") return h >= 6 && h < 12;
    if (selectedTime === "AFTERNOON") return h >= 12 && h < 17;
    if (selectedTime === "EVENING") return h >= 17 && h < 22;
    if (selectedTime === "LATE") return h >= 22 || h < 6;

    return true;
  };

  if (loading) return <div className="p-10 text-xl">Loading...</div>;

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* MOVIE HEADER */}
        <section className="mb-6 p-4 bg-white shadow rounded">
          <h1 className="text-3xl font-bold">{movie?.title}</h1>
          <div className="mt-2 text-gray-700">{movie?.genre}</div>
        </section>

        {/* DATE TABS */}
        <section className="flex gap-3 mb-6 overflow-x-auto">
          {dateTabs.map((d) => (
            <button
              key={d.raw}
              onClick={() => setSelectedDate(d)}
              className={`px-4 py-2 rounded ${
                selectedDate?.raw === d.raw
                  ? "bg-red-600 text-white"
                  : "bg-white border"
              }`}
            >
              {d.label}
            </button>
          ))}
        </section>

        {/* THEATRES LIST */}
        <section className="space-y-4">
          {theatres.map((t) => {
            const filteredShows = t.shows.filter((s) => {
              if (
                selectedDate &&
                normalizeDate(s.showDate) !== normalizeDate(selectedDate.raw)
              ) {
                return false;
              }

              if (!filterShowByTime(s)) return false;

              return true;
            });

            if (!filteredShows.length) return null;

            return (
              <div key={t.theatreId} className="p-4 bg-white shadow rounded">
                <h3 className="text-lg font-semibold">{t.theatre?.name}</h3>

                <div className="mt-3 flex flex-wrap gap-3">
                  {filteredShows.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleShowClick(s, t.theatre)}
                      className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                      {formatShowTimeLabel(s.showTime)} • ₹{s.price}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

      </main>
    </div>
  );
}
