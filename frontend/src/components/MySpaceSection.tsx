'use client';

interface Task {
  id: string;
  title: string;
  tenantId: string;
  creator?: { email: string };
  assignee?: { email: string };
  dueDate?: string;
}

interface MySpaceSectionProps {
  tasks: Task[];
  userEmail?: string;
}

export default function MySpaceSection({ tasks, userEmail }: MySpaceSectionProps) {
  if (!userEmail) {
    return <p className="text-gray-600">You must be logged in to view your tasks.</p>;
  }

  const assignedTasks = tasks.filter(
    (task) => task.assignee?.email === userEmail
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Assigned Tasks</h2>
      <p className="text-gray-600 mb-4">
        You have {assignedTasks.length} task{assignedTasks.length !== 1 ? 's' : ''} assigned to you.
      </p>

      {assignedTasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to yu.</p>
      ) : (
        <ul className="space-y-2">
          {assignedTasks.map((task) => (
            <li key={task.id} className="p-3 border rounded shadow-sm">
              <p className="font-medium">{task.title}</p>
              {task.dueDate && (
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <p className="text-sm text-gray-400">
                Created by: {task.creator?.email || 'Unknown'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
