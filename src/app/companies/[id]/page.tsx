'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function CompanyDetailPage() {
  const params = useParams();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    if (params?.id) {
      fetch(`/api/companies/${params.id}`).then(res => res.json()).then(data => setCompany(data.company));
      fetch(`/api/jobs?company_id=${params.id}`).then(res => res.json()).then(data => setJobs(data.jobs));
    }
  }, [params]);
  if (!company) return <div>Loading...</div>;
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">{company.name}</h1>
      <div className="mb-4">{company.description}</div>
      <div className="mb-4 text-xs text-gray-500">Booth: {company.location}</div>
      <div className="flex gap-2 overflow-x-auto mb-4">
        {company.gallery?.map((url: string, i: number) => (
          <img key={i} src={url} alt="Gallery" className="w-32 h-32 object-cover rounded" />
        ))}
      </div>
      <h2 className="text-xl font-bold mt-8 mb-2">Lowongan di Perusahaan Ini</h2>
      <ul className="space-y-2">
        {jobs.map((job) => (
          <li key={job.id} className="p-3 bg-gray-50 rounded border">
            <div className="font-semibold">{job.title}</div>
            <div className="text-sm text-gray-600">{job.description}</div>
          </li>
        ))}
        {jobs.length === 0 && <li className="text-gray-400">Belum ada lowongan.</li>}
      </ul>
    </div>
  );
} 