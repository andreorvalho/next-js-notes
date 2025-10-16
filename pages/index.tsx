import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function Home() {
  const { session, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    // Redirect authenticated users directly to notes
    router.replace('/notes');
  }, [isLoadingAuth, session]);

  if (isLoadingAuth) return <p>Loading...</p>;

  return null;
}
