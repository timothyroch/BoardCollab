import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getSession({ req });
  const email = session?.user?.email;

  if (!email) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Missing invite token" });

  try {
    const resInvite = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/resolve-token?token=${token}`);
    const invite = await resInvite.json();

    if (!resInvite.ok || invite.email !== email) {
      return res.status(400).json({ message: "Invalid or mismatched invite" });
    }

    const acceptRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/invites/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteId: invite.id, userId: session?.user?.userId }),
    });

    if (!acceptRes.ok) {
      const errData = await acceptRes.json();
      return res.status(500).json({ message: "Invite acceptance failed", error: errData });
    }

    return res.status(200).json({ success: true, tenantId: invite.tenant.id });
  } catch (err) {
    return res.status(500).json({ message: "Internal error", error: err });
  }
}
