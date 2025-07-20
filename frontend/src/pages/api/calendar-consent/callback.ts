import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const tenantId = req.query.state as string; 
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_URL || 'http://localhost:3000'}/api/calendar-consent/callback`;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);


    res.redirect(`/dashboard/${tenantId}`);
  } catch (err) {
    console.error('Calendar consent failed:', err);
    res.status(500).send('Authorization failed');
  }
}
