import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { tenantId, userId } = req.body;

  if (!tenantId || typeof tenantId !== 'string' || !userId || typeof userId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid tenantId or userId' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tenants/${tenantId}/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || 'Failed to leave group' });
    }

    return res.status(200).json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
