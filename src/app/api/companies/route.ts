import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: companies } = await supabase.from('companies').select('*');
  return NextResponse.json({ companies });
} 