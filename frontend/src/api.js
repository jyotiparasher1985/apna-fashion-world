// Central API configuration
// Override by setting VITE_API_URL in a .env file
// Defaults to the local Express backend (see ../backend/server.js on port 4000)
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:4000";
