import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465, // true for 465 (SSL), false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text?: string; html?: string }) {
    if (!process.env.SMTP_USER) {
        console.log("---------------------------------------------------");
        console.log("⚠️ SMTP_USER not set. Logging email to console.");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text || html}`);
        console.log("---------------------------------------------------");
        return { success: true, message: "Logged to console" };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Hair Rent Shop" <info@hair-rent.co.za>`,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}
