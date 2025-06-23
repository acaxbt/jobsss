'use client';
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ScanPage() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [assignMsg, setAssignMsg] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);

  useEffect(() => {
    if ((session?.user as any)?.role !== 'ADMIN') return;
    if (!scannerRef.current) return;
    import('html5-qrcode').then(({ Html5Qrcode }) => {
      html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          setUserId(decodedText);
          html5QrCodeRef.current.stop();
        },
        (err: any) => {}
      );
    });
    return () => {
      if (html5QrCodeRef.current) html5QrCodeRef.current.stop();
    };
  }, [session]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/profile/${userId}`).then(res => res.json()).then(data => {
        setProfile(data.profile);
      }).catch(() => setError('Gagal fetch profil'));
      // Fetch jobs milik perusahaan admin
      if (session?.user?.email === 'superadmin@jobfair.com') {
        fetch('/api/jobs').then(res => res.json()).then(data => setJobs(data.jobs));
      } else if ((session?.user as any)?.company_id) {
        fetch(`/api/jobs?company_id=${(session?.user as any).company_id}`).then(res => res.json()).then(data => setJobs(data.jobs));
      }
    }
  }, [userId, session]);

  const handleAssign = async () => {
    setAssignMsg('');
    if (!selectedJob) return setAssignMsg('Pilih lowongan terlebih dahulu');
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, job_id: selectedJob }),
    });
    if (res.ok) setAssignMsg('Berhasil assign pelamar ke lowongan!');
    else {
      const data = await res.json();
      setAssignMsg(data.message || 'Gagal assign');
    }
  };

  if (!session || (session.user as any).role !== 'ADMIN') return <div>Unauthorized</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Scan QR Pelamar</h1>
      <div ref={scannerRef} id="qr-reader" className="w-full h-64 bg-gray-100 mb-4" />
      {userId && <div className="mb-4">User ID: {userId}</div>}
      {profile && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <div><b>Nama:</b> {profile.name}</div>
          <div><b>Pendidikan:</b> {profile.education}</div>
          <div><b>Pengalaman:</b> {profile.experience}</div>
          <div><b>Skills:</b> {profile.skills}</div>
          <div><b>CV URL:</b> {profile.cvUrl}</div>
        </div>
      )}
      {profile && jobs.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Assign ke Lowongan:</label>
          <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="w-full border p-2 rounded">
            <option value="">Pilih lowongan</option>
            {jobs.map((job: any) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
          <button onClick={handleAssign} className="mt-2 bg-black text-white px-4 py-2 rounded">Assign</button>
          {assignMsg && <div className="mt-2 text-green-600">{assignMsg}</div>}
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
} 