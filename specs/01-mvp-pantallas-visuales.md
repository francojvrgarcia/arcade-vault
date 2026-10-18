# SPEC 01 — MVP visual de Arcade Vault

> **Estado:** Aprobado
> **Depende de:** ninguna
> **Fecha:** 2026-10-18
> **Objetivo:** Implementar en Next.js las cinco pantallas de `references/templates/` (biblioteca, detalle, reproductor, acceso y salón de la fama) como MVP puramente visual, sin ningún juego real.

---

## Alcance

**Dentro:**

- Biblioteca de juegos con búsqueda por nombre y filtro por categoría (`/`).
- Detalle de juego con descripción, estadísticas y ranking (`/juegos/[id]`).
- Reproductor con HUD, pausa, fin de partida y guardado de puntuación sobre una arena decorativa (`/juegos/[id]/jugar`).
- Pantalla de acceso con pestañas "Iniciar sesión" / "Crear cuenta" y botón de invitado (`/auth`).
- Salón de la Fama con selector de juego, podio y tabla (`/salon`).
- Layout compartido: barra de navegación con menú móvil y footer (`components/nav.tsx`, `components/footer.tsx`, `app/layout.tsx`).
- Sesión simulada en `localStorage` (`components/auth-provider.tsx`).
- Datos mock en `app/data/`: 8 juegos y ranking pseudoaleatorio con semilla.
- Reutilización del CSS ya portado en `app/globals.css` y de las fuentes de `app/layout.tsx`.

**Fuera de alcance (para specs futuros):**

- Cualquier juego jugable real; el reproductor solo suma puntos al azar.
- Autenticación real, backend o base de datos.
- Lectura de `av_scores` para mostrar puntuaciones guardadas en el ranking.
- Botones sociales (Google, GitHub) funcionales.
- Tests automatizados (no hay test runner configurado).

---

## Modelo de datos

Estructuras definidas en `app/data/types.ts` y `components/auth-provider.tsx`:

```ts
type Game = {
  id: string;        // slug de la ruta, p. ej. "bloque-buster"
  title: string;
  short: string;
  long: string;
  cat: string;       // "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS"
  cover: string;     // clase CSS de globals.css, p. ej. "cover-bricks"
  color: "cyan" | "magenta" | "green" | "yellow";
  best: number;
  plays: string;
};

type ScoreRow = { rank: number; name: string; score: number; date: string };

type User = { name: string };
```

Convenciones:

- `localStorage["av_user"]`: JSON de `User`; ausente significa invitado.
- `localStorage["av_scores"]`: arreglo de `{ game, score, name, at }` que solo se escribe, no se lee.
- `seededScores(seed, count)` es determinista, así que el servidor y el cliente generan el mismo ranking.
- Los números se formatean con `formatScore` (`es-ES`).

---

## Plan de implementación

1. Crear `app/data/` con `types.ts`, `games.ts` (`GAMES`, `CATS`, `getGame`), `scores.ts` (`formatScore`, `seededScores`) e `index.ts`.
2. Crear `components/auth-provider.tsx` (contexto con `useSyncExternalStore` sobre `av_user`).
3. Crear `components/nav.tsx` y `components/footer.tsx`, y envolver `app/layout.tsx` con `AuthProvider`, `Nav`, `<main className="av-main">` y `Footer`. Verificación: `npm run dev` muestra la barra en todas las rutas.
4. Crear `components/game-card.tsx` y `components/library.tsx`, y renderizar `Library` desde `app/page.tsx`.
5. Crear `app/juegos/[id]/page.tsx` con `generateStaticParams` y `notFound()`.
6. Crear `components/game-player.tsx` y `app/juegos/[id]/jugar/page.tsx` con `generateStaticParams`.
7. Crear `app/auth/page.tsx`.
8. Crear `app/salon/page.tsx`.

---

## Criterios de aceptación

- [x] `npm run build` termina sin errores y prerenderiza `/`, `/auth`, `/salon` y las rutas de los 8 juegos.
- [x] `npx tsc --noEmit` y `npx eslint app components lib` no reportan errores.
- [x] `/` muestra 8 tarjetas; escribir "caída" en el buscador deja solo la de CAÍDA.
- [x] Pulsar el chip "SHOOTER" muestra únicamente INVASORES y ROCAS.
- [x] Buscar un texto sin coincidencias muestra "NO HAY RESULTADOS".
- [x] Pulsar una tarjeta o su botón JUGAR navega a `/juegos/[id]`.
- [x] `/juegos/inexistente` devuelve 404.
- [x] El botón "JUGAR AHORA" lleva a `/juegos/[id]/jugar` y "VOLVER AL VAULT" a `/`.
- [x] En el reproductor la puntuación sube mientras no está en pausa y se detiene con PAUSA.
- [x] El botón FIN abre el modal con la puntuación final; GUARDAR PUNTUACIÓN muestra "PUNTUACIÓN GUARDADA_" y añade una entrada a `localStorage["av_scores"]`.
- [x] JUGAR DE NUEVO reinicia la puntuación a 0 y cierra el modal.
- [x] En `/auth`, enviar el formulario guarda el usuario en mayúsculas (máx. 10 caracteres) en `av_user`, redirige a `/` y la barra muestra ese nombre.
- [x] La pestaña "CREAR CUENTA" muestra el campo de correo electrónico.
- [x] "JUGAR COMO INVITADO" redirige a `/` sin usuario guardado.
- [x] Pulsar el nombre de usuario en la barra cierra la sesión y vuelve a mostrar "Iniciar Sesión".
- [x] `/salon` muestra podio y tabla de 12 filas; cambiar de chip cambia los datos.
- [x] Con sesión iniciada, `/salon` muestra la fila "TU MEJOR MARCA"; sin sesión no aparece.
- [x] En ancho móvil el botón `≡` abre el panel lateral con los enlaces.

---

## Decisiones

- **Sí:** App Router con una ruta por pantalla (`/`, `/juegos/[id]`, `/juegos/[id]/jugar`, `/auth`, `/salon`). Permite enlaces directos y usa `next/link`.
- **No:** SPA con estado en el hash, como la plantilla. Pierde el enrutado de Next.js.
- **Sí:** `generateStaticParams` en las rutas dinámicas. `cacheComponents` exige que los parámetros conocidos se prerendericen.
- **Sí:** sesión simulada en `localStorage` con `useSyncExternalStore`. Evita `setState` en efectos y desajustes de hidratación.
- **No:** autenticación real. Exige backend y merece su propio spec.
- **Sí:** datos mock en `app/data/` con ranking sembrado. Es determinista y suficiente para un MVP visual.
- **No:** leer `av_scores` en los rankings. Se deja para cuando exista un backend de puntuaciones.
- **Sí:** reutilizar el CSS de la plantilla (`app/globals.css`) y sus clases, en vez de reescribirlo con utilidades de Tailwind. Mantiene fidelidad visual.
- **Sí:** pantallas de interacción (`Library`, `GamePlayer`, auth, salón) como Client Components; el detalle es un Server Component.

---

## Riesgos

| Riesgo                                         | Mitigación                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `localStorage` bloqueado o no disponible       | Lecturas y escrituras en `try/catch`; la app funciona como invitado.                         |
| Desajuste de hidratación por el usuario        | `getServerSnapshot` devuelve `null`; el estado real se aplica tras hidratar.                 |
| Las clases CSS de la plantilla divergen        | Todo el estilo vive en `app/globals.css`; los componentes solo usan sus nombres de clase.    |

---

## Lo que **no** está en este spec

- Ningún juego jugable (bloques, serpiente, etc.).
- Autenticación real, cuentas o backend.
- Puntuaciones persistentes mostradas en los rankings.
- Login social funcional.
- Tests automatizados.

Cada uno, si llega, va en su propio spec.
