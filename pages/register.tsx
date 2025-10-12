import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Form from '../components/Form';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const inputs = [
    {
      type: 'text',
      name: 'name',
      id: 'name',
      value: fullName,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value),
      required: true,
      className: 'form-input',
      placeholder: 'Name',
    },
    {
      type: 'email',
      name: 'email',
      id: 'email',
      value: email,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
      required: true,
      className: 'form-input',
      placeholder: 'E-mail',
    },
    {
      type: 'password',
      name: 'password',
      id: 'password',
      value: password,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
      required: true,
      className: 'form-input',
      placeholder: 'Password',
    },
  ]

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
        <Form
          showLogo
          footerText="Already have an account?"
          footerLink={{ href: '/login', label: 'Sign in' }}
          error={errorMessage}
          onSubmit={handleSubmit}
          formClassName="space-y-6"
          inputs={inputs}
          submitButton={{
            label: 'Create account',
            loadingLabel: <span className="sr-only">Creating account...</span>,
            isSubmitting: isSubmitting,
            className: '',
          }}
        />
      </div>
    </div>
  );
}
