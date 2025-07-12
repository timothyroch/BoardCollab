import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, tenantId, inviterId } = req.body;

  if (!email || !tenantId || !inviterId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tenantId, inviterId }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send invite' });
  }
}
