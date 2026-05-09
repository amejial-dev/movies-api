import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import MovieCard from './MovieCard'

const SIDE = 2
const getStep = () => window.innerWidth >= 768
  ? Math.floor(window.innerWidth * 0.19)   // escala con la pantalla
  : 110

export default function MovieCarousel({ movies, onSelectMovie }) {
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(getStep)
  const cardsRef = useRef([])
  const touchX = useRef(null)
  const isDragging = useRef(false)

  // Ajustar STEP al redimensionar
  useEffect(() => {
    const onResize = () => setStep(getStep())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Resetear al centro cuando cambian las películas
  useEffect(() => {
    setActive(0)
  }, [movies])

  // Aplicar posiciones 3D coverflow
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return
      const offset = i - active
      const abs = Math.abs(offset)
      const visible = abs <= SIDE

      gsap.to(card, {
        x: offset * step,
        xPercent: -50,
        yPercent: -50,
        rotateY: offset * -36,
        scale: visible ? Math.max(0.64, 1 - abs * 0.18) : 0.5,
        opacity: visible ? Math.max(0.28, 1 - abs * 0.37) : 0,
        zIndex: 10 - abs,
        filter: abs === 0 ? 'brightness(1)' : `brightness(${Math.max(0.52, 1 - abs * 0.25)})`,
        duration: 0.42,
        ease: 'power2.out',
      })
    })
  }, [active, movies, step])

  const goTo = useCallback((idx) => {
    setActive(Math.max(0, Math.min(movies.length - 1, idx)))
  }, [movies.length])

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX
    isDragging.current = false
  }
  const onTouchMove = (e) => {
    if (touchX.current !== null && Math.abs(e.touches[0].clientX - touchX.current) > 8)
      isDragging.current = true
  }
  const onTouchEnd = (e) => {
    if (!isDragging.current || touchX.current === null) { touchX.current = null; return }
    const delta = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) goTo(active + (delta > 0 ? 1 : -1))
    touchX.current = null
    isDragging.current = false
  }

  if (!movies.length) return null

  return (
    <div className="coverflow-outer">
      <div
        className="coverflow-stage"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {movies.map((movie, i) => (
          <div
            key={movie.imdbID}
            className={`coverflow-item${i === active ? ' is-active' : ''}`}
            ref={el => { cardsRef.current[i] = el }}
            onClick={() => {
              if (!isDragging.current) {
                if (i === active) onSelectMovie(movie.imdbID)
                else goTo(i)
              }
            }}
          >
            <MovieCard movie={movie} onClick={() => {}} />
          </div>
        ))}
      </div>

      <div className="coverflow-dots">
        {movies.map((_, i) => (
          <button
            key={i}
            className={`coverflow-dot${i === active ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Película ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
