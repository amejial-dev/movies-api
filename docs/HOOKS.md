# Hooks — useOMDb

Todos los accesos a la API de OMDb están encapsulados en `src/hooks/useOMDb.js`.

---

## useMovieSearch(query, page)

Busca películas por título usando el endpoint `?s=`.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `query` | `string` | Título a buscar. Si está vacío, no lanza ninguna petición. |
| `page` | `number` | Página de resultados (1-based). OMDb devuelve 10 resultados por página. |

### Retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `movies` | `Array` | Lista de películas del resultado actual |
| `totalResults` | `number` | Total de resultados disponibles en OMDb |
| `loading` | `boolean` | `true` mientras la petición está en curso |
| `error` | `string / null` | Mensaje de error técnico (red, HTTP 5xx, etc.) |
| `notFound` | `boolean` | `true` cuando OMDb responde sin resultados para esa búsqueda |

### Comportamiento

- Aplica **cancelación automática** de peticiones anteriores (flag `cancelled`) para evitar race conditions al tipear rápido.
- El debounce de 500ms se aplica desde `App.jsx`, no desde el hook.
- `error` y `notFound` son mutuamente excluyentes: uno u otro, nunca los dos.

### Ejemplo de uso

```jsx
const { movies, totalResults, loading, error, notFound } = useMovieSearch('inception', 1)

if (loading)  return <Skeleton />
if (notFound) return <p>No encontramos nada</p>
if (error)    return <p>Error: {error}</p>
return <MovieGrid movies={movies} />
```

---

## useMovieById(imdbId)

Carga el detalle completo de una película por su IMDb ID usando el endpoint `?i=&plot=full`.

### Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `imdbId` | `string` | IMDb ID válido, ej: `tt0499549`. Si está vacío, no lanza petición. |

### Retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `movie` | `Object / null` | Objeto completo de la película devuelto por OMDb |
| `loading` | `boolean` | `true` mientras carga |
| `error` | `string / null` | Error técnico |
| `notFound` | `boolean` | `true` cuando el ID no existe en OMDb |

### Objeto movie

Campos relevantes devueltos por OMDb:

```js
{
  Title:      "Inception",
  Year:       "2010",
  Rated:      "PG-13",
  Runtime:    "148 min",
  Genre:      "Action, Adventure, Sci-Fi",
  Director:   "Christopher Nolan",
  Actors:     "Leonardo DiCaprio, ...",
  Plot:       "A thief who steals...",
  Poster:     "https://...",
  imdbRating: "8.8",
  imdbVotes:  "2,500,000",
  imdbID:     "tt1375666",
  Type:       "movie",
  Awards:     "Won 4 Oscars...",
  Language:   "English, Japanese, French"
}
```

### Ejemplo de uso

```jsx
const { movie, loading, error, notFound } = useMovieById('tt1375666')

if (loading)  return <DetailSkeleton />
if (notFound) return <NotFound message="Pelicula no encontrada" />
if (error)    return <ErrorBox message={error} />
return <DetailView movie={movie} />
```

---

## Manejo de errores

La función interna `fetchOMDb` distingue dos tipos de fallo:

```
Respuesta HTTP no-OK   ->  Error técnico   ->  err.notFound = false
OMDb Response: "False" ->  No encontrado   ->  err.notFound = true
```

Mensajes OMDb que activan `notFound`:
- `"Movie not found!"`
- `"Incorrect IMDb ID."`
- `"Too many results."`
- Cualquier otro mensaje cuando `Response === "False"`

Los errores técnicos (sin conexión, HTTP 500, etc.) llegan al campo `error` como string para mostrarse en un cuadro de aviso. Los `notFound` llegan al campo `notFound: true` para mostrarse con el estado vacío amigable.
