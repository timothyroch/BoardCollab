import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = await getToken({ req, secret });

  if (!token || !token.sub) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = token.userId;
  const { taskId, content } = req.body;

  if (!taskId || !content || typeof content !== 'string' || !content.trim()) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, userId, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || 'Failed to post comment' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Create comment error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
