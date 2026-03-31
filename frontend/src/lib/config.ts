
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bcnnetwork.in';

// ✅ Helper: build API endpoint paths cleanly
export const apiUrl = (path: string) => `${API_BASE_URL}${path}`;