import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Jobfair</h1>
      <Link href="/companies" className="bg-black text-white px-6 py-3 rounded text-lg">Lihat Daftar Perusahaan</Link>
    </div>
  );
}
