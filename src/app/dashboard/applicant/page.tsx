import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function ApplicantDashboard() {
  const session = await getServerSession(authOptions);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Pelamar</h1>
      <p>Selamat datang, {session?.user?.email}!</p>
      <Link href="/dashboard/applicant/applications" className="inline-block mt-4 bg-black text-white px-4 py-2 rounded">Lamaran Saya</Link>
    </div>
  );
} 