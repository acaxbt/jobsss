import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company_id = searchParams.get('company_id');
  const user_id = searchParams.get('user_id');
  let query = supabase
    .from('applications')
    .select('id, created_at, user_id, job_id, jobs(id, title, company_id, companies(id, name)), users(id, email, profiles(name))');
  if (company_id) query = query.eq('jobs.company_id', company_id);
  if (user_id) query = query.eq('user_id', user_id);
  const { data: applications } = await query;
  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const { user_id, job_id } = await req.json();
  if (!user_id || !job_id) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  // Cek apakah sudah pernah assign
  const { data: existing } = await supabase.from('applications').select('id').eq('user_id', user_id).eq('job_id', job_id).single();
  if (existing) return NextResponse.json({ message: 'Pelamar sudah di-assign ke lowongan ini' }, { status: 400 });
  const { error } = await supabase.from('applications').insert([{ user_id, job_id }]);
  if (error) return NextResponse.json({ message: 'Gagal assign' }, { status: 500 });
  return NextResponse.json({ message: 'Berhasil assign' }, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) return NextResponse.json({ message: 'Gagal hapus lamaran' }, { status: 500 });
  return NextResponse.json({ message: 'Lamaran dihapus' });
} 