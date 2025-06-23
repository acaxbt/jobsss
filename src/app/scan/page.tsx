'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

function ScanPageContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const companyId = searchParams.get('company_id');
  
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [assignMsg, setAssignMsg] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<any>(null);

  // Fetch company info and jobs when component mounts
  useEffect(() => {
    const targetCompanyId = companyId || (session?.user as any)?.company_id;
    if (targetCompanyId) {
      // Fetch company info
      fetch(`/api/companies/${targetCompanyId}`).then(res => res.json()).then(data => {
        setCompany(data.company);
      }).catch(() => setError('Gagal fetch info perusahaan'));
      
      // Fetch jobs for this company
      fetch(`/api/jobs?company_id=${targetCompanyId}`).then(res => res.json()).then(data => {
        setJobs(data.jobs);
      }).catch(() => setError('Gagal fetch lowongan'));
    }
  }, [companyId, session]);

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
          setIsScanning(false);
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
    }
  }, [userId]);

  const handleAssign = async () => {
    setAssignMsg('');
    if (!selectedJob) return setAssignMsg('Pilih lowongan terlebih dahulu');
    
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, job_id: selectedJob }),
    });
    
    if (res.ok) {
      setAssignMsg('Berhasil assign pelamar ke lowongan!');
      setSelectedJob('');
    } else {
      const data = await res.json();
      setAssignMsg(data.message || 'Gagal assign');
    }
  };

  const resetScan = () => {
    setUserId('');
    setProfile(null);
    setError('');
    setSelectedJob('');
    setAssignMsg('');
    setIsScanning(true);
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          setUserId(decodedText);
          setIsScanning(false);
          html5QrCodeRef.current.stop();
        },
        (err: any) => {}
      );
    }
  };

  if (!session || (session.user as any).role !== 'ADMIN') return <div>Unauthorized</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Scan QR Code Pelamar</h1>
      
      {/* Company Info Section */}
      {company && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2 text-blue-800">{company.name}</h2>
          <p className="text-blue-700 mb-2">{company.description}</p>
          <p className="text-sm text-blue-600">Booth: {company.location}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Scanner and User Info */}
        <div>
          {isScanning && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Scanner QR Code</h2>
              <div ref={scannerRef} id="qr-reader" className="w-full h-64 bg-gray-100 rounded" />
              <p className="text-sm text-gray-600 mt-2 text-center">Arahkan kamera ke QR Code pelamar</p>
            </div>
          )}
          
          {userId && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">User ID Terdeteksi</h2>
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">{userId}</div>
            </div>
          )}
          
          {profile && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Profil Pelamar</h2>
              <div className="grid gap-3">
                <div><span className="font-semibold">Nama:</span> {profile.name}</div>
                <div><span className="font-semibold">Pendidikan:</span> {profile.education}</div>
                <div><span className="font-semibold">Pengalaman:</span> {profile.experience}</div>
                <div><span className="font-semibold">Skills:</span> {profile.skills}</div>
                {profile.cvUrl && (
                  <div>
                    <span className="font-semibold">CV:</span> 
                    <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                      Lihat CV
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Available Jobs and Assignment */}
        <div>
          {/* Available Jobs Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Lowongan Tersedia</h2>
            {jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.map((job: any) => (
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
          
          {/* Assignment Section */}
          {profile && jobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Assign ke Lowongan</h2>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Pilih Lowongan:</label>
                <select 
                  value={selectedJob} 
                  onChange={e => setSelectedJob(e.target.value)} 
                  className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih lowongan</option>
                  {jobs.map((job: any) => (
                    <option key={job.id} value={job.id}>{job.title}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAssign} 
                disabled={!selectedJob}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Assign Pelamar ke Lowongan
              </button>
              {assignMsg && (
                <div className={`mt-3 p-3 rounded ${assignMsg.includes('Berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {assignMsg}
                </div>
              )}
            </div>
          )}
          
          {profile && jobs.length === 0 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Tidak ada lowongan tersedia untuk assign.
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
          {error}
        </div>
      )}
      
      {profile && (
        <div className="text-center mt-6">
          <button 
            onClick={resetScan}
            className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
          >
            Scan QR Code Baru
          </button>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto p-8 text-center">Loading...</div>}>
      <ScanPageContent />
    </Suspense>
  );
} 