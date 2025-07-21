import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const returnTo = typeof req.query.state === 'string' ? req.query.state : '/dashboard';
    const origin = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  const redirectUri = `${origin}/api/github-callback`;

  if (!code) {
    return res.status(400).send('Missing GitHub authorization code');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

if (!data.access_token) {
  console.error('GitHub OAuth error details:', data);
  return res
    .status(400)
    .json({ message: 'GitHub token exchange failed', details: data });
}


  res.redirect(returnTo);
}
