"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Input from "./ui/input";
import Button from "./ui/Button";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import socket from "../../utils/socket";

interface TaskCreatorProps {
  tenantId: string;
  userId?: string;
  onTaskCreated?: (task: any) => void;
}

export default function TaskCreator({ tenantId, userId, onTaskCreated }: TaskCreatorProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [assignee, setAssignee] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<{ id: string; email: string; name?: string }[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [repoIssues, setRepoIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<string>('');


  useEffect(() => {
  if (!tenantId) return;
  fetch(`/api/get-users?tenantId=${tenantId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Unexpected user data:", data);
      }
    })
    .catch(err => console.error("Failed to fetch users:", err));
}, [tenantId]);



  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    if (selectedAssignees.length === 0) {
      setError("At least one assignee is required.");
      return;
    }

    const task = {
      title,
      tenantId,
      creatorId: userId,
      dueDate: dueDate.toISOString(),
      assigneeEmails: selectedAssignees,
    };

    setSubmitting(true);

    try {
      const response = await fetch("/api/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task.");
      }

      setSuccess("Task created successfully.");
      setTitle("");
      setAssignee("");
      setDueDate(undefined);
      onTaskCreated?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
useEffect(() => {
  if (!userId) return;

  fetch(`/api/repos?userId=${userId}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setGithubRepos(data);
      }
    })
    .catch(err => console.error('Failed to fetch GitHub repos', err));
}, [userId]);

useEffect(() => {
  if (!selectedRepo || !userId) return;

  fetch(`/api/github-issues?userId=${userId}&repo=${encodeURIComponent(selectedRepo)}`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setRepoIssues(data);
      }
    })
    .catch(err => console.error('Failed to fetch issues', err));
}, [selectedRepo, userId]);

  return (
    <div className="border p-4 rounded mb-6 max-w-xl">
      {githubRepos.length > 0 && (
  <div className="mb-4">
    <Label>GitHub Repository</Label>
    <select
      value={selectedRepo}
      onChange={(e) => {
        setSelectedRepo(e.target.value);
        setSelectedIssue('');
      }}
      className="border p-2 rounded w-full"
    >
      <option value="">-- Select a repository --</option>
      {githubRepos.map((repo) => (
        <option key={repo.id} value={repo.full_name}>
          {repo.full_name}
        </option>
      ))}
    </select>
  </div>
)}

{selectedRepo && repoIssues.length > 0 && (
  <div className="mb-4">
    <Label>GitHub Issue</Label>
    <select
      value={selectedIssue}
      onChange={(e) => setSelectedIssue(e.target.value)}
      className="border p-2 rounded w-full"
    >
      <option value="">-- Select an issue --</option>
      {repoIssues.map((issue) => (
        <option key={issue.id} value={issue.title}>
          #{issue.number} - {issue.title}
        </option>
      ))}
    </select>
  </div>
)}

      <h2 className="text-xl font-semibold mb-4">Create Task</h2>

      <div className="mb-4">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design login page"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="assignee">Assign To</Label>
            <select
        id="assignees"
        multiple
        value={selectedAssignees}
        onChange={(e) =>
          setSelectedAssignees(Array.from(e.target.selectedOptions, (option) => option.value))
        }
        className="border p-2 rounded w-full h-32"
      >
        {users.map((user) => (
          <option key={user.id} value={user.email}>
            {user.email}
          </option>
        ))}
      </select>
      </div>

      <div className="mb-4">
        <Label>Due Date</Label>
            <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            />
        {dueDate && <p className="text-sm mt-1">Selected: {format(dueDate, "PPP")}</p>}
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <Button onClick={handleSubmit} disabled={submitting || !tenantId}>
        {submitting ? "Creating..." : "Create Task"}
      </Button>
    </div>
  );
}
