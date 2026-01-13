import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
    },
    placeholder: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Start writing...',
  },
};

export const WithContent: Story = {
  args: {
    value: '<p>This is some <strong>formatted</strong> content.</p>',
    onChange: () => {},
    placeholder: 'Start writing...',
  },
};

export const WithFormattedContent: Story = {
  args: {
    value: `
      <h1>Heading 1</h1>
      <p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
      <h2>Heading 2</h2>
      <ul>
        <li>First item</li>
        <li>Second item</li>
        <li>Third item</li>
      </ul>
      <p>Another paragraph with a <a href="#">link</a>.</p>
    `,
    onChange: () => {},
    placeholder: 'Start writing...',
  },
};

export const EvernotePaste: Story = {
  args: {
    value: `
      <p>Content pasted from Evernote:</p>
      <p><strong>Important Note:</strong> This content was copied from Evernote and should preserve formatting.</p>
      <ul>
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
        <li>Bullet point 3</li>
      </ul>
      <p>More content here...</p>
    `,
    onChange: () => {},
    placeholder: 'Paste content from Evernote here...',
  },
};

export const Interactive: Story = {
  render: () => {
    const [content, setContent] = useState(
      '<p>Edit this content using the toolbar above!</p>'
    );

    return (
      <div className="space-y-4">
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Start writing..."
        />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">HTML Output:</h3>
          <pre className="text-sm overflow-auto">{content}</pre>
        </div>
      </div>
    );
  },
};

export const LargeContent: Story = {
  args: {
    value: Array(10)
      .fill(0)
      .map(
        (_, i) =>
          `<h2>Section ${i + 1}</h2><p>This is a large content example with multiple sections. Each section contains some text to demonstrate how the editor handles longer content.</p>`
      )
      .join(''),
    onChange: () => {},
    placeholder: 'Start writing...',
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    placeholder: 'Click here to start writing your note...',
  },
};
