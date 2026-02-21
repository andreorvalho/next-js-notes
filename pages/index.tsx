import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { Note } from '@/types';
import { signOut } from 'next-auth/react';
import NotesList from '@/components/NotesList';
import NoteForm from '@/components/NoteForm';

type ViewMode = 'kanban' | 'list';
type SortField = 'created_at' | 'updated_at' | 'title';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const router = useRouter();
  const { session, isLoading: isLoadingAuth } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortField, setSortField] = useState<SortField>('updated_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Note editing state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('orderBy', sortField);
      params.append('orderDirection', sortDirection);

      const response = await fetch(`/api/notes?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }
      const data = await response.json();
      // Ensure data is an array
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, sortField, sortDirection]);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    fetchNotes();
  }, [
    isLoadingAuth,
    session,
    searchQuery,
    sortField,
    sortDirection,
    fetchNotes,
    router,
  ]);

  const handleLogout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  const handleNoteClick = useCallback(async (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setTitle(note.title);
    setContent(note.content);
    setError(undefined);
    setSuccess(undefined);
    try {
      const res = await fetch(`/api/notes/${note.id}`);
      if (res.ok) {
        const fullNote: Note = await res.json();
        setTitle(fullNote.title);
        setContent(fullNote.content);
        setSelectedNote(fullNote);
      }
    } catch {
      // Keep list preview content if fetch fails
    }
  }, []);

  const handleNewNote = useCallback(() => {
    setSelectedNote(null);
    setIsEditing(true);
    setTitle('');
    setContent('');
    setError(undefined);
    setSuccess(undefined);
  }, []);

  const saveNote = useCallback(
    async (overrideTitle?: string, overrideContent?: string) => {
      const titleToSave = overrideTitle !== undefined ? overrideTitle : title;
      const contentToSave =
        overrideContent !== undefined ? overrideContent : content;
      if (!titleToSave.trim() && !contentToSave.trim()) return;

      setIsSaving(true);
      setError(undefined);

      try {
        const method = selectedNote ? 'PUT' : 'POST';
        const url = selectedNote
          ? `/api/notes/${selectedNote.id}`
          : '/api/notes';
        const payload = {
          title: titleToSave.trim() || 'Untitled Note',
          content: contentToSave.trim() || '',
        };

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(
            data?.error ? JSON.stringify(data.error) : 'Failed to save note'
          );
          return;
        }

        const savedNote: Note = await res.json();
        setSelectedNote(savedNote);
        // Update state with saved values to keep in sync
        if (overrideTitle !== undefined) {
          setTitle(savedNote.title);
        }
        if (overrideContent !== undefined) {
          setContent(savedNote.content);
        }
        setSuccess('Note saved');

        // Clear success message after 2 seconds
        setTimeout(() => setSuccess(undefined), 2000);

        // Refresh notes list
        fetchNotes();
      } catch {
        setError('Network error');
      } finally {
        setIsSaving(false);
      }
    },
    [title, content, selectedNote, fetchNotes]
  );

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const handleTitleSave = useCallback(
    (newTitle?: string) => {
      saveNote(newTitle, undefined);
    },
    [saveNote]
  );

  const handleContentSave = useCallback(
    (newContent?: string) => {
      saveNote(undefined, newContent);
    },
    [saveNote]
  );

  if (isLoadingAuth || isLoading)
    return (
      <div className="min-h-screen relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-app-gradient" />
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-text-primary">Loading...</div>
        </div>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      {/* Background with CSS custom properties */}
      <div className="absolute inset-0 bg-app-gradient" />

      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-decoration bg-decoration-primary"></div>
        <div className="bg-decoration bg-decoration-secondary"></div>
      </div>

      <div className="relative text-text-primary">
        {/* Main Content - Split Layout */}
        <div className="flex h-[100vh]">
          <NotesList
            notes={notes}
            selectedNote={selectedNote}
            viewMode={viewMode}
            searchQuery={searchQuery}
            showSearch={showSearch}
            showSortOptions={showSortOptions}
            sortField={sortField}
            sortDirection={sortDirection}
            isLoading={isLoading}
            onNoteClick={handleNoteClick}
            onNewNote={handleNewNote}
            onSearchChange={setSearchQuery}
            onSearchToggle={() => setShowSearch(!showSearch)}
            onSortToggle={() => setShowSortOptions(!showSortOptions)}
            onSortFieldChange={setSortField}
            onSortDirectionChange={setSortDirection}
            onViewModeToggle={() =>
              setViewMode(viewMode === 'kanban' ? 'list' : 'kanban')
            }
          />

          <NoteForm
            selectedNote={selectedNote}
            isEditing={isEditing}
            title={title}
            content={content}
            error={error}
            success={success}
            isSaving={isSaving}
            onTitleChange={handleTitleChange}
            onContentChange={handleContentChange}
            onTitleSave={handleTitleSave}
            onContentSave={handleContentSave}
            onNewNote={handleNewNote}
          />
        </div>

        {/* Floating user menu (logout) */}
        <div className="fixed bottom-6 right-6 z-[1050]">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((open) => !open)}
            className="rounded-full bg-surface shadow-xl border border-border px-4 py-3 text-sm font-medium text-text-primary hover:bg-surface-elevated transition-colors"
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
          >
            Menu
          </button>

          {isUserMenuOpen && (
            <div className="mt-3 bg-surface border border-border rounded-2xl shadow-xl py-3 px-4 min-w-[160px]">
              <p className="text-xs text-text-tertiary mb-2">Account</p>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
