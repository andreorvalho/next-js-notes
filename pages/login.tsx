import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.success) {
      setSuccess(true);
    }
  }, [router.query.success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result && result.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 shadow-md rounded-lg">
      {success && (
        <p className="text-green-500">
          Registration successful! Please log in.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-500">
          Register
        </Link>
      </p>
    </div>
  );
}
