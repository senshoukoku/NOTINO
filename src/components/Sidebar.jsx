import { forwardRef, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Plus, Search, Folder, Hash, GripVertical, Edit2, Trash2, ChevronRight, ChevronDown, Pin } from 'lucide-react';

const AVAILABLE_ICONS = ['Folder', 'Star', 'Zap', 'Heart', 'Cloud', 'Moon', 'Sun'];

const Sidebar = forwardRef(({ 
  notes, folders, selectedNoteId, activeFolderId, 
  onSelectNote, onAddNote, onAddFolder, onUpdateFolder, onDeleteFolder, onDeleteNote, onTogglePin,
  onSelectFolder, onReorderNotes, onReorderFolders, onMoveNoteToFolder,
  search, onSearch, isVisible, toggleSidebar, className
}, ref) => {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = (note.title || '').toLowerCase().includes(search.toLowerCase()) ||
                           (note.body || '').toLowerCase().includes(search.toLowerCase());
      const matchesFolder = activeFolderId ? note.folderId === activeFolderId : true;
      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      if (a.isPinned === b.isPinned) return b.timestamp - a.timestamp;
      return a.isPinned ? -1 : 1;
    });

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('noteId', id);
  };

  const handleFolderDragStart = (e, id) => {
    e.dataTransfer.setData('folderId', id);
  };

  const handleDrop = (e, targetId) => {
    const draggedId = e.dataTransfer.getData('noteId');
    const draggedFolderId = e.dataTransfer.getData('folderId');
    
    if (draggedId !== targetId) {
      onReorderNotes(draggedId, targetId);
    } else if (draggedFolderId && draggedFolderId !== targetId) {
      onReorderFolders(draggedFolderId, targetId, false);
    }
  };

  const handleFolderDrop = (e, folderId) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('noteId');
    const draggedFolderId = e.dataTransfer.getData('folderId');

    if (noteId) {
      onMoveNoteToFolder(noteId, folderId);
    } else if (draggedFolderId && draggedFolderId !== folderId) {
      onReorderFolders(draggedFolderId, folderId, true);
    }
  };

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const cycleIcon = (id, currentIcon, e) => {
    e.stopPropagation();
    const currentIndex = AVAILABLE_ICONS.indexOf(currentIcon || 'Folder');
    const nextIndex = (currentIndex + 1) % AVAILABLE_ICONS.length;
    onUpdateFolder(id, { icon: AVAILABLE_ICONS[nextIndex] });
  };

  const startRenaming = (folder, e) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
  };

  const saveRename = (id) => {
    onUpdateFolder(id, { name: editingName });
    setEditingFolderId(null);
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders[folder.id];
    const children = folders.filter(f => f.parentId === folder.id);
    const IconComp = LucideIcons[folder.icon || 'Folder'] || Folder;

    return (
      <div key={folder.id} style={{ paddingLeft: level > 0 ? '1rem' : '0' }}>
        <div 
          draggable
          onDragStart={(e) => handleFolderDragStart(e, folder.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleFolderDrop(e, folder.id)}
          onClick={() => onSelectFolder(folder.id)}
          className={`folder-item group ${activeFolderId === folder.id ? 'folder-item-active' : ''}`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {children.length > 0 ? (
              <button onClick={(e) => toggleExpand(folder.id, e)} className="text-white/20 hover:text-white">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <div className="w-[14px]" />}
            
            <button onClick={(e) => cycleIcon(folder.id, folder.icon, e)} className="hover:text-yellow-400 transition-colors">
              <IconComp size={14} />
            </button>

            {editingFolderId === folder.id ? (
              <input 
                autoFocus
                className="bg-white/10 border-none outline-none text-sm text-white w-full rounded px-1"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => saveRename(folder.id)}
                onKeyDown={(e) => e.key === 'Enter' && saveRename(folder.id)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm truncate">{folder.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => startRenaming(folder, e)} className="p-1 hover:text-yellow-400">
              <Edit2 size={12} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }} className="p-1 hover:text-red-400">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {isExpanded && children.map(child => renderFolder(child, level + 1))}
      </div>
    );
  };

  return (
    <div ref={ref}
      className={`sidebar-panel ${isVisible ? 'sidebar-panel-visible' : 'sidebar-panel-hidden'} ${className}`}
    >
      <div className="sidebar-header">
        <div className="flex items-center mb-4">
          <h1 className="sidebar-title">
            Notes
            <span className="note-count">({filteredNotes.length})</span>
          </h1>
          <button
            onClick={onAddNote}
            className="ml-auto btn-sidebar-toggle btn-action"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Folders</span>
          <button onClick={() => setIsAddingFolder(true)} className="text-white/40 hover:text-yellow-400 transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="space-y-1">
          <div 
            onClick={() => onSelectFolder(null)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleFolderDrop(e, null)}
            className={`folder-item ${!activeFolderId ? 'folder-item-active' : ''}`}
          >
            <Hash size={14} /> <span className="text-sm">All Notes</span>
          </div>
          {folders.filter(f => !f.parentId).map(folder => renderFolder(folder))}
          
          {isAddingFolder && (
            <input 
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
              onBlur={() => setIsAddingFolder(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddFolder(newFolderName);
                  setNewFolderName('');
                  setIsAddingFolder(false);
                }
              }}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
            />
          )}
        </div>
      </div>

      <div className="notes-list pt-2">
        {filteredNotes.map(note => (
          <div
            key={note.id}
            draggable
            onDragStart={(e) => handleDragStart(e, note.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, note.id)}
            onClick={() => onSelectNote(note.id)}
            className={`note-item ${selectedNoteId === note.id ? 'note-item-active' : ''}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="note-item-title">{note.title || 'Untitled'}</h3>
              <div className={`flex items-center gap-1 transition-opacity ${note.isPinned ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
                  className={`p-1 transition-colors ${note.isPinned ? 'text-yellow-400' : 'hover:text-yellow-400'}`}
                >
                  <Pin size={14} fill={note.isPinned ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
                  className="p-1 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                <GripVertical size={14} className="text-white/30 cursor-grab" />
              </div>
            </div>
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {note.tags.map(tag => (
                  <span key={tag} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/40 border border-white/10">#{tag}</span>
                ))}
              </div>
            )}
            <p className="note-item-date">
              {new Date(note.timestamp).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Sidebar;