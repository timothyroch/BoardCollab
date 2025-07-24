import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string;
  const returnTo = req.query.returnTo as string || '/dashboard';
  if (!userId) return res.status(400).send('Missing userId');
  const { origin } = new URL(req.headers.referer || 'http://localhost:3000');
  const redirectUri = encodeURIComponent(`${origin}/api/github-callback`);
  const state = encodeURIComponent(JSON.stringify({ userId, returnTo }));

  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${state}&` +
    `scope=repo`;

  res.redirect(githubAuthUrl);
}