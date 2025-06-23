import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ profile: null });
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', session.user.id)
    .single();
  return NextResponse.json({ profile });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  // Upsert profile
  const { error } = await supabase.from('profiles').upsert({ ...data, userId: session.user.id });
  if (error) return NextResponse.json({ message: 'Gagal menyimpan profil' }, { status: 500 });
  return NextResponse.json({ profile: { ...data, userId: session.user.id } });
} 