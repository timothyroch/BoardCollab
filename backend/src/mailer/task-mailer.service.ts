import * as nodemailer from 'nodemailer';

export class TaskMailer {
  static async sendTaskAssignmentEmail(
    to: string,
    taskTitle: string,
    groupName: string,
    assignerName: string,
    link: string,
    issues?: { repo: string; issueNumber: number; issueTitle: string }[]
  ) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const issuesSection = issues && issues.length > 0
      ? `
        <div class="mt-6">
          <h4 class="text-lg font-semibold text-gray-800">Linked GitHub Issues</h4>
          <ul class="mt-2 space-y-2">
            ${issues.map(issue =>
              `<li class="text-gray-600"><span class="font-medium text-gray-800">${issue.repo} #${issue.issueNumber}</span> - ${issue.issueTitle}</li>`
            ).join('')}
          </ul>
        </div>
      `
      : '';

    const mailOptions = {
      from: `"${assignerName} via Workspace" <${process.env.GMAIL_USER}>`,
      to,
      subject: `New Task Assigned in ${groupName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Task Assignment</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media (prefers-color-scheme: dark) {
              .bg-white { background-color: #1f2937; }
              .text-gray-800 { color: #f3f4f6; }
              .text-gray-600 { color: #d1d5db; }
              .bg-blue-600 { background-color: #2563eb; }
              .bg-gray-100 { background-color: #374151; }
              .text-blue-600 { color: #60a5fa; }
            }
            .animate-pulse-slow {
              animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
          </style>
        </head>
        <body class="bg-gray-100 font-sans">
          <div class="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-gray-800">New Task Assignment</h1>
              <p class="mt-2 text-gray-600">You’ve got a new task to tackle!</p>
            </div>
            <div class="mt-6 p-4 bg-gray-50 rounded-md">
              <h2 class="text-xl font-semibold text-gray-800">${taskTitle}</h2>
              <p class="mt-2 text-gray-600">In group: <span class="font-medium">${groupName}</span></p>
              <p class="mt-1 text-gray-600">Assigned by: <span class="font-medium">${assignerName}</span></p>
            </div>
            ${issuesSection}
            <div class="mt-6 text-center">
              <a href="${link}" class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 animate-pulse-slow">View Task</a>
            </div>
            <div class="mt-6 text-center text-sm text-gray-600">
              <p>Workspace Notification</p>
              <p class="mt-1">This is an automated email, please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Assignment email sent to ${to}:`, info.response);
    } catch (error) {
      console.error('Failed to send task assignment email:', error);
      throw error;
    }
  }
}