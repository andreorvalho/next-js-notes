import { Note } from '@/types';
import { FlexibleForm } from '@/components/FlexibleForm';

interface NoteFormProps {
  selectedNote: Note | null;
  isEditing: boolean;
  title: string;
  content: string;
  error: string | undefined;
  success: string | undefined;
  isSaving: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTitleSave: () => void;
  onContentSave: () => void;
  onNewNote: () => void;
}

export default function NoteForm({
  selectedNote,
  isEditing,
  title,
  content,
  error,
  success,
  isSaving,
  onTitleChange,
  onContentChange,
  onTitleSave,
  onContentSave,
  onNewNote,
}: NoteFormProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {selectedNote || isEditing ? (
        <div className="h-full">
          <FlexibleForm
            layout="document"
            fields={[
              {
                type: 'inline' as const,
                name: 'title',
                value: title,
                onChange: onTitleChange,
                onSave: onTitleSave,
                placeholder: 'Note title',
                className: 'note-title',
                titleClassName: 'note-title',
              },
              {
                type: 'inline' as const,
                name: 'content',
                value: content,
                onChange: onContentChange,
                onSave: onContentSave,
                placeholder: 'Start writing your note content here...',
                multiline: true,
                className: 'note-content',
                contentClassName: 'note-content',
              },
            ]}
            error={error}
            success={success}
            subtitle={
              selectedNote
                ? `Created: ${new Date(
                    selectedNote.created_at
                  ).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} • Last updated: ${new Date(
                    selectedNote.updated_at
                  ).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                : 'Start typing to create your note...'
            }
            showLogo={false}
          />

          {/* Save indicator */}
          {isSaving && (
            <div className="fixed bottom-4 right-4 bg-surface text-text-primary px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <div className="loading-spinner"></div>
              <span>Saving...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Select a note to view
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Choose a note from the list to start reading or editing
            </p>
            <button
              onClick={onNewNote}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-white"
            >
              Create New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
