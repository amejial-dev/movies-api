import { useMovieById } from '../hooks/useOMDb'

const SadFaceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="9" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
    <path d="M8.5 16.5 Q12 13.5 15.5 16.5"/>
  </svg>
)

const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f5c518">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const ImageIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)

function DetailSkeleton() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div className="detail-layout" style={{ paddingTop: 0 }}>
          <div className="detail-poster-col">
            <div className="skeleton" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 16 }} />
          </div>
          <div className="detail-info-col">
            <div className="skeleton" style={{ height: 32, borderRadius: 8, marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 16, width: '45%', borderRadius: 8, marginBottom: 20 }} />
            <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 6 }} />
          </div>
        </div>
      </div>
    </>
  )
}

export default function MovieDetail({ imdbId, onBack }) {
  const { movie, loading, error, notFound } = useMovieById(imdbId)

  return (
    <div className="page">
      <button className="detail-back" onClick={onBack}>
        <BackIcon />
        Back to results
      </button>

      {loading && <DetailSkeleton />}

      {notFound && (
        <div className="empty-state">
          <div className="empty-state__icon"><SadFaceIcon /></div>
          <h3>Movie not found</h3>
          <p>We couldn't find a movie with that ID.<br />Check the IMDb ID and try again.</p>
        </div>
      )}

      {error && !notFound && (
        <div style={{ padding: '0 24px' }}>
          <div className="error-msg">Could not load movie: {error}</div>
        </div>
      )}

      {movie && (
        <div className="detail-layout">
          <div className="detail-poster-col">
            {movie.Poster && movie.Poster !== 'N/A'
              ? <img className="detail-poster" src={movie.Poster} alt={movie.Title} />
              : (
                <div className="detail-poster-placeholder">
                  <ImageIcon />
                </div>
              )
            }
          </div>

          <div className="detail-info-col">
            <h2 className="detail-title">{movie.Title}</h2>

            <div className="detail-meta-row">
              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <span className="detail-rating-big">
                  <Star />
                  {movie.imdbRating}
                  <span>/10</span>
                </span>
              )}
              {movie.Year && <span className="detail-year">{movie.Year}</span>}
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <span className="detail-year">{movie.Runtime}</span>
              )}
              {movie.Rated && movie.Rated !== 'N/A' && (
                <span className="badge">{movie.Rated}</span>
              )}
            </div>

            {movie.Genre && movie.Genre !== 'N/A' && (
              <div className="detail-tags">
                {movie.Genre.split(',').map(g => (
                  <span key={g.trim()} className="detail-tag">{g.trim()}</span>
                ))}
              </div>
            )}

            <div className="detail-divider" />

            {movie.Plot && movie.Plot !== 'N/A' && (
              <div className="detail-section">
                <h3>Synopsis</h3>
                <p>{movie.Plot}</p>
              </div>
            )}

            {movie.Director && movie.Director !== 'N/A' && (
              <div className="detail-section">
                <h3>Director</h3>
                <p>{movie.Director}</p>
              </div>
            )}

            {movie.Actors && movie.Actors !== 'N/A' && (
              <div className="detail-section">
                <h3>Cast</h3>
                <p>{movie.Actors}</p>
              </div>
            )}

            {movie.Language && movie.Language !== 'N/A' && (
              <div className="detail-section">
                <h3>Language</h3>
                <p>{movie.Language}</p>
              </div>
            )}

            {movie.Awards && movie.Awards !== 'N/A' && (
              <div className="detail-section">
                <h3>Awards</h3>
                <p>{movie.Awards}</p>
              </div>
            )}

            {movie.imdbVotes && movie.imdbVotes !== 'N/A' && (
              <div className="detail-section">
                <h3>IMDb Votes</h3>
                <p>{movie.imdbVotes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
