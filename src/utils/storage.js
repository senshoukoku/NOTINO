const NOTES_KEY = 'notino_notes';
const FOLDERS_KEY = 'notino_folders';

export const getNotes = () => {
  const notes = localStorage.getItem(NOTES_KEY);
  return notes ? JSON.parse(notes) : [];
};

export const saveNotes = (notes) => {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const getFolders = () => {
  const folders = localStorage.getItem(FOLDERS_KEY);
  return folders ? JSON.parse(folders) : [];
};

export const saveFolders = (folders) => {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
};

export const addFolder = (name) => {
  const folders = getFolders();
  const newFolder = { 
    id: Date.now().toString(), 
    name,
    parentId: null,
    icon: 'Folder'
  };
  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
};

export const updateFolder = (id, updates) => {
  const folders = getFolders();
  const index = folders.findIndex(f => f.id === id);
  if (index !== -1) {
    folders[index] = { ...folders[index], ...updates };
    saveFolders(folders);
  }
};

export const deleteFolder = (id) => {
  const folders = getFolders();
  const filtered = folders.filter(f => f.id !== id);
  saveFolders(filtered);
};

export const addNote = (note) => {
  const notes = getNotes();
  const newNote = { 
    ...note, 
    id: Date.now().toString(), 
    timestamp: Date.now(),
    tags: [],
    folderId: null,
    isPinned: false
  };
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

export const updateNote = (id, updates) => {
  const notes = getNotes();
  const index = notes.findIndex(note => note.id === id);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...updates };
    saveNotes(notes);
  }
};

export const deleteNote = (id) => {
  const notes = getNotes();
  const filtered = notes.filter(note => note.id !== id);
  saveNotes(filtered);
};

// Onboarding state management
const ONBOARDING_KEY = 'notino_hasSeenOnboarding';

export const getOnboardingStatus = () => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const setOnboardingStatus = (seen) => {
  localStorage.setItem(ONBOARDING_KEY, seen.toString());
};