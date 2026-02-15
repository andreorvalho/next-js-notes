import type { Meta, StoryObj } from '@storybook/react';
import { FormInput, FormTextarea } from './FormInput';

const meta: Meta<typeof FormInput> = {
  title: 'Components/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    required: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'example',
    label: 'Example Input',
    placeholder: 'Enter text here',
    value: '',
    onChange: () => {},
  },
};

export const WithLabel: Story = {
  args: {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'Enter your email',
    value: '',
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    value: 'weak',
    onChange: () => {},
    error: 'Password must be at least 8 characters long',
  },
};

export const WithHelpText: Story = {
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
    value: '',
    onChange: () => {},
    helpText: 'Choose a unique username that others can use to find you',
  },
};

export const Required: Story = {
  args: {
    name: 'required',
    label: 'Required Field',
    placeholder: 'This field is required',
    value: '',
    onChange: () => {},
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled',
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    value: 'Disabled value',
    onChange: () => {},
    disabled: true,
  },
};

export const Textarea: Story = {
  render: () => (
    <FormTextarea
      name="message"
      label="Message"
      placeholder="Enter your message here"
      value=""
      onChange={() => {}}
      rows={4}
    />
  ),
};

export const TextareaWithError: Story = {
  render: () => (
    <FormTextarea
      name="message"
      label="Message"
      placeholder="Enter your message here"
      value=""
      onChange={() => {}}
      rows={4}
      error="Message is required"
    />
  ),
};

export const TextareaWithHelpText: Story = {
  render: () => (
    <FormTextarea
      name="description"
      label="Description"
      placeholder="Enter a description"
      value=""
      onChange={() => {}}
      rows={3}
      helpText="Provide a detailed description of your project"
    />
  ),
};
