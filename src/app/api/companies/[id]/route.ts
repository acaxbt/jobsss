import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', params.id)
    .single();
  return NextResponse.json({ company });
} 