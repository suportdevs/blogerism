import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Purges the storefront cache after admin edits. Only signed-in admins (valid API token) may call it.
export async function POST(request) {
  const auth = request.headers.get('authorization');
  if (!auth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const me = await fetch(`${API_URL}/api/auth/me`, { headers: { authorization: auth }, cache: 'no-store' });
  if (!me.ok) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true });
}
