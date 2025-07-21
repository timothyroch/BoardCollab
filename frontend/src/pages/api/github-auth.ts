import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { origin } = new URL(req.headers.referer || 'http://localhost:3000');
  const redirectUri = encodeURIComponent(`${origin}/api/github-callback`);
  const returnTo = encodeURIComponent(req.headers.referer || '/dashboard');

  const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${process.env.GITHUB_CLIENT_ID}&` +
    `redirect_uri=${redirectUri}&` +
    `state=${returnTo}&` +
    `scope=repo`;

  res.redirect(githubAuthUrl);
}