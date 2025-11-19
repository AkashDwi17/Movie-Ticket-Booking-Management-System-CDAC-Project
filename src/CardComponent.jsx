import React, { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CardComponent() {
  const movieCategories = [
    {
      title: "Recommended Movies",
      movies: [
        { id: 1, title: "Dune: Part Two", rating: 8.7, year: 2024, genre: "Sci-Fi/Action" },
        { id: 2, title: "Oppenheimer", rating: 8.9, year: 2023, genre: "Biography/Drama" },
        { id: 3, title: "The Batman", rating: 8.2, year: 2022, genre: "Action/Crime" },
        { id: 4, title: "Everything Everywhere", rating: 8.4, year: 2022, genre: "Action/Comedy" },
        { id: 5, title: "Top Gun: Maverick", rating: 8.6, year: 2022, genre: "Action/Drama" },
        { id: 6, title: "Avatar 2", rating: 8.1, year: 2022, genre: "Sci-Fi/Adventure" },
        { id: 7, title: "John Wick 4", rating: 8.5, year: 2023, genre: "Action/Thriller" },
        { id: 8, title: "Mission Impossible", rating: 8.3, year: 2023, genre: "Action/Thriller" },
      ]
    },
    {
      title: "Action Movies",
      movies: [
        { id: 9, title: "Fast X", rating: 7.2, year: 2023, genre: "Action/Crime" },
        { id: 10, title: "Extraction 2", rating: 7.8, year: 2023, genre: "Action/Thriller" },
        { id: 11, title: "The Equalizer 3", rating: 7.9, year: 2023, genre: "Action/Crime" },
        { id: 12, title: "Rebel Moon", rating: 7.4, year: 2023, genre: "Sci-Fi/Adventure" },
        { id: 13, title: "Wonka", rating: 7.7, year: 2023, genre: "Family/Musical" },
        { id: 14, title: "Aquaman 2", rating: 7.6, year: 2023, genre: "Action/Adventure" },
        { id: 15, title: "The Marvels", rating: 8.1, year: 2023, genre: "Action/Sci-Fi" },
        { id: 16, title: "Napoleon", rating: 7.9, year: 2023, genre: "Biography/Drama" },
      ]
    },
    {
      title: "Sci-Fi Movies",
      movies: [
        { id: 17, title: "Deadpool 3", rating: 8.3, year: 2024, genre: "Action/Comedy" },
        { id: 18, title: "Gladiator 2", rating: 8.0, year: 2024, genre: "Action/Drama" },
        { id: 19, title: "Joker 2", rating: 8.8, year: 2024, genre: "Crime/Drama" },
        { id: 20, title: "Inside Out 2", rating: 8.6, year: 2024, genre: "Animation/Comedy" },
        { id: 21, title: "Kingdom Planet Apes", rating: 8.0, year: 2024, genre: "Sci-Fi/Action" },
        { id: 22, title: "Furiosa", rating: 8.1, year: 2024, genre: "Action/Adventure" },
        { id: 23, title: "Bad Boys 4", rating: 7.4, year: 2024, genre: "Action/Comedy" },
        { id: 24, title: "Venom 3", rating: 7.7, year: 2024, genre: "Action/Sci-Fi" },
      ]
    }
  ];

  const MovieRow = ({ category }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
      const container = scrollRef.current;
      const scrollAmount = 400;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className="mb-10 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8 text-gray-800">
          {category.title}
        </h2>
        
        <div className="relative group">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:shadow-xl p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft size={24} className="text-gray-800" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-8 py-2"
          >
            {category.movies.map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 cursor-pointer group/card"
              >
              
                <div className="relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transform transition-all duration-300 group-hover/card:scale-105">
                
                  <div className="w-full h-72 sm:h-80 md:h-96 relative">
                    <img 
                      src="https://free-3dtextureshd.com/wp-content/uploads/2024/06/47.jpg.webp"
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    
                    
                    <div className="absolute top-3 right-3 bg-gray-900 bg-opacity-90 px-2 py-1 rounded flex items-center gap-1">
                      <Star size={14} className="fill-red-500 text-red-500" />
                      <span className="text-sm font-bold text-white">{movie.rating}/10</span>
                    </div>
                  </div>

                  
                  <div className="p-3 bg-white">
                    <h4 className="font-bold text-base md:text-lg text-gray-900 truncate mb-1">
                      {movie.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">{movie.genre}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-xs">{movie.year}</span>
                      <Link to={`/MovieDetails`} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded transition-colors">
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
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

      <style jsx>{`
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