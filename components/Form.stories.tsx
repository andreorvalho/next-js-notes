import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

// Full example showcasing all optional props
export const AllProps: Story = {
  args: {
    title: 'Form Title',
    subtitle: 'A short descriptive subtitle',
    showLogo: true,
    footerText: "Don't have an account?",
    footerLink: { href: '/register', label: 'Create one here' },
    formClassName: 'space-y-6',
    inputs: [
      { type: 'text', name: 'name', placeholder: 'Name', required: true },
      { type: 'email', name: 'email', placeholder: 'E-mail', required: true },
      { type: 'password', name: 'password', placeholder: 'Password', required: true },
    ],
    submitButton: {
      label: 'Submit',
      loadingLabel: 'Submitting…',
      isSubmitting: false,
      className: '',
      type: 'submit',
      disabled: false,
    },
    onSubmit: (e) => e.preventDefault(),
  },
};

// Minimal example (no props — uses component defaults)
export const Minimal: Story = {
  args: {},
};

export const WithSuccess: Story = {
  args: {
    title: 'Success',
    success: 'Account created successfully!',
    inputs: [],
  },
};

export const WithError: Story = {
  args: {
    title: 'Error',
    error: 'Something went wrong',
    inputs: [],
  },
};


