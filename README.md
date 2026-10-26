# Assignment 6 – Post Dashboard
Hüma Berra Kolukısa – 230408056

Web Programming, Fall 2026

A React app (built with Vite) that loads posts from JSONPlaceholder, shows
loading / error / empty states, and filters posts by title.

## How to run

```bash
npm install
npm run dev
```

## File organization

- `src/api/postsApi.js` – Only data fetching. `fetchPosts` calls the API with
  `fetch`, throws an error if the response is not OK, and returns parsed JSON.
  No React or JSX here.
- `src/reducer/postsReducer.js` – A pure reducer that manages the async state
  (`posts`, `loading`, `error`) with the actions `FETCH_START`,
  `FETCH_SUCCESS` and `FETCH_ERROR`. It never mutates state and has no side
  effects.
- `src/App.jsx` – Owns the state. Uses `useReducer` for the posts state and
  `useState` for the filter text. Fetches posts in `useEffect` on first mount,
  cancels the request in the cleanup function with `AbortController`, and
  decides which state to show (loading, error, empty or list). Filtered posts
  are derived during render, not stored in state.
- `src/components/FilterForm.jsx` – Controlled input for the title filter.
  It receives the value and the change handler from `App`.
- `src/components/PostList.jsx` – Renders the list with `.map()`, using
  `post.id` as a stable key.
- `src/components/Post.jsx` – Presentational component that shows one post's
  title and body.

## Challenges

- **fetch does not fail on HTTP errors:** `fetch` only rejects on network
  failures, not on 404 or 500. I had to check `response.ok` and throw an
  error myself so that the `catch` block could dispatch `FETCH_ERROR`.
- **Effect running twice:** In development, React StrictMode mounts, cleans
  up and re-runs the effect. With `AbortController` the first request is
  cancelled. The cancelled request throws an `AbortError`, which I ignore so
  it is not shown as an error to the user.
- **Async function in useEffect:** The effect callback cannot be `async`
  because it must return a cleanup function, so I defined an async function
  inside the effect and called it.
- **Derived state:** At first it seemed natural to keep filtered posts in
  state, but that would duplicate data. Computing them during render keeps a
  single source of truth.
- **Setup:** PowerShell blocked `npm` because script execution was disabled.
  I fixed it with `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.