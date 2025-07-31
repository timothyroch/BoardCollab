"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Input from "./ui/input";
import { Calendar } from "./ui/calendar";
import socket from "../../utils/socket";
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'lucide-react';
import { Fragment } from 'react'

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
  type SelectedIssue = {
  number: number;
  title: string;
} | null;
  const [selectedIssue, setSelectedIssue] = useState<SelectedIssue>(null);


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
      issues: selectedIssue && selectedRepo
    ? [{
        repo: selectedRepo,
        issueNumber: selectedIssue.number,
        issueTitle: selectedIssue.title,
      }]
    : [],
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
    <div className="p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl bg-neutral-950">
      {githubRepos.length > 0 && (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-white mb-2">GitHub Repository</label>

<Listbox value={selectedRepo} onChange={setSelectedRepo}>
  <div className="relative mt-1">
    <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-neutral-900 py-3 pl-4 pr-10 text-left text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30">
      <span className="block truncate">{selectedRepo || '-- Select a repository --'}</span>
      <ChevronDown className="absolute inset-y-0 right-3 h-5 w-5 text-white/50" />
    </Listbox.Button>

    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl !bg-neutral-900 text-white shadow-lg ring-1 ring-white/10 focus:outline-none scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
        {githubRepos.map((repo) => (
          <Listbox.Option
            key={repo.id}
            value={repo.full_name}
            className={({ active }) =>
              `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                active ? 'bg-neutral-800 text-white' : 'text-white'
              }`
            }
          >
            {({ selected }) => (
              <>
                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                  {repo.full_name}
                </span>
                {selected && (
                  <span className="absolute left-3 top-2 text-white">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Transition>
  </div>
</Listbox>


  </div>
)}

{selectedRepo && repoIssues.length > 0 && (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-white mb-2">GitHub Issue</label>
<Listbox value={selectedIssue} onChange={setSelectedIssue}>
  <div className="relative mt-1">
    <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-neutral-900 py-3 pl-4 pr-10 text-left text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30">
      <span className="block truncate">
        {selectedIssue ? `#${selectedIssue.number} - ${selectedIssue.title}` : '-- Select an issue --'}
      </span>
      <ChevronDown className="absolute inset-y-0 right-3 h-5 w-5 text-white/50" />
    </Listbox.Button>
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
  <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl !bg-neutral-900 text-white shadow-lg ring-1 ring-white/10 focus:outline-none scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
        {repoIssues.map((issue) => {
          const value = { number: issue.number, title: issue.title };
          return (
            <Listbox.Option
              key={issue.id}
              value={value}
              className={({ active }) =>
                `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                  active ? 'bg-neutral-800 text-white' : 'text-white'
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                    #{issue.number} - {issue.title}
                  </span>
                  {selected && (
                    <span className="absolute left-3 top-2 text-white">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          );
        })}
      </Listbox.Options>
    </Transition>
  </div>
</Listbox>

  </div>
)}


      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">Task Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design login page"
          className="
            w-full px-4 py-3 text-white bg-neutral-900 border border-white/30 rounded-xl
            focus:border-white focus:ring-2 focus:ring-white/30 focus:outline-none
            transition-all duration-300 placeholder:text-white/50
          "
        />
      </div>

      <div className="mb-6">
        <label htmlFor="assignee" className="block text-sm font-semibold text-white mb-2">Assign To</label>
      <Listbox
        value={selectedAssignees}
        onChange={(value) => setSelectedAssignees(value)}
        multiple
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-neutral-900 py-3 pl-4 pr-10 text-left text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30">
            <span className="block truncate">
              {selectedAssignees.length > 0
                ? selectedAssignees.join(', ')
                : '-- Select assignees --'}
            </span>
            <ChevronDown className="absolute inset-y-0 right-3 h-5 w-5 text-white/50" />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-xl !bg-neutral-900 text-white shadow-lg ring-1 ring-white/10 focus:outline-none scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
              {users.map((user) => (
                <Listbox.Option
                  key={user.id}
                  value={user.email}
                  className={({ active }) =>
                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                      active ? 'bg-neutral-800 text-white' : 'text-white'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {user.email}
                      </span>
                      {selected && (
                        <span className="absolute left-3 top-2 text-white">
                          <Check className="h-4 w-4" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">Due Date</label>
            <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            className="
                bg-neutral-900 border border-white/20 rounded-xl p-4 shadow-2xl
                text-white
                [--calendar-selected-bg:theme(colors.white)]
                [--calendar-selected-text:theme(colors.gray.900)]
              "
            />
        {dueDate && <p className="text-sm mt-1">Selected: {format(dueDate, "PPP")}</p>}
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

      <button onClick={handleSubmit} disabled={submitting || !tenantId} className="
          w-full px-6 py-3 text-sm font-semibold text-gray-900 bg-white rounded-xl
          hover:bg-gray-100 hover:shadow-xl transition-all duration-300 ease-in-out
          transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
        ">
        {submitting ? "Creating..." : "Create Task"}
      </button>
    </div>
  );
}
