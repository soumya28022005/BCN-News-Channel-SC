const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function clientFetch(endpoint: string) {
  try {
    const res = await fetch(`${API}${endpoint}`);

    if (!res.ok) throw new Error('Failed to fetch');

    return await res.json();
  } catch (error) {
    console.error('Client Fetch Error:', error);
    return null;
  }
}