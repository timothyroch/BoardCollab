import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
  const repo = req.query.repo as string;

  if (!userId || !repo) {
    return res.status(400).json({ message: 'Missing userId or repo' });
  }

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/integrations/github/issues?userId=${userId}&repo=${encodeURIComponent(repo)}`
    );

    const data = await backendRes.json();
    return res.status(backendRes.ok ? 200 : 500).json(data);
  } catch (err) {
    console.error('Error fetching GitHub issues:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
