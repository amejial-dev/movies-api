const Star = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ImageIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

export default function MovieCard({ movie, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A'

  return (
    <button className="movie-card" onClick={() => onClick(movie.imdbID)}>
      {hasPoster
        ? <img className="movie-card__poster" src={movie.Poster} alt={movie.Title} loading="lazy" />
        : (
          <div className="movie-card__poster-placeholder">
            <ImageIcon />
          </div>
        )
      }
      <div className="movie-card__info">
        <div className="movie-card__meta">
          {movie.imdbRating && movie.imdbRating !== 'N/A' && (
            <span className="rating"><Star />{movie.imdbRating}</span>
          )}
          {movie.Type && (
            <span className="badge badge--type">{movie.Type}</span>
          )}
        </div>
        <p className="movie-card__title">{movie.Title}</p>
        <p className="movie-card__sub">{movie.Year}</p>
      </div>
    </button>
  )
}
