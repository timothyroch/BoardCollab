import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid tenantId' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks?tenantId=${tenantId}`);
    const text = await backendRes.text(); 
    console.log('Raw backend response:', text);

    const data = JSON.parse(text);

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Failed to fetch tasks from backend:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
