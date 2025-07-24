import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;

  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/github/repos?userId=${userId}`);

    const data = await response.json();
    return res.status(response.ok ? 200 : 500).json(data);
  } catch (err) {
    console.error('Error fetching GitHub repos:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
