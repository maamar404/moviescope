const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (filters = {}, page = 1) => {
    const { sort_by, year, genre, language } = filters;
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sort_by || 'popularity.desc'}&page=${page}`;
    
    // Append year if available (use primary_release_year for better results)
    if (year) url += `&primary_release_year=${year}`;

    // Append genre if available
    if (genre) url += `&with_genres=${genre}`;

    // Append language if available (use with_original_language for filtering)
    if (language) url += `&with_original_language=${language}`;
    
    console.log('Fetching movies with URL:', url); // Debug log
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
};

export const searchMovies = async (query, page = 1) => {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    
    console.log('Searching movies with URL:', url); // Debug log
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results || [];
};

export const fetchMovieDetails = async (id) => {
    const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;
    
    console.log('Fetching movie details with URL:', url); // Debug log
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
};