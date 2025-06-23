'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CompanyDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  
  useEffect(() => {
    if (params?.id) {
      fetch(`/api/companies/${params.id}`).then(res => res.json()).then(data => setCompany(data.company));
      fetch(`/api/jobs?company_id=${params.id}`).then(res => res.json()).then(data => setJobs(data.jobs));
    }
  }, [params]);
  
  if (!company) return <div>Loading...</div>;
  
  const isAdmin = session?.user?.role === 'ADMIN';
  const canAccessCompany = isAdmin && (
    !session.user.company_id || 
    session.user.company_id === company.id
  );
  
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <Link href="/companies" className="text-blue-600 hover:underline">← Kembali ke Daftar Perusahaan</Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
        <div className="text-gray-600 mb-4">{company.description}</div>
        <div className="text-sm text-gray-500 mb-4">Booth: {company.location}</div>
        
        {company.gallery && company.gallery.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-4">
            {company.gallery.map((url: string, i: number) => (
              <img key={i} src={url} alt="Gallery" className="w-32 h-32 object-cover rounded" />
            ))}
          </div>
        )}
        
        {isAdmin && canAccessCompany && (
          <div className="mt-4">
            <Link 
              href={`/scan?company_id=${company.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Scan QR Code Pelamar
            </Link>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Lowongan Tersedia</h2>
        {jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="font-semibold text-lg">{job.title}</div>
                <div className="text-gray-600 mt-1">{job.description}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Belum ada lowongan tersedia.</div>
        )}
      </div>
    </div>
  );
} 