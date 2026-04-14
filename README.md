# Notino - Modern React Note-Taking App

A minimalist note-taking application built with React, Tailwind CSS, and localStorage persistence. Features Google Calendar integration for syncing notes as events.

## Features

- **Persistent Storage**: Notes are stored in localStorage for immediate persistence. The data layer is designed to easily swap to a database later.
- **Note Management**: Create, edit, delete, and search through notes. Each note has a title, body, and timestamp.
- **Google Calendar Integration**: Sync notes to Google Calendar as 30-minute reminder events using the note title and body.
- **Clean UI**: Notion-style aesthetic with a sidebar for note list and main editor area.
- **Icons**: Uses Lucide React for consistent iconography.

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Lucide React
- Google Identity Services & Google API Client

## Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Google Cloud Console Setup

To enable Google Calendar integration, follow these steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).

2. Create a new project or select an existing one.

3. Enable the Google Calendar API:
   - Navigate to "APIs & Services" > "Library".
   - Search for "Google Calendar API" and enable it.

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials".
   - Click "Create Credentials" > "OAuth 2.0 Client IDs".
   - Choose "Web application" as the application type.
   - Add your development URL (e.g., `http://localhost:5173`) to "Authorized JavaScript origins".
   - Add your redirect URI if needed (for production, add your domain).
   - Note down the Client ID.

5. Get an API Key:
   - In "Credentials", click "Create Credentials" > "API Key".
   - Restrict the API key to the Google Calendar API for security.

6. Update the constants in `src/components/CalendarButton.jsx`:
   ```javascript
   const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```

7. For production, ensure your domain is added to the OAuth consent screen and authorized origins.

## Usage

- Click the "+" button to create a new note.
- Use the search bar to find notes by title or content.
- Edit notes in the main editor area and click "Save".
- Click "Sync to Calendar" to add the note as a Google Calendar event (requires sign-in).

## Project Structure

- `src/App.jsx`: Main application component
- `src/components/Sidebar.jsx`: Note list and search
- `src/components/Editor.jsx`: Note editor with save and calendar sync
- `src/components/CalendarButton.jsx`: Google Calendar integration
- `src/utils/storage.js`: localStorage utilities

## Future Enhancements

- Replace localStorage with a backend database (e.g., Firebase, Supabase).
- Add note categories/tags.
- Implement note sharing.
- Add rich text editing.
