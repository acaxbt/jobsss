import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { title, description, company_id } = await req.json();
  const { error } = await supabase.from('jobs').update({ title, description, company_id }).eq('id', params.id);
  if (error) return NextResponse.json({ message: 'Gagal update job' }, { status: 500 });
  return NextResponse.json({ message: 'Job diupdate' });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('jobs').delete().eq('id', params.id);
  if (error) return NextResponse.json({ message: 'Gagal hapus job' }, { status: 500 });
  return NextResponse.json({ message: 'Job dihapus' });
} 