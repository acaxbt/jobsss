import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Admin Perusahaan</h1>
      <p>Selamat datang, {session?.user?.email}!</p>
      <Link href="/dashboard/admin/jobs" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded mr-2">Lowongan</Link>
      <Link href="/dashboard/admin/applications" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">Daftar Lamaran</Link>
    </div>
  );
} 