const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function serverFetch(
  endpoint: string,
  options?: {
    revalidate?: number;
  }
) {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      next: { revalidate: options?.revalidate ?? 60 },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Server Fetch Error:', error);
    return [];
  }
}