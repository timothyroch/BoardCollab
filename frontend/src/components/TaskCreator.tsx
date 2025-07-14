"use client";

import { useState } from "react";
import { format } from "date-fns";
import Input from "./ui/input";
import Button from "./ui/Button";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";

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

    if (!assignee.trim()) {
      setError("Assignee email is required.");
      return;
    }

    const task = {
      title,
      tenantId,
      creatorId: userId,
      dueDate: dueDate.toISOString(),
      assigneeEmail: assignee,
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

  return (
    <div className="border p-4 rounded mb-6 max-w-xl">
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
        <Label htmlFor="assignee">Assignee Email</Label>
        <Input
          id="assignee"
          type="email"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="e.g. teammate@example.com"
        />
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
