import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies, searchMovies } from '../api';
import Filters from './Filters';
import { 
  Search as SearchIcon, 
  Star as StarIcon, 
  Calendar as CalendarIcon, 
  Play as PlayIcon, 
  Filter as FilterIcon,
  X as XIcon,
  ChevronUp as ChevronUpIcon,
  Image as ImageIcon
} from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({ sort_by: 'popularity.desc', year: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Handle scroll events for scroll-to-top button and infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search and filter effect
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
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, searchQuery, page]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  }, []);

  const handleCardClick = useCallback((movieId) => {
    navigate(`/movie/${movieId}`);
  }, [navigate]);

  const handleImageError = useCallback((movieId) => {
    setImageErrors(prev => new Set([...prev, movieId]));
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setPage(1);
    searchInputRef.current?.focus();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getYearFromDate = (dateString) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Movie Discovery
          </h1>
          
          {/* Enhanced Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search movies, genres, actors..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 sm:pl-14 pr-12 sm:pr-16 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg shadow-2xl focus:bg-white/15 focus:scale-[1.02]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:bg-white/10 rounded-full p-1 transition-colors"
              >
                <XIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex justify-center mb-4 sm:hidden">
            <button
              onClick={toggleFilters}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <FilterIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filters with Mobile Support */}
        <div className={`mb-6 transition-all duration-300 ${showFilters || !isSearching ? 'block' : 'hidden sm:block'}`}>
          {!isSearching && <Filters setFilters={setFilters} />}
        </div>

        {/* Enhanced Results Header */}
        <div className="mb-4 sm:mb-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {isSearching ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm sm:text-base text-gray-300">
            <p>{movies.length} movies found</p>
            {movies.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-0">
                Page {page}
              </p>
            )}
          </div>
        </div>

        {/* Enhanced Movies Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <div
                key={`${movie.id}-${index}`}
                className="group relative  overflow-hidden  transition-all duration-300 hover:transform hover:scale-100 hover:shadow-2xl cursor-pointer touch-manipulation"
                onClick={() => handleCardClick(movie.id)}
              >
                {/* Enhanced Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
                  {!imageErrors.has(movie.id) ? (
                    <img
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/api/placeholder/300/450'
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={() => handleImageError(movie.id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Enhanced Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <PlayIcon className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Enhanced Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 shadow-lg">
                      <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-xs sm:text-sm font-medium">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced Movie Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-white text-sm sm:text-base lg:text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors duration-200 leading-tight">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{getYearFromDate(movie.release_date)}</span>
                    </div>
                    
                    {movie.vote_count > 0 && (
                      <span className="text-gray-400 hidden sm:inline">
                        {movie.vote_count > 1000 
                          ? `${(movie.vote_count / 1000).toFixed(1)}k votes`
                          : `${movie.vote_count} votes`
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12 sm:py-16">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sm:p-8 max-w-md mx-auto">
                  <SearchIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No movies found</h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Enhanced Loading Skeleton */}
          {loading && (
            Array.from({ length: window.innerWidth < 640 ? 6 : 12 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 animate-pulse"
              >
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-4 sm:h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Load More Button */}
        {movies.length > 0 && !loading && (
          <div className="text-center" ref={loadMoreRef}>
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-sm sm:text-base w-full sm:w-auto touch-manipulation"
            >
              Load More Movies
            </button>
          </div>
        )}

        {/* Enhanced Loading Indicator */}
        {loading && movies.length > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20">
              <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-400 mr-3"></div>
              <span className="text-white text-sm sm:text-base">Loading more movies...</span>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
          aria-label="Scroll to top"
        >
          <ChevronUpIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Movies;