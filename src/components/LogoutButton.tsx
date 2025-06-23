'use client';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="ml-4 bg-red-500 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  );
} 