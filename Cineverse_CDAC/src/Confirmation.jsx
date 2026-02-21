import React, { useState, useEffect } from 'react';
import { Check, Calendar, Clock, MapPin, Film, Users, CreditCard, Download, Share2 } from 'lucide-react';

export default function BookingConfirmation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock booking data - replace with API data later
  const bookingData = {
    bookingId: "BMS2024112701",
    movieName: "Inception",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    theaterName: "INOX Megaplex",
    screen: "Screen 3 - IMAX",
    date: "December 15, 2024",
    time: "7:00 PM",
    seats: ["F7", "F8", "F9"],
    location: "Phoenix Market City, Bangalore",
    amount: "₹1,350"
  };

  return (
    <div className="min-h-screen text-black md:p-8 mt-15 ">
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-4 animate-bounce">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold  mb-2">
            Booking Confirmed!
          </h1>
          <p className=" text-lg">
            Your tickets have been sent to your WhatsApp
          </p>
        </div>

        {/* Main Ticket Card */}
        <div className={` text-black rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Movie Header with Poster */}
          <div className="relative h-48  p-6 flex items-center text-black">
            <img 
              src={bookingData.posterUrl} 
              alt={bookingData.movieName}
              className="w-28 h-40 object-cover rounded-lg shadow-lg"
            />
            <div className="ml-6 text-black">
              <h2 className="text-3xl font-bold mb-2">{bookingData.movieName}</h2>
              <p className=" flex  items-center gap-2">
                <Film className="w-4 h-4" />
                English • 2D
              </p>
            </div>
            <div className="absolute top-4 right-4 text-black  px-4 py-2 rounded-full font-semibold text-sm">
              Booking ID: {bookingData.bookingId}
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-6">
            {/* Theater & Screen */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Theater Details</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{bookingData.theaterName}</p>
                    <p className="text-sm text-gray-600">{bookingData.location}</p>
                    <p className="text-sm text-gray-500 mt-1">{bookingData.screen}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-800">{bookingData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Show Time</p>
                  <p className="font-semibold text-gray-800">{bookingData.time}</p>
                </div>
              </div>
            </div>

            {/* Seats */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-indigo-600 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Your Seats</p>
                  <div className="flex gap-2 flex-wrap">
                    {bookingData.seats.map((seat, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            

            {/* Amount */}
            <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">Total Amount Paid</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{bookingData.amount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-600 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
              <Share2 className="w-5 h-5" />
              Share
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className={`mt-6 text-center  text-sm transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p>Please arrive 15 minutes before the show time</p>
          <p className="mt-1">Show this ticket at the theater entrance</p>
        </div>
      </div>
    </div>
  );
}