import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultilineInlineEdit } from './MultilineInlineEdit';

const meta: Meta<typeof MultilineInlineEdit> = {
  title: 'Components/MultilineInlineEdit',
  component: MultilineInlineEdit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    richText: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value:
      'This is a multiline text.\nYou can edit it by clicking on it.\nPress Ctrl+Enter to save.',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Enter multiline text here',
  },
};

export const ContentStyle: Story = {
  args: {
    value:
      'This is the content of the note. It can be quite long and will wrap to multiple lines as needed.',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Start writing your note content here...',
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const RichTextMode: Story = {
  args: {
    value:
      '<p>This is <strong>rich text</strong> content with <em>formatting</em>.</p><ul><li>List item 1</li><li>List item 2</li></ul>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Click to edit with rich text editor',
    richText: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const RichTextDisplay: Story = {
  args: {
    value:
      '<h2>Rich Text Display</h2><p>This content is displayed as HTML. Click to edit with the rich text editor.</p><p>You can use <strong>bold</strong>, <em>italic</em>, and <u>underline</u> formatting.</p>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Click to start editing',
    richText: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const RichTextEvernote: Story = {
  args: {
    value:
      '<p>Content pasted from <strong>Evernote</strong>:</p><ul><li>Preserves formatting</li><li>Maintains lists</li><li>Keeps structure</li></ul><p>More content here...</p>',
    onChange: () => {},
    onSave: () => {},
    placeholder: 'Paste Evernote content here',
    richText: true,
    className: 'note-content',
    contentClassName: 'note-content',
  },
};

export const Interactive: Story = {
  render: () => {
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
            Content
          </h3>
          <MultilineInlineEdit
            value={content}
            onChange={setContent}
            onSave={handleSave}
            placeholder="Enter content"
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
          <MultilineInlineEdit
            value={content}
            onChange={setContent}
            onSave={handleSave}
            placeholder="Click to edit with rich text editor"
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
