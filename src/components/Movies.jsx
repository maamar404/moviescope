import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, searchMovies } from '../api';
import Filters from './Filters';
import { SearchIcon, StarIcon, CalendarIcon, PlayIcon } from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ sort_by: 'popularity.desc', year: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
  const timer = setTimeout(() => {
    const getMovies = async () => {
      setLoading(true);
      try {
        if (searchQuery.trim() === '') {
          setIsSearching(false);
          const data = await fetchMovies(filters, page);
          setMovies(prev => (page === 1 ? data : [...prev, ...data]));
        } else {
          setIsSearching(true);
          const data = await searchMovies(searchQuery, page);
          setMovies(prev => (page === 1 ? data : [...prev, ...data]));
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, 500); // 500ms delay

  return () => clearTimeout(timer);
}, [filters, searchQuery, page]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const getYearFromDate = (dateString) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for movies, genres, or actors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Filters */}
        {!isSearching && <Filters setFilters={setFilters} />}

        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isSearching ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          </h2>
          <p className="text-gray-300 mt-1">
            {movies.length} movies found
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 mb-8">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onClick={() => handleCardClick(movie.id)}
              >
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/api/placeholder/300/450'
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayIcon className="w-16 h-16 text-white" />
                  </div>

                  {/* Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{getYearFromDate(movie.release_date)}</span>
                    </div>
                    
                    {movie.vote_count > 0 && (
                      <span className="text-gray-400">
                        {movie.vote_count} votes
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-md mx-auto">
                  <SearchIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                  <p className="text-gray-300">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Loading Skeleton */}
          {loading && (
            Array.from({ length: 10 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 animate-pulse"
              >
                <div className="aspect-[2/3] bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {movies.length > 0 && !loading && (
          <div className="text-center">
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
            >
              Load More Movies
            </button>
          </div>
        )}

        {/* Loading Indicator for Load More */}
        {loading && movies.length > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-white">Loading more movies...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;