import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

const FilmIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
    <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="2" y1="7" x2="7" y2="7"/><line x1="17" y1="7" x2="22" y2="7"/>
    <line x1="17" y1="17" x2="22" y2="17"/><line x1="2" y1="17" x2="7" y2="17"/>
  </svg>
)
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const ITEMS = [
  { id: 'home',    label: 'Home',    Icon: HomeIcon    },
  { id: 'search',  label: 'Search',  Icon: SearchIcon  },
  { id: 'profile', label: 'Profile', Icon: ProfileIcon },
]

export default function Navigation({ active, onChange }) {
  const mobileRefs  = useRef([])
  const desktopRefs = useRef([])
  const prevActive  = useRef(null)

  useEffect(() => {
    if (prevActive.current === active) return
    prevActive.current = active

    const idx = ITEMS.findIndex(i => i.id === active)

    ;[mobileRefs, desktopRefs].forEach(refs => {
      const wrap = refs.current[idx]?.querySelector('.nav-item__icon-wrap')
      if (!wrap) return
      gsap.killTweensOf(wrap)
      gsap.fromTo(wrap,
        { scale: 0.7, rotation: -8 },
        { scale: 1, rotation: 0, duration: 0.45, ease: 'elastic.out(1.2, 0.5)' }
      )
    })
  }, [active])

  return (
    <>
      {/* ── Topbar flotante (desktop) ── */}
      <nav className="topbar" aria-label="Main navigation">
        <div className="topbar__logo">
          <div className="topbar__logo-icon"><FilmIcon /></div>
          <span className="topbar__logo-text">MovieFinder</span>
        </div>

        <div className="topbar__items">
          {ITEMS.map(({ id, label, Icon }, i) => (
            <button
              key={id}
              ref={el => { desktopRefs.current[i] = el }}
              className={`topbar__item${active === id ? ' active' : ''}`}
              onClick={() => onChange(id)}
              aria-current={active === id ? 'page' : undefined}
            >
              <span className="nav-item__icon-wrap"><Icon /></span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {ITEMS.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            ref={el => { mobileRefs.current[i] = el }}
            className={`nav-item${active === id ? ' active' : ''}`}
            onClick={() => onChange(id)}
            aria-label={label}
            aria-current={active === id ? 'page' : undefined}
          >
            <span className="nav-item__icon-wrap"><Icon /></span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
