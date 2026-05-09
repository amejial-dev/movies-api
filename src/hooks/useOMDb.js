import { useState, useEffect, useCallback } from 'react'

const API_KEY = '1e1e9a98'
const BASE_URL = 'https://www.omdbapi.com'

async function fetchOMDb(params) {
  const url = new URL(BASE_URL)
  url.searchParams.set('apikey', API_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP error ${res.status}`)
  const data = await res.json()
  if (data.Response === 'False') {
    const err = new Error(data.Error || 'No results found')
    err.notFound = true   // OMDb "not found" — no es un error técnico
    throw err
  }
  return data
}

export function useMovieSearch(query, page) {
  const [movies, setMovies] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!query || !query.trim()) {
      setMovies([])
      setTotalResults(0)
      setError(null)
      setNotFound(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setNotFound(false)
    fetchOMDb({ s: query.trim(), page })
      .then(data => {
        if (cancelled) return
        setMovies(data.Search || [])
        setTotalResults(parseInt(data.totalResults, 10) || 0)
      })
      .catch(err => {
        if (cancelled) return
        setMovies([])
        setTotalResults(0)
        if (err.notFound) setNotFound(true)
        else setError(err.message)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [query, page])

  return { movies, totalResults, loading, error, notFound }
}

export function useMovieById(imdbId) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const load = useCallback(() => {
    if (!imdbId) return
    setLoading(true)
    setError(null)
    setNotFound(false)
    setMovie(null)
    fetchOMDb({ i: imdbId, plot: 'full' })
      .then(setMovie)
      .catch(err => {
        if (err.notFound) setNotFound(true)
        else setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [imdbId])

  useEffect(() => { load() }, [load])

  return { movie, loading, error, notFound }
}
