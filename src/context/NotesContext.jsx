/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const NotesContext = createContext({});
const NOTE_SELECT =
  'id, user_id, title, content, color, is_pinned, is_archived, is_trashed, labels, reminder_at, created_at, updated_at';
const NOTE_SELECT_FALLBACK =
  'id, user_id, title, content, color, is_pinned, is_archived, is_trashed, created_at, updated_at';

const normalizeLabels = (labels = []) => {
  if (!Array.isArray(labels)) return [];

  return [...new Set(
    labels
      .map((label) => String(label).replace(/^#/, '').trim())
      .filter(Boolean)
  )];
};

const normalizeNote = (note) => ({
  ...note,
  content: note.content || '',
  labels: normalizeLabels(note.labels),
  reminder_at: note.reminder_at || null,
});

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getMetadataKey = (userId) => `fikanotes-note-metadata-${userId}`;

const readLocalMetadata = (userId) => {
  if (!userId) return {};

  try {
    return JSON.parse(localStorage.getItem(getMetadataKey(userId)) || '{}');
  } catch {
    return {};
  }
};

const writeLocalMetadata = (userId, metadata) => {
  if (!userId) return;
  localStorage.setItem(getMetadataKey(userId), JSON.stringify(metadata));
};

const mergeLocalMetadata = (sourceNotes, userId) => {
  const metadata = readLocalMetadata(userId);

  return sourceNotes.map((note) => normalizeNote({
    ...note,
    labels: metadata[note.id]?.labels ?? note.labels,
    reminder_at: metadata[note.id]?.reminder_at ?? note.reminder_at,
  }));
};

export const useNotes = () => useContext(NotesContext);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [supportsMetadata, setSupportsMetadata] = useState(true);

  async function fetchNotes() {
    try {
      setLoading(true);
      let metadataSupported = true;
      let { data, error } = await supabase
        .from('notes')
        .select(NOTE_SELECT)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error && /labels|reminder_at|schema cache/i.test(error.message || '')) {
        console.warn('Faltan columnas de etiquetas/recordatorios. Usando modo compatible.', error);
        metadataSupported = false;
        setSupportsMetadata(false);

        const fallback = await supabase
          .from('notes')
          .select(NOTE_SELECT_FALLBACK)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        data = fallback.data;
        error = fallback.error;
      }

      if (error) throw error;
      if (data) {
        setSupportsMetadata(metadataSupported);
        const normalizedNotes = metadataSupported
          ? data.map(normalizeNote)
          : mergeLocalMetadata(data, user.id);

        setNotes(normalizedNotes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchNotes();
    } else {
      queueMicrotask(() => {
        setNotes([]);
        setLoading(false);
      });
    }
  }, [user?.id]);

  const addNote = async ({ title, content, color = 'bg-white', labels = [], reminder_at = null }) => {
    try {
      const payload = {
        user_id: user.id,
        title,
        content,
        color,
        is_pinned: false,
        is_archived: false,
        is_trashed: false,
      };

      if (supportsMetadata) {
        payload.labels = normalizeLabels(labels);
        payload.reminder_at = reminder_at;
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        const note = normalizeNote({
          ...data,
          labels: supportsMetadata ? data.labels : normalizeLabels(labels),
          reminder_at: supportsMetadata ? data.reminder_at : reminder_at,
        });

        if (!supportsMetadata && (note.labels.length > 0 || note.reminder_at)) {
          const metadata = readLocalMetadata(user.id);
          metadata[note.id] = {
            labels: note.labels,
            reminder_at: note.reminder_at,
          };
          writeLocalMetadata(user.id, metadata);
        }

        setNotes([note, ...notes]);
      }
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const metadataKeys = ['labels', 'reminder_at'];
      const nextUpdates = { ...updates };

      if (!supportsMetadata) {
        metadataKeys.forEach((key) => delete nextUpdates[key]);
      }

      if (Array.isArray(nextUpdates.labels)) {
        nextUpdates.labels = normalizeLabels(nextUpdates.labels);
      }

      const { data, error } = await supabase
        .from('notes')
        .update({ ...nextUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        let updatedNote = normalizeNote(data);

        if (!supportsMetadata) {
          const previousNote = notes.find((note) => note.id === id);
          updatedNote = normalizeNote({
            ...updatedNote,
            labels: updates.labels ?? previousNote?.labels ?? [],
            reminder_at: Object.prototype.hasOwnProperty.call(updates, 'reminder_at')
              ? updates.reminder_at
              : previousNote?.reminder_at ?? null,
          });

          const metadata = readLocalMetadata(user.id);
          metadata[id] = {
            labels: updatedNote.labels,
            reminder_at: updatedNote.reminder_at,
          };
          writeLocalMetadata(user.id, metadata);
        }

        setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      }
      return data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const togglePin = (id, currentPinStatus) => {
    return updateNote(id, { is_pinned: !currentPinStatus });
  };

  const toggleArchive = (id, currentArchiveStatus) => {
    return updateNote(id, { is_archived: !currentArchiveStatus, is_pinned: false }); // Unpin when archiving
  };

  const moveToTrash = (id) => {
    return updateNote(id, { is_trashed: true, is_pinned: false }); // Unpin when trashing
  };

  const restoreFromTrash = (id) => {
    return updateNote(id, { is_trashed: false });
  };

  const deleteNotePermanently = async (id) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      if (!supportsMetadata) {
        const metadata = readLocalMetadata(user.id);
        delete metadata[id];
        writeLocalMetadata(user.id, metadata);
      }
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const changeColor = (id, color) => {
    return updateNote(id, { color });
  };

  const toggleLabel = (noteId, label) => {
    const note = notes.find((item) => item.id === noteId);
    if (!note) return Promise.resolve();

    const cleanLabel = normalizeLabels([label])[0];
    if (!cleanLabel) return Promise.resolve();

    const hasLabel = note.labels.includes(cleanLabel);
    const labels = hasLabel
      ? note.labels.filter((item) => item !== cleanLabel)
      : [...note.labels, cleanLabel];

    return updateNote(noteId, { labels });
  };

  const setReminder = (noteId, reminderAt) => {
    return updateNote(noteId, { reminder_at: reminderAt || null });
  };

  const clearReminder = (noteId) => {
    return updateNote(noteId, { reminder_at: null });
  };

  const filteredBySearch = (sourceNotes) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sourceNotes;

    return sourceNotes.filter((note) => {
      const title = (note.title || '').toLowerCase();
      const content = stripHtml(note.content || '').toLowerCase();
      return title.includes(query) || content.includes(query);
    });
  };

  const allLabels = [...new Set(notes.flatMap((note) => note.labels || []))]
    .sort((a, b) => a.localeCompare(b));

  const value = {
    notes,
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    supportsMetadata,
    allLabels,
    normalizeLabels,
    filteredBySearch,
    fetchNotes,
    addNote,
    updateNote,
    togglePin,
    toggleArchive,
    moveToTrash,
    restoreFromTrash,
    deleteNotePermanently,
    changeColor,
    toggleLabel,
    setReminder,
    clearReminder,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
