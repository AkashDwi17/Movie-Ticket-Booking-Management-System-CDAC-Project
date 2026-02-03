import { useEffect, useState } from "react";
import api from "./apiClient";

export default function BookingsPage() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await api.get("/api/bookings/all");
    setData(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold text-white">Bookings</h1>

      <table className="w-full text-sm bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <thead className="bg-slate-800 text-xs text-slate-400">
          <tr>
            <th className="p-2">Booking ID</th>
            <th className="p-2">User</th>
            <th className="p-2">Movie</th>
            <th className="p-2">Seats</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Time</th>
          </tr>
        </thead>

        <tbody>
          {data.map((b) => (
            <tr key={b.bookingId} className="border-t border-slate-800">
              <td className="p-2 text-slate-300">{b.bookingId}</td>
              <td className="p-2 text-slate-300">{b.userId}</td>
              <td className="p-2 text-slate-300">{b.movieName || b.movieId}</td>
              <td className="p-2 text-slate-300">{b.seatNumbers?.join(", ")}</td>
              <td className="p-2 text-slate-300">₹{b.amount}</td>
              <td className="p-2 text-slate-300">
                {b.bookingTime?.replace("T", " ").slice(0, 16)}
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-slate-500">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
