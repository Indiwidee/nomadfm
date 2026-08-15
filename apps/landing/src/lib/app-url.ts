export const APP_URL =
  import.meta.env.VITE_APP_URL ??
  (import.meta.env.PROD
    ? `${import.meta.env.BASE_URL}app/`
    : "http://localhost:5173")
