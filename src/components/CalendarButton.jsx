import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Modal from './Modal';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export default function CalendarButton({ note, isMobile }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let authInstance;
    const initGapi = async () => {
      await new Promise((resolve) => {
        window.gapi.load('client:auth2', resolve);
      });

      await window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });

      authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      }
    };

    if (window.gapi) {
      initGapi();
    } else {
      window.addEventListener('load', initGapi);
    }

    return () => {
      if (authInstance) {
        authInstance.isSignedIn.removeListener(setIsSignedIn);
      }
      window.removeEventListener('load', initGapi);
    };
  }, []);

  const handleSignIn = () => {
    const auth = window.gapi?.auth2?.getAuthInstance();
    if (auth) auth.signIn();
  };

  const handleSync = async () => {
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      const event = {
        summary: note.title || 'Untitled Note',
        description: note.body || '',
        start: {
          dateTime: new Date().toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes later
          timeZone: 'UTC',
        },
      };

      await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      setModal({
        title: 'Success',
        message: 'Note successfully synced to your Google Calendar!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error syncing to calendar:', error);
      setModal({
        title: 'Sync Failed',
        message: 'Could not add event to your calendar. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isSignedIn ? (
        <button
          onClick={handleSignIn}
          className="btn-google"
          aria-label={isMobile ? "Sign in to Google" : undefined}
        >
          <Calendar size={16} className={isMobile ? "" : "mr-2"} />
          {!isMobile && "Sign in to Google"}
        </button>
      ) : (
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="btn-sync"
          aria-label={isMobile ? "Sync to calendar" : undefined}
        >
          <Calendar size={16} className={isMobile ? "" : "mr-2"} />
          {!isMobile && (isLoading ? 'Syncing...' : 'Sync to Calendar')}
        </button>
      )}
      <Modal isOpen={!!modal} onClose={() => setModal(null)} {...modal} />
    </>
  );
}