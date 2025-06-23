import { supabase } from '@/lib/supabase';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }
    const hashed = await hash(password, 10);
    const { error } = await supabase.from('users').insert([{ email, password: hashed, role }]);
    if (error) return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
    return NextResponse.json({ message: 'Registered' }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 });
  }
} 