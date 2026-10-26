// Central API configuration
// Override by setting VITE_API_URL in a .env file
// Defaults to the local Express backend in dev, and the deployed Vercel backend in production.
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:4000" : "https://apna-fashion-backend.vercel.app");
