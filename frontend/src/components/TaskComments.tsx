import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/input';
import { Label } from './ui/label';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    email: string;
  };
}

interface TaskCommentsProps {
  taskId: string;
}

function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/get-comment?taskId=${taskId}`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/create-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, content: newComment }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const added = await res.json();
      setComments((prev) => [...prev, added]);
      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <Label htmlFor="title">Comments</Label>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="text-sm text-gray-300">
              <span className="font-semibold">{c.user?.email ?? 'Unknown'}:</span> {c.content}
              <span className="ml-2 text-gray-500 text-xs">
                ({new Date(c.created_at).toLocaleString()})
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex gap-2">
        <Input
          id="title"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
        handleSubmit();
      }
    }}
          placeholder="Add a comment..."
        />
      <Button onClick={handleSubmit}>
        Post
      </Button>
      </div>
    </div>
  );
}

export default TaskComments;
