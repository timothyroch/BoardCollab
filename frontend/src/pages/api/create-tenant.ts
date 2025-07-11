import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, userId } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: 'Missing userId or name' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Tenant creation failed' });
  }
}