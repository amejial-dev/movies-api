const RESULTS_PER_PAGE = 10

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

function getPages(page, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (page <= 3) return [1, 2, 3, 4, '...', totalPages]
  if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, '...', page - 1, page, page + 1, '...', totalPages]
}

export default function Pagination({ page, totalResults, onPageChange }) {
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE)
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {getPages(page, totalPages).map((p, i) =>
        p === '...'
          ? <span key={`d${i}`} className="pagination__dots">…</span>
          : (
            <button
              key={p}
              className={`pagination__btn${page === p ? ' active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          )
      )}

      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
  )
}
