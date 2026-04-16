import { useState, useEffect, forwardRef } from 'react';
import { Save, Trash, Menu, Plus, Tag as TagIcon } from 'lucide-react';
import CalendarButton from './CalendarButton';

const Editor = forwardRef(({ note, onUpdateNote, toggleSidebar, isLoading, isReady, isMobile }, ref) => {
  const [title, setTitle] = useState(note?.title || '');
  const [body, setBody] = useState(note?.body || '');
  const [tags, setTags] = useState(note?.tags || []);
  const [folderId, setFolderId] = useState(note?.folderId || '');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setTitle(note?.title || '');
    setBody(note?.body || '');
    setTags(note?.tags || []);
    setFolderId(note?.folderId || '');
  }, [note]);

  const handleSave = () => {
    if (note) {
      onUpdateNote(note.id, { title, body, tags, folderId, timestamp: Date.now() });
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div ref={ref} className="editor-panel p-12 space-y-8">
        <div className="h-12 w-1/2 skeleton rounded-2xl opacity-20" />
        <div className="space-y-4">
          <div className="h-6 w-full skeleton rounded-xl opacity-10" />
          <div className="h-6 w-full skeleton rounded-xl opacity-10" />
          <div className="h-6 w-3/4 skeleton rounded-xl opacity-10" />
          <div className="h-6 w-full skeleton rounded-xl opacity-10" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div ref={ref} className={`editor-panel empty-editor ${isReady ? 'editor-panel-ready' : ''}`}>
        <button
          onClick={toggleSidebar}
          className="btn-sidebar-toggle btn-action absolute top-10 left-10 z-30"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col items-center">
          <Plus size={64} className="mb-4 text-white opacity-20" />
          <p className="empty-editor-text">Select a note or create a new one to begin writing.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`editor-panel ${isReady ? 'editor-panel-ready' : ''}`}>
      <div className="editor-header">
        <button onClick={toggleSidebar} className="mr-4 btn-sidebar-toggle btn-action" aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="editor-title-input"
          aria-label="Note title"
        />
        <div className="editor-actions">
          <button
            onClick={handleSave}
            className="btn-save"
            aria-label={isMobile ? "Save note" : undefined}
          >
            <Save size={16} className={isMobile ? "" : "mr-2"} />
            {!isMobile && "Save"}
          </button>
          <CalendarButton note={{ ...note, title, body }} isMobile={isMobile} />
        </div>
      </div>
      <textarea
        placeholder="Start writing..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="editor-textarea"
        aria-label="Note content"
      />
    </div>
  );
});

export default Editor;