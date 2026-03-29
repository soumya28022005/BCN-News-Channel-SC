import nodemailer from 'nodemailer';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  async sendWelcome(to: string, name: string) {
    await this.send({
      to,
      subject: 'Welcome to BCN - The Bengal Chronicle Network',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C8102E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">BCN</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">The Bengal Chronicle Network</p>
          </div>
          <div style="padding: 30px;">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for joining BCN – your trusted source for news from Bengal, India, and the world.</p>
            <p>Stay informed. Stay ahead.</p>
            <a href="${config.SITE_URL}" 
               style="display: inline-block; background: #C8102E; color: white; 
                      padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
              Read Today's News
            </a>
          </div>
          <div style="background: #f5f5f5; padding: 16px; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} BCN – The Bengal Chronicle Network
          </div>
        </div>
      `,
    });
  }

  async sendNewsletterConfirmation(to: string) {
    await this.send({
      to,
      subject: 'Newsletter Subscription Confirmed – BCN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C8102E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BCN</h1>
          </div>
          <div style="padding: 30px;">
            <h2>You're subscribed! ✅</h2>
            <p>You'll now receive the latest news from BCN directly in your inbox.</p>
            <p>Truth. Speed. Bengal.</p>
          </div>
        </div>
      `,
    });
  }

  async sendPasswordReset(to: string, resetUrl: string) {
    await this.send({
      to,
      subject: 'Password Reset – BCN',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #C8102E; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BCN</h1>
          </div>
          <div style="padding: 30px;">
            <h2>Reset Your Password</h2>
            <p>Click the button below to reset your password. This link expires in 1 hour.</p>
            <a href="${resetUrl}"
               style="display: inline-block; background: #C8102E; color: white;
                      padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Reset Password
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 13px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });
  }

  private async send(options: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      await this.transporter.sendMail({
        from: `"BCN News" <${config.SMTP_FROM}>`,
        ...options,
      });
      logger.info(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      logger.error('Email send failed:', error);
    }
  }
}