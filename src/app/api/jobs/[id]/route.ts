import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, context: any) {
  const { title, description, company_id } = await req.json();
  const { id } = context.params;
  const { error } = await supabase.from('jobs').update({ title, description, company_id }).eq('id', id);
  if (error) return NextResponse.json({ message: 'Gagal update job' }, { status: 500 });
  return NextResponse.json({ message: 'Job diupdate' });
}

export async function DELETE(req: Request, context: any) {
  const { id } = context.params;
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) return NextResponse.json({ message: 'Gagal hapus job' }, { status: 500 });
  return NextResponse.json({ message: 'Job dihapus' });
} 