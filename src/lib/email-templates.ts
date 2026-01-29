
export const getEmailTemplate = (type: 'REPLY' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED', data: {
    customerName: string;
    productName: string;
    message?: string; // For REPLY or custom notes
    productUrl?: string; // Optional link to product
}) => {
    const { customerName, productName, message, productUrl } = data;

    const header = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop</h2>
            </div>
    `;

    const footer = `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop. All rights reserved.</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    `;

    let bodyContent = '';

    switch (type) {
        case 'REPLY':
            bodyContent = `
                <p>Hi ${customerName},</p>
                <p>You have a new message regarding your request for <strong>${productName}</strong>:</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0070f3; margin: 20px 0;">
                    ${message ? message.replace(/\n/g, '<br>') : ''}
                </div>
            `;
            break;

        case 'ACCEPTED':
            bodyContent = `
                <p>Hi ${customerName},</p>
                <p>Great news! Your purchase request for <strong>${productName}</strong> has been <strong>ACCEPTED</strong>.</p>
                <p>We will be in touch shortly with payment details and shipping arrangements.</p>
                ${message ? `<p><strong>Note from Admin:</strong> ${message}</p>` : ''}
            `;
            break;

        case 'REJECTED':
            bodyContent = `
                <p>Hi ${customerName},</p>
                <p>Thank you for your interest in <strong>${productName}</strong>.</p>
                <p>Unfortunately, we are unable to fulfill your request at this time. The request has been marked as <strong>REJECTED</strong> (likely due to the item being sold or unavailable).</p>
                ${message ? `<p><strong>Note from Admin:</strong> ${message}</p>` : ''}
                <p>Please check our shop for other available items.</p>
            `;
            break;

        case 'WAITLISTED':
            bodyContent = `
                <p>Hi ${customerName},</p>
                <p>We have received your request for <strong>${productName}</strong>.</p>
                <p>You have been added to our <strong>WAITLIST</strong>. We will notify you via email as soon as this item (or a similar one) becomes available.</p>
                ${message ? `<p><strong>Note from Admin:</strong> ${message}</p>` : ''}
            `;
            break;
    }

    return `${header}${bodyContent}${footer}`;
};

// Initial order received email (no EFT details yet)
export async function sendOrderReceivedEmail(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    items: any[];
    total: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { customerEmail, customerName, orderNumber, items, total } = data;

    const itemsList = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.productName}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                R ${parseFloat(item.price).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop</h2>
                <h3 style="color: #4CAF50;">Order Request Received</h3>
            </div>

            <p>Hi ${customerName},</p>
            <p>Thank you for your order request! We've received your inquiry and will review it shortly.</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Order Number:</strong> #${orderNumber}</p>
            </div>

            <h3 style="color: #333;">Requested Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsList}
                <tr>
                    <td style="padding: 15px 10px; font-weight: bold; font-size: 1.1em;">Total:</td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 1.1em; color: #8B4513;">
                        R ${parseFloat(total).toFixed(2)}
                    </td>
                </tr>
            </table>

            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #856404;">Next Steps</h4>
                <p style="margin: 5px 0;">We're checking availability of your requested items.</p>
                <p style="margin: 5px 0;">You'll receive an email once we've reviewed your order with:</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Confirmation of availability</li>
                    <li>Payment instructions (if approved)</li>
                </ul>
            </div>

            <p>This usually takes a few hours during business hours. We'll be in touch soon!</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop. All rights reserved.</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: customerEmail,
        subject: `Order Request Received - #${orderNumber}`,
        html
    });
}

// Order approved email with EFT details (sent when admin approves)
export async function sendOrderApprovedEmail(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    items: any[];
    total: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { customerEmail, customerName, orderNumber, items, total } = data;

    const itemsList = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.productName}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                R ${parseFloat(item.price).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop</h2>
                <h3 style="color: #4CAF50;">Order Approved! 🎉</h3>
            </div>

            <p>Hi ${customerName},</p>
            <p>Great news! Your order has been <strong>approved</strong> and the items are available for you.</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Order Number:</strong> #${orderNumber}</p>
            </div>

            <h3 style="color: #333;">Order Items:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsList}
                <tr>
                    <td style="padding: 15px 10px; font-weight: bold; font-size: 1.1em;">Total:</td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 1.1em; color: #8B4513;">
                        R ${parseFloat(total).toFixed(2)}
                    </td>
                </tr>
            </table>

            <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #155724;">EFT Payment Details</h4>
                <p style="margin: 5px 0;"><strong>Bank:</strong> FNB</p>
                <p style="margin: 5px 0;"><strong>Account Name:</strong> HR-SMP</p>
                <p style="margin: 5px 0;"><strong>Account Type:</strong> Cheque</p>
                <p style="margin: 5px 0;"><strong>Account Number:</strong> 6301 3876 529</p>
                <p style="margin: 5px 0;"><strong>Branch Code:</strong> 200 607</p>
                <p style="margin: 5px 0;"><strong>Reference:</strong> ${customerName}</p>
            </div>

            <p><strong>Important:</strong> Please use your <strong>Name & Surname</strong> as the payment reference.</p>
            <p>We will process your order once payment is confirmed. This usually takes 1-2 business days.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3000/orders/${orderNumber}" style="display: inline-block; padding: 12px 24px; background: #8B4513; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    Upload Proof of Payment
                </a>
            </div>
            
            <p style="font-size: 0.9rem; color: #666;">After making the payment, please upload your proof of payment using the link above. This will help us process your order faster.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop. All rights reserved.</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: customerEmail,
        subject: `Order Approved - Payment Details - #${orderNumber}`,
        html
    });
}

// Admin notification email
export async function sendAdminOrderNotification(data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: any[];
    total: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { orderNumber, customerName, customerEmail, customerPhone, items, total } = data;

    const itemsList = items.map(item => `
        <li>${item.productName} - R ${parseFloat(item.price).toFixed(2)}</li>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #333;">New Order Received</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
                <p style="margin: 5px 0;"><strong>Phone:</strong> ${customerPhone}</p>
            </div>

            <h3>Order Items:</h3>
            <ul>${itemsList}</ul>

            <p style="font-size: 1.2em;"><strong>Total:</strong> R ${parseFloat(total).toFixed(2)}</p>
            <p><strong>Payment Method:</strong> EFT</p>
            <p><strong>Status:</strong> Awaiting Payment</p>

            <p style="margin-top: 20px;">Please check the admin panel for full order details.</p>
        </div>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'sales@hair-rent.co.za';

    return sendEmail({
        to: adminEmail,
        subject: `New Order Received - #${orderNumber}`,
        html
    });
}

// Payment confirmed email (sent when admin marks order as PAID)
export async function sendPaymentConfirmedEmail(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    items: any[];
    total: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { customerEmail, customerName, orderNumber, items, total } = data;

    const itemsList = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                ${item.productName}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                R ${parseFloat(item.price).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop</h2>
                <h3 style="color: #28a745;">Payment Confirmed! 🎉</h3>
            </div>

            <p>Hi ${customerName},</p>
            <p>Great news! We've received and confirmed your payment for order <strong>#${orderNumber}</strong>.</p>

            <div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
                <p style="margin: 0; color: #155724;"><strong>✓ Payment Status:</strong> Confirmed</p>
            </div>

            <h3 style="color: #333;">Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsList}
                <tr>
                    <td style="padding: 15px 10px; font-weight: bold; font-size: 1.1em;">Total Paid:</td>
                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; font-size: 1.1em; color: #28a745;">
                        R ${parseFloat(total).toFixed(2)}
                    </td>
                </tr>
            </table>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #333;">What's Next?</h4>
                <p style="margin: 5px 0;">We're now processing your order and will prepare your items for delivery/collection.</p>
                <p style="margin: 5px 0;">You'll receive another email with tracking/collection details soon.</p>
            </div>

            <p>Thank you for choosing Hair Rent Shop! If you have any questions, feel free to reply to this email.</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop. All rights reserved.</p>
                <p>Questions? Reply to this email or contact us at sales@hair-rent.co.za</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: customerEmail,
        subject: `Payment Confirmed - Order #${orderNumber}`,
        html
    });
}

// Proof of payment uploaded notification (sent to admin)
export async function sendPOPUploadedNotification(data: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    popUrl: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { orderNumber, customerName, customerEmail, popUrl } = data;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop - Admin Notification</h2>
                <h3 style="color: #007bff;">Proof of Payment Uploaded</h3>
            </div>

            <p>A customer has uploaded proof of payment for their order.</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
                <p style="margin: 5px 0;"><strong>Customer Name:</strong> ${customerName}</p>
                <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
            </div>

            <div style="background-color: #d1ecf1; padding: 15px; border-left: 4px solid #0c5460; margin: 20px 0;">
                <p style="margin: 0; color: #0c5460;"><strong>Action Required:</strong> Please review the proof of payment and mark the order as PAID if the payment is confirmed.</p>
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3000/admin/orders" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    View Order in Admin Panel
                </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop - Admin Notification</p>
            </div>
        </div>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'sales@hair-rent.co.za';

    return sendEmail({
        to: adminEmail,
        subject: `Proof of Payment Uploaded - Order #${orderNumber}`,
        html
    });
}

// New message reply email (sent to customer)
export async function sendOrderReplyEmail(data: {
    customerEmail: string;
    customerName: string;
    orderNumber: string;
    message: string;
}) {
    const { sendEmail } = await import("@/lib/email");
    const { customerEmail, customerName, orderNumber, message } = data;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #333;">Hair Rent Shop</h2>
                <h3 style="color: #007bff;">New Message Received</h3>
            </div>

            <p>Hi ${customerName},</p>
            <p>You have received a new message regarding your order <strong>#${orderNumber}</strong>:</p>

            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:3000/orders/${orderNumber}" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
                    View Order & Reply
                </a>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>&copy; ${new Date().getFullYear()} Hair Rent Shop. All rights reserved.</p>
                <p>If you have any questions, please reply to this email.</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: customerEmail,
        subject: `New Message - Order #${orderNumber}`,
        html
    });
}
