'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ApplicantApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !session.user) return;
    fetch(`/api/applications?user_id=${session.user.id}`)
      .then(res => res.json())
      .then(data => {
        setApplications(data.applications || []);
        setLoading(false);
      });
  }, [session]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Lamaran Saya</h1>
      {loading ? <div>Loading...</div> : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Lowongan</th>
              <th className="p-2 border">Perusahaan</th>
              <th className="p-2 border">Waktu Assign</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id}>
                <td className="p-2 border">{a.jobs?.title}</td>
                <td className="p-2 border">{a.jobs?.companies?.name}</td>
                <td className="p-2 border">{new Date(a.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {applications.length === 0 && <tr><td colSpan={3} className="text-center text-gray-400">Belum ada lamaran.</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
} 