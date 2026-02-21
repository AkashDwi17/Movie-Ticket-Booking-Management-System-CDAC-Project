import React, { useEffect, useState } from "react";
import api from "./apiClient";

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  const emptyMovie = {
    title: "",
    genre: "",
    language: "",
    durationMinutes: "",
    rating: "",
    releaseDate: "",
    cast: ""
  };

  const [form, setForm] = useState(emptyMovie);

  // LOAD MOVIES
  const load = async () => {
    try {
      const res = await api.get("/api/movies");
      setMovies(res.data || []);
    } catch (err) {
      console.log("Error loading movies", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // HANDLE INPUT CHANGES
  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // HANDLE EDIT BUTTON
  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm({
      title: m.title || "",
      genre: m.genre || "",
      language: m.language || "",
      durationMinutes: m.durationMinutes || "",
      rating: m.rating || "",
      releaseDate: m.releaseDate || "",
      cast: m.cast ? m.cast.join(", ") : ""
    });
    setPosterFile(null);
  };

  // HANDLE DELETE
  const del = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await api.delete(`/api/movies/${id}`);
      load();
    } catch (err) {
      console.log("Delete error", err);
    }
  };

  // 🔥 CREATE OR UPDATE USING MULTIPART FORM DATA
  const save = async () => {
    const movieJson = JSON.stringify({
      title: form.title,
      genre: form.genre,
      language: form.language,
      durationMinutes: Number(form.durationMinutes),
      rating: Number(form.rating),
      releaseDate: form.releaseDate,
      cast: form.cast ? form.cast.split(",").map((c) => c.trim()) : []
    });

    const fd = new FormData();
    fd.append("movie", movieJson);

    if (posterFile) {
      fd.append("poster", posterFile);
    }

    try {
      if (editingId) {
        await api.put(`/api/movies/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/api/movies", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setForm(emptyMovie);
      setPosterFile(null);
      setEditingId(null);
      load();
    } catch (err) {
      console.log("Save error", err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyMovie);
    setPosterFile(null);
  };

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold text-white mb-4">Movies</h1>

      {/* FORM */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mb-6">

        {/* TITLE & GENRE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-sm">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Genre</label>
            <input
              name="genre"
              value={form.genre}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>
        </div>

        {/* LANGUAGE & DURATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-slate-400 text-sm">Language</label>
            <input
              name="language"
              value={form.language}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Duration (minutes)</label>
            <input
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>
        </div>

        {/* RATING + RELEASE DATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-slate-400 text-sm">Rating</label>
            <input
              name="rating"
              value={form.rating}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>

          <div>
            <label className="text-slate-400 text-sm">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={updateField}
              className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
            />
          </div>
        </div>

        {/* POSTER FILE UPLOAD */}
        <div className="mt-4">
          <label className="text-slate-400 text-sm">Poster Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files[0])}
            className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
          />
        </div>

        {/* CAST */}
        <div className="mt-4">
          <label className="text-slate-400 text-sm">Cast (comma separated)</label>
          <textarea
            name="cast"
            value={form.cast}
            onChange={updateField}
            rows={3}
            className="w-full p-2 rounded bg-slate-800 text-white border border-slate-600"
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-4 flex gap-4">
          <button
            onClick={save}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {editingId ? "Update Movie" : "Add Movie"}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        </div>

      </div>

      {/* MOVIES TABLE */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-2">Title</th>
              <th className="p-2">Language</th>
              <th className="p-2">Genre</th>
              <th className="p-2">Duration</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {movies.map((m) => (
              <tr key={m.id} className="border-t border-slate-800">
                <td className="p-2">{m.title}</td>
                <td className="p-2">{m.language}</td>
                <td className="p-2">{m.genre}</td>
                <td className="p-2">{m.durationMinutes}</td>

                <td className="p-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="px-2 py-1 border border-slate-600 rounded hover:bg-slate-800 text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => del(m.id)}
                    className="px-2 py-1 border border-red-600 rounded text-red-400 hover:bg-red-900/30 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
