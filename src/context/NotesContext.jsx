import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const NotesContext = createContext({});

export const useNotes = () => useContext(NotesContext);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchNotes();
    } else {
      setNotes([]);
      setLoading(false);
    }
  }, [user?.id]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('id, user_id, title, color, is_pinned, is_archived, is_trashed, created_at, updated_at') // Excluimos 'content' temporalmente
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNote = async ({ title, content, color = 'bg-white' }) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: user.id,
            title,
            content,
            color,
            is_pinned: false,
            is_archived: false,
            is_trashed: false,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNotes([data, ...notes]);
      }
      return data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNotes(notes.map((n) => (n.id === id ? data : n)));
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
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const changeColor = (id, color) => {
    return updateNote(id, { color });
  };

  const value = {
    notes,
    loading,
    fetchNotes,
    addNote,
    updateNote,
    togglePin,
    toggleArchive,
    moveToTrash,
    restoreFromTrash,
    deleteNotePermanently,
    changeColor
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
