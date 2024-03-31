/**
 * Default API URL of the backend server.
 * @module constants/api_url
 */
const DEFAULT_API_URL = 'http://localhost:3000'

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL
