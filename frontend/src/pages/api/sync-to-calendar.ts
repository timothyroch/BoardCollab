import { getToken } from 'next-auth/jwt';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || !token.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { title, dueDate } = req.body;
    const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
    );
    oauth2Client.setCredentials({ access_token: token.accessToken as string});

  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        start: { dateTime: new Date(dueDate).toISOString() },
        end: { dateTime: new Date(new Date(dueDate).getTime() + 60 * 60 * 1000).toISOString() }, // +1 hour
      },
    });
    return res.status(200).json({ message: 'Event added to calendar' });
  } catch (err) {
    console.error('Google Calendar API error:', err);
    return res.status(500).json({ error: 'Failed to add event' });
  }
}
