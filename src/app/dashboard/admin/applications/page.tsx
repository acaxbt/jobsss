'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user) return;
    let url = '/api/applications';
    if (
      session.user.email !== 'superadmin@jobfair.com' &&
      session.user.company_id
    ) {
      url += `?company_id=${session.user.company_id}`;
    }
    fetch(url).then(res => res.json()).then(data => {
      setApplications(data.applications || []);
      setLoading(false);
    });
  }, [session]);

  const handleDelete = async (id: string) => {
    await fetch('/api/applications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setApplications(applications.filter(a => a.id !== id));
  };

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Lamaran ke Lowongan</h1>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Nama Pelamar</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Lowongan</th>
              <th className="p-2 border">Perusahaan</th>
              <th className="p-2 border">Waktu Assign</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id}>
                <td className="p-2 border">{a.users?.profiles?.name || '-'}</td>
                <td className="p-2 border">{a.users?.email}</td>
                <td className="p-2 border">{a.jobs?.title}</td>
                <td className="p-2 border">{a.jobs?.companies?.name}</td>
                <td className="p-2 border">{new Date(a.created_at).toLocaleString()}</td>
                <td className="p-2 border"><button onClick={() => handleDelete(a.id)} className="text-red-600">Hapus</button></td>
              </tr>
            ))}
            {applications.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400">Belum ada lamaran.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
} 