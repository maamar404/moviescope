import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetails } from '../api';
import { 
  ArrowLeftIcon, 
  StarIcon, 
  CalendarIcon, 
  ClockIcon, 
  TagIcon,
  GlobeIcon,
  DollarSignIcon,
  TrendingUpIcon,
  PlayIcon,
  UsersIcon,
  HomeIcon
} from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    getMovieDetails();
  }, [id]);

  const goBack = () => {
    navigate('/');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Backdrop with Overlay */}
      {backdropUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>
      )}

      <div className="relative z-10">
        {/* Back Button */}
        <div className="p-6">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-lg text-white hover:bg-black/70 transition-all duration-300 border border-white/20"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Movies</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-12">
          <div className="lg:flex lg:space-x-12">
            {/* Movie Poster */}
            <div className="lg:flex-shrink-0 mb-8 lg:mb-0">
              <div className="relative group">
                <img
                  src={movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/api/placeholder/400/600'
                  }
                  alt={movie.title}
                  className="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl shadow-2xl border border-white/20 transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Rating Badge on Poster */}
                {movie.vote_average > 0 && (
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-2 flex items-center space-x-1">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-bold text-lg">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Information */}
            <div className="lg:flex-1">
              {/* Title and Basic Info */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {movie.title}
                </h1>
                
                {movie.tagline && (
                  <p className="text-xl text-blue-300 italic mb-6">
                    "{movie.tagline}"
                  </p>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 mb-6">
                  <div className="flex items-center space-x-2 text-gray-200">
                    <CalendarIcon className="w-5 h-5 text-blue-400" />
                    <span>{formatDate(movie.release_date)}</span>
                  </div>
                  
                  {movie.runtime && (
                    <div className="flex items-center space-x-2 text-gray-200">
                      <ClockIcon className="w-5 h-5 text-green-400" />
                      <span>{movie.runtime} minutes</span>
                    </div>
                  )}

                  {movie.vote_count > 0 && (
                    <div className="flex items-center space-x-2 text-gray-200">
                      <TrendingUpIcon className="w-5 h-5 text-purple-400" />
                      <span>{movie.vote_count.toLocaleString()} votes</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex items-center space-x-2 mb-6">
                    <TagIcon className="w-5 h-5 text-pink-400" />
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-white hover:bg-white/20 transition-colors duration-200"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Overview */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></span>
                  Overview
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

              {/* Additional Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Info */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <DollarSignIcon className="w-6 h-6 text-green-400 mr-2" />
                      Financial
                    </h3>
                    <div className="space-y-3">
                      {movie.budget > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Budget:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(movie.budget)}
                          </span>
                        </div>
                      )}
                      {movie.revenue > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Revenue:</span>
                          <span className="text-white font-medium">
                            {formatCurrency(movie.revenue)}
                          </span>
                        </div>
                      )}
                      {movie.budget > 0 && movie.revenue > 0 && (
                        <div className="flex justify-between pt-2 border-t border-white/10">
                          <span className="text-gray-300">Profit:</span>
                          <span className={`font-medium ${movie.revenue - movie.budget > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(movie.revenue - movie.budget)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Languages and Countries */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <GlobeIcon className="w-6 h-6 text-blue-400 mr-2" />
                    Languages & Countries
                  </h3>
                  <div className="space-y-3">
                    {movie.original_language && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Original Language:</span>
                        <span className="text-white font-medium uppercase">
                          {movie.original_language}
                        </span>
                      </div>
                    )}
                    {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                      <div>
                        <span className="text-gray-300 block mb-2">Spoken Languages:</span>
                        <div className="flex flex-wrap gap-2">
                          {movie.spoken_languages.map((lang) => (
                            <span
                              key={lang.iso_639_1}
                              className="px-2 py-1 bg-white/10 rounded text-sm text-white"
                            >
                              {lang.english_name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {movie.production_countries && movie.production_countries.length > 0 && (
                      <div>
                        <span className="text-gray-300 block mb-2">Production Countries:</span>
                        <div className="flex flex-wrap gap-2">
                          {movie.production_countries.map((country) => (
                            <span
                              key={country.iso_3166_1}
                              className="px-2 py-1 bg-white/10 rounded text-sm text-white"
                            >
                              {country.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Production Info */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <HomeIcon className="w-6 h-6 text-purple-400 mr-2" />
                      Production Companies
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {movie.production_companies.map((company) => (
                        <div key={company.id} className="flex items-center space-x-3">
                          {company.logo_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="w-8 h-8 object-contain bg-white rounded p-1"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                              <HomeIcon className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <span className="text-white text-sm">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Movie Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <UsersIcon className="w-6 h-6 text-orange-400 mr-2" />
                    Movie Stats
                  </h3>
                  <div className="space-y-3">
                    {movie.popularity && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Popularity Score:</span>
                        <span className="text-white font-medium">
                          {Math.round(movie.popularity)}
                        </span>
                      </div>
                    )}
                    {movie.adult !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Adult Content:</span>
                        <span className={`font-medium ${movie.adult ? 'text-red-400' : 'text-green-400'}`}>
                          {movie.adult ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                    {movie.status && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Status:</span>
                        <span className="text-white font-medium">
                          {movie.status}
                        </span>
                      </div>
                    )}
                    {movie.original_title && movie.original_title !== movie.title && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Original Title:</span>
                        <span className="text-white font-medium text-right ml-2">
                          {movie.original_title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* External Links */}
              {(movie.homepage || movie.imdb_id) && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <span className="w-1 h-8 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></span>
                    External Links
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {movie.homepage && (
                      <a
                        href={movie.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                      >
                        <GlobeIcon className="w-5 h-5" />
                        <span>Official Website</span>
                      </a>
                    )}
                    {movie.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${movie.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-all duration-300"
                      >
                        <StarIcon className="w-5 h-5" />
                        <span>View on IMDb</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;