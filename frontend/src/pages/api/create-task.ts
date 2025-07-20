import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { title, tenantId, creatorId, dueDate, assigneeEmails, status = 'to_do' } = req.body;
console.log("title:", title);
console.log("tenantId:", tenantId);
console.log("creatorId:", creatorId);
console.log("dueDate:", dueDate);
console.log("assigneeEmails:", assigneeEmails);
console.log("isArray:", Array.isArray(assigneeEmails));
console.log("length:", assigneeEmails?.length);

  if (!title || !tenantId || !creatorId || !dueDate || !Array.isArray(assigneeEmails) || assigneeEmails.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, tenantId, creatorId, dueDate, assigneeEmails, status }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || 'Failed to create task' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
