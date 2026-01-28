import React, { useState, useEffect } from 'react'
import { MdSearch, MdLocalMovies } from 'react-icons/md'
import { FaSkull } from 'react-icons/fa'
import { tmdbApi } from '../services/tmdbApi.js'
import MovieCard from '../components/MovieCard.jsx'
import './HomePage.css'

const HomePage = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  // Load popular horror movies
  useEffect(() => {
    loadPopularMovies()
  }, [])

  const loadPopularMovies = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await tmdbApi.getPopularHorrorMovies()
      setMovies(data.results || [])
    } catch (err) {
      setError('Failed to load movies. Please try again.')
      console.error('Error loading popular movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      return
    }

    try {
      setSearching(true)
      setError('')
      const data = await tmdbApi.searchHorrorMovies(searchQuery)
      setMovies(data.results || [])
      
      if (data.results.length === 0) {
        setError('No horror movies found for your search.')
      }
    } catch (err) {
      setError('Failed to search movies. Please try again.')
      console.error('Error searching movies:', err)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    loadPopularMovies()
  }

  return (
    <div className="home-page">
      <div className="container">
        <header className="page-header">
          <h1>
            <FaSkull className="title-icon" />
            Horror Movies Collection
          </h1>
          <p>Discover the scariest movies from around the world <br />(Made with the help of Copilot)</p>
        </header>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for horror movies..."
                className="search-input"
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={searching || !searchQuery.trim()}
              >
                <MdSearch className="search-icon" />
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {searchQuery && (
            <button onClick={clearSearch} className="clear-search">
              <MdLocalMovies className="clear-icon" />
              Show Popular Movies
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="movies-section">
          {searchQuery ? (
            <h2>Search Results for "{searchQuery}"</h2>
          ) : (
            <h2>Popular Horror Movies</h2>
          )}

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading horror movies...</p>
            </div>
          ) : (
            <div className="movies-grid">
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))
              ) : (
                !error && (
                  <div className="no-movies">
                    <p>No movies found.</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
