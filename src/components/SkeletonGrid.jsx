export default function SkeletonGrid({ count = 4 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-poster" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line-sm" />
        </div>
      ))}
    </div>
  )
}
