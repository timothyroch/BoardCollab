'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import TaskCreator from './TaskCreator';
import TaskList from './TaskList';
import { Task } from '../../types/task';
import { Github } from 'lucide-react';



interface GroupSectionProps {
  tenantId: string;
  userId?: string;
  tasks: Task[];
  userEmail?: string;
  onTaskCreated: (task: Task) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function GroupSection({ tenantId, userEmail, tasks, setTasks }: GroupSectionProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showTaskCreator, setShowTaskCreator] = useState(false);
  const calendarRef = useRef<any>(null);  
const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
  setTasks(prev =>
    prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
  );

  const res = await fetch('/api/update-task-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, status: newStatus }),
  });

  if (!res.ok) {
    alert('Failed to update status');
  }
};
const handleGithubSync = () => {
  const userId = session?.user.userId;
  if (!userId) return alert('User ID missing');
  const returnTo = encodeURIComponent(window.location.href);
  const githubAuthUrl = `/api/github-auth?userId=${userId}&returnTo=${returnTo}`;
  window.location.href = githubAuthUrl;
};


  const handleDelete = async (taskId: string) => {
  const confirmed = confirm('Are you sure you want to delete this task?');
  if (!confirmed) return;

  const res = await fetch('/api/delete-task', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId }),
  });

  if (res.ok) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const eventToRemove = calendarApi.getEvents().find((event: any) => event.id === taskId);
      if (eventToRemove) {
        eventToRemove.remove();  
      }
    }

    alert('Task deleted');
  } else {
    const data = await res.json();
    alert(data.message || 'Failed to delete task');
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto relative">
      <div className="flex justify-between items-center mb-8">

      <h2 className="text-3xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(255,255,255,0.3)]">Group Tasks</h2>
      <div className="flex space-x-4">
          <button
            onClick={handleGithubSync}
            className="
              inline-flex items-center px-4 py-2.5 text-sm font-semibold
              text-white bg-gray-800/50 border border-white/30 rounded-xl
              hover:bg-white/10 hover:text-white hover:border-white/50
              transition-all duration-300 ease-in-out transform hover:scale-105
            "
          >
            <Github className="mr-2 h-4 w-4" />
            Sync GitHub
          </button>
          <button
            onClick={() => setShowTaskCreator(true)}
            className="
              inline-flex items-center px-4 py-2.5 text-sm font-semibold
              text-black bg-white rounded-xl
              hover:bg-gray-100 hover:shadow-xl
              transition-all duration-300 ease-in-out transform hover:scale-105
            "
          >
            Create Task
          </button>
        </div>
      </div>

      {showTaskCreator && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto py-8 transition-opacity duration-300">
          <div
            className="
              bg-neutral-950 p-8 rounded-2xl shadow-2xl max-w-2xl w-full
              border border-white/20 transform transition-all duration-300 scale-100 my-8
            "
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Create New Task</h3>
              <button
                onClick={() => setShowTaskCreator(false)}
                className="text-white/70 hover:text-white/90 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
      <TaskCreator
        tenantId={tenantId}
        userId={session?.user?.userId}
        onTaskCreated={task => {
                setTasks(prev => [...prev, task]);
                setShowTaskCreator(false);
        }}
      />
        </div>
        </div>
      )}
      {loading ? (
        <p className="text-white/60 text-center text-lg animate-pulse">Loading tasks...</p>
      ) : (
        <TaskList
         tasks={tasks}
         userEmail={userEmail} 
         onStatusChange={handleStatusChange}
         onDeleteTask={handleDelete}
         />
      )}
    </div>
  );
}
