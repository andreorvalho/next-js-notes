import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FlexibleForm } from './FlexibleForm';

const meta: Meta<typeof FlexibleForm> = {
  title: 'Components/FlexibleForm',
  component: FlexibleForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['card', 'document', 'minimal'],
    },
    showLogo: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Traditional Form Story
export const TraditionalForm: Story = {
  args: {
    title: 'Contact Us',
    subtitle: 'Send us a message and we\'ll get back to you',
    layout: 'card',
    showLogo: true,
    fields: [
      {
        type: 'input',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        value: '',
        onChange: () => {},
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        value: '',
        onChange: () => {},
      },
      {
        type: 'textarea',
        name: 'message',
        label: 'Message',
        placeholder: 'Enter your message',
        rows: 4,
        value: '',
        onChange: () => {},
      },
    ],
    submitButton: {
      label: 'Send Message',
      type: 'submit',
    },
    footerText: 'Need help?',
    footerLink: { href: '/help', label: 'Visit our help center' },
  },
};

// Inline Editing Form Story
export const InlineEditingForm: Story = {
  args: {
    layout: 'document',
    showLogo: false,
    subtitle: 'Click on the title or content to start editing',
    fields: [
      {
        type: 'inline',
        name: 'title',
        value: 'My Note Title',
        onChange: () => {},
        onSave: () => {},
        placeholder: 'Note title',
        className: 'note-title',
        titleClassName: 'note-title',
      },
      {
        type: 'inline',
        name: 'content',
        value: 'This is the content of my note. Click here to edit it inline.',
        onChange: () => {},
        onSave: () => {},
        placeholder: 'Start writing your note content here...',
        multiline: true,
        className: 'note-content',
        contentClassName: 'note-content',
      },
    ],
  },
};

// Minimal Form Story
export const MinimalForm: Story = {
  args: {
    title: 'Quick Note',
    layout: 'minimal',
    showLogo: false,
    fields: [
      {
        type: 'input',
        name: 'quickTitle',
        placeholder: 'Quick title',
        value: '',
        onChange: () => {},
      },
      {
        type: 'textarea',
        name: 'quickContent',
        placeholder: 'Quick content',
        value: '',
        onChange: () => {},
        rows: 3,
      },
    ],
  },
};

// Interactive Form Story
export const InteractiveForm: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
      title: 'Interactive Note',
      content: 'This is an interactive note. Try editing it!',
    });
    const [success, setSuccess] = useState('');

    const handleInputChange = (field: string) => (value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      setSuccess('Note saved!');
      setTimeout(() => setSuccess(''), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setSuccess('Form submitted!');
      setTimeout(() => setSuccess(''), 3000);
    };

    const traditionalFields = [
      {
        type: 'input' as const,
        name: 'name',
        label: 'Full Name',
        value: formData.name,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData(prev => ({ ...prev, name: e.target.value })),
        placeholder: 'Enter your full name',
        required: true,
      },
      {
        type: 'input' as const,
        name: 'email',
        label: 'Email Address',
        value: formData.email,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setFormData(prev => ({ ...prev, email: e.target.value })),
        placeholder: 'Enter your email',
        required: true,
      },
      {
        type: 'textarea' as const,
        name: 'message',
        label: 'Message',
        value: formData.message,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setFormData(prev => ({ ...prev, message: e.target.value })),
        placeholder: 'Enter your message',
        rows: 4,
      },
    ];

    const inlineFields = [
      {
        type: 'inline' as const,
        name: 'title',
        value: formData.title,
        onChange: handleInputChange('title'),
        onSave: handleSave,
        placeholder: 'Note title',
        className: 'note-title',
        titleClassName: 'note-title',
      },
      {
        type: 'inline' as const,
        name: 'content',
        value: formData.content,
        onChange: handleInputChange('content'),
        onSave: handleSave,
        placeholder: 'Start writing your note content here...',
        multiline: true,
        className: 'note-content',
        contentClassName: 'note-content',
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Traditional Form
          </h3>
          <FlexibleForm
            title="Contact Us"
            subtitle="Send us a message and we'll get back to you"
            fields={traditionalFields}
            onSubmit={handleSubmit}
            success={success}
            submitButton={{
              label: 'Send Message',
              type: 'submit',
            }}
            footerText="Need help?"
            footerLink={{ href: '/help', label: 'Visit our help center' }}
            layout="card"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Inline Editing Form
          </h3>
          <FlexibleForm
            fields={inlineFields}
            success={success}
            subtitle="Click on the title or content to start editing"
            layout="document"
            showLogo={false}
          />
        </div>
      </div>
    );
  },
};

// With Error State
export const WithError: Story = {
  args: {
    title: 'Form with Error',
    subtitle: 'This form shows error states',
    layout: 'card',
    error: 'Please fix the errors below and try again.',
    fields: [
      {
        type: 'input',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        required: true,
        value: '',
        onChange: () => {},
        error: 'Name is required',
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        required: true,
        value: 'invalid-email',
        onChange: () => {},
        error: 'Please enter a valid email address',
      },
    ],
    submitButton: {
      label: 'Submit',
      type: 'submit',
    },
  },
};

// With Success State
export const WithSuccess: Story = {
  args: {
    title: 'Form with Success',
    subtitle: 'This form shows success state',
    layout: 'card',
    success: 'Form submitted successfully!',
    fields: [
      {
        type: 'input',
        name: 'name',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        value: 'John Doe',
        onChange: () => {},
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        value: 'john@example.com',
        onChange: () => {},
      },
    ],
    submitButton: {
      label: 'Submit',
      type: 'submit',
    },
  },
};
