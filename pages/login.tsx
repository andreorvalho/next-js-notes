import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.success) {
      setSuccess(true);
    }

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, [router.query.success]);

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      <div
        className="absolute inset-0 bg-gradient-to-br"
        style={{
          backgroundImage: isDarkMode
            ? 'linear-gradient(to bottom right, var(--color-gray-900), var(--color-gray-800), var(--color-gray-900))'
            : 'linear-gradient(to bottom right, var(--color-primary-50), #ffffff, var(--color-secondary-50))'
        }}
      />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-decoration bg-decoration-primary"></div>
        <div className="bg-decoration bg-decoration-secondary"></div>
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4 container">
        {/* Theme toggle with modern CSS classes */}
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          <svg className="theme-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isDarkMode ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            )}
          </svg>
        </button>

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
              <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <Link
                href="/register"
                className="font-medium transition-colors duration-200"
                style={{
                  color: 'var(--color-primary-600)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--color-primary-500)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--color-primary-600)';
                }}
              >
                Create one here
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
