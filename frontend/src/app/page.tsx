'use client';
import Image from "next/image";

const features = [
  {
    title: 'Create Groups',
    description: 'Organize your projects by creating distinct groups for different teams or objectives.',
    image: '/create_group.png',
  },
  {
    title: 'Invite Teammates',
    description: 'Invite your collaborators via email to join your group instantly.',
    image: '/invite.png',
  },
  {
    title: 'Group Task Board',
    description: 'Visualize all your tasks in a group and manage progress collaboratively.',
    image: '/group.png',
  },
  {
    title: 'Create Tasks from GitHub Issues',
    description: 'Import your GitHub issues to create tasks seamlessly within your group.',
    image: '/create_task.png',
  },
  {
    title: 'Sync GitHub Issues',
    description: 'Keep GitHub and GitSync in sync—no manual duplication needed.',
    image: '/sync_github.png',
  },
  {
    title: 'Personal Task View',
    description: 'Visualize your task schedule with our built-in calendar interface.',
    image: '/your_tasks.png',
  },
  {
    title: 'Email Notifications',
    description: 'Get notified when you are assigned new tasks or mentioned by a teammate.',
    image: '/mail.png',
  },
  {
    title: 'Sync to Google Calendar',
    description: 'Push tasks directly to Google Calendar and stay in sync with your schedule.',
    image: '/google_calendar.png',
  },
];

export default function Home() {
  return (
<main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl font-bold mb-6 tracking-tight">
          All-in-One Task Collaboration for Developers
        </h1>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          GitSync centralizes your group task workflows with GitHub integration, calendar sync, email notifications, and a powerful group management system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center gap-6 bg-neutral-900 p-6 rounded-2xl shadow-lg border border-white/10"
          >
            <div className="w-full md:w-1/2">
              <Image
                src={feature.image}
                alt={feature.title}
                width={600}
                height={400}
                className="rounded-xl object-cover w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-white/70">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
