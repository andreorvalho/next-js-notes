import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password }),
      });

      if (response.ok) {
        router.push('/login?success=1');
        return;
      }

      const data = await response.json().catch(() => ({}));
      setErrorMessage(data.error || 'Failed to register');
    } catch {
      setErrorMessage('Failed to register');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Card */}
        <div className="card w-full max-w-md animate-slide-in">
          {/* Header with logo */}
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

          {/* Error message */}
          {errorMessage && (
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
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <input
                type="text"
                name="name"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="form-input"
                placeholder="Name"
              />
            </div>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary w-full ${isSubmitting ? 'btn-loading' : ''}`}
            >
              {isSubmitting ? (
                <span className="sr-only">Creating account...</span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-8 text-center">
            <p
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Already have an account?{' '}
              <Link href="/login" className="font-medium link-accent">
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
