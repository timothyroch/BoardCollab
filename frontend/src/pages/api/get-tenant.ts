import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid tenantId' });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/${tenantId}`);
    const data = await backendRes.json();

    if (!backendRes.ok) {
      return res.status(backendRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch tenant from backend' });
  }
}
