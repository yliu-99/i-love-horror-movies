const API_KEY = 'a27694be92018101b670d792391a8156';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Horror genre ID in TMDB
const HORROR_GENRE_ID = 27;

export const tmdbApi = {
  // Get popular horror movies (for initial load)
  getPopularHorrorMovies: async (page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${HORROR_GENRE_ID}&sort_by=popularity.desc&page=${page}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching popular horror movies:', error);
      throw error;
    }
  },

  // Search for horror movies
  searchHorrorMovies: async (query, page = 1) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&with_genres=${HORROR_GENRE_ID}&page=${page}`
      );
      const data = await response.json();
      // Filter results to only include horror movies
      const horrorMovies = {
        ...data,
        results: data.results.filter(movie => 
          movie.genre_ids && movie.genre_ids.includes(HORROR_GENRE_ID)
        )
      };
      return horrorMovies;
    } catch (error) {
      console.error('Error searching horror movies:', error);
      throw error;
    }
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  // Helper function to get full image URL
  getImageUrl: (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
  }
};
