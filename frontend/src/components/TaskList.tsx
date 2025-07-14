'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Task {
  id?: string;
  title: string;
  tenantId: string;
  creator?: { email: string };
  assignee?: { email: string };
  dueDate?: string;
}

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
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
              {task.assignee?.email ?? 'Unassigned'}
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
        </motion.li>
      ))}
    </ul>
  );
}