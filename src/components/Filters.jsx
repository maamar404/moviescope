import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, FilterIcon } from 'lucide-react';

const Filters = ({ setFilters }) => {
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [isExpanded, setIsExpanded] = useState(false);

  const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
  ];

  const years = [
    
    '2025','2024', '2023', '2022', '2021', '2020', '2019', '2018',
    '2017', '2016', '2015', '2014', '2013', '2012', '2011',
    '2010', '2009', '2008', '2007', '2006', '2005', '2004',
    '2003', '2002', '2001', '2000'
  ];

  useEffect(() => {
    setFilters({
      sort_by: sortBy,
      year: year,
      genre: genre,
      language: language,
    });
  }, [sortBy, year, genre, language, setFilters]);

  const clearFilters = () => {
    setYear('');
    setGenre('');
    setLanguage('');
    setSortBy('popularity.desc');
  };

  const hasActiveFilters = year || genre || language || sortBy !== 'popularity.desc';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-8 overflow-hidden transition-all duration-300">
      {/* Filter Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <FilterIcon className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <ChevronDownIcon 
          className={`w-6 h-6 text-gray-300 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`} 
        />
      </div>

      {/* Filter Content */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Sort By
              </label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-800/70"
              >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="release_date.desc">Newest</option>
              </select>
            </div>

            {/* Release Year */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Release Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-800/70"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-800/70"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:bg-gray-800/70"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 border border-red-500/30 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;