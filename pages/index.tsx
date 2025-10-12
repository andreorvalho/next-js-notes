import { useState, useEffect } from 'react';
import { User } from '../types';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { session, isLoading: isLoadingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    setIsLoadingUsers(true);
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers)
      .finally(() => setIsLoadingUsers(false));
  }, [isLoadingAuth, session, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (isLoadingAuth || isLoadingUsers) return <p>Loading...</p>;

  if (!session) return null;

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
