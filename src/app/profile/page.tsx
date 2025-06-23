'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ name: '', education: '', experience: '', skills: '', cvUrl: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch profile jika sudah login
    if (session && session.user && (session.user as any).id && (session.user as any).role === 'APPLICANT') {
      fetch('/api/profile').then(res => res.json()).then(data => {
        if (data.profile) setForm(data.profile);
      });
    }
  }, [session]);

  if (!session || !session.user || (session.user as any).role !== 'APPLICANT') return <div>Unauthorized</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) setMessage('Profil tersimpan!');
    else setMessage('Gagal menyimpan profil');
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Profil Pelamar</h1>
      <div className="mb-4 flex flex-col items-center">
        <QRCode value={(session.user as any).id} size={128} />
        <div className="text-xs mt-2">QR Code ID: {(session.user as any).id}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="education" placeholder="Pendidikan" value={form.education} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="experience" placeholder="Pengalaman" value={form.experience} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="skills" placeholder="Skills" value={form.skills} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="cvUrl" placeholder="CV URL (opsional)" value={form.cvUrl} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="w-full bg-black text-white p-2 rounded disabled:opacity-50" disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan Profil'}</button>
      </form>
      {message && <div className="mt-2 text-green-600">{message}</div>}
    </div>
  );
} 