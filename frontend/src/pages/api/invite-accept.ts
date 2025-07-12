import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { inviteId, userId } = req.body;

  if (!inviteId || !userId) {
    return res.status(400).json({ message: 'Missing inviteId or userId' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteId, userId }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to accept invite' });
  }
}
