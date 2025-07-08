'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import socket from "../../../utils/socket";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
        if (session?.user?.tenantId) {
            socket.emit('joinTenant', session.user.tenantId);
        }
}, [status, session, router]);
    useEffect(() => {
        socket.on('taskCreated', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });

        socket.on('taskUpdated', (updatedTask) => {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
        });

        socket.on('taskDeleted', (deletedTaskId) => {
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== deletedTaskId)
            );
        });

        return () => {
            socket.off('taskCreated');
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, []);

    const createTask = () => {
        if (!newTaskTitle) return;

        const task = {
            id: crypto.randomUUID(), // Temporary ID
            title: newTaskTitle,
            tenantId: session?.user?.tenantId,
        };

        socket.emit('createTask', { tenantId: session?.user?.tenantId, task });
        setNewTaskTitle('');
    };


if (status === 'loading') {
    return <div>Loading...</div>;
}
return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome, {session?.user?.name}!</p>    
        <div>
            <h2>Create New Task</h2>      
     <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter new task title"
                />
                <button onClick={createTask}>Add Task</button>
            </div>

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                ))}
            </ul>
        </div>
)
}