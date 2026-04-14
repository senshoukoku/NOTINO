import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Modal from './components/Modal';
import { getNotes, addNote, updateNote, deleteNote, getFolders, addFolder, saveNotes, updateFolder, deleteFolder, saveFolders } from './utils/storage';
import { Menu } from 'lucide-react';

function App() {
  const [notes, setNotes] = useState(getNotes());
  const [folders, setFolders] = useState(getFolders());
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    // This triggers the entrance animation only once on mount
    setIsAppReady(true);
  }, []);

  const appRef = useRef(null);
  const sidebarRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        appRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !editorRef.current.contains(event.target)
      ) {
        setSelectedNoteId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedNoteId]);

  const handleAddFolder = (name) => {
    const folder = addFolder(name);
    setFolders([...folders, folder]);
  };

  const handleReorderNotes = (draggedId, targetId) => {
    const newNotes = [...notes];
    const draggedIndex = newNotes.findIndex(n => n.id === draggedId);
    const targetIndex = newNotes.findIndex(n => n.id === targetId);
    const [removed] = newNotes.splice(draggedIndex, 1);
    newNotes.splice(targetIndex, 0, removed);
    setNotes(newNotes);
    saveNotes(newNotes);
  };

  const handleUpdateFolder = (id, updates) => {
    updateFolder(id, updates);
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleDeleteFolder = (id) => {
    const folder = folders.find(f => f.id === id);
    setModal({
      title: 'Delete Folder',
      message: `Are you sure you want to delete "${folder?.name}"? Notes inside will be moved to "All Notes".`,
      confirmText: 'Delete',
      type: 'error',
      onConfirm: () => {
        deleteFolder(id);
        setFolders(prev => prev.filter(f => f.id !== id));
        const updatedNotes = notes.map(n => n.folderId === id ? { ...n, folderId: null } : n);
        setNotes(updatedNotes);
        saveNotes(updatedNotes);
        setModal(null);
      }
    });
  };

  const handleReorderFolders = (draggedId, targetId, isNesting = false) => {
    if (isNesting) {
      handleUpdateFolder(draggedId, { parentId: targetId });
    } else {
      const newFolders = [...folders];
      const draggedIndex = newFolders.findIndex(f => f.id === draggedId);
      const targetIndex = newFolders.findIndex(f => f.id === targetId);
      const [removed] = newFolders.splice(draggedIndex, 1);
      newFolders.splice(targetIndex, 0, removed);
      setFolders(newFolders);
      saveFolders(newFolders);
    }
  };

  const handleMoveNoteToFolder = (noteId, folderId) => {
    handleUpdateNote(noteId, { folderId });
  };

  const handleTogglePin = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      handleUpdateNote(id, { isPinned: !note.isPinned });
    }
  };

  const handleAddNote = () => {
    const newNote = addNote({ title: '', body: '', folderId: activeFolderId });
    setNotes(prev => [...prev, newNote]);
    setSelectedNoteId(newNote.id);
  };

  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
  };

  const handleUpdateNote = (id, updates) => {
    updateNote(id, updates);
    setNotes(prev => prev.map(note => note.id === id ? { ...note, ...updates } : note));
  };

  const handleDeleteNote = (id) => {
    setModal({
      title: 'Delete Note',
      message: 'Are you sure you want to delete this note? This action cannot be undone.',
      confirmText: 'Delete',
      type: 'error',
      onConfirm: () => {
        deleteNote(id);
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
        setModal(null);
      }
    });
  };

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  return (
    <div ref={appRef} className="app-container">
      {/* Sidebar */}
      <Sidebar
        ref={sidebarRef}
        notes={notes}
        folders={folders}
        selectedNoteId={selectedNoteId}
        activeFolderId={activeFolderId}
        onSelectNote={handleSelectNote}
        onAddNote={handleAddNote}
        onAddFolder={handleAddFolder}
        onUpdateFolder={handleUpdateFolder}
        onDeleteFolder={handleDeleteFolder}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onSelectFolder={setActiveFolderId}
        onReorderNotes={handleReorderNotes}
        onReorderFolders={handleReorderFolders}
        onMoveNoteToFolder={handleMoveNoteToFolder}
        search={search}
        onSearch={setSearch}
        isVisible={showSidebar}
        toggleSidebar={toggleSidebar}
        className={isAppReady ? 'animate-entrance' : ''}
      />

      {/* Main content area */}
      <div
        ref={editorRef}
        className={`editor-wrapper ${isAppReady ? 'animate-entrance' : ''}`}
        style={{ animationDelay: '150ms' }}
      >
        <Editor
          note={selectedNote}
          folders={folders}
          onUpdateNote={handleUpdateNote}
          isReady={isAppReady}
          toggleSidebar={toggleSidebar} /* Pass toggleSidebar to Editor */
        />
      </div>
      <Modal isOpen={!!modal} onClose={() => setModal(null)} {...modal} />
    </div>
  );
}

export default App;
