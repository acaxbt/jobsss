'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const { data: session } = useSession();
  const isApplicant = (session?.user as any)?.role === 'APPLICANT';
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  
  return (
    <nav className="bg-gray-100 p-4 flex gap-4 items-center">
      <Link href="/">Jobfair</Link>
      <Link href="/companies">Perusahaan</Link>
      {!session && <Link href="/register">Register</Link>}
      {!session && <Link href="/login">Login</Link>}
      {isApplicant && <Link href="/dashboard">Dashboard</Link>}
      {isApplicant && <Link href="/profile">Profil</Link>}
      {isAdmin && <span className="text-gray-400">Admin Mode</span>}
      {isAdmin && <Link href="/scan">Scan QR</Link>}
      {session && <LogoutButton />}
    </nav>
  );
} 