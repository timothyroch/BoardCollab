import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { taskId, status } = req.body;

  if (!taskId || !status) {
    return res.status(400).json({ message: 'Missing taskId or status' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json(error);
    }

    return res.status(200).json({ message: 'Status updated' });
  } catch (err) {
    console.error('Failed to update task status:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}