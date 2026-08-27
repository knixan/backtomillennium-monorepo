const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchHealth() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error('backend unreachable');
  return res.json() as Promise<{ status: string }>;
}
