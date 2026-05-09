# Arquitectura y componentes

## Flujo general de la aplicación

```
App.jsx
├── Navigation          -> Topbar (desktop) / Bottom nav (movil)
└── app-body
    ├── HomeView        -> Busqueda por defecto ("marvel")
    ├── SearchView      -> Busqueda manual por titulo o IMDb ID
    ├── ProfileView     -> Info de la app
    └── MovieDetail     -> Detalle de una pelicula (cualquier vista)
```

Cada vista es una función local dentro de `App.jsx`. La navegación entre ellas es **por estado** (`tab`, `selectedId`), no por router — no hay cambio de URL.

---

## Diagrama de estado

```
tab: 'home' | 'search' | 'profile'
selectedId: string | null

Si selectedId !== null  ->  muestra MovieDetail (sobre cualquier tab)
Si selectedId === null  ->  muestra la vista del tab activo
```

Al navegar a otro tab, `selectedId` se limpia automáticamente.

---

## Componentes

### Navigation
Renderiza dos navs en paralelo:
- `.topbar` — pill flotante con glassmorphism, visible solo en desktop (`>= 768px`)
- `.bottom-nav` — barra fija al pie, visible solo en movil (`< 768px`)

Ambas comparten la misma lógica de tab activo y animación GSAP en el ícono al cambiar de sección.

---

### MovieCarousel — Coverflow 3D
Solo visible en movil. Usa GSAP para posicionar cada tarjeta en el espacio 3D:

```
offset = índice - índiceActivo

x        = offset x STEP          -> separación horizontal
rotateY  = offset x -36 grados    -> giro en perspectiva
scale    = 1 - |offset| x 0.18    -> profundidad
opacity  = 1 - |offset| x 0.37    -> desvanecimiento lateral
filter   = brightness(...)        -> oscurecer tarjetas laterales
```

**Navegación disponible:**
- Swipe tactil (touch start -> end con delta > 40px)
- Clic en tarjeta lateral -> navega a ella
- Clic en tarjeta activa -> abre el detalle

El `STEP` es reactivo al tamaño de pantalla:
- Movil: `110px`
- Desktop: `floor(window.innerWidth x 0.19)` — escala con el monitor

---

### MovieCard
Tarjeta estándar usada en el grid de desktop y dentro del coverflow.

Dentro del coverflow recibe overrides CSS que convierten el layout (poster + info debajo) en un **poster tipo cartelera** con info superpuesta mediante un degradado negro en la parte inferior.

---

### MovieDetail
Carga los datos completos de una película con `useMovieById`. Muestra:
- Poster en columna lateral (sticky en desktop)
- Título, rating, año, duración, clasificación
- Tags de género
- Sinopsis, director, reparto, idioma, premios

Maneja tres estados: `loading` -> skeleton | `notFound` -> mensaje de no encontrado | `error` -> mensaje técnico.

---

### Pagination
Recibe `page`, `totalResults` y `onPageChange`. Calcula el total de páginas (`ceil(total / 10)`) y muestra un rango de botones centrado en la página actual con elipsis en los extremos.

---

### SkeletonGrid
Renderiza `n` tarjetas placeholder con animación shimmer mientras carga. Solo visible en desktop (el coverflow no usa skeletons).

---

## Hooks

Ver [HOOKS.md](./HOOKS.md) para la documentación completa de `useMovieSearch` y `useMovieById`.

---

## Animaciones GSAP

| Animación | Donde | Descripción |
|---|---|---|
| Page entrance | Todas las vistas | `opacity 0->1` + `y 18->0` al montar |
| Grid reveal | Desktop grid | `opacity + scale + y` con ScrollTrigger al entrar en viewport |
| Coverflow | MovieCarousel | Posicionamiento 3D continuo por estado activo |
| Nav icon pop | Navigation | `scale + rotation` elástico al cambiar de tab |

---

## Estilos

El diseño usa **CSS vanilla** con custom properties definidas en `:root` (`index.css`):

```css
--bg-primary      /* fondo oscuro principal */
--accent          /* amarillo IMDb #f5c518  */
--glass-bg        /* fondo glassmorphism    */
--glass-blur      /* blur + saturate        */
--glass-border    /* borde semitransparente */
```

No hay ninguna librería de UI — todo es CSS propio.
