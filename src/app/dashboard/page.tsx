import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role === 'APPLICANT') {
    redirect('/dashboard/applicant');
  } else if (session.user.role === 'ADMIN') {
    redirect('/dashboard/admin');
  }
  return null;
} 