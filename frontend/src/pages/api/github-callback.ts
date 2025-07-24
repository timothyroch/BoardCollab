import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  const rawState = req.query.state as string;

  if (!code || !rawState) {
    return res.status(400).send('Missing GitHub authorization code');
  }
    let state: { userId: string; returnTo: string };
  try {
    state = JSON.parse(decodeURIComponent(rawState));
  } catch (e) {
    return res.status(400).send('Invalid state');
  }

  const { userId, returnTo } = state;

  const origin = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
  const redirectUri = `${origin}/api/github-callback`;

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
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/save-github-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      githubAccessToken: data.access_token,
      tokenType: data.token_type,
      scope: data.scope,
    }),
  });

  res.redirect(returnTo);
}
