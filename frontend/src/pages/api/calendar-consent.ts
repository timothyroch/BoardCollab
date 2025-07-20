import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenantId = req.query.tenantId as string;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_URL || 'http://localhost:3000'}/api/calendar-consent/callback`;

  if (!tenantId) return res.status(400).send('Missing tenantId');
  if (!clientId || !clientSecret) return res.status(500).send('Missing Google client credentials');

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    state: tenantId, 
  });

  res.redirect(authUrl);
}
