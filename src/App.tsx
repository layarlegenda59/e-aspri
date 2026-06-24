import * as React from 'react';
import { useAuth } from './hooks/useAuth';
import { useAIChat } from './hooks/useAIChat';
import { AppLayout } from './components/AppLayout';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

// Pages
import { Auth } from './pages/Auth';
import { Index } from './pages/Index';
import { Chat } from './pages/Chat';
import { DraftPage } from './pages/Draft';
import { Knowledge } from './pages/Knowledge';
import { TaskPage } from './pages/Task';
import { Meeting } from './pages/Meeting';
import { Notfound } from './pages/Notfound';

// Initial Mock Constants & Types
import { 
  INITIAL_TASKS, 
  INITIAL_DRAFTS, 
  INITIAL_PUSTAKA_FILES, 
  INITIAL_MEETINGS 
} from './constants/mockData';
import { Task, Draft, PustakaFile, MeetingDoc } from './types';

export default function App() {
  const { user, error: authError, loading: authLoading, login, logout } = useAuth();
  
  // Active page router state
  const [activePage, setActivePage] = React.useState('dashboard');
  
  // Pending command pipeline to obrolan
  const [pendingCommand, setPendingCommand] = React.useState<string | null>(null);



  // App core persistent states (PWA LocalStorage cache simulation)
  const [tasks, setTasks] = React.useState<Task[]>(() => {
    const saved = localStorage.getItem('e_aspri_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [drafts, setDrafts] = React.useState<Draft[]>(() => {
    const saved = localStorage.getItem('e_aspri_drafts');
    return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
  });

  const [files, setFiles] = React.useState<PustakaFile[]>(() => {
    const saved = localStorage.getItem('e_aspri_files');
    return saved ? JSON.parse(saved) : INITIAL_PUSTAKA_FILES;
  });

  const [meetings, setMeetings] = React.useState<MeetingDoc[]>(() => {
    const saved = localStorage.getItem('e_aspri_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  // Sync state to local storage
  React.useEffect(() => {
    localStorage.setItem('e_aspri_tasks', JSON.stringify(tasks));
  }, [tasks]);

  React.useEffect(() => {
    localStorage.setItem('e_aspri_drafts', JSON.stringify(drafts));
  }, [drafts]);

  React.useEffect(() => {
    localStorage.setItem('e_aspri_files', JSON.stringify(files));
  }, [files]);

  React.useEffect(() => {
    localStorage.setItem('e_aspri_meetings', JSON.stringify(meetings));
  }, [meetings]);

  // Save new draft callback (e.g. from chat bot generation)
  const handleSaveNewDraft = (title: string, content: string, category = 'Lainnya') => {
    const newDraft: Draft = {
      id: 'd_' + Math.random().toString(36).substring(7),
      title,
      category,
      content,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  // AI chat custom hook
  const { 
    messages, 
    isTyping, 
    handleSendMessage, 
    handleExecuteCommand 
  } = useAIChat((newDraftData) => {
    handleSaveNewDraft(newDraftData.title, newDraftData.content, newDraftData.category);
  }, files);

  // Task Operations
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      id: 't_' + Math.random().toString(36).substring(7),
      completed: false,
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Batch insert tasks (from meeting action items)
  const handleAddMultipleTasks = (taskTitles: string[]) => {
    const newTasks: Task[] = taskTitles.map(title => ({
      id: 't_' + Math.random().toString(36).substring(7),
      title,
      completed: false,
      priority: 'sedang',
      dueDate: '3 hari kerja',
      category: 'Rapat'
    }));
    setTasks(prev => [...newTasks, ...prev]);
  };

  // Draft Operations
  const handleUpdateDraft = (id: string, title: string, content: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, title, content, lastModified: new Date().toISOString() } : d));
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  // File Operations
  const handleUploadFile = (fileData: Omit<PustakaFile, 'id' | 'uploadDate'>) => {
    const newFile: PustakaFile = {
      id: 'f_' + Math.random().toString(36).substring(7),
      uploadDate: new Date().toISOString().split('T')[0],
      ...fileData
    };
    setFiles(prev => [newFile, ...prev]);
  };

  // Meeting Operations
  const handleAddMeeting = (newMeeting: MeetingDoc) => {
    setMeetings(prev => [newMeeting, ...prev]);
  };

  // Triggers quick command redirect from outside page
  const handleTriggerQuickCommand = (cmd: string, initialValues: Record<string, string> = {}) => {
    setPendingCommand(cmd);
    setActivePage('chat');
  };

  // Router selector mapping
  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Index 
            user={user}
            tasks={tasks}
            drafts={drafts}
            meetings={meetings}
            setActivePage={setActivePage}
            onTriggerChatCommand={(cmd) => handleTriggerQuickCommand(cmd)}
          />
        );
      case 'chat':
        return (
          <Chat
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onExecuteCommand={handleExecuteCommand}
            onSaveDraft={(title, content) => handleSaveNewDraft(title, content, 'Chat')}
            pendingCommand={pendingCommand}
            clearPendingCommand={() => setPendingCommand(null)}
          />
        );
      case 'draft':
        return (
          <DraftPage
            drafts={drafts}
            onUpdateDraft={handleUpdateDraft}
            onDeleteDraft={handleDeleteDraft}
          />
        );
      case 'meeting':
        return (
          <Meeting
            meetings={meetings}
            onAddMeeting={handleAddMeeting}
            onAddTasks={handleAddMultipleTasks}
            onSaveDraft={(title, content) => handleSaveNewDraft(title, content, 'Rapat')}
          />
        );
      case 'task':
        return (
          <TaskPage
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'knowledge':
        return (
          <Knowledge
            files={files}
            onUploadFile={handleUploadFile}
            setActivePage={setActivePage}
            onTriggerChatCommand={handleTriggerQuickCommand}
          />
        );
      default:
        return <Notfound setActivePage={setActivePage} />;
    }
  };

  // Render Auth screen if session is empty
  if (!user) {
    return (
      <>
        <Auth 
          onLogin={login} 
          error={authError} 
          loading={authLoading} 
        />
        <PWAInstallPrompt />
      </>
    );
  }

  return (
    <>
      <AppLayout
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
        onLogout={logout}
      >
        {renderActivePage()}
      </AppLayout>
      <PWAInstallPrompt />
    </>
  );
}
