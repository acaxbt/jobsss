'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'APPLICANT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Register failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <div className="text-red-500">{error}</div>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="APPLICANT">Pelamar</option>
          <option value="ADMIN">Admin Perusahaan</option>
        </select>
        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
} 