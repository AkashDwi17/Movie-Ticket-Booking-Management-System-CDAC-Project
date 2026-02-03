import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "./apiClient";

const ROWS = ["A","B","C","D","E","F","G","H","J","K","L","M","N"];
const SEATS_PER_ROW = 18;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

// Fetch real userId when needed
async function fetchUserIdFromBackend() {
  try {
    const username = localStorage.getItem("cineverse_username");
    if (!username) return null;

    const res = await api.get(`/api/auth/user/${username}`);
    return res.data.id;
  } catch {
    return null;
  }
}

export default function SeatLayout() {
  const { id: showIdParam } = useParams();
  const showId = Number(showIdParam);

  const location = useLocation();
  const navigate = useNavigate();

  const movie = location.state?.movie;
  const show = location.state?.show;
  const theatre = location.state?.theatre;

  const [ticketCount] = useState(2);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatStatus, setSeatStatus] = useState([]);

  // Load seat availability
  async function loadSeatStatus() {
    try {
      const res = await api.get(`/api/bookings/seat-status/${showId}`);
      setSeatStatus(res.data);
    } catch (err) {
      console.error("Seat load error:", err);
    }
  }

  useEffect(() => {
    loadSeatStatus();
  }, [showId]);

  // Build seat rows
  const seatRows = ROWS.map((row) => ({
    rowLabel: row,
    seats: Array.from({ length: SEATS_PER_ROW }, (_, index) => {
      const num = String(index + 1).padStart(2, "0");
      const id = `${row}${num}`;

      const backendStatus =
        seatStatus.find((s) => s.seat === id)?.status || "available";

      return {
        id,
        label: num,
        status: backendStatus,
        price: show?.price || 200,
      };
    }),
  }));

  // Selected total
  const selectedTotal = useMemo(
    () =>
      selectedSeats.reduce(
        (acc, seat) => {
          acc.amount += seat.price;
          acc.ids.push(seat.id);
          return acc;
        },
        { amount: 0, ids: [] }
      ),
    [selectedSeats]
  );

  // SELECT / UNSELECT seat (NO LOCK here)
  const handleSeatToggle = (seat) => {
    if (seat.status !== "available") return;

    setSelectedSeats((prev) => {
      if (prev.some((s) => s.id === seat.id)) {
        return prev.filter((s) => s.id !== seat.id);
      }
      if (prev.length >= ticketCount) return prev;

      return [...prev, seat];
    });
  };

  // PROCEED TO PAYMENT — LOCK HERE
  const proceedToPayment = async () => {
    if (!selectedSeats.length) return;

    let userId = localStorage.getItem("cineverse_userId");
    if (!userId) userId = await fetchUserIdFromBackend();

    const token = localStorage.getItem("cineverse_token");

    try {
      // ⭐ Lock all selected seats at once
      await api.post(
        "/api/bookings/lock",
        {
          userId,
          showId,
          seatNumbers: selectedSeats.map((s) => s.id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      alert("Some seats were taken by others! Please reselect seats.");
      await loadSeatStatus();
      return;
    }

    // If locking succeeded → go to payment page
    navigate("/payment", {
      state: {
        movie,
        show,
        theatre,
        showId,
        userId,
        selectedSeats,
        amount: selectedTotal.amount,
      },
    });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 flex flex-col gap-6">

      {/* HEADER */}
      <header className="bg-gradient-to-br from-[#1f2538] to-[#2c3551] text-white p-8 rounded-3xl">
        <p className="uppercase text-xs opacity-80">{movie?.genre} • U/A</p>
        <h1 className="text-3xl font-semibold mt-1">{movie?.title}</h1>
        <p className="opacity-70">
          {theatre?.name} • {show?.showDate} • {show?.showTime}
        </p>
      </header>

      {/* MAIN */}
      <section className="bg-white p-6 rounded-3xl shadow">
        <h2 className="text-xl font-semibold">Select Seats</h2>

        {/* Legend */}
        <div className="flex gap-6 text-sm mt-6 text-gray-700">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-200 border border-green-600 rounded" /> Available
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-600 border-green-600 rounded" /> Selected
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-200 border-red-500 rounded" /> Sold
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-200 border-yellow-500 rounded" /> Locked
          </span>
        </div>

        {/* Seat Rows */}
        {seatRows.map((row) => (
          <div key={row.rowLabel} className="mt-5 border rounded-xl p-4">
            <p className="font-semibold text-gray-600">{row.rowLabel}</p>

            <div className="flex gap-2 flex-wrap mt-3">
              {row.seats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatToggle(seat)}
                  className={`w-10 h-9 text-sm rounded-lg border font-semibold
                    ${
                      seat.status === "sold"
                        ? "bg-red-200 border-red-500 text-red-700 cursor-not-allowed"
                        : seat.status === "locked"
                        ? "bg-yellow-200 border-yellow-500 text-yellow-700 cursor-not-allowed"
                        : selectedSeats.some((s) => s.id === seat.id)
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-400 hover:border-green-600"
                    }
                  `}
                >
                  {seat.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Screen Label */}
        <div className="mt-10 mb-6 flex justify-center">
          <div className="
            w-2/3 h-6 
            bg-gradient-to-b from-gray-300 to-white
            rounded-b-full shadow-lg
            flex items-center justify-center
            text-gray-700 font-semibold text-sm
          ">
            SCREEN THIS SIDE
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="bg-white rounded-3xl p-7 shadow flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">
            {selectedSeats.length
              ? `${selectedSeats.length} seat(s) selected`
              : "No seats selected"}
          </p>
          <p className="text-gray-600">
            {selectedSeats.length ? selectedTotal.ids.join(", ") : "Select seats to continue"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">{formatCurrency(selectedTotal.amount)}</div>

          <button
            disabled={!selectedSeats.length}
            onClick={proceedToPayment}
            className="px-6 py-3 bg-[#ff4d5a] text-white rounded-full font-semibold disabled:opacity-40"
          >
            Proceed to Pay
          </button>
        </div>
      </section>
    </div>
  );
}
