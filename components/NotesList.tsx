import { Note } from '@/types';

type ViewMode = 'kanban' | 'list';
type SortField = 'created_at' | 'updated_at' | 'title';
type SortDirection = 'asc' | 'desc';

interface NotesListProps {
  notes: Note[];
  selectedNote: Note | null;
  viewMode: ViewMode;
  searchQuery: string;
  showSearch: boolean;
  showSortOptions: boolean;
  sortField: SortField;
  sortDirection: SortDirection;
  isLoading: boolean;
  onNoteClick: (note: Note) => void;
  onNewNote: () => void;
  onSearchChange: (query: string) => void;
  onSearchToggle: () => void;
  onSortToggle: () => void;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onViewModeToggle: () => void;
}

export default function NotesList({
  notes,
  selectedNote,
  viewMode,
  searchQuery,
  showSearch,
  showSortOptions,
  sortField,
  sortDirection,
  isLoading,
  onNoteClick,
  onNewNote,
  onSearchChange,
  onSearchToggle,
  onSortToggle,
  onSortFieldChange,
  onSortDirectionChange,
  onViewModeToggle,
}: NotesListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupNotesByDate = (notes: Note[]) => {
    const groups: { [key: string]: Note[] } = {};
    notes.forEach(note => {
      const date = formatDate(note.updated_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(note);
    });
    return groups;
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const groupedNotes = groupNotesByDate(notes);

  return (
    <div className="w-1/3 border-r border-border bg-surface/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Notes</h1>
              <p className="text-text-secondary text-sm">{notes.length} notes</p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Sort Button */}
              <button
                onClick={onSortToggle}
                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Sort notes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>

              {/* Filter/Search Button */}
              <button
                onClick={onSearchToggle}
                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Filter notes"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>

              {/* View Mode Button */}
              <button
                onClick={onViewModeToggle}
                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Change view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>

              {/* Create Note Button */}
              <button
                onClick={onNewNote}
                className="px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-white flex items-center gap-2 text-sm"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-border-focus text-sm"
              />
            </div>
          )}

          {/* Sort Options */}
          {showSortOptions && (
            <div className="mb-4 p-3 bg-surface rounded-lg border border-border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Sort by</label>
                  <select
                    value={sortField}
                    onChange={(e) => onSortFieldChange(e.target.value as SortField)}
                    className="w-full px-2 py-1 bg-surface border border-border rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-border-focus text-xs"
                  >
                    <option value="updated_at">Last Updated</option>
                    <option value="created_at">Created Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Direction</label>
                  <select
                    value={sortDirection}
                    onChange={(e) => onSortDirectionChange(e.target.value as SortDirection)}
                    className="w-full px-2 py-1 bg-surface border border-border rounded text-text-primary focus:outline-none focus:ring-1 focus:ring-border-focus text-xs"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        {viewMode === 'kanban' ? (
          // Kanban View
          <div className="space-y-4">
            {Object.entries(groupedNotes).map(([date, dateNotes]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-text-secondary mb-2">{date}</h2>
                <div className="space-y-2">
                  {dateNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`bg-surface rounded-lg p-3 hover:bg-surface-elevated transition-colors cursor-pointer border border-border ${
                        selectedNote?.id === note.id ? 'border-l-4 border-primary-500 bg-primary-50/10' : ''
                      }`}
                      onClick={() => onNoteClick(note)}
                    >
                      <h3 className="font-semibold text-text-primary mb-1 line-clamp-2 text-sm">{note.title}</h3>
                      <p className="text-text-secondary text-xs mb-2 line-clamp-2">
                        {truncateContent(note.content, 60)}
                      </p>
                      <div className="text-xs text-text-tertiary">
                        {formatDateTime(note.updated_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {Object.entries(groupedNotes).map(([date, dateNotes]) => (
              <div key={date}>
                <h2 className="text-sm font-semibold text-text-secondary mb-2">{date}</h2>
                <div className="space-y-1">
                  {dateNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`bg-surface rounded-lg p-3 hover:bg-surface-elevated transition-colors cursor-pointer border border-border ${
                        selectedNote?.id === note.id ? 'border-l-4 border-primary-500 bg-primary-50/10' : ''
                      }`}
                      onClick={() => onNoteClick(note)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text-primary mb-1 text-sm line-clamp-1">{note.title}</h3>
                          <p className="text-text-secondary text-xs line-clamp-1">
                            {truncateContent(note.content, 40)}
                          </p>
                        </div>
                        <div className="text-xs text-text-tertiary ml-2 flex-shrink-0">
                          {formatDateTime(note.updated_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {notes.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm">No notes found</p>
            <button
              onClick={onNewNote}
              className="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-white text-sm"
            >
              Create your first note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
