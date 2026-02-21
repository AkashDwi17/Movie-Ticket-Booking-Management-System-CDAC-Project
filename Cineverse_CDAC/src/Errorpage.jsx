import React from "react";
import { Home, Search } from "lucide-react";
import imageNotFound from "./assets/notFound.svg";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Error */}
        <div className="mb-8 flex justify-center">
         <img src={imageNotFound} alt="Not Found" />
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            LOOKS LIKE YOU'RE LOST
          </h2>
          <p className="text-gray-600 text-base md:text-lg mb-8">
            We can't seem to find the page you're looking for
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto">
            <Home size={20} />
            Go to Home
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold px-8 py-3 rounded-lg border-2 border-gray-300 transition-colors flex items-center gap-2 w-full sm:w-auto">
            <Search size={20} />
            Search Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;