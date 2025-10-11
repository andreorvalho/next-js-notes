import { useState, useEffect } from 'react';
import { User } from '../types';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const router = useRouter();

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  if (loading) return <p>Loading...</p>;

  if (!session) {
    router.push('/login');
    return null;
  }

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
