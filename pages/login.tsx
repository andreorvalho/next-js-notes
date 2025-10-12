import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { signIn, getSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Form from '@/components/Form';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputs = [
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
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
      required: true,
      className: 'form-input',
      placeholder: 'Password',
    },
  ];

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
        <Form
          showLogo
          footerText="Don’t have an account?"
          footerLink={{ href: '/register', label: 'Create one here' }}
          error={error}
          success={
            success ? 'Registration successful! Please log in.' : undefined
          }
          onSubmit={handleSubmit}
          formClassName="space-y-6"
          inputs={inputs}
          submitButton={{
            label: 'Sign In',
            loadingLabel: <span className="sr-only">Signing in...</span>,
            isSubmitting: isLoading,
            className: '',
          }}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
