'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/companies').then(res => res.json()).then(data => setCompanies(data.companies));
  }, []);
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Daftar Perusahaan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((c) => (
          <Link key={c.id} href={`/companies/${c.id}`} className="block">
            <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border">
              <div className="text-xl font-bold mb-2">{c.name}</div>
              <div className="text-gray-600 mb-3">{c.description}</div>
              <div className="text-sm text-gray-500">Booth: {c.location}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 