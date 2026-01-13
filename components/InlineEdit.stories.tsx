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
    richText: {
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

export const RichTextMode: Story = {
  args: {
    value: '<p>This is <strong>rich text</strong> content with <em>formatting</em>.</p><ul><li>List item 1</li><li>List item 2</li></ul>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Click to edit with rich text editor',
    multiline: true,
    richText: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const RichTextDisplay: Story = {
  args: {
    value: '<h2>Rich Text Display</h2><p>This content is displayed as HTML. Click to edit with the rich text editor.</p><p>You can use <strong>bold</strong>, <em>italic</em>, and <u>underline</u> formatting.</p>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Click to start editing',
    multiline: true,
    richText: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const RichTextEvernote: Story = {
  args: {
    value: '<p>Content pasted from <strong>Evernote</strong>:</p><ul><li>Preserves formatting</li><li>Maintains lists</li><li>Keeps structure</li></ul><p>More content here...</p>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Paste Evernote content here',
    multiline: true,
    richText: true,
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

export const InteractiveRichText: Story = {
  render: () => {
    const [content, setContent] = useState(
      '<p>This is <strong>interactive</strong> rich text content. Click to edit!</p>'
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
            Rich Text Content
          </h3>
          <InlineEdit
            value={content}
            onChange={setContent}
            onSave={handleSave}
            placeholder="Click to edit with rich text editor"
            multiline
            richText
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
