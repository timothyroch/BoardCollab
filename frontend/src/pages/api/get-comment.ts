import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid taskId' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/comments?taskId=${taskId}`);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ message: errorData.message || 'Failed to fetch comments' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Get comments error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
