import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Menu, X } from 'lucide-react';
import logo from './assets/cineverse_logo1.png';
import { Link, useNavigate } from 'react-router-dom';
import api from "./apiClient";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ⭐ Load city from storage OR default to Yelahanka
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("cineverse_city") || "Yelahanka"
  );

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef();

  const cities = [
    'Yelahanka', 'Whitefield', 'Koramangala', 'MG Road',
    'Indiranagar', 'Jayanagar', 'HSR Layout', 'Hebbal'
  ];

  // CHECK LOGIN
  const isLoggedIn = !!localStorage.getItem("cineverse_token");

  const handleLogout = () => {
    localStorage.removeItem("cineverse_token");
    navigate("/login");
  };

  // 🔍 SEARCH API CALL
  useEffect(() => {
    if (!searchText.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get(`/api/movies/search?query=${searchText}`);
        setResults(res.data);
        setShowResults(true);
      } catch (e) {
        console.log("Search error:", e);
      }
    }, 300); // debounce

    return () => clearTimeout(delay);
  }, [searchText]);

  // CLOSE SEARCH DROPDOWN IF CLICKED OUTSIDE
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-8">

            {/* LOGO */}
            <Link to="/" className="flex w-50 h-10 items-center cursor-pointer">
              <img src={logo} alt="logo" className="h-full w-auto" />
            </Link>

            {/* SEARCH BOX */}
            <div ref={searchRef} className="hidden md:flex items-center relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 w-96 focus-within:border-gray-400">
                <Search size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for Movies, Events, Plays, Sports and Activities"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onFocus={() => searchText && setShowResults(true)}
                  className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* 🔥 SEARCH RESULTS */}
              {showResults && results.length > 0 && (
                <div className="absolute top-12 left-0 w-96 bg-white shadow-lg border rounded-md z-50 max-h-80 overflow-y-auto">
                  {results.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => {
                        navigate(`/movie/${movie.id}`);
                        setShowResults(false);
                        setSearchText("");
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{movie.title}</p>
                        <p className="text-xs text-gray-500">{movie.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 md:gap-6">

            {/* CITY DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown(!showCityDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                📍 <span className="hidden sm:inline">{selectedCity}</span>
                <ChevronDown size={16} className={`${showCityDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showCityDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCityDropdown(false)}></div>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          localStorage.setItem("cineverse_city", city); // ⭐ persist
                          setShowCityDropdown(false);
                          window.location.reload(); // refresh for theatre filtering
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          selectedCity === city ? 'text-pink-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* LOGIN / LOGOUT */}
            {!isLoggedIn ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 md:px-6 py-2 rounded text-sm font-medium"
              >
                Sign in
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 text-lg font-bold">👤</span>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}

            {/* MOBILE MENU */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-4">
          <div className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays..."
              className="flex-1 outline-none text-sm text-gray-700"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
