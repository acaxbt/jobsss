import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  context: any
) {
  const { userId } = context.params;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', userId)
    .single();
  return NextResponse.json({ profile });
} 