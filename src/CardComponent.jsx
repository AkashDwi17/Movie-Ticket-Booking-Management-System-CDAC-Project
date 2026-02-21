import React, { useRef, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import api from "./apiClient";

export default function CardComponent() {
  const [movieCategories, setMovieCategories] = useState([]);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const res = await api.get("/api/movies"); // Backend correct endpoint
      const movies = res.data;

      const categoryMap = {};

      movies.forEach((movie) => {
        const genreKey = movie.genre?.split("/")[0] || "Others";
        if (!categoryMap[genreKey]) categoryMap[genreKey] = [];
        categoryMap[genreKey].push(movie);
      });

      const formatted = Object.keys(categoryMap).map((genre) => ({
        title: genre + " Movies",
        movies: categoryMap[genre],
      }));

      setMovieCategories(formatted);
    } catch (err) {
      console.error("Error loading movies:", err);
    }
  };

  const MovieRow = ({ category }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollRef.current;
      const scrollAmount = 400;

      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    };

    return (
      <div className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 text-gray-800">
          {category.title}
        </h2>

        <div className="relative group">
          {/* Scroll Left */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          {/* Movie List */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 py-2 scrollbar-hide"
          >
            {category.movies.map((movie, idx) => (
              <div
                key={movie.id + "_" + idx}   // <<< FIXED KEY
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 cursor-pointer group/card"
              >
                <div className="relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transform transition-all duration-300 group-hover/card:scale-105">
                  <div className="w-full h-72 sm:h-80 md:h-96 relative">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Rating */}
                    <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-90 px-2 py-1 rounded flex items-center gap-1">
                      <Star size={14} className="fill-red-500 text-red-500" />
                      <span className="text-sm font-bold text-white">
                        {movie.rating}/10
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 bg-white">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 truncate mb-1">
                      {movie.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{movie.genre}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">
                        {movie.language}
                      </span>

                      <Link
                        to={`/movie/${movie.id}`}   // <<< FIXED ID
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Right */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-screen-2xl mx-auto">
        {movieCategories.map((category, idx) => (
          <MovieRow key={idx} category={category} />
        ))}
      </div>

      {/* Hide scrollbars */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
