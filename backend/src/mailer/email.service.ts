import * as nodemailer from 'nodemailer';

export class MailerService {
  static async sendInviteEmail(
    to: string,
    inviterName: string,
    tenantName: string,
    link: string,
  ) {
    console.log('sendInviteEmail called with:', { to, inviterName, tenantName, link });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
    });

    const mailOptions = {
      from: `"${inviterName} via Workspace" <${process.env.GMAIL_USER}>`,
      to,
      subject: `You're invited to join ${tenantName}`,
      html: `
        <p>${inviterName} invited you to join <strong>${tenantName}</strong>.</p>
        <p><a href="${link}">Click here to join</a></p>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${to}:`, info.response);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
