import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "./apiClient";
import jsPDF from "jspdf";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("Invalid payment session. Please try booking again.");
      setLoading(false);
      return;
    }

    const finalizeBooking = async () => {
      try {
        const token = localStorage.getItem("cineverse_token");

        const res = await api.post(
          "/api/payments/confirm-session",
          {
            sessionId,
            authHeader: `Bearer ${token}`,   // ⭐ send token to backend
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTicket(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Booking confirmation failed:", err);
        setErrorMsg(
          "Payment done but booking confirmation failed. Please contact support."
        );
        setLoading(false);
      }
    };

    finalizeBooking();
  }, [sessionId]);

  const handleDownloadPdf = () => {
    if (!ticket) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("CineVerse - Movie Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text("Thank you for booking with us!", 20, 30);

    let y = 45;
    const gap = 8;

    doc.setFontSize(14);
    doc.text("Booking Details", 20, y);
    y += gap + 2;

    doc.setFontSize(12);
    doc.text(`Booking ID : ${ticket.bookingId}`, 20, y);
    y += gap;
    doc.text(`Movie      : ${ticket.movieName}`, 20, y);
    y += gap;
    doc.text(`Show Time  : ${ticket.showTime}`, 20, y);
    y += gap;
    doc.text(`Seats      : ${ticket.seatNumbers.join(", ")}`, 20, y);
    y += gap;
    doc.text(`Amount     : ₹${ticket.amount}`, 20, y);
    y += gap * 2;

    doc.text("Please reach the theatre 15 minutes before showtime.", 20, y);

    y += gap * 2;
    doc.setFontSize(10);
    doc.text("CineVerse | This is a computer generated ticket.", 20, y);

    doc.save(`ticket-${ticket.bookingId}.pdf`);
  };

  if (loading) {
    return (
      <div className="text-center p-10 animate-pulse">
        <h1 className="text-3xl font-bold">Payment Successful 🎉</h1>
        <p className="text-lg">Finalizing your booking…</p>
      </div>
    );
  }

  if (errorMsg && !ticket) {
    return (
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
        <p className="mt-3 text-lg">{errorMsg}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold text-green-600">Booking Confirmed 🎟️</h1>
      <p className="mt-3 text-xl font-semibold">
        Movie Ticket Booked Successfully!
      </p>

      <div className="mt-8 mx-auto p-6 bg-white rounded-xl shadow-lg w-[400px] text-left">
        <p><b>Movie:</b> {ticket.movieName}</p>
        <p><b>Show Time:</b> {ticket.showTime}</p>
        <p><b>Seats:</b> {ticket.seatNumbers.join(", ")}</p>
        <p><b>Amount:</b> ₹{ticket.amount}</p>
        <p><b>Booking ID:</b> {ticket.bookingId}</p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={handleDownloadPdf}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download Ticket (PDF)
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
