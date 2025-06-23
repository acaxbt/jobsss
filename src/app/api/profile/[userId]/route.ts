import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('userId', params.userId)
    .single();
  return NextResponse.json({ profile });
} 