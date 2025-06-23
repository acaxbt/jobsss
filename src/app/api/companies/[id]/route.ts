import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: any
) {
  const { id } = context.params;
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();
  return NextResponse.json({ company });
} 