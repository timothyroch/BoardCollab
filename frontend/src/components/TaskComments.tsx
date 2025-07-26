import { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/input';
import { Label } from './ui/label';
import socket from '../../utils/socket';
import { ArrowUpIcon } from '@heroicons/react/24/solid';


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
      const handleNewComment = (comment: Comment & { taskId: string; tenantId: string }) => {
    if (comment.taskId === taskId) {
      setComments((prev) => [...prev, comment]);
    }
  };

  socket.on('commentAdded', handleNewComment);

  const tenantId = sessionStorage.getItem('tenantId'); 
  if (tenantId) {
    socket.emit('joinRoom', tenantId);
  }

  return () => {
    socket.off('commentAdded', handleNewComment);
  };
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

      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
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
      <button onClick={handleSubmit} 
  className="
    p-3 rounded-xl bg-transparent text-white border border-white/10
    hover:border-white/20 hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]
    transition-all duration-300 ease-in-out flex items-center justify-center
    shadow-sm transform hover:scale-102 focus:outline-none focus:ring-2 focus:ring-white/15
  "
  title="Post comment"
>
  <ArrowUpIcon className="w-5 h-5" />
      </button>
      </div>
    </div>
  );
}

export default TaskComments;
