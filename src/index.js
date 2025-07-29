import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Movies from './components/Movies';
import MovieDetails from './components/MovieDetails';
import HeroSection from './components/HeroSection';
import NavigationHeader from './components/NavigationHeader'; // Import the new NavigationHeader component
import './App.css';

// Create a new Home component with proper structure
const Home = () => {
  return (
    <div>
      <NavigationHeader />
      <HeroSection />
      <Movies />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} /> {/* Route now shows Hero + Movies */}
      <Route path="/movie/:id" element={<MovieDetails />} /> {/* Route for movie details */}
    </Routes>
  </Router>
);