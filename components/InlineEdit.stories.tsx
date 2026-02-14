import type { Meta, StoryObj } from '@storybook/react';
import { SingleLineInlineEdit } from './SingleLineInlineEdit';
import { MultilineInlineEdit } from './MultilineInlineEdit';

/**
 * Inline edit components are split into:
 *
 * - **SingleLineInlineEdit** – single-line input; Enter or blur saves. See Components/SingleLineInlineEdit.
 * - **MultilineInlineEdit** – textarea or rich text; Ctrl+Enter or Save button. See Components/MultilineInlineEdit.
 */
const meta: Meta<typeof SingleLineInlineEdit> = {
  title: 'Components/InlineEdit',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <p
        className="text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Use SingleLineInlineEdit for titles and short text. Use
        MultilineInlineEdit for note content (plain or rich text). See the
        dedicated story pages for each component.
      </p>
      <div>
        <SingleLineInlineEdit
          value="Note title (single line)"
          onChange={() => {}}
          onSave={() => {}}
          placeholder="Enter title"
        />
      </div>
      <div>
        <MultilineInlineEdit
          value="Note content (multiline). Press Ctrl+Enter to save."
          onChange={() => {}}
          onSave={() => {}}
          placeholder="Enter content"
        />
      </div>
    </div>
  ),
};
