'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import TaskComments from './TaskComments';
import { useSession } from 'next-auth/react';


interface Task {
  id?: string;
  title: string;
  tenantId: string;
  creator?: { email: string };
  assignees?: { email: string }[];
  dueDate?: string;
  status?: 'to_do' | 'in_progress' | 'done';
}

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

}

const STATUS_CYCLE: Task['status'][] = ['to_do', 'in_progress', 'done'];

const getNextStatus = (current: Task['status']): Task['status'] => {
  const index = STATUS_CYCLE.indexOf(current ?? 'to_do');
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
};

export default function TaskList({ tasks, renderTaskExtras, userEmail, onStatusChange }: TaskListProps) {
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

  return (
    <ul className="space-y-4 p-4 max-w-2xl mx-auto">
      {tasks.map((task) => (
        <motion.li
          key={task.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-black border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="font-serif text-2xl text-white mb-2 tracking-tight">{task.title}</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-300">
              <span className="font-semibold text-gold-400">Assignee:</span>{' '}
              {task.assignees && task.assignees.length > 0 ? task.assignees.map(a => a.email).join(', ') : 'Unassigned'}
            </p>
              <p className="text-gray-300">
                <span className="font-semibold text-gold-400">Status:</span>{' '}
                {(!task.assignees || task.assignees.some(a => a.email === userEmail)) ? (
                  <span
                    onClick={async () => {
                      const nextStatus = getNextStatus(task.status ?? 'to_do');

                      const res = await fetch('/api/update-task-status', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ taskId: task.id, status: nextStatus }),
                      });

                      if (res.ok) {
                        if (onStatusChange) {
                          onStatusChange(task.id!, nextStatus);
                          }
                      } else {
                        alert('Failed to update status');
                      }
                    }}
                    className={`ml-2 cursor-pointer underline ${
                      task.status === 'done'
                        ? 'text-green-400'
                        : task.status === 'in_progress'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                    title="Click to change status"
                  >
                    {task.status}
                  </span>
                ) : (
                  <span
                    className={`ml-2 ${
                      task.status === 'done'
                        ? 'text-green-400'
                        : task.status === 'in_progress'
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {task.status}
                  </span>
                )}
              </p>
            <p className="text-gray-300">
              <span className="font-semibold text-gold-400">Due:</span>{' '}
              {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'N/A'}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-gold-400">Created by:</span>{' '}
              {task.creator?.email ?? 'Unknown'}
            </p>
          </div>
              {renderTaskExtras && (
             <div className="mt-2">
               {renderTaskExtras(task)}
              </div>
              )}
          <TaskComments taskId={task.id!}/>
        </motion.li>
      ))}
    </ul>
  );
}