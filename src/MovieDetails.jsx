import React, { useState } from 'react';
import { Star, Heart, Share2 } from 'lucide-react';
import { Link } from "react-router-dom";

export default function MovieDetails() {
  

  // Dummy movie data
  const movie = {
    title: "Kantara: A Legend Chapter 1",
    poster: "https://free-3dtextureshd.com/wp-content/uploads/2024/06/47.jpg.webp",
    rating: 8.9,
    format: "2D, IMAX 2D",
    language: "Kannada, Hindi, Telugu, Tamil",
    duration: "2h 28m",
    genre: "Action, Drama, Thriller",
    releaseDate: "15 Dec, 2024",
    censor: "UA",
    description: "Set in the fictional village of Dakshina Kannada, Kantara is a visual grandeur that brings alive the traditional culture. It is believed that Demigods are the guardians and their energies encircle the village. The story encompasses the conflict between nature and human beings.",
  };

  const cast = [
    { name: "Rishab Shetty", role: "Actor", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { name: "Sapthami Gowda", role: "Actor", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { name: "Kishore", role: "Actor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { name: "Achyuth Kumar", role: "Actor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
     { name: "Rishab Shetty", role: "Actor", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { name: "Sapthami Gowda", role: "Actor", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { name: "Kishore", role: "Actor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { name: "Achyuth Kumar", role: "Actor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" },
     { name: "Rishab Shetty", role: "Actor", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
    { name: "Sapthami Gowda", role: "Actor", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
    { name: "Kishore", role: "Actor", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
    { name: "Achyuth Kumar", role: "Actor", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" }
  ];

  const crew = [
    { name: "Rishab Shetty", role: "Director" },
    { name: "Vijay Kiragandur", role: "Producer" },
    { name: "B. Ajaneesh Loknath", role: "Music" },
    { name: "Rishab Shetty", role: "Director" },
    { name: "Vijay Kiragandur", role: "Producer" },
    { name: "B. Ajaneesh Loknath", role: "Music" },
    { name: "Rishab Shetty", role: "Director" },
    { name: "Vijay Kiragandur", role: "Producer" }

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background */}
      <div className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <img src={movie.poster} alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto md:mx-0"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded">
                  <Star size={20} className="fill-red-500 text-red-500" />
                  <span className="font-bold text-lg">{movie.rating}/10</span>
                </div>
              </div>

              {/* Movie Details */}
              <div className="space-y-2 mb-6 text-gray-300">
                <p><span className="font-semibold">Format:</span> {movie.format}</p>
                <p><span className="font-semibold">Language:</span> {movie.language}</p>
                <p><span className="font-semibold">Duration:</span> {movie.duration} • {movie.genre}</p>
                <p><span className="font-semibold">Release Date:</span> {movie.releaseDate} • {movie.censor}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Book Tickets
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the movie</h2>
          <p className="text-gray-700 leading-relaxed">{movie.description}</p>
        </section>

        {/* Cast Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {cast.map((person, index) => (
              <div key={index} className="text-center">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-gray-200"
                />
                <h4 className="font-semibold text-sm text-gray-900">{person.name}</h4>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crew Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Crew</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {crew.map((person, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900">{person.name}</h4>
                <p className="text-sm text-gray-500">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your Safety Section */}
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Your safety is our priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Social distancing measures</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Regular sanitization</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <span>Contactless security checks</span>
            </div>
          </div>
        </section>

        {/* Book Tickets Button */}
        <div className=" flex  bottom-0 bg-white shadow-lg border-t border-gray-200 p-4 -mx-4 md:-mx-8">
          <div className="w-50 mx-auto">
            <button className="w-full hover:cursor-pointer bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors">
              Book Tickets
            </button>
          </div>
          <div className="w-50 mx-auto">
            {/* <Link to="/" className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors">
              Back to Home
            </Link> */}
             <button className="w-full hover:cursor-pointer bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold text-lg transition-colors">
              Back to Home
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}