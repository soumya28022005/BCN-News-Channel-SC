import { cookies } from 'next/headers';
import { apiUrl } from '../config';
export async function serverGet<T>(path: string, revalidate = 60): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map((item) => `${item.name}=${item.value}`).join('; ');
  const response = await fetch(apiUrl(path), { headers: cookieHeader ? { Cookie: cookieHeader } : undefined, next: { revalidate } });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}