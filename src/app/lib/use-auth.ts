'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface Session {
  user: User;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setSession(data);
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, loading, user: session?.user || null };
}
