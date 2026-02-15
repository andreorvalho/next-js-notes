import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SingleLineInlineEdit } from './SingleLineInlineEdit';

const meta: Meta<typeof SingleLineInlineEdit> = {
  title: 'Components/SingleLineInlineEdit',
  component: SingleLineInlineEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 'Click to edit',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Enter text here',
  },
};

export const Empty: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Click to start editing',
  },
};

export const WithContent: Story = {
  args: {
    value: 'This is some content that you can edit by clicking on it.',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Enter text here',
  },
};

export const TitleStyle: Story = {
  args: {
    value: 'Note Title',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Enter note title',
    className: 'note-title',
    titleClassName: 'note-title',
  },
};

export const Interactive: Story = {
  render: () => {
    const [title, setTitle] = useState('Interactive Title');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const handleSave = () => {
      setLastSaved(new Date());
    };

    return (
      <div className="space-y-4">
        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Title
          </h3>
          <SingleLineInlineEdit
            value={title}
            onChange={setTitle}
            onSave={handleSave}
            placeholder="Enter title"
            className="note-title"
            titleClassName="note-title"
          />
        </div>

        {lastSaved && (
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>
    );
  },
};
