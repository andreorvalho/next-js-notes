import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTheme } from '../components/ThemeProvider';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.success) {
      setSuccess(true);
    }
  }, [router.query.success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      {/* Background with CSS custom properties */}
      <div className="absolute inset-0 bg-app-gradient" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-decoration bg-decoration-primary"></div>
        <div className="bg-decoration bg-decoration-secondary"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4 container">
        {/* Login card with modern CSS classes */}
        <div className="card w-full max-w-md animate-slide-in">
          {/* Header */}
          <header className="text-center mb-10">
            <div className="flex justify-center">
              <picture>
                <source srcSet="/images/logo.webp" type="image/webp" />
                <img
                  src="/images/logo.png"
                  alt="Notabili Logo"
                  className="h-32 w-auto"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </header>

          {/* Success message */}
          {success && (
            <div className="alert alert-success">
              <svg
                className="alert-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Registration successful! Please log in.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="E-mail"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Password"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-error">
                <svg
                  className="alert-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-primary w-full ${isLoading ? 'btn-loading' : ''}`}
            >
              {isLoading ? (
                <span className="sr-only">Signing in...</span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-medium link-accent">
                Create one here
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
