import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifySmtp() {
    console.log('Testing SMTP Connection...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Successful!');

        // Optional: Send test email
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.ADMIN_EMAIL, // Send to admin verification
            subject: 'SMTP Configuration Test',
            text: 'This is a test email to verify new SMTP settings.',
        });
        console.log('✅ Test Email Sent:', info.messageId);
    } catch (error) {
        console.error('❌ SMTP Connection Failed:', error);
    }
}

verifySmtp();
