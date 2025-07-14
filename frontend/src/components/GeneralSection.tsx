'use client';

interface GeneralSectionProps {
  tenantId: string;
  inviteEmail: string;
  onInviteEmailChange: (val: string) => void;
  onSendInvite: () => Promise<void>;
  inviteError: string;
  inviteSuccess: string;
}

export default function GeneralSection({
  tenantId,
  inviteEmail,
  onInviteEmailChange,
  onSendInvite,
  inviteError,
  inviteSuccess,
}: GeneralSectionProps) {
  return (
    <div className="border p-4 rounded max-w-md">
      <h3 className="text-lg font-semibold mb-2">Invite User to Workspace</h3>
      <input
        type="email"
        placeholder="Enter user's email"
        className="border p-2 rounded w-full mb-2"
        value={inviteEmail}
        onChange={(e) => onInviteEmailChange(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        onClick={onSendInvite}
      >
        Send Invite
      </button>
      {inviteError && <p className="text-red-600 text-sm mt-2">{inviteError}</p>}
      {inviteSuccess && <p className="text-green-600 text-sm mt-2">{inviteSuccess}</p>}
    </div>
  );
}
