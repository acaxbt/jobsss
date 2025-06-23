'use client';
import { useEffect, useState } from 'react';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/companies').then(res => res.json()).then(data => setCompanies(data.companies));
  }, []);
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Perusahaan</h1>
      <ul className="space-y-4">
        {companies.map((c) => (
          <li key={c.id} className="p-4 bg-white rounded shadow">
            <a href={`/companies/${c.id}`} className="font-bold text-lg">{c.name}</a>
            <div>{c.description}</div>
            <div className="text-xs text-gray-500">Booth: {c.location}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 