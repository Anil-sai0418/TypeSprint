const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendLoginNotification = async (userEmail, userName) => {
    try {
        const timestamp = new Date().toLocaleString();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'New Login Alert - Typevex',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        
                        <!-- 🔰 Logo Section -->
                        <div style="text-align: center; padding: 20px; background-color: #0f172a;">
                            <!-- Update this URL with your actual production domain once deployed -->
                            <img src="https://typevex.vercel.app/Type-logo.png" alt="Typevex Logo" width="120" style="display: block; margin: 0 auto;"/>
                        </div>

                        <!-- 📩 Content Section -->
                        <div style="padding: 30px; color: #333;">
                            <h2 style="color: #0f172a; margin-bottom: 10px;">Welcome to Typevex 🚀</h2>
                            <p>Hello <b>${userName}</b>,</p>
                            <p>We're excited to have you back on <b>Typevex</b>!</p>
                            <p>You have successfully logged in to your account.</p>
                            
                            <p style="margin: 15px 0;">
                                <b>Login Time:</b> ${timestamp}
                            </p>

                            <!-- 🎯 CTA Button -->
                            <div style="text-align: center; margin: 25px 0;">
                                <a href="https://typevex.vercel.app"
                                   style="background-color: #2563eb; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                                   Start Typing
                                </a>
                            </div>

                            <p>If this was you, no action is needed.</p>
                            <p>If you did not log in, please secure your account immediately.</p>
                        </div>

                        <!-- 🔻 Footer -->
                        <div style="text-align: center; padding: 15px; font-size: 12px; color: #777;">
                            <p>© ${new Date().getFullYear()} Typevex. All rights reserved.</p>
                            <p><b>Team Typevex</b></p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Login notification sent to ${userEmail}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending login notification email:', error.message);
        return false;
    }
};

module.exports = {
    sendLoginNotification
};