'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import TaskComments from './TaskComments';
import { Task } from '../../types/task';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';


interface Comment {
  id: string;
  content: string;
  user: { email: string };
  created_at: string;
}


interface TaskListProps {
  tasks: Task[];
  userId?: string;
  userEmail?: string;
  renderTaskExtras?: (task: Task) => React.ReactNode;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onDeleteTask?: (taskId: string) => void;

}

const STATUS_CYCLE: Task['status'][] = ['to_do', 'in_progress', 'done'];



export default function TaskList({ tasks, renderTaskExtras, userEmail, userId, onStatusChange, onDeleteTask = () => {}  }: TaskListProps) {
  const { data: session } = useSession();
  
const currentUserId = session?.user?.userId;

  const getNextStatus = (current: Task['status']): Task['status'] => {
  const index = STATUS_CYCLE.indexOf(current ?? 'to_do');
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
};
  if (!tasks.length) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gray-400 text-center font-serif text-xl"
      >
        No tasks available.
      </motion.p>
    );
  }

const handleStatusChange = async (task: Task) => {
  const nextStatus = getNextStatus(task.status ?? 'to_do');
  const res = await fetch('/api/update-task-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId: task.id, status: nextStatus }),
  });

  if (res.ok) {
    if (onStatusChange) {
      onStatusChange(task.id, nextStatus);
    }
  } else {
    alert('Failed to update status');
  }
};



  return (
    <ul className="space-y-4 p-4 max-w-2xl mx-auto">
      {tasks.map((task) => (
        <motion.li
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="
            p-6 bg-neutral-900 border border-white/20 rounded-2xl shadow-xl
            hover:shadow-2xl transition-all duration-300 hover:bg-neutral-800/80
          "
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <h3
                className="
                  font-serif text-2xl font-bold text-white tracking-tight
                  [text-shadow:0_1px_2px_rgba(255,255,255,0.2)]
                "
              >
                {task.title}
              </h3>
              {task.creator?.id && (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="
                    text-sm font-semibold text-red-400 hover:text-red-300
                    transition-colors duration-200 flex items-center gap-1
                  "
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Delete
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  {task.assignees && task.assignees.length > 0
                    ? task.assignees.map((a) => a.email).join(', ')
                    : 'Unassigned'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {(!task.assignees || task.assignees.some((a) => a.email === userEmail)) ? (
                  <span
                    onClick={() => handleStatusChange(task)}
                    className={`
                      cursor-pointer font-medium px-3 py-1 rounded-lg
                      transition-all duration-300 hover:scale-105
                      ${
                        task.status === 'done'
                          ? 'text-gray-900 bg-green-400 hover:bg-green-300'
                          : task.status === 'in_progress'
                          ? 'text-black bg-white hover:bg-gray-100'
                          : 'text-gray-900 bg-gray-400 hover:bg-gray-300'
                      }
                    `}
                    title="Click to change status"
                  >
                    {task.status?.replace('_', ' ') ?? 'To Do'}
                  </span>
                ) : (
                  <span
                    className={`
                      font-medium px-3 py-1 rounded-lg
                      ${
                        task.status === 'done'
                          ? 'text-gray-900 bg-green-400'
                          : task.status === 'in_progress'
                          ? 'text-black bg-white'
                          : 'text-gray-900 bg-gray-400'
                      }
                    `}
                  >
                    {task.status?.replace('_', ' ') ?? 'To Do'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'N/A'}</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{task.creator?.email ?? 'Unknown'}</span>
              </div>
            </div>

            {task.issues && task.issues.length > 0 && (
              <div className="mt-6 border-t border-white/20 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <p className="font-semibold text-white text-sm">Linked GitHub Issues</p>
                </div>
                <ul className="space-y-3">
                  {task.issues.map((issue) => (
                    <li key={issue.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <a
                        href={`https://github.com/${issue.github_repo}/issues/${issue.github_issue_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          text-white hover:text-gray-200
                          transition-colors duration-200 text-sm
                        "
                      >
                        {issue.github_repo} #{issue.github_issue_number} - {issue.github_issue_title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {renderTaskExtras && (
              <div className="mt-6 border-t border-white/20 pt-4">
                {renderTaskExtras(task)}
              </div>
            )}

            <div className="mt-6 border-t border-white/20 pt-4">
              <TaskComments taskId={task.id!} />
            </div>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}