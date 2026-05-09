const Star = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

export default function CarouselCard({ movie, onClick }) {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A'
  const hasRating = movie.imdbRating && movie.imdbRating !== 'N/A'

  return (
    <button
      className="carousel-card"
      onClick={() => onClick(movie.imdbID)}
      aria-label={`Ver ${movie.Title}`}
    >
      {hasPoster
        ? <img className="carousel-card__bg" src={movie.Poster} alt="" loading="lazy" />
        : <div className="carousel-card__placeholder"><ImageIcon /></div>
      }

      <div className="carousel-card__gradient" />

      {/* Badge plataforma esquina superior */}
      {movie.Type === 'movie' && (
        <span className="carousel-card__platform">Movie</span>
      )}
      {movie.Type === 'series' && (
        <span className="carousel-card__platform" style={{ background: 'rgba(99,102,241,0.92)' }}>
          Series
        </span>
      )}

      <div className="carousel-card__info">
        <div className="carousel-card__meta">
          {hasRating && (
            <span className="carousel-card__rating">
              <Star />
              {movie.imdbRating}
            </span>
          )}
          {hasRating && (
            <span className="carousel-card__imdb">IMDB {movie.imdbRating}</span>
          )}
        </div>
        <p className="carousel-card__title">{movie.Title}</p>
        {movie.Year && (
          <p className="carousel-card__sub">{movie.Year}</p>
        )}
      </div>
    </button>
  )
}
