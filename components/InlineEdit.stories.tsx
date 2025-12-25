import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';
import { InlineEdit } from './InlineEdit';

const meta: Meta<typeof InlineEdit> = {
  title: 'Components/InlineEdit',
  component: InlineEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    multiline: {
      control: { type: 'boolean' },
    },
  },
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

export const Multiline: Story = {
  args: {
    value:
      'This is a multiline text.\nYou can edit it by clicking on it.\nPress Ctrl+Enter to save.',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Enter multiline text here',
    multiline: true,
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

export const ContentStyle: Story = {
  args: {
    value:
      'This is the content of the note. It can be quite long and will wrap to multiple lines as needed.',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Start writing your note content here...',
    multiline: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const Interactive: Story = {
  render: () => {
    const [title, setTitle] = useState('Interactive Title');
    const [content, setContent] = useState(
      'This is interactive content. Click to edit!'
    );
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
          <InlineEdit
            value={title}
            onChange={setTitle}
            onSave={handleSave}
            placeholder="Enter title"
            className="note-title"
            titleClassName="note-title"
          />
        </div>

        <div>
          <h3
            className="text-sm font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Content
          </h3>
          <InlineEdit
            value={content}
            onChange={setContent}
            onSave={handleSave}
            placeholder="Enter content"
            multiline
            className="note-content"
            contentClassName="note-content"
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
