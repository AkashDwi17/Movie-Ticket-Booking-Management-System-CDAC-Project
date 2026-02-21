import { useEffect, useState } from "react";
import api from "./apiClient";

const empty = {
  movieId: "",
  theatreId: "",
  showDate: "",
  showTime: "",
  price: "",
};

export default function ShowsPage() {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  // LOAD ALL DATA
  const load = async () => {
    try {
      const m = await api.get("/api/movies");
      setMovies(m.data);

      const t = await api.get("/api/theatres/list");
      setTheatres(t.data);

      // load shows for all theatres
      const all = [];
      for (let th of t.data) {
        try {
          const res = await api.get(`/api/shows/by-theatre/${th.id}`);
          all.push(...res.data);
        } catch {}
      }
      setShows(all);
    } catch (err) {
      console.error("Load error", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // SAVE OR UPDATE SHOW
  const save = async (e) => {
    e.preventDefault();

    const payload = {
      movieId: form.movieId,
      theatreId: Number(form.theatreId),
      showDate: form.showDate,
      showTime: form.showTime,
      price: Number(form.price),
    };

    if (editingId) {
      // UPDATE
      await api.put(`/api/shows/${editingId}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cineverse_token")}`,
        },
      });
    } else {
      // CREATE
      await api.post("/api/shows", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("cineverse_token")}`,
        },
      });
    }

    setForm(empty);
    setEditingId(null);
    load();
  };

  // DELETE SHOW
  const del = async (id) => {
    if (!confirm("Delete show?")) return;
    await api.delete(`/api/shows/${id}`);
    load();
  };

  // EDIT BUTTON CLICK
  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      movieId: s.movieId,
      theatreId: s.theatreId,
      showDate: s.showDate,
      showTime: s.showTime,
      price: s.price,
    });
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setForm(empty);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold text-white">Shows</h1>

      {/* FORM */}
      <form
        onSubmit={save}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl"
      >
        {/* MOVIE */}
        <div>
          <label className="text-xs text-slate-400">Movie</label>
          <select
            value={form.movieId}
            onChange={(e) => setForm({ ...form, movieId: e.target.value })}
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            required
          >
            <option value="">Select Movie</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* THEATRE */}
        <div>
          <label className="text-xs text-slate-400">Theatre</label>
          <select
            value={form.theatreId}
            onChange={(e) => setForm({ ...form, theatreId: e.target.value })}
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            required
          >
            <option value="">Select Theatre</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div>
          <label className="text-xs text-slate-400">Show Date</label>
          <input
            type="date"
            value={form.showDate}
            onChange={(e) => setForm({ ...form, showDate: e.target.value })}
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            required
          />
        </div>

        {/* TIME */}
        <div>
          <label className="text-xs text-slate-400">Show Time</label>
          <input
            type="time"
            value={form.showTime}
            onChange={(e) => setForm({ ...form, showTime: e.target.value })}
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="text-xs text-slate-400">Ticket Price (₹)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            required
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex gap-4">
          <button className="bg-emerald-600 px-4 py-2 rounded text-white hover:bg-emerald-700">
            {editingId ? "Update Show" : "Add Show"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* SHOW LIST TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300 text-xs">
            <tr>
              <th className="p-2">Movie</th>
              <th className="p-2">Theatre</th>
              <th className="p-2">City</th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Price</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {shows.map((s) => (
              <tr key={s.id} className="border-t border-slate-800 text-white">
                <td className="p-2">{movies.find((m) => m.id === s.movieId)?.title}</td>
                <td className="p-2">{s.theatreName}</td>
                <td className="p-2">{s.city}</td>
                <td className="p-2">{s.showDate}</td>
                <td className="p-2">{s.showTime}</td>
                <td className="p-2">₹{s.price}</td>

                <td className="p-2 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-2 py-1 text-xs border border-slate-600 text-blue-300 rounded hover:bg-slate-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => del(s.id)}
                    className="px-2 py-1 text-xs border border-red-600 text-red-400 rounded hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {shows.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-slate-500">
                  No shows added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
