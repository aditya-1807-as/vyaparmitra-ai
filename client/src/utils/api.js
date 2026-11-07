/**
 * Centralized API configuration.
 * - In Development: defaults to http://localhost:5000
 * - In Production (Single-service / Render): uses '' (relative path /api)
 * - In Production (Split-service / Vercel): uses import.meta.env.VITE_API_URL
 */
export const API_BASE = import.meta.env.VITE_API_URL 
  || (import.meta.env.DEV ? 'http://localhost:5000' : '');
