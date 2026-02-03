import { useEffect, useState } from "react";
import api from "./apiClient";

const empty = {
  name: "",
  address: "",
  city: "",
  screenType: "",
  totalSeats: "",
};

export default function TheatrePage() {
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  // LOAD THEATRES
  const load = async () => {
    try {
      const res = await api.get("/api/theatres/list");
      setTheatres(res.data);
    } catch (err) {
      console.error("Error loading theatres", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // SAVE OR UPDATE
  const save = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      address: form.address,
      city: form.city,
      screenType: form.screenType,
      totalSeats: Number(form.totalSeats),
    };

    if (editingId) {
      await api.put(`/api/theatres/${editingId}`, payload);
    } else {
      await api.post("/api/theatres", payload);
    }

    setForm(empty);
    setEditingId(null);
    load();
  };

  // DELETE
  const del = async (id) => {
    if (!confirm("Delete theatre?")) return;
    await api.delete(`/api/theatres/${id}`);
    load();
  };

  // EDIT BUTTON
  const handleEdit = (t) => {
    setEditingId(t.id);
    setForm({
      name: t.name,
      address: t.address,
      city: t.city,
      screenType: t.screenType,
      totalSeats: t.totalSeats,
    });
  };

  const cancelEdit = () => {
    setForm(empty);
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-white">Theatres</h1>

      {/* FORM */}
      <form
        onSubmit={save}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl"
      >
        <div>
          <label className="text-xs text-slate-400">Name</label>
          <input
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Address</label>
          <input
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">City</label>
          <input
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Screen Type</label>
          <input
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            value={form.screenType}
            onChange={(e) => setForm({ ...form, screenType: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-400">Total Seats</label>
          <input
            type="number"
            className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
            value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
            required
          />
        </div>

        <div className="flex gap-4 col-span-1 md:col-span-2">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
            {editingId ? "Update Theatre" : "Add Theatre"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* THEATRES LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300 text-xs">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">City</th>
              <th className="p-2">Screen Type</th>
              <th className="p-2">Seats</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {theatres.map((t) => (
              <tr key={t.id} className="border-t border-slate-800 text-white">
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.city}</td>
                <td className="p-2">{t.screenType}</td>
                <td className="p-2">{t.totalSeats}</td>

                <td className="p-2 text-right flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(t)}
                    className="px-2 py-1 text-xs border border-blue-600 text-blue-300 rounded hover:bg-blue-900/30"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => del(t.id)}
                    className="px-2 py-1 text-xs border border-red-600 text-red-400 rounded hover:bg-red-900/30"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {theatres.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-slate-500">
                  No theatres added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
