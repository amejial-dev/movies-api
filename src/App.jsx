import { useState, useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import { useMovieSearch } from './hooks/useOMDb'
import MovieCard from './components/MovieCard'
import MovieCarousel from './components/MovieCarousel'
import MovieDetail from './components/MovieDetail'
import Navigation from './components/Navigation'
import Pagination from './components/Pagination'
import SkeletonGrid from './components/SkeletonGrid'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_QUERY = 'marvel'

/* ── Shared SVG icons ─────────────────────────── */
const SearchBarIcon = () => (
  <svg className="search-bar__icon" width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IdIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
)
const EmptySearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const EmptyFilmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
    <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/>
    <line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/>
  </svg>
)
const SadFaceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="9" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="9.5" r="0.8" fill="currentColor" stroke="none"/>
    <path d="M8.5 16.5 Q12 13.5 15.5 16.5"/>
  </svg>
)
const EmptyIdIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="13" y2="14"/>
  </svg>
)
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

/* ── useDebounce ──────────────────────────────── */
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ── usePageEntrance: fade+slide en cada vista ── */
function usePageEntrance(ref) {
  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', clearProps: 'all' }
    )
  }, [])
}

/* ── useGridReveal: ScrollTrigger para desktop grid ── */
function useGridReveal(gridRef, deps) {
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const isDesktop = window.innerWidth >= 768
    if (!isDesktop) return

    const cards = grid.querySelectorAll('.movie-card')
    if (!cards.length) return

    /* matar triggers previos de este grid */
    ScrollTrigger.getAll()
      .filter(t => t.vars?.id === 'grid-reveal')
      .forEach(t => t.kill())

    gsap.fromTo(cards,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          id: 'grid-reveal',
          trigger: grid,
          scroller: '.app-body',
          start: 'top 90%',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.vars?.id === 'grid-reveal')
        .forEach(t => t.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/* ════════════════════════════════════════════════
   HOME VIEW
   ════════════════════════════════════════════════ */
function HomeView({ onSelectMovie }) {
  const pageRef = useRef(null)
  const gridRef = useRef(null)
  const [input, setInput] = useState('')
  const [page, setPage] = useState(1)
  const debouncedInput = useDebounce(input, 500)
  const query = debouncedInput.trim() || DEFAULT_QUERY

  useEffect(() => { setPage(1) }, [debouncedInput])

  const { movies, totalResults, loading, error, notFound } = useMovieSearch(query, page)
  const isDefault = !debouncedInput.trim()

  usePageEntrance(pageRef)
  useGridReveal(gridRef, [movies])

  return (
    <div className="page" ref={pageRef}>
      <div className="page-header">
        <div className="page-header__titles">
          <small>Welcome back</small>
          <h1>Movie Finder</h1>
        </div>
        <div className="avatar"><UserIcon /></div>
      </div>

      <div className="search-wrap">
        <div className="search-bar">
          <SearchBarIcon />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Search movies…"
            aria-label="Search movies"
          />
        </div>
      </div>

      {/* Section title — dentro del padding lateral normal */}
      <div className="content" style={{ paddingBottom: 0 }}>
        {error && <div className="error-msg">{error}</div>}
        <div className="section-title">
          <h2>{isDefault ? 'Popular Movies' : `Results for "${query}"`}</h2>
          {totalResults > 0 && (
            <span className="section-title__count">{totalResults.toLocaleString()} titles</span>
          )}
        </div>
      </div>

      {loading && (
        <div className="content" style={{ paddingBottom: 0 }}>
          <SkeletonGrid count={8} />
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          {/* Mobile: carousel hero, sangra hasta los bordes */}
          <MovieCarousel movies={movies} onSelectMovie={onSelectMovie} />

          {/* Desktop: grid con ScrollTrigger, dentro del padding */}
          <div className="content" style={{ paddingBottom: 0 }}>
            <div className="movie-grid" ref={gridRef}>
              {movies.map(m => (
                <MovieCard key={m.imdbID} movie={m} onClick={onSelectMovie} />
              ))}
            </div>
          </div>

          <div className="content">
            <Pagination
              page={page}
              totalResults={totalResults}
              onPageChange={p => { setPage(p); window.scrollTo(0, 0) }}
            />
          </div>
        </>
      )}

      {!loading && (notFound || (!error && movies.length === 0 && !isDefault)) && (
        <div className="empty-state">
          <div className="empty-state__icon"><SadFaceIcon /></div>
          <h3>No results for "{query}"</h3>
          <p>Try a different search term or check the spelling</p>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   SEARCH VIEW
   ════════════════════════════════════════════════ */
function SearchView({ onSelectMovie }) {
  const pageRef = useRef(null)
  const gridRef = useRef(null)
  const [input, setInput] = useState('')
  const [searchById, setSearchById] = useState(false)
  const [page, setPage] = useState(1)
  const [committed, setCommitted] = useState('')
  const debouncedInput = useDebounce(input, 500)

  useEffect(() => {
    if (!searchById) {
      setCommitted(debouncedInput.trim())
      setPage(1)
    }
  }, [debouncedInput, searchById])

  const handleSubmit = e => {
    e.preventDefault()
    const val = input.trim()
    if (searchById) { if (val) onSelectMovie(val) }
    else { setCommitted(val); setPage(1) }
  }

  const { movies, totalResults, loading, error, notFound } = useMovieSearch(
    searchById ? '' : committed, page
  )

  usePageEntrance(pageRef)
  useGridReveal(gridRef, [movies])

  return (
    <div className="page" ref={pageRef}>
      <div className="page-header">
        <div className="page-header__titles">
          <small>Find anything</small>
          <h1>Search</h1>
        </div>
      </div>

      <div className="search-wrap">
        <form className="search-bar" onSubmit={handleSubmit}>
          <SearchBarIcon />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={searchById ? 'Enter IMDb ID (e.g. tt0499549)…' : 'Search by title…'}
            autoFocus
            aria-label={searchById ? 'Search by IMDb ID' : 'Search by title'}
          />
          <button
            type="button"
            className={`search-bar__toggle${searchById ? ' active' : ''}`}
            onClick={() => { setSearchById(b => !b); setInput(''); setCommitted('') }}
          >
            <IdIcon />
            {searchById ? 'By ID' : 'By ID'}
          </button>
        </form>
      </div>

      {error && <div className="content" style={{ paddingBottom: 0 }}><div className="error-msg">{error}</div></div>}

      {loading && (
        <div className="content" style={{ paddingBottom: 0 }}>
          <SkeletonGrid count={8} />
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          <div className="content" style={{ paddingBottom: 0 }}>
            <div className="section-title">
              <h2>Results for "{committed}"</h2>
              <span className="section-title__count">{totalResults.toLocaleString()} found</span>
            </div>
          </div>

          {/* Mobile carousel hero */}
          <MovieCarousel movies={movies} onSelectMovie={onSelectMovie} />

          {/* Desktop grid */}
          <div className="content" style={{ paddingBottom: 0 }}>
            <div className="movie-grid" ref={gridRef}>
              {movies.map(m => (
                <MovieCard key={m.imdbID} movie={m} onClick={onSelectMovie} />
              ))}
            </div>
          </div>

          <div className="content">
            <Pagination
              page={page}
              totalResults={totalResults}
              onPageChange={p => { setPage(p); window.scrollTo(0, 0) }}
            />
          </div>
        </>
      )}

      {!loading && (notFound || (!error && committed && movies.length === 0)) && (
        <div className="empty-state">
          <div className="empty-state__icon"><SadFaceIcon /></div>
          <h3>No results for "{committed}"</h3>
          <p>Check the spelling or try another title</p>
        </div>
      )}

      {!loading && !committed && !searchById && (
        <div className="empty-state">
          <div className="empty-state__icon"><EmptySearchIcon /></div>
          <h3>Start searching</h3>
          <p>Type a movie title to find results</p>
        </div>
      )}

      {searchById && !loading && (
        <div className="empty-state">
          <div className="empty-state__icon"><EmptyIdIcon /></div>
          <h3>Search by IMDb ID</h3>
          <p>Enter an ID and press Enter<br />(e.g. tt0499549 for Avatar)</p>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   PROFILE VIEW
   ════════════════════════════════════════════════ */
function ProfileView() {
  const pageRef = useRef(null)
  usePageEntrance(pageRef)

  return (
    <div className="page" ref={pageRef}>
      <div className="page-header">
        <div className="page-header__titles">
          <small>Your account</small>
          <h1>Profile</h1>
        </div>
        <div className="avatar"><UserIcon /></div>
      </div>
      <div className="content">
        <div className="profile-card">
          <p className="profile-card__label">About</p>
          <p className="profile-card__title">Movie Finder App</p>
          <p className="profile-card__body">
            A responsive movie browser built with React and the OMDb API.
            Search for any movie by title or IMDb ID.
          </p>
        </div>
        <div className="profile-card">
          <p className="profile-card__label">Data source</p>
          <p className="profile-card__title">OMDb API</p>
          <p className="profile-card__body">
            All movie data is provided by{' '}
            <span className="profile-card__accent">The Open Movie Database (OMDb)</span>.
          </p>
        </div>
        <div className="profile-card">
          <p className="profile-card__label">Tech stack</p>
          <p className="profile-card__title">Built with</p>
          <p className="profile-card__body">React 18 · Vite 5 · GSAP · CSS Glassmorphism · OMDb REST API</p>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   ROOT APP
   ════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [originTab, setOriginTab] = useState('home')

  const handleSelectMovie = useCallback((id) => {
    setOriginTab(tab)
    setSelectedId(id)
  }, [tab])

  const handleBack = useCallback(() => setSelectedId(null), [])

  const handleTabChange = useCallback((newTab) => {
    setSelectedId(null)
    setTab(newTab)
  }, [])

  const renderView = () => {
    if (selectedId) return <MovieDetail imdbId={selectedId} onBack={handleBack} />
    if (tab === 'home')    return <HomeView    onSelectMovie={handleSelectMovie} />
    if (tab === 'search')  return <SearchView  onSelectMovie={handleSelectMovie} />
    if (tab === 'profile') return <ProfileView />
    return <HomeView onSelectMovie={handleSelectMovie} />
  }

  return (
    <div className="app">
      <Navigation
        active={selectedId ? originTab : tab}
        onChange={handleTabChange}
      />
      <div className="app-body">
        {renderView()}
      </div>
    </div>
  )
}
