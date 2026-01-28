import React from 'react'
import { Link } from 'react-router-dom'
import { MdStar, MdImage } from 'react-icons/md'
import { tmdbApi } from '../services/tmdbApi.js'
import './MovieCard.css'

const MovieCard = ({ movie }) => {
  const posterUrl = tmdbApi.getImageUrl(movie.poster_path)
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-link">
        <div className="movie-poster">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={movie.title}
              loading="lazy"
            />
          ) : (
            <div className="no-poster">
              <MdImage className="no-image-icon" />
              <span>No Image</span>
            </div>
          )}
          <div className="movie-rating">
            <MdStar className="star-icon" />
            {movie.vote_average.toFixed(1)}
          </div>
        </div>
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-year">{releaseYear}</p>
          <p className="movie-overview">
            {movie.overview.length > 100 
              ? `${movie.overview.substring(0, 100)}...` 
              : movie.overview
            }
          </p>
        </div>
      </Link>
    </div>
  )
}

export default MovieCard
