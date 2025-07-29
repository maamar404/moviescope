import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'antd';
import { fetchMovies } from '../api';
import { 
  PlayIcon, 
  StarIcon, 
  CalendarIcon, 
  InfoIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

const HeroSection = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getFeaturedMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMovies({ sort_by: 'popularity.desc' }, 1);
        // Get top 5 most popular movies
        setFeaturedMovies(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching featured movies:', error);
      } finally {
        setLoading(false);
      }
    };
    getFeaturedMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const getYearFromDate = (dateString) => {
    return dateString ? new Date(dateString).getFullYear() : 'N/A';
  };

  const goToSlide = (slideIndex) => {
    carouselRef.current?.goTo(slideIndex);
  };

  const nextSlide = () => {
    carouselRef.current?.next();
  };

  const prevSlide = () => {
    carouselRef.current?.prev();
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading featured movies...</p>
        </div>
      </div>
    );
  }

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    fade: true,
    speed: 1000,
    dots: false,
    arrows: false,
    beforeChange: (current, next) => setCurrentSlide(next),
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Carousel ref={carouselRef} {...carouselSettings}>
        {featuredMovies.map((movie, index) => (
          <div key={movie.id} className="relative w-full h-screen">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${
                  movie.backdrop_path 
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : '/api/placeholder/1920/1080'
                })`
              }}
            >
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  {/* Movie Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {movie.title}
                  </h1>

                  {/* Movie Stats */}
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    {movie.vote_average > 0 && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-500/30">
                          <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-bold text-lg">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-gray-200">
                      <CalendarIcon className="w-5 h-5 text-blue-400" />
                      <span className="text-lg font-medium">
                        {getYearFromDate(movie.release_date)}
                      </span>
                    </div>

                    {movie.vote_count > 0 && (
                      <div className="text-gray-300 text-lg">
                        {movie.vote_count.toLocaleString()} votes
                      </div>
                    )}
                  </div>

                  {/* Movie Overview */}
                  <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-xl line-clamp-3">
                    {movie.overview || 'No overview available for this movie.'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleMovieClick(movie.id)}
                      className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                    >
                      <PlayIcon className="w-6 h-6 fill-current" />
                      <span className="text-lg">Watch Now</span>
                    </button>

                    <button
                      onClick={() => handleMovieClick(movie.id)}
                      className="flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold rounded-2xl transition-all duration-300"
                    >
                      <InfoIcon className="w-6 h-6" />
                      <span className="text-lg">More Info</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Poster - Right Side */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
              <div className="relative group">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/api/placeholder/300/450'
                  }
                  alt={movie.title}
                  className="w-80 h-auto rounded-2xl shadow-2xl border border-white/20 transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <PlayIcon className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="flex space-x-2">
            {featuredMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-white/20 rounded-full text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Movie Counter */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2">
          <span className="text-white font-medium">
            {currentSlide + 1} / {featuredMovies.length}
          </span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block">
        <div className="text-white/60 text-sm flex items-center space-x-2">
          <span>Auto-play enabled</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;