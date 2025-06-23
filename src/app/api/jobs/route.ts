import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const company_id = searchParams.get('company_id');
  let query = supabase.from('jobs').select('*');
  if (company_id) query = query.eq('company_id', company_id);
  const { data: jobs } = await query;
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const { title, description, company_id } = await req.json();
  if (!title || !company_id) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const { error } = await supabase.from('jobs').insert([{ title, description, company_id }]);
  if (error) return NextResponse.json({ message: 'Gagal tambah job' }, { status: 500 });
  return NextResponse.json({ message: 'Job ditambah' }, { status: 201 });
} 