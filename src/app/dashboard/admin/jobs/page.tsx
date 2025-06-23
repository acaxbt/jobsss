'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', description: '', company_id: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/companies').then(res => res.json()).then(data => setCompanies(data.companies));
    fetch('/api/jobs').then(res => res.json()).then(data => setJobs(data.jobs));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/jobs/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: '', description: '', company_id: '' });
    setEditingId(null);
    fetch('/api/jobs').then(res => res.json()).then(data => setJobs(data.jobs));
  };

  const handleEdit = (job: any) => {
    setForm({ title: job.title, description: job.description, company_id: job.company_id });
    setEditingId(job.id);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    fetch('/api/jobs').then(res => res.json()).then(data => setJobs(data.jobs));
  };

  // Filter jobs jika bukan superadmin
  const isSuperAdmin = session?.user?.email === 'superadmin@jobfair.com';
  const userCompanyId = (session?.user as any)?.company_id;
  const filteredJobs = isSuperAdmin ? jobs : jobs.filter(j => j.company_id === userCompanyId);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Lowongan Kerja</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-8">
        <input name="title" placeholder="Judul" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" required />
        <select name="company_id" value={form.company_id} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Pilih Perusahaan</option>
          {companies.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded">{editingId ? 'Update' : 'Tambah'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', company_id: '' }); }} className="ml-2 px-4 py-2 rounded border">Batal</button>}
      </form>
      <ul className="space-y-4">
        {filteredJobs.map((job) => (
          <li key={job.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
            <div>
              <div className="font-bold">{job.title}</div>
              <div className="text-sm text-gray-600">{job.description}</div>
              <div className="text-xs text-gray-400">Perusahaan: {companies.find((c: any) => c.id === job.company_id)?.name}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(job)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(job.id)} className="text-red-600">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 