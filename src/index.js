import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Movies from './components/Movies';
import MovieDetails from './components/MovieDetails';
import HeroSection from './components/HeroSection';
import NavigationHeader from './components/NavigationHeader';
import './App.css';

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
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  </Router>
);