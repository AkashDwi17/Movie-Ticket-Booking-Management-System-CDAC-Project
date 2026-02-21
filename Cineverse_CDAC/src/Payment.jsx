import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./apiClient";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    movie,
    show,
    theatre,
    showId,
    userId,
    selectedSeats,
    amount,
    userName,
    userPhone,
  } = location.state || {};

  // If user directly hits /payment without state
  if (!location.state) return <div>Error: Missing booking data</div>;

  // fallback WhatsApp number if frontend didn't send
  const finalPhone = userPhone?.trim() || "917892085469";

  // 10-minute session timer
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("Session expired! Please select seats again.");
          navigate(`/shows/${showId}`, {
            state: { movie, show, theatre },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, showId, movie, show, theatre]);

  const formattedTime = `${Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;

  const payNow = async () => {
    if (timeLeft <= 0) {
      alert("Session expired! Please select seats again.");
      navigate(`/shows/${showId}`, {
        state: { movie, show, theatre },
      });
      return;
    }

    try {
      const token = localStorage.getItem("cineverse_token");

      const res = await api.post(
        "/api/payments/create-checkout-session",
        {
          userId,
          showId,
          bookingId: showId,
          amount,

          seats: selectedSeats.map((s) => s.id),

          // Always send phone so WhatsApp always works
          userName: userName || "User",
          userPhone: finalPhone,

          movieName: movie?.title,
          showTime: show?.showTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initialization failed");
    }
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">Confirm Your Payment</h1>

      <p className="text-lg mb-2">Movie: {movie?.title}</p>
      <p className="text-lg mb-2">Theatre: {theatre?.name}</p>
      <p className="text-lg mb-2">Show Time: {show?.showTime}</p>
      <p className="text-lg mb-2">
        Seats: {selectedSeats.map((s) => s.id).join(", ")}
      </p>
      <p className="text-lg font-bold mb-4">Amount: ₹{amount}</p>

      {/* Timer */}
      <p className="text-md text-red-600 font-semibold mb-4">
        Session expires in: {formattedTime}
      </p>

      <button
        onClick={payNow}
        disabled={timeLeft <= 0}
        className="px-8 py-3 bg-red-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {timeLeft > 0 ? "Pay Securely" : "Session Expired"}
      </button>
    </div>
  );
}
