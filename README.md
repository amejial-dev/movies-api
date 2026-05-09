# Movie Finder

Aplicación web para buscar películas y series usando la API de OMDb. Diseño dark con glassmorphism, animaciones GSAP y experiencia adaptada a móvil y escritorio.

![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)
![GSAP](https://img.shields.io/badge/GSAP-3-88ce02?style=flat-square)
![OMDb](https://img.shields.io/badge/OMDb-API-f5c518?style=flat-square)

---

## Características

| Función | Descripción |
|---|---|
| Búsqueda por título | Resultados en tiempo real con debounce de 500ms |
| Búsqueda por IMDb ID | Abre directamente el detalle de la película |
| Coverflow en móvil | Carrusel 3D con swipe táctil animado con GSAP |
| Grid en escritorio | 3 a 5 columnas según el ancho de pantalla |
| Detalle completo | Póster, sinopsis, director, reparto, premios y más |
| Skeletons | Estados de carga con animación shimmer |
| Manejo de errores | Carita triste para "no encontrado", error técnico separado |
| Paginación | Navegación entre páginas de resultados |
| Dark UI | Glassmorphism, gradientes y efectos de brillo |

---

## Vista previa

### Móvil — Coverflow
```
┌──────────────────────────┐
│   MovieFinder            │
│─────────────────────────│
│   Search movies...       │
│                          │
│   [card] [CARD] [card]   │
│      *  o  o  o          │
│                          │
│  Home   Search   Profile │  <- bottom nav
└──────────────────────────┘
```

### Escritorio — Grid + Topbar flotante
```
┌──────────────────────────────────────────┐
│    ┌────── MovieFinder ────────────────┐ │  <- topbar flotante
│    │  Home   Search   Profile          │ │
│    └───────────────────────────────────┘ │
│                                          │
│  Popular Movies              120 titles  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │      │ │      │ │      │ │      │   │
│  │      │ │      │ │      │ │      │   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
└──────────────────────────────────────────┘
```

---

## Instalación y uso

### Requisitos previos
- Node.js `>= 20`
- npm `>= 9`

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd movie-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
La app abre en `http://localhost:5173`

### 4. Build de producción
```bash
npm run build
npm run preview   # previsualizar el build
```

---

## Estructura del proyecto

```
movie-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── MovieCarousel.jsx   # Coverflow 3D (movil)
│   │   ├── MovieCard.jsx       # Tarjeta individual
│   │   ├── CarouselCard.jsx    # Variante poster-only
│   │   ├── MovieDetail.jsx     # Vista de detalle
│   │   ├── Navigation.jsx      # Topbar (desktop) + Bottom nav (movil)
│   │   ├── Pagination.jsx      # Paginacion de resultados
│   │   └── SkeletonGrid.jsx    # Skeletons de carga
│   ├── hooks/
│   │   └── useOMDb.js          # Hooks para la API de OMDb
│   ├── App.jsx                 # Vistas y logica principal
│   ├── App.css                 # Estilos de componentes
│   ├── index.css               # Variables globales y reset
│   └── main.jsx                # Entry point
├── docs/
│   ├── ARCHITECTURE.md         # Arquitectura y componentes
│   └── HOOKS.md                # Referencia de hooks
├── index.html
├── package.json
└── vite.config.js
```

---

## API

La app usa la [OMDb API](https://www.omdbapi.com). La API key está incluida para desarrollo.

| Endpoint | Uso |
|---|---|
| `?s={título}&page={n}` | Búsqueda por título con paginación |
| `?i={imdbId}&plot=full` | Detalle completo por IMDb ID |

> Los resultados de OMDb vienen en páginas de 10 elementos.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev) | 18 | UI y estado |
| [Vite](https://vitejs.dev) | 5 | Bundler y dev server |
| [GSAP](https://gsap.com) | 3.15 | Animaciones (coverflow, transiciones, scroll) |
| [OMDb API](https://www.omdbapi.com) | — | Datos de películas |

Sin librerías de UI externas — todos los estilos son CSS vanilla con custom properties.

---

## Diseño responsive

| Breakpoint | Layout |
|---|---|
| `< 768px` | Coverflow 3D + bottom navigation |
| `768px – 1099px` | Grid 3 columnas + topbar flotante |
| `1100px – 1399px` | Grid 4 columnas + topbar flotante |
| `>= 1400px` | Grid 5 columnas + topbar flotante |

---

## Documentación adicional

- [Arquitectura y componentes](./docs/ARCHITECTURE.md)
- [Guía de hooks](./docs/HOOKS.md)

---

## Licencia

MIT — libre para uso personal y comercial.
